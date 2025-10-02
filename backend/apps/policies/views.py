from rest_framework import viewsets, permissions
from django.db.models import Q
from .models import Policy
from .serializers import PolicySerializer
from backend.apps.core.permissions import IsOwnerOrManager

class PolicyViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet для просмотра полисов.
    - Администраторы видят все.
    - Менеджеры видят свои и полисы своей команды.
    - Консультанты видят только свои.
    """
    serializer_class = PolicySerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrManager]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Policy.objects.all()

        if hasattr(user, 'adviser_profile'):
            user_adviser = user.adviser_profile

            # Менеджер видит свои полисы и полисы подчиненных
            allowed_advisers = [user_adviser] + list(user_adviser.subordinates.all())
            return Policy.objects.filter(adviser__in=allowed_advisers)

        return Policy.objects.none()
