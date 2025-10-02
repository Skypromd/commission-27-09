from django.db import models
from django.conf import settings
from apps.advisers.models import Adviser

class Client(models.Model):
    """
    Represents a client.
    """
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    address = models.TextField(blank=True)
    nationality = models.CharField(max_length=100, blank=True)
    employment_status = models.CharField(max_length=100, blank=True)
    risk_category = models.CharField(max_length=50, blank=True) # Example: Low, Medium, High

    # Corporate client fields
    corporate_client_flag = models.BooleanField(default=False)
    client_group_id = models.CharField(max_length=100, blank=True, null=True)

    # Analytics and Marketing
    client_lifetime_value = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    client_satisfaction_score = models.DecimalField(max_digits=3, decimal_places=1, null=True, blank=True)
    marketing_source = models.CharField(max_length=100, blank=True)

    # Compliance
    gdpr_consent_status = models.BooleanField(default=False)
    marketing_consent_flag = models.BooleanField(default=False)

    adviser = models.ForeignKey(
        Adviser,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='clients'
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='created_clients'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
