from django.contrib import admin
from .models import Client

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'email', 'adviser', 'risk_category', 'corporate_client_flag')
    list_filter = ('risk_category', 'corporate_client_flag', 'adviser')
    search_fields = ('first_name', 'last_name', 'email')
    autocomplete_fields = ['adviser']

