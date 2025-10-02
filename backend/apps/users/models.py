from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _
from mptt.models import MPTTModel, TreeForeignKey


class User(AbstractUser, MPTTModel):
    """
    Кастомная модель пользователя с иерархией.
    """
    class Role(models.TextChoices):
        ADVISER = "ADVISER", _("Adviser")
        MANAGER = "MANAGER", _("Manager")
        ADMIN = "ADMIN", _("Administrator")
        SUPER_ADMIN = "SUPER_ADMIN", _("Super Administrator")

    role = models.CharField(_("Role"), max_length=20, choices=Role.choices, default=Role.ADVISER, blank=True)
    parent = TreeForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='children',
        verbose_name=_('Manager')
    )
    fca_number = models.CharField(_('FCA Number'), max_length=100, blank=True, null=True)

    agency_number = models.CharField(max_length=50, blank=True, null=True, unique=True, help_text="Уникальный номер агентства/менеджера")
    parent_agency_id = models.CharField(max_length=50, blank=True, null=True, help_text="Номер родительского агентства")

    class MPTTMeta:
        order_insertion_by = ['username']

    @property
    def is_manager(self):
        """Я��ляется ли пользователь руководителем любого уровня?"""
        return self.role == self.Role.MANAGER or self.role == self.Role.ADMIN or self.role == self.Role.SUPER_ADMIN

    def __str__(self):
        return self.username
