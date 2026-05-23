import os
from rest_framework import status, generics, views
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth.models import User
from django.db import IntegrityError
from django.db.models import Count, Avg

from .pii_detector import detect_and_mask
from .risk_calculator import calculate_risk
from .models import ScanHistory


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def scan_text(request):
    """
    Accepts raw text blocks, processes structural PII, updates compliance metrics,
    and returns sanitized data payloads.
    """
    if request.method == "GET":
        return Response({"status": "healthy", "engine": "PrivacyShield AI running"}, status=status.HTTP_200_OK)

    text = request.data.get("text", "").strip()
    if not text:
        return Response({"error": "Text payload field cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)

    # Core Analysis Execution
    masked_text, detected = detect_and_mask(text)
    risk_score, risk_level = calculate_risk(detected)

    # Persist Scan Log Trace
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
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """
    Creates standard platform accounts securely with proper exception handling.
    """
    username = request.data.get('username', '').strip()
    email = request.data.get('email', '').strip()
    password = request.data.get('password', '')

    # Basic Request Sanitization Layer
    if not username or not password or not email:
        return Response({"error": "All parameter fields (username, email, password) are required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Django automatically handles password hashing securely via create_user
        User.objects.create_user(username=username, email=email, password=password)
        return Response({"message": "User profile successfully provisioned."}, status=status.HTTP_201_CREATED)
        
    except IntegrityError:
        return Response({"error": "An operator with that username profile already exists inside the database registry."}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as system_fault:
        return Response({"error": f"Registration sequence execution aborted: {str(system_fault)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])  # AllowAny for effortless initial testing
@parser_classes([MultiPartParser, FormParser])
def upload_file(request):
    """
    Validates, reads, and anonymizes file stream payloads dynamically.
    """
    uploaded_file = request.FILES.get('file')
    if not uploaded_file:
        return Response({"error": "No data stream parameter located under key 'file'."}, status=status.HTTP_400_BAD_REQUEST)

    filename = uploaded_file.name
    _, extension = os.path.splitext(filename.lower())
    
    if extension not in ['.txt', '.csv']:
        return Response({"error": f"This direct ingestion route does not support format variations matching '{extension}'."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        content = uploaded_file.read().decode('utf-8', errors='ignore')
        if not content.strip():
            return Response({"error": "Target processed source document file cannot be blank."}, status=status.HTTP_400_BAD_REQUEST)

        # Threat Remediation Routing Steps
        masked_text, detected = detect_and_mask(content)
        risk_score, risk_level = calculate_risk(detected)

        # Fallback to map data if testing anonymously
        if request.user.is_authenticated:
            exec_user = request.user
        else:
            exec_user = User.objects.first()
            if not exec_user:
                exec_user = User.objects.create_user(username="system_agent", email="agent@shield.io", password="SafePassword123!")

        # Save to database record trace
        ScanHistory.objects.create(
            user=exec_user,
            original_text=content,
            masked_text=masked_text,
            risk_score=risk_score,
            risk_level=risk_level
        )

        return Response({
            "filename": filename,
            "original_text": content,
            "masked_text": masked_text,
            "detected": detected,
            "risk_score": risk_score,
            "risk_level": risk_level
        }, status=status.HTTP_201_CREATED)

    except Exception as process_err:
        print(f"!!! CRITICAL INGESTION CRASH LOG: {str(process_err)}")
        return Response({"error": f"Internal process exception: {str(process_err)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ScanHistoryListView(generics.ListAPIView):
    """
    API endpoint that fetches historical scanning actions for the frontend UI.
    """
    permission_classes = [AllowAny]
    
    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            queryset = ScanHistory.objects.filter(user=request.user)
        else:
            queryset = ScanHistory.objects.all()

        data = [{
            "id": item.id,
            "filename": f"scan_log_{item.id}.txt",
            "original_text": item.original_text,
            "masked_text": item.masked_text,
            "risk_score": item.risk_score,
            "risk_level": item.risk_level,
            "created_at": item.created_at
        } for item in queryset]
        
        return Response(data, status=status.HTTP_200_OK)


class AdminSystemAnalyticsView(views.APIView):
    """
    Aggregates global analytics vectors for dashboard presentation pipelines.
    """
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        total_scans = ScanHistory.objects.count()
        risk_distributions = ScanHistory.objects.values('risk_level').annotate(count=Count('id'))
        average_risk_matrix = ScanHistory.objects.aggregate(average=Avg('risk_score'))
        
        payload = {
            "total_scans": total_scans,
            "risk_distribution_breakdown": {item['risk_level']: item['count'] for item in risk_distributions},
            "system_mean_score": average_risk_matrix['average'] or 0.0
        }
        return Response(payload, status=status.HTTP_200_OK)