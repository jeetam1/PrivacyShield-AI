import re
import spacy

nlp = spacy.load("en_core_web_sm")


def detect_and_mask(text):

    detected = {}

    # Email
    emails = re.findall(r'\S+@\S+', text)
    detected["emails"] = len(emails)

    text = re.sub(
        r'\S+@\S+',
        'EMAIL_MASKED',
        text
    )



    # Phone Number
    phones = re.findall(
        r'\d{10}',
        text
    )

    detected["phones"] = len(phones)

    text = re.sub(
        r'\d{10}',
        'PHONE_MASKED',
        text
    )



    # Aadhaar
    aadhaar = re.findall(
        r'\d{4}\s?\d{4}\s?\d{4}',
        text
    )

    detected["aadhaar"] = len(aadhaar)

    text = re.sub(
        r'\d{4}\s?\d{4}\s?\d{4}',
        'AADHAAR_MASKED',
        text
    )



    # PAN
    pan = re.findall(
        r'[A-Z]{5}[0-9]{4}[A-Z]{1}',
        text
    )

    detected["pan"] = len(pan)

    text = re.sub(
        r'[A-Z]{5}[0-9]{4}[A-Z]{1}',
        'PAN_MASKED',
        text
    )



    # NLP Detection

    doc = nlp(text)

    detected["names"] = 0
    detected["locations"] = 0
    detected["organizations"] = 0


    for ent in doc.ents:

        if ent.label_=="PERSON":

            text=text.replace(
                ent.text,
                "NAME_MASKED"
            )

            detected["names"] += 1



        elif ent.label_=="GPE":

            text=text.replace(
                ent.text,
                "LOCATION_MASKED"
            )

            detected["locations"] += 1



        elif ent.label_=="ORG":

            text=text.replace(
                ent.text,
                "ORG_MASKED"
            )

            detected["organizations"] += 1



    return text, detected