import re
import spacy

# Load spaCy English model with only NER enabled for maximum performance
try:
    nlp = spacy.load("en_core_web_sm", disable=["tagger", "parser", "attribute_ruler", "lemmatizer"])
except Exception:
    import en_core_web_sm
    nlp = en_core_web_sm.load()
    # Disable unneeded pipeline stages if loaded via fallback
    for pipe_name in ["tagger", "parser", "attribute_ruler", "lemmatizer"]:
        if pipe_name in nlp.pipe_names:
            nlp.disable_pipe(pipe_name)

# Precompiled Regex Patterns for Maximum Speed
EMAIL_PATTERN = re.compile(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}')
PHONE_PATTERN = re.compile(r'(?:\+91[\-\s]?)?[6-9]\d{9}|(?:\+?1[\-\s]?)?\(?\d{3}\)?[\-\s]?\d{3}[\-\s]?\d{4}|\b(?:\+?\d{1,3}[\-\s]?)?[6-9]\d{9}\b|0\d{2,4}[\-\s]?\d{6,8}')
AADHAAR_PATTERN = re.compile(r'\b\d{4}[\s\-]\d{4}[\s\-]\d{4}\b')
PAN_PATTERN = re.compile(r'\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b')
SSN_PATTERN = re.compile(r'\b\d{3}-\d{2}-\d{4}\b')
CC_PATTERN = re.compile(r'\b(?:\d{4}[-\s]?){3}\d{4}\b')

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
    High-performance PII detection and masking.
    Scans raw text, detects PII entities, replaces them with clean XXXX masked values (or tags),
    and returns masked text along with detection metrics and detailed items.
    """
    if not text:
        return "", {
            "emails": 0, "phones": 0, "aadhaar": 0, "pan": 0,
            "ssn": 0, "credit_card": 0, "names": 0, "locations": 0, "organizations": 0
        }, []

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
    rep_map = {}

    # 1. Emails
    if options.get("emails", True):
        emails = EMAIL_PATTERN.findall(text)
        detected_counts["emails"] = len(emails)
        email_rep = "xxxx@xxxx.com" if mask_style == "xxxx" else "[EMAIL_MASKED]"
        for em in set(emails):
            detected_items.append({"token": em, "category": "email"})
            rep_map[em] = email_rep

    # 2. Identification Documents & Cards
    if options.get("ids", True):
        ccs = CC_PATTERN.findall(text)
        detected_counts["credit_card"] = len(ccs)
        cc_rep = "XXXX-XXXX-XXXX-XXXX" if mask_style == "xxxx" else "[CARD_MASKED]"
        for c in set(ccs):
            detected_items.append({"token": c, "category": "credit_card"})
            rep_map[c] = cc_rep

        aadhaars = AADHAAR_PATTERN.findall(text)
        detected_counts["aadhaar"] = len(aadhaars)
        aadhaar_rep = "XXXX-XXXX-XXXX" if mask_style == "xxxx" else "[AADHAAR_MASKED]"
        for aad in set(aadhaars):
            detected_items.append({"token": aad, "category": "aadhaar"})
            rep_map[aad] = aadhaar_rep

        pans = PAN_PATTERN.findall(text)
        detected_counts["pan"] = len(pans)
        pan_rep = "XXXXX1234X" if mask_style == "xxxx" else "[PAN_MASKED]"
        for pan in set(pans):
            detected_items.append({"token": pan, "category": "pan"})
            rep_map[pan] = pan_rep

        ssns = SSN_PATTERN.findall(text)
        detected_counts["ssn"] = len(ssns)
        ssn_rep = "XXX-XX-XXXX" if mask_style == "xxxx" else "[SSN_MASKED]"
        for s in set(ssns):
            detected_items.append({"token": s, "category": "ssn"})
            rep_map[s] = ssn_rep

    # 3. Phone Numbers
    if options.get("phones", True):
        raw_phones = PHONE_PATTERN.findall(text)
        phones = [p for p in raw_phones if len(re.sub(r'\D', '', p)) >= 10]
        detected_counts["phones"] = len(phones)
        phone_rep = "+XX XXXXXXXXXX" if mask_style == "xxxx" else "[PHONE_MASKED]"
        for ph in set(phones):
            detected_items.append({"token": ph, "category": "phone"})
            rep_map[ph] = phone_rep

    # 4. Fast NLP Named Entity Recognition (Only executed when entity options are active)
    check_names = options.get("names", True)
    check_locations = options.get("locations", True)
    check_orgs = options.get("organizations", False) or options.get("orgs", False)

    if check_names or check_locations or check_orgs:
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
                
            if check_names and ent.label_ == "PERSON":
                rep = "XXXX XXXX" if mask_style == "xxxx" else "[NAME_MASKED]"
                detected_counts["names"] += 1
                detected_items.append({"token": ent_text, "category": "name"})
                rep_map[ent_text] = rep
            elif check_locations and ent.label_ in ["GPE", "LOC"]:
                rep = "XXXX" if mask_style == "xxxx" else "[LOCATION_MASKED]"
                detected_counts["locations"] += 1
                detected_items.append({"token": ent_text, "category": "location"})
                rep_map[ent_text] = rep
            elif check_orgs and ent.label_ == "ORG":
                if "MASKED" not in ent_text and "XXXX" not in ent_text:
                    rep = "XXXX Corp" if mask_style == "xxxx" else "[ORG_MASKED]"
                    detected_counts["organizations"] += 1
                    detected_items.append({"token": ent_text, "category": "organization"})
                    rep_map[ent_text] = rep

    # High-speed single-pass batch token substitution
    if rep_map:
        sorted_keys = sorted(rep_map.keys(), key=len, reverse=True)
        # Word boundary safe pattern
        pattern_parts = []
        for k in sorted_keys:
            escaped = re.escape(k)
            if k.isalnum():
                pattern_parts.append(r'\b' + escaped + r'\b')
            else:
                pattern_parts.append(escaped)
        
        batch_regex = re.compile('|'.join(pattern_parts))
        text = batch_regex.sub(lambda m: rep_map.get(m.group(0), rep_map.get(m.group(0).strip(), m.group(0))), text)

    return text, detected_counts, detected_items