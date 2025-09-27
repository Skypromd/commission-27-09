from django.contrib import admin
from mptt.admin import DraggableMPTTAdmin

from .models import User


@admin.register(User)
class CustomUserAdmin(DraggableMPTTAdmin):
    """Наст��ойка админ-панели для иерархической модели пользователя."""

    list_display = ("tree_actions", "indented_title", "role", "fca_number", "email")
    list_display_links = ("indented_title",)
    list_filter = ("role", "is_staff", "is_active")
    search_fields = ("username", "first_name", "last_name", "email", "fca_number")

    fieldsets = (
        (None, {"fields": ("username", "password")}),
        ("Personal info", {"fields": ("first_name", "last_name", "email")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Hierarchy and Role", {"fields": ("role", "parent", "fca_number")}),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
    )
