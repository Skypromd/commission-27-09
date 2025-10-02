from django.contrib import admin

from .models import Report


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at', 'report_type')
    list_filter = ('report_type', 'created_at')
    search_fields = ('name',)

