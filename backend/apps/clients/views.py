from rest_framework import viewsets, permissions
from .models import Client
from .serializers import ClientSerializer
from apps.core.mixins import HierarchicalQuerySetMixin

class ClientViewSet(HierarchicalQuerySetMixin, viewsets.ModelViewSet):
    """
    API эндпоинт для просмотра и редактирования клиентов.
    """
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = super().get_queryset()

        if user.is_superuser:
            return queryset

        allowed_advisers = self.get_allowed_advisers(user)
        if allowed_advisers.exists():
            # Клиент виден, если он связан с полисом ИЛИ ипотечной ��делкой
            # консультанта или его подчиненных.
            policy_clients = Client.objects.filter(policies__adviser__in=allowed_advisers)
            mortgage_clients = Client.objects.filter(mortgage_cases__adviser__in=allowed_advisers)
            return (policy_clients | mortgage_clients).distinct()

        return Client.objects.none()
