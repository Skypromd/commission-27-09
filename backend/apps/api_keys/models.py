from django.conf import settings
from django.db import models
from rest_framework_api_key.models import AbstractAPIKey


class UserAPIKey(AbstractAPIKey):
    """
    Кастомная модель API ключа для связи с пользователем (консультантом).
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="api_keys",
        verbose_name="Пользователь",
        help_text="Пользователь, с которым связан этот ключ."
    )

    class Meta(AbstractAPIKey.Meta):
        verbose_name = "API ключ пользователя"
        verbose_name_plural = "API ключи пользователей"
