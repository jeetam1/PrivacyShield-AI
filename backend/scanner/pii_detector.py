import re
import spacy

# Load the lightweight English model
nlp = spacy.load("en_core_web_sm")

def detect_and_mask(text):
    # Initialize trackers
    detected_counts = {
        "emails": 0, "phones": 0, "aadhaar": 0, "pan": 0,
        "names": 0, "locations": 0, "organizations": 0
    }
    
    # ---------------------------------------------------------
    # STEP 1: Strict Regex Handling (Do these first)
    # ---------------------------------------------------------
    email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    phone_pattern = r'(?:\+91[\-\s]?)?[6-9]\d{9}|0\d{2,4}\-\d{6,8}'
    aadhaar_pattern = r'\b\d{4}[\s\-]\d{4}[\s\-]\d{4}\b'
    pan_pattern = r'\b[A-Z]{5}\d{4}[A-Z]{1}\b'

    # Track and replace regex entities safely
    emails = re.findall(email_pattern, text)
    detected_counts["emails"] = len(emails)
    text = re.sub(email_pattern, "[EMAIL_MASKED]", text)

    phones = re.findall(phone_pattern, text)
    detected_counts["phones"] = len(phones)
    text = re.sub(phone_pattern, "[PHONE_MASKED]", text)

    # Clean up Aadhaar tokens safely using placeholder constants
    aadhaars = re.findall(aadhaar_pattern, text)
    detected_counts["aadhaar"] = len(aadhaars)
    text = re.sub(aadhaar_pattern, "[AADHAAR_MASKED]", text)

    pans = re.findall(pan_pattern, text)
    detected_counts["pan"] = len(pans)
    text = re.sub(pan_pattern, "[PAN_MASKED]", text)

    # ---------------------------------------------------------
    # STEP 2: Controlled NLP NER Processing
    # ---------------------------------------------------------
    doc = nlp(text)
    
    # Create a list of labels we want to mutate safely
    nlp_replacements = []
    
    # Add a strict explicit stop-word list of terms the model should NEVER mask
    structural_safelist = {
        "identity", "location", "email", "mapping", "sovereign", 
        "matrices", "unit", "permanent", "account", "number", 
        "notice", "document", "asset", "corporate", "data", "test"
    }

    for ent in doc.ents:
        # Prevent parsing empty spacing or safelisted template terms
        if ent.text.strip().lower() in structural_safelist:
            continue
            
        if ent.label_ == "PERSON":
            nlp_replacements.append((ent.text, "[NAME_MASKED]"))
            detected_counts["names"] += 1
        elif ent.label_ == "GPE" or ent.label_ == "LOC":
            nlp_replacements.append((ent.text, "[LOCATION_MASKED]"))
            detected_counts["locations"] += 1
        elif ent.label_ == "ORG":
            # Avoid masking plain placeholder variables
            if "MASKED" not in ent.text:
                nlp_replacements.append((ent.text, "[ORG_MASKED]"))
                detected_counts["organizations"] += 1

    # Apply the NLP replacements in reverse order to keep string indexing exact
    # This prevents the character positions from shifting mid-loop!
    for original, replacement in sorted(list(set(nlp_replacements)), key=lambda x: len(x[0]), reverse=True):
        if original.strip(): # Protect against empty matching strings
            text = text.replace(original, replacement)

    return text, detected_counts