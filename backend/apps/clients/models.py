from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _

class Client(models.Model):
    """Модель клиента."""
    name = models.CharField("Имя", max_length=200)
    agent = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='clients')
    email = models.EmailField("Email", unique=True, blank=True, null=True)
    phone_number = models.CharField("Номер телефона", max_length=20, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Клиент"
        verbose_name_plural = "Клиенты"
        ordering = ["name"]
