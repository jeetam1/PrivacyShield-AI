from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
# Ensure the import names match the exact views defined inside views.py
from .views import scan_text, register, upload_file, ScanHistoryListView, AdminSystemAnalyticsView
from .views import scan_text, register, upload_file, ScanHistoryListView, AdminSystemAnalyticsView, UserProfileView
urlpatterns = [
    # --- Authentication Endpoints ---
    path('auth/register/', register, name='auth_register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='auth_token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='auth_token_refresh'),

    # --- Core PII Scanning Endpoints ---
    path('scanner/scan/', scan_text, name='scanner_scan_text'),
    path('scanner/upload/', upload_file, name='scanner_upload_file'),
    path('auth/profile/', UserProfileView.as_view(), name='user_profile'),

    # --- Analytics & Tracking Lists ---
    path('scanner/history/', ScanHistoryListView.as_view(), name='scanner_history_list'),
    path('scanner/admin/analytics/', AdminSystemAnalyticsView.as_view(), name='scanner_admin_analytics'),
]