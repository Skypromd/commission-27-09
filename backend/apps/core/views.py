from rest_framework import viewsets, permissions, status, mixins
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Client, Adviser
from .serializers import ClientSerializer, AdviserSerializer
from .mixins import HierarchicalQuerySetMixin
from .permissions import IsRelatedOwnerOrReadOnly
from .filters import ReportingFilter


class BaseRelatedObjectViewSet(HierarchicalQuerySetMixin, viewsets.ModelViewSet):
    """
    Базовый ViewSet для связанных объектов, которые принадлежат Adviser через родительскую модель.
    """
    permission_classes = [permissions.IsAuthenticated]
    related_field_path = None  # e.g., 'mortgage_case__adviser'


class BaseModifierViewSet(BaseRelatedObjectViewSet):
    """
    Базовый ViewSet для всех модификаторов комиссии.
    """
    pass


class BaseReportingViewSet(HierarchicalQuerySetMixin, viewsets.GenericViewSet):
    """
    Базовый ViewSet для отчетов с иерархической фильтрацией.
    """
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_class = ReportingFilter


class BaseDashboardViewSet(HierarchicalQuerySetMixin, viewsets.ViewSet):
    """
    Базовый ViewSet для дашбордов.
    """
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        dashboard_data = self.get_dashboard_data(queryset)
        return Response(dashboard_data)

    def get_dashboard_data(self, queryset):
        """
        Placeholder method for subclasses to implement.
        Should return a dictionary of dashboard data based on the provided queryset.
        """
        raise NotImplementedError("Subclasses must implement `get_dashboard_data`.")


class BaseDataIngestionViewSet(mixins.RetrieveModelMixin, viewsets.ViewSet):
    """
    Базовый ViewSet для задач по импорту данных.
    """
    permission_classes = [permissions.IsAdminUser]

    def create(self, request, *args, **kwargs):
        """Запускает асинхронную задачу по импорту данных."""
        serializer = self.ingestion_serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        # Передаем ID пользователя, чтобы связать задачу с ним
        task = self.task_function.delay(serializer.validated_data, request.user.id)

        # Со��даем запись о задаче в БД
        task_instance = self.queryset.model.objects.create(id=task.id, created_by=request.user)

        response_serializer = self.serializer_class(task_instance)
        return Response(response_serializer.data, status=status.HTTP_202_ACCEPTED)

    def list(self, request, *args, **kwargs):
        """Возвращает список всех задач по импорту."""
        queryset = self.queryset.all().order_by('-created_at')
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def get_object(self):
        # Helper to get object for retrieve action
        queryset = self.queryset
        obj = queryset.filter(pk=self.kwargs.get('pk')).first()
        return obj


class ClientViewSet(viewsets.ModelViewSet):
    """
    API эндпо��нт для управления клиентами (Client Master File).
    """
    queryset = Client.objects.all().order_by('name')
    serializer_class = ClientSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = ['name', 'client_id', 'contact_details']
    filterset_fields = ['risk_category', 'corporate_client_flag', 'gdpr_consent_status']

class AdviserViewSet(viewsets.ModelViewSet):
    """
    API эндпоинт для управления консультантами (Adviser Master File).
    """
    queryset = Adviser.objects.select_related('user', 'manager').all().order_by('user__username')
    serializer_class = AdviserSerializer
    permission_classes = [permissions.IsAdminUser]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = ['user__username', 'user__first_name', 'user__last_name', 'adviser_id', 'fca_reference_number']
    filterset_fields = ['role', 'status', 'club', 'region', 'active_flag']
