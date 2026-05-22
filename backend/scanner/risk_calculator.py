def calculate_risk(detected):

    score = 0


    score += detected["emails"] * 10

    score += detected["phones"] * 15

    score += detected["aadhaar"] * 25

    score += detected["pan"] * 25

    score += detected["names"] * 5

    score += detected["locations"] * 5

    score += detected["organizations"] * 5


    score=min(score,100)


    if score <=30:

        level="LOW"

    elif score <=60:

        level="MEDIUM"

    else:

        level="HIGH"


    return score,level