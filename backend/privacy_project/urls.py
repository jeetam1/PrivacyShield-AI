from django.urls import path, include
from django.http import JsonResponse
from django.conf import settings
from django.conf.urls.static import static

def api_root_health_check(request):
    return JsonResponse({
        "status": "online",
        "platform": "PrivacyShield AI - Dedicated PDF Redaction Engine",
        "version": "2.0.0",
        "endpoints": {
            "mask_pdf": "/api/scanner/mask-pdf/",
            "mask_text": "/api/scanner/mask-text/",
            "health": "/api/scanner/health/"
        }
    })

urlpatterns = [
    # Root Health Check
    path('', api_root_health_check, name='api_root_health'),

    # Scanner Application Core Routing Space
    path('api/', include('scanner.urls')),
    path('api/scanner/', include('scanner.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)