from django.db import models
from django.contrib.auth.models import User


class ScanHistory(models.Model):

    user=models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True
    )

    uploaded_file=models.FileField(
        upload_to='uploads/',
        null=True,
        blank=True
    )

    original_text=models.TextField()

    masked_text=models.TextField()

    risk_score=models.IntegerField()

    risk_level=models.CharField(
        max_length=20
    )

    created_at=models.DateTimeField(
        auto_now_add=True
    )


    def __str__(self):

        return f"{self.id}"