from django.contrib import admin
from rest_framework_api_key.admin import APIKeyModelAdmin
from .models import UserAPIKey


@admin.register(UserAPIKey)
class CustomAPIKeyAdmin(APIKeyModelAdmin):
    """
    Настройка административной панели для кастомной модели API ключа.
    Наследует все функциональные возможности от APIKeyModelAdmin.
    """
    pass
