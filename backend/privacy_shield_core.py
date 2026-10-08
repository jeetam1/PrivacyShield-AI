import re
# Match phones, emails and ID numbers
PATTERNS = {
    "phone": re.compile(r'(?:\+91[\-\s]?)?[6-9]\d{9}|\b\d{3}[-\s]?\d{3}[-\s]?\d{4}\b'),
    "email": re.compile(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'),
    "aadhaar": re.compile(r'\b\d{4}[\s\-]\d{4}[\s\-]\d{4}\b'),
}

REPLACEMENTS = {
    "phone": "+XX XXXXXXXXXX",
    "email": "xxxx@xxxx.com",
    "aadhaar": "XXXX-XXXX-XXXX",
}
# Scan text and mask sensitive data
def mask_pii(text: str):
    counts = {}
    for key, pattern in PATTERNS.items():
        matches = pattern.findall(text)
        counts[key] = len(matches)
        if matches:
            text = pattern.sub(REPLACEMENTS[key], text)
    return text, counts

# Test with sample data
if __name__ == "__main__":
    sample = "Employee: Jeetam singh | Phone: +91 9425361458 | Email: jeetamtech@gmail.com"
    masked, counts = mask_pii(sample)
    
    print("Original:", sample)
    print("Masked:  ", masked)
    print("Found:   ", counts)
