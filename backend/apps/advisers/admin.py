from django.contrib import admin
from .models import Adviser

@admin.register(Adviser)
class AdviserAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'status', 'parent_adviser', 'active_flag')
    list_filter = ('role', 'status', 'active_flag', 'region')
    search_fields = ('user__username', 'user__first_name', 'user__last_name', 'fca_reference_number')
    autocomplete_fields = ['user', 'parent_adviser']

