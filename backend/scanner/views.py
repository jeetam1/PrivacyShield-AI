from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .pii_detector import detect_and_mask
from .risk_calculator import calculate_risk
from .models import ScanHistory


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def scan_text(request):

    if request.method == "GET":
        return Response(
            {"message":"PrivacyShield AI running"}
        )

    text = request.data.get("text","")

    masked_text, detected = detect_and_mask(text)

    risk_score, risk_level = calculate_risk(detected)

    ScanHistory.objects.create(
        user=request.user,
        original_text=text,
        masked_text=masked_text,
        risk_score=risk_score,
        risk_level=risk_level
    )

    return Response({

        "masked_text": masked_text,
        "detected": detected,
        "risk_score": risk_score,
        "risk_level": risk_level

    })

@api_view(['POST'])

def register(request):

    username=request.data.get(
        'username'
    )

    email=request.data.get(
        'email'
    )

    password=request.data.get(
        'password'
    )


    user=User.objects.create_user(

        username=username,

        email=email,

        password=password

    )


    return Response({

        "message":"User created"

    })