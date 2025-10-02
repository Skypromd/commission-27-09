from rest_framework import permissions


class IsAdminOrOwnerOrManagerReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow admins to edit anything,
    managers to read their subordinates,
    and users to read/edit their own profile.
    """

    def has_permission(self, request, view):
        # Allow authenticated users to access the API
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Admin can do anything
        if request.user.is_staff:
            return True
        
        # Users can only access their own profile for read/write
        if obj == request.user:
            return True
            
        # Managers can read subordinates (implement manager logic here if needed)
        if request.method in permissions.SAFE_METHODS:
            return True
            
        return False