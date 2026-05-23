from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.conf import settings
from django.conf.urls.static import static

# A simple health check view for the empty root path
def api_root_health_check(request):
    return JsonResponse({
        "status": "online",
        "platform": "PrivacyShield AI Core Engine",
        "version": "1.0.0",
        "endpoints": {
            "admin": "/admin/",
            "scanner_api": "/api/scanner/"
        }
    })

urlpatterns = [
    # --- Project Management ---
    path('admin/', admin.site.urls),

    # --- Landing Root Endpoint ---
    path('', api_root_health_check, name='api_root_health'),

    # --- Scanner Application Core Routing Space ---
    # This includes your register, login, scan, and upload endpoints cleanly
    path('api/', include('scanner.urls')),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)