from django.db import models
from django.conf import settings
from decimal import Decimal
from django.core.validators import MinValueValidator, MaxValueValidator

class Client(models.Model):
    name = models.CharField(max_length=255)
    client_id = models.CharField(max_length=100, unique=True, null=True, blank=True)
    dob = models.DateField(null=True, blank=True)
    address = models.TextField(blank=True)
    contact_details = models.TextField(blank=True)
    nationality = models.CharField(max_length=100, blank=True)
    employment_status = models.CharField(max_length=100, blank=True)
    risk_category = models.CharField(max_length=50, blank=True)
    corporate_client_flag = models.BooleanField(default=False)
    client_group_id = models.CharField(max_length=100, blank=True)
    client_lifetime_value = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    client_satisfaction_score = models.DecimalField(max_digits=3, decimal_places=1, null=True, blank=True)
    gdpr_consent_status = models.BooleanField(default=False)
    marketing_consent_flag = models.BooleanField(default=False)
    marketing_source = models.CharField(max_length=100, blank=True)
    income_details = models.JSONField(null=True, blank=True)
    credit_score = models.CharField(max_length=50, blank=True)
    mortgage_history = models.TextField(blank=True)
    client_complaint_flag = models.BooleanField(default=False)
    client_complaint_details = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Adviser(models.Model):
    class Role(models.TextChoices):
        ADVISER = 'ADVISER', 'Adviser'
        MANAGER = 'MANAGER', 'Manager'
        FINANCE = 'FINANCE', 'Finance Manager'
        COMPLIANCE = 'COMPLIANCE', 'Compliance Officer'
        ADMIN = 'ADMIN', 'Administrator'

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    adviser_id = models.CharField(max_length=100, unique=True, null=True, blank=True)
    fca_reference_number = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=50, blank=True, help_text="e.g., Experienced, CAS")
    club = models.CharField(max_length=100, blank=True)
    agency_number = models.CharField(max_length=100, blank=True)
    region = models.CharField(max_length=100, blank=True)
    contact_details = models.TextField(blank=True)
    license_number = models.CharField(max_length=100, blank=True)
    hierarchy_level = models.IntegerField(null=True, blank=True)
    role_type = models.CharField(max_length=50, blank=True, help_text="e.g., Lead, Junior, Override")
    active_flag = models.BooleanField(default=True)
    start_date = models.DateField(null=True, blank=True)
    termination_date = models.DateField(null=True, blank=True)
    aml_check_status = models.BooleanField(default=False)
    default_fee_percentage = models.DecimalField(
        max_digits=5, decimal_places=2,
        default=80.00,
        validators=[MinValueValidator(Decimal('0.00')), MaxValueValidator(Decimal('100.00'))],
        help_text="Default percentage of the net commission the adviser earns."
    )

    manager = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='subordinates')
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.ADVISER)

    def __str__(self):
        return self.user.get_full_name() or self.user.username
