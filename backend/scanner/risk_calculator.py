def calculate_risk(detected):
    score = 0

    # Using .get(key, default) prevents KeyError if a key is missing
    score += detected.get("emails", 0) * 10
    score += detected.get("phones", 0) * 15
    score += detected.get("aadhaar", 0) * 25
    score += detected.get("pan", 0) * 25
    score += detected.get("names", 0) * 5
    score += detected.get("locations", 0) * 5
    score += detected.get("organizations", 0) * 5

    # Cap the absolute maximum score at 100
    score = min(score, 100)

    # Classify exposure risk thresholds
    if score <= 30:
        level = "LOW"
    elif score <= 60:
        level = "MEDIUM"
    else:
        level = "HIGH"

    return score, level