from django.urls import path
from .views import mask_pdf, mask_text, health_check

urlpatterns = [
    # Core Stateless Endpoints
    path('health/', health_check, name='health_check'),
    path('mask-pdf/', mask_pdf, name='mask_pdf'),
    path('mask-text/', mask_text, name='mask_text'),
    
    # Backward compatibility aliases
    path('upload/', mask_pdf, name='legacy_upload'),
    path('scan/', mask_text, name='legacy_scan'),
]