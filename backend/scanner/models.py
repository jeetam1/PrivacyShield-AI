from django.db import models
from django.contrib.auth.models import User

class ScanHistory(models.Model):
    # FIXED: Changed 'on_stdio_context' to 'on_delete'
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='scans')
    filename = models.CharField(max_length=255, default="unnamed_stream.txt")
    original_text = models.TextField()
    masked_text = models.TextField()
    risk_score = models.IntegerField(default=0)
    risk_level = models.CharField(max_length=10, default="LOW")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.filename} - {self.risk_level}"