from rest_framework import permissions
from apps.advisers.models import Adviser


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Разрешение только для чтения всем пользователям, полный доступ только администраторам.
    """
    def has_permission(self, request, view):
        # Доступ на чтение для всех
        if request.method in permissions.SAFE_METHODS:
            return True
        # Доступ на запись только для администраторов
        return request.user and request.user.is_staff


class IsOwnerOrManager(permissions.BasePermission):
    """
    Разрешение, которое позволяет доступ:
    - Администраторам.
    - Владельцу объекта (консультанту).
    - Руководителю консультанта.
    """
    def has_permission(self, request, view):
        """
        Разрешает доступ на уровне представления (для списков).
        """
        # Доступ разрешен всем аутентифицированным пользователям,
        # так как реальная фильтрация происходит в get_queryset.
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Разрешение на чтение разрешено всем, кто прошел has_permission,
        # так как фильтрация происходит в get_queryset.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Для небезопасных методов (POST, PUT, DELETE)
        if request.user.is_staff:
            return True

        # Проверяем, есть ли у пользователя профиль консультанта
        if not hasattr(request.user, 'adviser_profile'):
            return False

        user_adviser = request.user.adviser_profile

        # Получаем связанного с объектом консультанта
        # Это делает разрешение более гибким для разных моделей (Commission, Policy)
        target_adviser = getattr(obj, 'adviser', None)
        if not target_adviser:
            return False

        # Является ли пользователь владельцем объекта
        if target_adviser == user_adviser:
            return True

        # Является ли пользователь руководителем владельца объекта
        if target_adviser.parent_adviser == user_adviser:
            return True

        return False


class HasReportAccess(permissions.BasePermission):
    """
    Разрешение для доступа к отчетам.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated
