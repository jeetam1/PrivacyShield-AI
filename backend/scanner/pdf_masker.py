import io
import re
import pymupdf as fitz
import spacy
from .risk_calculator import calculate_risk

# Load lightweight spaCy English model safely
try:
    nlp = spacy.load("en_core_web_sm")
except Exception:
    import en_core_web_sm
    nlp = en_core_web_sm.load()

# Precompiled Regex Patterns for High-Precision Matching
PATTERNS = {
    "emails": re.compile(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'),
    "phones": re.compile(r'(?:\+91[\-\s]?)?[6-9]\d{9}|(?:\+?1[\-\s]?)?\(?\d{3}\)?[\-\s]?\d{3}[\-\s]?\d{4}|\b(?:\+?\d{1,3}[\-\s]?)?[6-9]\d{9}\b|0\d{2,4}[\-\s]?\d{6,8}'),
    "aadhaar": re.compile(r'\b\d{4}[\s\-]\d{4}[\s\-]\d{4}\b'),
    "pan": re.compile(r'\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b'),
    "ssn": re.compile(r'\b\d{3}-\d{2}-\d{4}\b'),
    "credit_card": re.compile(r'\b(?:\d{4}[-\s]?){3}\d{4}\b'),
}

# Stop-words and structural headings that should never be redacted as names/orgs
STRUCTURAL_SAFELIST = {
    "identity", "location", "email", "mapping", "sovereign", 
    "matrices", "unit", "permanent", "account", "number", 
    "notice", "document", "asset", "corporate", "data", "test",
    "confidential", "privacy", "page", "date", "report", "total",
    "invoice", "signature", "status", "version", "summary", "address",
    "phone", "name", "customer", "employee", "authorized", "form",
    "aadhaar", "aadhaar card", "pan card", "card", "pan", "ssn",
    "credit card", "debit card", "client reference", "point of contact",
    "office location", "office", "contact email", "direct line",
    "employee details", "identification documents", "financial information",
    "additional notes", "full name", "personal email", "phone number",
    "alternate phone", "organization", "prepared by", "prepared", "details",
    "verification", "audit", "kyc", "payroll", "processing"
}

IGNORED_HEADING_KEYWORDS = (
    "card", "details", "documents", "information", "reference", 
    "notes", "report", "prepared", "date", "invoice", "verification",
    "location", "email", "phone", "name", "summary", "audit"
)

def extract_pii_from_text(text, options=None):
    """
    Extracts all PII entities and their categories from a given text string.
    """
    if options is None:
        options = {
            "emails": True,
            "phones": True,
            "ids": True,       # Aadhaar, PAN, SSN, Credit Card
            "names": True,
            "locations": True,
            "orgs": False,     # Organizations optional
        }

    detected_counts = {
        "emails": 0, "phones": 0, "aadhaar": 0, "pan": 0,
        "ssn": 0, "credit_card": 0, "names": 0, "locations": 0, "organizations": 0
    }
    detected_tokens = [] # List of (token_str, category)

    # 1. Regex PII Extraction
    if options.get("emails", True):
        for match in PATTERNS["emails"].finditer(text):
            tok = match.group(0).strip()
            if tok and len(tok) > 3:
                detected_counts["emails"] += 1
                detected_tokens.append((tok, "email"))

    if options.get("ids", True):
        for match in PATTERNS["credit_card"].finditer(text):
            tok = match.group(0).strip()
            detected_counts["credit_card"] += 1
            detected_tokens.append((tok, "credit_card"))

        for match in PATTERNS["aadhaar"].finditer(text):
            tok = match.group(0).strip()
            detected_counts["aadhaar"] += 1
            detected_tokens.append((tok, "aadhaar"))

        for match in PATTERNS["pan"].finditer(text):
            tok = match.group(0).strip()
            detected_counts["pan"] += 1
            detected_tokens.append((tok, "pan"))

        for match in PATTERNS["ssn"].finditer(text):
            tok = match.group(0).strip()
            detected_counts["ssn"] += 1
            detected_tokens.append((tok, "ssn"))

    if options.get("phones", True):
        for match in PATTERNS["phones"].finditer(text):
            tok = match.group(0).strip()
            # Basic validation to avoid matching short normal numbers
            digits = re.sub(r'\D', '', tok)
            if len(digits) >= 10:
                detected_counts["phones"] += 1
                detected_tokens.append((tok, "phone"))

    # 2. NLP Named Entity Recognition
    doc = nlp(text)
    for ent in doc.ents:
        ent_text = ent.text.strip()
        ent_lower = ent_text.lower()
        if (
            not ent_text 
            or len(ent_text) < 2 
            or ent_lower in STRUCTURAL_SAFELIST
            or any(keyword in ent_lower for keyword in IGNORED_HEADING_KEYWORDS)
            or "xxxx" in ent_lower
            or "masked" in ent_lower
            or "\n" in ent_text
        ):
            continue

        if options.get("names", True) and ent.label_ == "PERSON":
            detected_counts["names"] += 1
            detected_tokens.append((ent_text, "name"))
        elif options.get("locations", True) and ent.label_ in ["GPE", "LOC"]:
            detected_counts["locations"] += 1
            detected_tokens.append((ent_text, "location"))
        elif options.get("orgs", False) and ent.label_ == "ORG":
            if "MASKED" not in ent_text and "XXXX" not in ent_text:
                detected_counts["organizations"] += 1
                detected_tokens.append((ent_text, "organization"))

    # De-duplicate while preserving order, prioritize longer strings first
    unique_tokens = []
    seen = set()
    for tok, cat in detected_tokens:
        tok_clean = tok.strip()
        if tok_clean and tok_clean not in seen:
            seen.add(tok_clean)
            unique_tokens.append((tok_clean, cat))

    return unique_tokens, detected_counts


def redact_pdf_stream(pdf_bytes, options=None, redaction_style="xxxx"):
    """
    Performs true redaction on the input PDF bytes.
    Permanently eliminates sensitive text from PDF content stream.
    
    redaction_style: 'xxxx' (Clean XXXX in place), 'label' ([MASKED] label), 'blackout' (solid black box), 'whiteout' (blank white)
    """
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    total_pages = len(doc)
    
    all_detected_items = [] # Detailed log of what was masked per page
    total_counts = {
        "emails": 0, "phones": 0, "aadhaar": 0, "pan": 0,
        "ssn": 0, "credit_card": 0, "names": 0, "locations": 0, "organizations": 0
    }

    # Redaction appearance styling
    if redaction_style == "whiteout":
        fill_color = (1, 1, 1) # White
        text_color = (0.5, 0.5, 0.5)
        default_annot = ""
    elif redaction_style == "label":
        fill_color = (0.1, 0.1, 0.12) # Dark charcoal
        text_color = (1, 1, 1) # White
        default_annot = " [MASKED] "
    elif redaction_style == "blackout":
        fill_color = (0, 0, 0) # Solid black
        text_color = (0, 0, 0)
        default_annot = ""
    else: # Default "xxxx" - Clean XXXX replacement in place
        fill_color = (1, 1, 1) # Clean white paper background
        text_color = (0.1, 0.1, 0.1) # Clean dark text
        default_annot = "XXXX"

    for page_num in range(total_pages):
        page = doc[page_num]
        page_text = page.get_text()

        # Extract PII tokens present on this page
        page_tokens, counts = extract_pii_from_text(page_text, options)

        # Aggregate counts
        for k, v in counts.items():
            total_counts[k] = total_counts.get(k, 0) + v

        # Apply redaction for each detected token on the page
        applied_rects = []
        for token, category in page_tokens:
            rects = page.search_for(token)
            if not rects:
                continue

            # Determine replacement text for XXXX mode
            if redaction_style == "xxxx":
                if category == "email":
                    annot_text = "xxxx@xxxx.com"
                elif category == "aadhaar":
                    annot_text = "XXXX-XXXX-XXXX"
                elif category == "pan":
                    annot_text = "XXXXX1234X"
                elif category == "ssn":
                    annot_text = "XXX-XX-XXXX"
                elif category == "credit_card":
                    annot_text = "XXXX-XXXX-XXXX-XXXX"
                elif category == "phone":
                    annot_text = "+XX XXXXXXXXXX"
                else:
                    annot_text = "XXXX"
            else:
                annot_text = default_annot

            for rect in rects:
                # Prevent overlapping redaction stamps over the same region
                if any(rect.intersects(existing_rect) for existing_rect in applied_rects):
                    continue
                applied_rects.append(rect)

                annot_fontsize = max(8, min(11, int(rect.height * 0.75)))
                page.add_redact_annot(
                    rect,
                    text=annot_text,
                    fill=fill_color,
                    text_color=text_color,
                    fontsize=annot_fontsize,
                    align=fitz.TEXT_ALIGN_LEFT
                )

            all_detected_items.append({
                "token": token,
                "category": category,
                "page": page_num + 1,
                "occurrences": len(rects)
            })

        # Commit redactions permanently on the page
        page.apply_redactions()

    # Save redacted PDF to memory stream
    output_stream = io.BytesIO()
    doc.save(output_stream, garbage=4, deflate=True)
    doc.close()
    
    redacted_pdf_bytes = output_stream.getvalue()
    risk_score, risk_level = calculate_risk(total_counts)

    return {
        "redacted_pdf_bytes": redacted_pdf_bytes,
        "total_pages": total_pages,
        "total_counts": total_counts,
        "detected_items": all_detected_items,
        "risk_score": risk_score,
        "risk_level": risk_level
    }


def text_to_formatted_pdf(masked_text):
    """
    Renders sanitized text into a high-quality, professionally formatted PDF document.
    Uses clean typography, proper line spacing, consistent margins, and no overlapping artifacts.
    """
    doc = fitz.open()
    margin_x = 54  # 0.75 in
    margin_y = 54
    page_width, page_height = 595.28, 841.89  # Standard A4
    content_height = page_height - 2 * margin_y

    font_size = 10.5
    line_height = 16
    lines_per_page = int(content_height / line_height)

    lines = masked_text.splitlines()
    total_lines = len(lines)
    
    for page_start in range(0, max(1, total_lines), lines_per_page):
        page = doc.new_page(width=page_width, height=page_height)
        page_lines = lines[page_start:page_start + lines_per_page]
        
        y = margin_y + font_size
        for line in page_lines:
            if line.isupper() and len(line) > 5 and ":" not in line:
                # Title / Main Header
                page.insert_text((margin_x, y), line, fontname="helv", fontsize=12, color=(0.08, 0.08, 0.12))
            elif line.endswith(":") and ("DETAILS" in line or "DOCUMENTS" in line or "INFORMATION" in line or "REFERENCE" in line or "NOTES" in line):
                # Section Header
                page.insert_text((margin_x, y), line, fontname="helv", fontsize=11, color=(0.12, 0.15, 0.2))
            else:
                # Standard content line
                page.insert_text((margin_x, y), line, fontname="helv", fontsize=font_size, color=(0.15, 0.18, 0.22))
            y += line_height

    output_stream = io.BytesIO()
    doc.save(output_stream, deflate=True)
    doc.close()
    return output_stream.getvalue()


def text_to_pdf_bytes(text_str):
    """
    Fallback converter from raw text to PDF.
    """
    return text_to_formatted_pdf(text_str)


