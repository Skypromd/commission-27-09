from django.contrib import admin
from .models import Client

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('name', 'agent', 'risk_category', 'corporate_client_flag')
    search_fields = ('name', 'agent__username')
    list_filter = ('risk_category', 'corporate_client_flag', 'agent')
