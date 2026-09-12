import re
import spacy

# Load spaCy English model safely
try:
    nlp = spacy.load("en_core_web_sm")
except Exception:
    import en_core_web_sm
    nlp = en_core_web_sm.load()

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

def detect_and_mask(text, options=None, mask_style="xxxx"):
    """
    Scans raw text, detects PII entities, replaces them with clean XXXX masked values (or tags),
    and returns masked text along with detection metrics and detailed items.
    """
    if options is None:
        options = {
            "emails": True,
            "phones": True,
            "ids": True,
            "names": True,
            "locations": True,
            "organizations": False
        }

    detected_counts = {
        "emails": 0, "phones": 0, "aadhaar": 0, "pan": 0,
        "ssn": 0, "credit_card": 0, "names": 0, "locations": 0, "organizations": 0
    }
    detected_items = []

    # Regex patterns
    email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    phone_pattern = r'(?:\+91[\-\s]?)?[6-9]\d{9}|(?:\+?1[\-\s]?)?\(?\d{3}\)?[\-\s]?\d{3}[\-\s]?\d{4}|\b(?:\+?\d{1,3}[\-\s]?)?[6-9]\d{9}\b|0\d{2,4}[\-\s]?\d{6,8}'
    aadhaar_pattern = r'\b\d{4}[\s\-]\d{4}[\s\-]\d{4}\b'
    pan_pattern = r'\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b'
    ssn_pattern = r'\b\d{3}-\d{2}-\d{4}\b'
    cc_pattern = r'\b(?:\d{4}[-\s]?){3}\d{4}\b'

    # 1. Emails
    if options.get("emails", True):
        emails = re.findall(email_pattern, text)
        detected_counts["emails"] = len(emails)
        for em in set(emails):
            detected_items.append({"token": em, "category": "email"})
        email_rep = "xxxx@xxxx.com" if mask_style == "xxxx" else "[EMAIL_MASKED]"
        text = re.sub(email_pattern, email_rep, text)

    # 2. Identification Documents & Cards
    if options.get("ids", True):
        ccs = re.findall(cc_pattern, text)
        detected_counts["credit_card"] = len(ccs)
        for c in set(ccs):
            detected_items.append({"token": c, "category": "credit_card"})
        cc_rep = "XXXX-XXXX-XXXX-XXXX" if mask_style == "xxxx" else "[CARD_MASKED]"
        text = re.sub(cc_pattern, cc_rep, text)

        aadhaars = re.findall(aadhaar_pattern, text)
        detected_counts["aadhaar"] = len(aadhaars)
        for aad in set(aadhaars):
            detected_items.append({"token": aad, "category": "aadhaar"})
        aadhaar_rep = "XXXX-XXXX-XXXX" if mask_style == "xxxx" else "[AADHAAR_MASKED]"
        text = re.sub(aadhaar_pattern, aadhaar_rep, text)

        pans = re.findall(pan_pattern, text)
        detected_counts["pan"] = len(pans)
        for pan in set(pans):
            detected_items.append({"token": pan, "category": "pan"})
        pan_rep = "XXXXX1234X" if mask_style == "xxxx" else "[PAN_MASKED]"
        text = re.sub(pan_pattern, pan_rep, text)

        ssns = re.findall(ssn_pattern, text)
        detected_counts["ssn"] = len(ssns)
        for s in set(ssns):
            detected_items.append({"token": s, "category": "ssn"})
        ssn_rep = "XXX-XX-XXXX" if mask_style == "xxxx" else "[SSN_MASKED]"
        text = re.sub(ssn_pattern, ssn_rep, text)

    # 3. Phone Numbers
    if options.get("phones", True):
        phones = [p for p in re.findall(phone_pattern, text) if len(re.sub(r'\D', '', p)) >= 10]
        detected_counts["phones"] = len(phones)
        for ph in set(phones):
            detected_items.append({"token": ph, "category": "phone"})
        phone_rep = "+XX XXXXXXXXXX" if mask_style == "xxxx" else "[PHONE_MASKED]"
        text = re.sub(phone_pattern, phone_rep, text)

    # 4. Controlled NLP Named Entity Recognition
    doc = nlp(text)
    nlp_replacements = []

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
            rep = "XXXX XXXX" if mask_style == "xxxx" else "[NAME_MASKED]"
            nlp_replacements.append((ent_text, rep))
            detected_counts["names"] += 1
            detected_items.append({"token": ent_text, "category": "name"})
        elif options.get("locations", True) and ent.label_ in ["GPE", "LOC"]:
            rep = "XXXX" if mask_style == "xxxx" else "[LOCATION_MASKED]"
            nlp_replacements.append((ent_text, rep))
            detected_counts["locations"] += 1
            detected_items.append({"token": ent_text, "category": "location"})
        elif options.get("organizations", False) and ent.label_ == "ORG":
            if "MASKED" not in ent_text and "XXXX" not in ent_text:
                rep = "XXXX Corp" if mask_style == "xxxx" else "[ORG_MASKED]"
                nlp_replacements.append((ent_text, rep))
                detected_counts["organizations"] += 1
                detected_items.append({"token": ent_text, "category": "organization"})

    for original, replacement in sorted(list(set(nlp_replacements)), key=lambda x: len(x[0]), reverse=True):
        if original.strip():
            text = re.sub(r'\b' + re.escape(original) + r'\b', replacement, text)

    return text, detected_counts, detected_items

    return text, detected_counts, detected_items