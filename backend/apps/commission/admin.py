from django.contrib import admin
from .models import (
    Commission, Retention, Clawback, Bonus, Override, ReferralFee,
    CommissionSplit, Advance, Repayment, VestingSchedule, ScheduledPayout
)

# Inlines для отображения на странице Commission
class RetentionInline(admin.TabularInline):
    model = Retention
    extra = 0

class ClawbackInline(admin.TabularInline):
    model = Clawback
    extra = 0

class BonusInline(admin.TabularInline):
    model = Bonus
    extra = 0

class OverrideInline(admin.TabularInline):
    model = Override
    extra = 0
    readonly_fields = ('recipient',)

class CommissionSplitInline(admin.TabularInline):
    model = CommissionSplit
    extra = 0

@admin.register(Commission)
class CommissionAdmin(admin.ModelAdmin):
    list_display = ('policy', 'adviser', 'net_commission', 'adviser_fee_amount', 'payment_status', 'date_received')
    list_filter = ('payment_status', 'adviser', 'product')
    search_fields = ('policy__policy_number', 'adviser__user__username')
    date_hierarchy = 'date_received'
    readonly_fields = ('adviser_fee_amount', 'created_at', 'updated_at')
    inlines = [
        RetentionInline,
        ClawbackInline,
        BonusInline,
        OverrideInline,
        CommissionSplitInline,
    ]

@admin.register(Advance)
class AdvanceAdmin(admin.ModelAdmin):
    list_display = ('adviser', 'amount', 'date_issued', 'is_fully_repaid')
    list_filter = ('is_fully_repaid', 'adviser')

# Простая регистрация для остальных моделей
admin.site.register(Repayment)
admin.site.register(VestingSchedule)
admin.site.register(ScheduledPayout)
