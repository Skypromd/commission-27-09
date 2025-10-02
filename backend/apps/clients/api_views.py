from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from drf_spectacular.utils import extend_schema, extend_schema_view
from django.db.models import Count, Sum, Q, Prefetch
from django.utils import timezone

from .models import Client
from .serializers import ClientSerializer
# from apps.core.permissions import IsOwnerOrManager  # Временно отключено


@extend_schema_view(
    list=extend_schema(description="List all clients with filtering and search"),
    create=extend_schema(description="Create a new client"),
    retrieve=extend_schema(description="Get client details with related data"),
    update=extend_schema(description="Update client information"), 
    destroy=extend_schema(description="Delete client (soft delete)"),
)
class ClientViewSet(viewsets.ModelViewSet):
    """
    ViewSet for comprehensive client management.
    Includes client history, policies, and communication tracking.
    """
    queryset = Client.objects.select_related('agent').all()
    serializer_class = ClientSerializer
    permission_classes = [permissions.AllowAny]  # Временно для демо
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['name', 'email', 'phone']
    ordering_fields = ['name', 'created_at', 'agent__user__last_name']
    ordering = ['-created_at']
    filterset_fields = ['agent']

    def get_queryset(self):
        """Filter clients based on user permissions"""
        user = self.request.user
        if user.is_superuser or user.is_staff:
            return self.queryset
        
        # Advisers can only see their own clients
        try:
            adviser = user.adviser
            return self.queryset.filter(agent=adviser)
        except:
            return Client.objects.none()

    @extend_schema(
        description="Get client's policy history and summary",
        responses={200: {
            'type': 'object',
            'properties': {
                'total_policies': {'type': 'integer'},
                'active_policies': {'type': 'integer'},
                'total_premium': {'type': 'number'},
                'policy_history': {'type': 'array'}
            }
        }}
    )
    @action(detail=True, methods=['get'])
    def policies(self, request, pk=None):
        """Get all policies for this client"""
        client = self.get_object()
        
        # Mock data - will be replaced when policy model is implemented
        policies_data = {
            'total_policies': 3,
            'active_policies': 2,
            'total_premium': 4500.00,
            'policy_history': [
                {
                    'id': 1,
                    'policy_number': 'POL001',
                    'product_type': 'Life Insurance',
                    'premium': 1200.00,
                    'start_date': '2024-01-15',
                    'status': 'active'
                },
                {
                    'id': 2, 
                    'policy_number': 'POL002',
                    'product_type': 'Health Insurance',
                    'premium': 850.00,
                    'start_date': '2024-03-20',
                    'status': 'active'
                }
            ]
        }
        
        return Response(policies_data)

    @extend_schema(
        description="Get client interaction history",
        responses={200: {
            'type': 'object',
            'properties': {
                'interactions': {'type': 'array'},
                'last_contact': {'type': 'string'},
                'next_followup': {'type': 'string'}
            }
        }}
    )
    @action(detail=True, methods=['get'])
    def interactions(self, request, pk=None):
        """Get client interaction and communication history"""
        client = self.get_object()
        
        # Mock interaction data
        interactions_data = {
            'interactions': [
                {
                    'date': timezone.now().date(),
                    'type': 'phone_call',
                    'subject': 'Policy renewal discussion',
                    'notes': 'Client interested in additional coverage',
                    'adviser': client.agent.user.get_full_name() if client.agent else 'N/A'
                },
                {
                    'date': timezone.now().date() - timezone.timedelta(days=7),
                    'type': 'email', 
                    'subject': 'Welcome package sent',
                    'notes': 'Sent welcome materials and policy documents',
                    'adviser': client.agent.user.get_full_name() if client.agent else 'N/A'
                }
            ],
            'last_contact': timezone.now().date().isoformat(),
            'next_followup': (timezone.now().date() + timezone.timedelta(days=30)).isoformat()
        }
        
        return Response(interactions_data)

    @extend_schema(
        description="Get client analytics and insights",
        responses={200: {
            'type': 'object',
            'properties': {
                'lifetime_value': {'type': 'number'},
                'risk_score': {'type': 'number'},
                'satisfaction_score': {'type': 'number'},
                'recommendations': {'type': 'array'}
            }
        }}
    )
    @action(detail=True, methods=['get'])
    def analytics(self, request, pk=None):
        """Get client analytics and business insights"""
        client = self.get_object()
        
        # Mock analytics data
        analytics_data = {
            'lifetime_value': 15000.00,
            'risk_score': 2.3,  # Scale of 1-5
            'satisfaction_score': 4.5,  # Scale of 1-5
            'policy_count': 3,
            'years_as_client': 2.5,
            'recommendations': [
                {
                    'type': 'cross_sell',
                    'product': 'Travel Insurance',
                    'confidence': 0.85,
                    'reason': 'Client has frequent business travel'
                },
                {
                    'type': 'upsell',
                    'product': 'Premium Health Coverage',
                    'confidence': 0.72,
                    'reason': 'Recent family expansion'
                }
            ]
        }
        
        return Response(analytics_data)
