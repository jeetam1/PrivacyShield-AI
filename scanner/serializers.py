from rest_framework import serializers
from .models import ScanHistory

class ScanHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ScanHistory
        fields = ['id', 'filename', 'original_text', 'masked_text', 'risk_score', 'risk_level', 'created_at']