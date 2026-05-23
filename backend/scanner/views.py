import os
from rest_framework import status, generics, views
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth.models import User
from django.db import IntegrityError
from django.db.models import Count, Avg

# CORE WORKSPACE IMPORTS
from .pii_detector import detect_and_mask
from .risk_calculator import calculate_risk
from .models import ScanHistory
from .serializers import ScanHistorySerializer # <-- FIXED: Added this crucial missing import link!


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
        filename="Direct Text Input Block", # Dynamic string property mapping for the history table link
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
    Creates standard platform accounts securely with proper serialization error filtering layers.
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
@permission_classes([IsAuthenticated])
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

        # Save to database record trace explicitly bound to the active login session
        ScanHistory.objects.create(
            user=request.user,
            filename=filename,
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
    API view endpoint that queries historical scan traces scoped 
    strictly to the authenticated clearance profile operator.
    """
    serializer_class = ScanHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Explicitly scope the query filter constraint to the active user session token
        return ScanHistory.objects.filter(user=self.request.user).order_by('-created_at')


class AdminSystemAnalyticsView(views.APIView):
    """
    Aggregates global analytics metrics scoped securely to the active operator instance session.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        
        # Admin metrics toggle fallback handler filter logic block
        if user.is_staff:
            user_scans = ScanHistory.objects.all()
        else:
            user_scans = ScanHistory.objects.filter(user=user)

        total_scans = user_scans.count()
        risk_distributions = user_scans.values('risk_level').annotate(count=Count('id'))
        average_risk_matrix = user_scans.aggregate(average=Avg('risk_score'))
        
        # Re-structure the response fields to pair accurately with dashboard charts
        distribution_map = {"HIGH": 0, "MEDIUM": 0, "LOW": 0}
        for item in risk_distributions:
            if item['risk_level'] in distribution_map:
                distribution_map[item['risk_level']] = item['count']
        
        payload = {
            "total_scans": total_scans,
            "risk_distribution_breakdown": distribution_map,
            "system_mean_score": average_risk_matrix['average'] or 0.0
        }
        return Response(payload, status=status.HTTP_200_OK)


class UserProfileView(views.APIView):
    """
    Returns the authenticated operator's account details and system telemetry metrics.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_scans = ScanHistory.objects.filter(user=user)
        
        # Calculate dynamic operator statistics
        total_volume = user_scans.count()
        critical_interceptions = user_scans.filter(risk_level="HIGH").count()
        
        return Response({
            "username": user.username,
            "email": user.email,
            "date_joined": user.date_joined.strftime("%B %d, %Y"),
            "is_staff": user.is_staff,
            "stats": {
                "total_volume": total_volume,
                "critical_volume": critical_interceptions,
            }
        }, status=status.HTTP_200_OK)