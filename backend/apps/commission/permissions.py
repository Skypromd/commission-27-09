from rest_framework.permissions import BasePermission, IsAdminUser, IsAuthenticated

class IsSuperAdminUser(BasePermission):
    """
    Позволяет доступ только пользователям с ролью 'Super Administrator'.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_super_admin)

class IsAdminOrSuperAdminUser(BasePermission):
    """
    Позволяет доступ пользователям с ролью 'Admin' или 'Super Administrator'.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_admin)

class IsManagerUser(BasePermission):
    """
    Позволяет доступ пользователям с ролью 'Manager', 'Admin' или 'Super Admin'.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_manager)

class IsObjectOwner(BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    Проверяет поле 'user' у объекта.
    """
    def has_object_permission(self, request, view, obj):
        # Write permissions are only allowed to the owner of the deal.
        return obj.user == request.user
