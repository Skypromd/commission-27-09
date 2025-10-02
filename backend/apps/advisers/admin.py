from django.contrib import admin
from .models import Adviser

@admin.register(Adviser)
class AdviserAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'status', 'parent_adviser', 'start_date')
    list_filter = ('role', 'status')
    search_fields = ('user__username', 'user__first_name', 'user__last_name')
    autocomplete_fields = ['user', 'parent_adviser']

