from django.contrib.auth import get_user_model
from apps.users.models import User


class HierarchicalQuerySetMixin:
    """
    Миксин для фильтрации queryset на основе иерархии пользователей.
    """
    def get_allowed_advisers(self, user: User):
        """
        Возвращает queryset с разрешенными консультантами.
        Для менеджера - он сам и его подчиненные.
        Для консультанта - только он сам.
        """
        if user.is_manager:
            return user.get_descendants(include_self=True)
        elif user.role == User.Role.ADVISER:
            return User.objects.filter(pk=user.pk)
        return User.objects.none()


class AdviserObjectOwnerMixin(HierarchicalQuerySetMixin):
    """
    Mixin for ViewSets where objects have a direct ForeignKey to the User model
    named 'adviser'. It handles hierarchical queryset filtering and automatic
    owner assignment on creation.
    """
    def get_queryset(self):
        user = self.request.user
        # Get the initial queryset from the subclass
        queryset = super().get_queryset()

        if user.is_superuser:
            return queryset

        allowed_advisers = self.get_allowed_advisers(user)
        if allowed_advisers.exists():
            return queryset.filter(adviser__in=allowed_advisers)

        # Return an empty queryset if no permissions
        return queryset.model.objects.none()

    def perform_create(self, serializer):
        """Automatically assign the current user as the adviser on creation."""
        if not self.request.user.is_superuser and self.request.user.role == User.Role.ADVISER:
            serializer.save(adviser=self.request.user)
        else:
            # Allows superusers to choose an adviser during creation
            super().perform_create(serializer)
