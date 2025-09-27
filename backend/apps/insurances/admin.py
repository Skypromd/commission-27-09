from django.contrib import admin
from .models import (
    Policy, Commission, Insurer, InsuranceType,
    Retention, Clawback, Bonus, Override, ReferralFee, IngestionTask
)

@admin.register(Policy)
class PolicyAdmin(admin.ModelAdmin):
    list_display = ('policy_number', 'client', 'adviser', 'insurer', 'status', 'start_date')
    list_filter = ('status', 'insurer', 'insurance_type', 'adviser')
    search_fields = ('policy_number', 'client__name', 'adviser__username')
    date_hierarchy = 'start_date'
    ordering = ('-start_date',)

@admin.register(Commission)
class CommissionAdmin(admin.ModelAdmin):
    list_display = ('policy', 'gross_commission', 'net_commission', 'adviser_fee_amount', 'payment_status', 'date_received')
    list_filter = ('payment_status', 'date_received', 'policy__adviser')
    search_fields = ('policy__policy_number',)
    date_hierarchy = 'date_received'

@admin.register(Insurer)
class InsurerAdmin(admin.ModelAdmin):
    list_display = ('name', 'fca_reference_number', 'region')
    search_fields = ('name',)

@admin.register(InsuranceType)
class InsuranceTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)

@admin.register(IngestionTask)
class IngestionTaskAdmin(admin.ModelAdmin):
    list_display = ('id', 'status', 'created_by', 'created_at', 'finished_at')
    list_filter = ('status',)
    readonly_fields = ('created_at', 'finished_at', 'report', 'task_id', 'created_by')

# Регистрация остальных моделей
admin.site.register(Retention)
admin.site.register(Clawback)
admin.site.register(Bonus)
admin.site.register(Override)
admin.site.register(ReferralFee)
