from django.contrib import admin
from .models import (
    Lender, MortgageCase, Commission, BrokerFee, MortgageIngestionTask,
    MortgageRetention, MortgageClawback, MortgageBonus,
    MortgageOverride, MortgageReferralFee
)

@admin.register(MortgageCase)
class MortgageCaseAdmin(admin.ModelAdmin):
    list_display = ('case_number', 'status', 'adviser', 'client', 'lender', 'loan_amount', 'completion_date')
    list_filter = ('status', 'lender', 'adviser')
    search_fields = ('case_number', 'client__name', 'adviser__name', 'property_address')
    date_hierarchy = 'application_date'
    ordering = ('-application_date',)

@admin.register(Commission)
class MortgageCommissionAdmin(admin.ModelAdmin):
    list_display = ('mortgage_case', 'payment_status', 'gross_commission', 'date_received')
    list_filter = ('payment_status',)
    search_fields = ('mortgage_case__case_number',)
    date_hierarchy = 'date_received'

@admin.register(Lender)
class LenderAdmin(admin.ModelAdmin):
    list_display = ('name', 'fca_reference_number', 'region')
    search_fields = ('name',)

@admin.register(BrokerFee)
class BrokerFeeAdmin(admin.ModelAdmin):
    list_display = ('mortgage_case', 'stage', 'amount', 'status', 'date_paid')
    list_filter = ('status', 'stage')
    search_fields = ('mortgage_case__case_number',)

@admin.register(MortgageIngestionTask)
class MortgageIngestionTaskAdmin(admin.ModelAdmin):
    list_display = ('id', 'status', 'created_by', 'created_at', 'finished_at')
    list_filter = ('status',)
    readonly_fields = ('created_at', 'finished_at', 'report', 'task_id', 'created_by')

# Регистрация остальных моделей для простого доступа
admin.site.register(MortgageRetention)
admin.site.register(MortgageClawback)
admin.site.register(MortgageBonus)
admin.site.register(MortgageOverride)
admin.site.register(MortgageReferralFee)
