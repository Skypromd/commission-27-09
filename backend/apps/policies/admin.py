from django.contrib import admin
from .models import Policy

@admin.register(Policy)
class PolicyAdmin(admin.ModelAdmin):
    list_display = ('policy_number', 'adviser', 'provider', 'status', 'date_issued')
    list_filter = ('status', 'provider', 'adviser')
    search_fields = ('policy_number', 'adviser__user__username')
    date_hierarchy = 'date_issued'

