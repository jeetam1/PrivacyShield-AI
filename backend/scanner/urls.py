from django.urls import path
from .views import scan_text,register

urlpatterns=[

    path(
        'scan/',
        scan_text
    ),

    path(
        'register/',
        register
    ),

]