from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from drf_spectacular.utils import extend_schema, extend_schema_view
from django.db.models import Count, Sum, Q
from django.utils import timezone
from datetime import datetime, timedelta

from .models import Adviser
from .serializers import AdviserSerializer
# from apps.core.permissions import IsOwnerOrManager  # Временно отключено


@extend_schema_view(
    list=extend_schema(description="List all advisers with filtering and search"),
    create=extend_schema(description="Create a new adviser"),
    retrieve=extend_schema(description="Get adviser details"),
    update=extend_schema(description="Update adviser information"),
    destroy=extend_schema(description="Delete adviser"),
)
class AdviserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing advisers with comprehensive functionality.
    Includes statistics, performance metrics, and team management.
    """
    queryset = Adviser.objects.select_related('user', 'parent_adviser').all()
    serializer_class = AdviserSerializer
    permission_classes = [permissions.AllowAny]  # Временно для демо
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['user__first_name', 'user__last_name', 'user__email', 'role']
    ordering_fields = ['user__first_name', 'role', 'start_date']
    ordering = ['-start_date']
    filterset_fields = ['role', 'status']

    def get_queryset(self):
        """Filter advisers based on user permissions"""
        # Временно возвращаем все данные для демо
        return self.queryset

    @extend_schema(
        description="Get adviser performance statistics",
        responses={200: {
            'type': 'object',
            'properties': {
                'total_clients': {'type': 'integer'},
                'active_policies': {'type': 'integer'}, 
                'total_commission': {'type': 'number'},
                'monthly_performance': {'type': 'array'}
            }
        }}
    )
    @action(detail=True, methods=['get'])
    def statistics(self, request, pk=None):
        """Get detailed performance statistics for an adviser"""
        adviser = self.get_object()
        
        # Get statistics from related models (we'll implement these later)
        stats = {
            'total_clients': 0,  # adviser.clients.count() when implemented
            'active_policies': 0,  # active policies count
            'total_commission': 0,  # sum of commissions
            'monthly_performance': [],  # last 12 months data
            'team_size': adviser.subordinates.count() if hasattr(adviser, 'subordinates') else 0,
            'join_date': adviser.start_date,
            'status': adviser.status
        }
        
        return Response(stats)

    @extend_schema(
        description="Get team hierarchy for manager advisers",
        responses={200: {
            'type': 'object', 
            'properties': {
                'team_members': {'type': 'array'},
                'total_team_commission': {'type': 'number'}
            }
        }}
    )
    @action(detail=True, methods=['get'])
    def team(self, request, pk=None):
        """Get team information for manager advisers"""
        adviser = self.get_object()
        
        # Get team members
        team_members = []
        if hasattr(adviser, 'subordinates'):
            team_members = AdviserSerializer(
                adviser.subordinates.all(), many=True, context={'request': request}
            ).data
        
        return Response({
            'team_members': team_members,
            'team_size': len(team_members),
            'total_team_commission': 0  # Calculate when commission model is ready
        })

    @extend_schema(
        description="Get adviser dashboard data",
        responses={200: {
            'type': 'object',
            'properties': {
                'recent_activities': {'type': 'array'},
                'pending_tasks': {'type': 'array'},
                'performance_summary': {'type': 'object'}
            }
        }}
    )
    @action(detail=True, methods=['get'])
    def dashboard(self, request, pk=None):
        """Get dashboard data for an adviser"""
        adviser = self.get_object()
        
        # Mock data for now - will be replaced with real queries
        dashboard_data = {
            'recent_activities': [
                {'type': 'policy_created', 'date': timezone.now(), 'description': 'New policy created'},
                {'type': 'client_meeting', 'date': timezone.now() - timedelta(days=1), 'description': 'Client consultation'}
            ],
            'pending_tasks': [
                {'title': 'Follow up with client', 'priority': 'high', 'due_date': timezone.now() + timedelta(days=2)},
                {'title': 'Complete policy documentation', 'priority': 'medium', 'due_date': timezone.now() + timedelta(days=5)}
            ],
            'performance_summary': {
                'this_month_commission': 2500,
                'clients_acquired': 3,
                'policies_sold': 5,
                'target_achievement': 75
            }
        }
        
        return Response(dashboard_data)
