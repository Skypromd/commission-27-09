from django.contrib import admin
from .models import Client

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('name', 'agent', 'email', 'created_at')
    search_fields = ('name', 'agent__username', 'email')
    list_filter = ('agent', 'created_at')
