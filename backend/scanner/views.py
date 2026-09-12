import os
import json
import base64
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import AllowAny
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.http import HttpResponse

from .pdf_masker import redact_pdf_stream, text_to_pdf_bytes, text_to_formatted_pdf
from .pii_detector import detect_and_mask
from .risk_calculator import calculate_risk


@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """
    Public health check endpoint.
    """
    return Response({
        "status": "online",
        "engine": "PrivacyShield-AI PDF Redaction Engine",
        "version": "2.0.0 (Stateless / Zero-Database)"
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
@parser_classes([MultiPartParser, FormParser])
def mask_pdf(request):
    """
    Receives a PDF or plain text document, detects sensitive PII entities (Aadhaar, PAN, Emails,
    Phone Numbers, Names, Locations, Organizations), applies irreversible PDF bounding-box
    redactions, and returns the sanitized document payload with detection telemetry.
    """
    uploaded_file = request.FILES.get('file')
    if not uploaded_file:
        return Response({"error": "No file stream provided under key 'file'."}, status=status.HTTP_400_BAD_REQUEST)

    filename = uploaded_file.name
    _, extension = os.path.splitext(filename.lower())

    if extension not in ['.pdf', '.txt']:
        return Response({"error": f"Invalid file type '{extension}'. Supported document formats: .pdf, .txt"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        raw_bytes = uploaded_file.read()
        if not raw_bytes:
            return Response({"error": "Uploaded file is empty."}, status=status.HTTP_400_BAD_REQUEST)

        # Parse user-configured masking toggles
        mask_options = {
            "names": request.data.get('mask_names', 'true').lower() == 'true',
            "emails": request.data.get('mask_emails', 'true').lower() == 'true',
            "phones": request.data.get('mask_phones', 'true').lower() == 'true',
            "ids": request.data.get('mask_ids', 'true').lower() == 'true',
            "locations": request.data.get('mask_locations', 'true').lower() == 'true',
            "orgs": request.data.get('mask_orgs', 'false').lower() == 'true',
        }
        redaction_style = request.data.get('redaction_style', 'xxxx')

        if extension == '.txt':
            text_str = raw_bytes.decode('utf-8', errors='ignore')
            # 1. Sanitize text directly using configured mask options
            masked_text, detected_counts, detected_items = detect_and_mask(text_str, options=mask_options, mask_style=redaction_style)
            risk_score, risk_level = calculate_risk(detected_counts)
            
            # 2. Render into a clean, properly formatted, high-res PDF
            redacted_pdf_bytes = text_to_formatted_pdf(masked_text)
            redacted_pdf_base64 = base64.b64encode(redacted_pdf_bytes).decode('utf-8')
            data_uri = f"data:application/pdf;base64,{redacted_pdf_base64}"
            
            base_name, _ = os.path.splitext(filename)
            output_filename = f"{base_name}_masked.pdf"

            return Response({
                "filename": filename,
                "output_filename": output_filename,
                "total_pages": 1,
                "detected_counts": detected_counts,
                "detected_items": [{"token": item["token"], "category": item["category"], "page": 1, "occurrences": 1} for item in detected_items],
                "risk_score": risk_score,
                "risk_level": risk_level,
                "redacted_pdf_data": data_uri,
                "redacted_size_bytes": len(redacted_pdf_bytes),
            }, status=status.HTTP_200_OK)

        # Standard PDF pipeline
        pdf_bytes = raw_bytes
        result = redact_pdf_stream(pdf_bytes, options=mask_options, redaction_style=redaction_style)

        # Encode redacted PDF to Base64 for instant browser rendering & download
        redacted_pdf_base64 = base64.b64encode(result["redacted_pdf_bytes"]).decode('utf-8')
        data_uri = f"data:application/pdf;base64,{redacted_pdf_base64}"

        base_name, _ = os.path.splitext(filename)
        output_filename = f"{base_name}_masked.pdf"

        return Response({
            "filename": filename,
            "output_filename": output_filename,
            "total_pages": result["total_pages"],
            "detected_counts": result["total_counts"],
            "detected_items": result["detected_items"],
            "risk_score": result["risk_score"],
            "risk_level": result["risk_level"],
            "redacted_pdf_data": data_uri,
            "redacted_size_bytes": len(result["redacted_pdf_bytes"]),
        }, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"PDF Redaction Error: {str(e)}")
        return Response({"error": f"Failed to process and redact PDF: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
@parser_classes([JSONParser, MultiPartParser, FormParser])
def mask_text(request):
    """
    Sanitizes raw text strings directly without any persistence layer.
    """
    text = request.data.get("text", "").strip()
    if not text:
        return Response({"error": "Text payload cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)

    mask_options = {
        "names": str(request.data.get('mask_names', 'true')).lower() == 'true',
        "emails": str(request.data.get('mask_emails', 'true')).lower() == 'true',
        "phones": str(request.data.get('mask_phones', 'true')).lower() == 'true',
        "ids": str(request.data.get('mask_ids', 'true')).lower() == 'true',
        "locations": str(request.data.get('mask_locations', 'true')).lower() == 'true',
        "organizations": str(request.data.get('mask_orgs', 'false')).lower() == 'true',
    }
    mask_style = request.data.get('mask_style', 'xxxx')

    masked_text, detected_counts, detected_items = detect_and_mask(text, options=mask_options, mask_style=mask_style)
    risk_score, risk_level = calculate_risk(detected_counts)

    return Response({
        "original_text": text,
        "masked_text": masked_text,
        "detected_counts": detected_counts,
        "detected_items": detected_items,
        "risk_score": risk_score,
        "risk_level": risk_level
    }, status=status.HTTP_200_OK)