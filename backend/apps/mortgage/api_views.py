from rest_framework import viewsets, permissions
from .models import MortgageCase
from .serializers import MortgageCaseSerializer
from .permissions import IsAgentOrAdmin
from apps.deals.mixins import DealViewSetMixin

class MortgageCaseViewSet(DealViewSetMixin, viewsets.ModelViewSet):
    """API для управления ипотечными сделками."""
    serializer_class = MortgageCaseSerializer
    permission_classes = [permissions.IsAuthenticated, IsAgentOrAdmin]

    # Вся основная логика (get_queryset, perform_create, move_to_stage)
    # теперь находится в DealViewSetMixin.
