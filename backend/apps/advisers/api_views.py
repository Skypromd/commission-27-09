from rest_framework import viewsets, permissions
from django.db.models import Q
from .models import Adviser
from .serializers import AdviserSerializer

class AdviserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet для просмотра консультантов с учетом прав доступа.
    - Администраторы видят всех.
    - Менеджеры видят себя и свою команду.
    - Консультанты видят только себя.
    """
    serializer_class = AdviserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        base_queryset = Adviser.objects.select_related('user', 'parent_adviser__user')

        if user.is_staff:
            return base_queryset.all()

        if hasattr(user, 'adviser_profile'):
            user_adviser = user.adviser_profile

            # Менеджер видит себя и своих подчиненных
            subordinate_ids = list(user_adviser.subordinates.values_list('id', flat=True))
            allowed_ids = [user_adviser.id] + subordinate_ids

            return base_queryset.filter(id__in=allowed_ids)

        return Adviser.objects.none()
