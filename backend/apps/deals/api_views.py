from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from drf_spectacular.utils import extend_schema, extend_schema_view
from django.db.models import Count, Sum, Avg, Q
from django.utils import timezone
from datetime import timedelta

from .models import Pipeline, Stage
# Временно используем простые сериализаторы
from rest_framework import serializers

class PipelineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pipeline
        fields = '__all__'

class StageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stage
        fields = '__all__'
from apps.core.permissions import IsOwnerOrManager


class DealViewSet(viewsets.ViewSet):
    """
    Advanced Deal Management ViewSet with comprehensive sales pipeline functionality.
    """
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        description="Get deals dashboard with pipeline analytics",
        responses={200: {
            'type': 'object',
            'properties': {
                'pipeline_overview': {'type': 'object'},
                'recent_deals': {'type': 'array'},
                'performance_metrics': {'type': 'object'}
            }
        }}
    )
    def list(self, request):
        """Get comprehensive deals dashboard"""
        
        # Mock comprehensive deals data
        dashboard_data = {
            'pipeline_overview': {
                'total_deals': 156,
                'total_value': 2850000.00,
                'avg_deal_size': 18269.23,
                'win_rate': 0.67,
                'avg_cycle_time': 45  # days
            },
            'stage_breakdown': [
                {'stage': 'Prospect', 'count': 45, 'value': 780000, 'conversion_rate': 0.78},
                {'stage': 'Qualification', 'count': 32, 'value': 650000, 'conversion_rate': 0.85},
                {'stage': 'Proposal', 'count': 28, 'value': 590000, 'conversion_rate': 0.72},
                {'stage': 'Negotiation', 'count': 18, 'value': 420000, 'conversion_rate': 0.89},
                {'stage': 'Closed Won', 'count': 33, 'value': 710000, 'conversion_rate': 1.0}
            ],
            'recent_deals': [
                {
                    'id': 1,
                    'client_name': 'ABC Corporation',
                    'product': 'Corporate Life Insurance',
                    'value': 45000,
                    'stage': 'Proposal',
                    'probability': 75,
                    'close_date': '2024-11-15',
                    'adviser': 'John Smith',
                    'last_activity': '2024-10-28',
                    'days_in_stage': 12
                },
                {
                    'id': 2,
                    'client_name': 'Smith Family Trust',
                    'product': 'Family Protection Package',
                    'value': 28000,
                    'stage': 'Negotiation',
                    'probability': 85,
                    'close_date': '2024-10-30',
                    'adviser': 'Sarah Johnson',
                    'last_activity': '2024-10-27',
                    'days_in_stage': 5
                },
                {
                    'id': 3,
                    'client_name': 'Tech Startup Inc',
                    'product': 'Business Insurance Bundle',
                    'value': 67000,
                    'stage': 'Qualification',
                    'probability': 60,
                    'close_date': '2024-12-01',
                    'adviser': 'Mike Wilson',
                    'last_activity': '2024-10-26',
                    'days_in_stage': 8
                }
            ],
            'performance_metrics': {
                'this_month': {
                    'deals_closed': 8,
                    'revenue': 185000,
                    'target_achievement': 0.84
                },
                'this_quarter': {
                    'deals_closed': 28,
                    'revenue': 640000,
                    'target_achievement': 0.91
                },
                'forecasting': {
                    'pipeline_strength': 'Strong',
                    'projected_monthly_close': 220000,
                    'risk_factors': ['2 large deals in negotiation', 'Seasonal slowdown expected']
                }
            },
            'team_leaderboard': [
                {'adviser': 'Sarah Johnson', 'deals_closed': 12, 'revenue': 280000, 'win_rate': 0.75},
                {'adviser': 'John Smith', 'deals_closed': 10, 'revenue': 245000, 'win_rate': 0.71},
                {'adviser': 'Mike Wilson', 'deals_closed': 8, 'revenue': 195000, 'win_rate': 0.67},
                {'adviser': 'Lisa Chen', 'deals_closed': 6, 'revenue': 150000, 'win_rate': 0.60}
            ]
        }
        
        return Response(dashboard_data)

    @extend_schema(
        description="Get detailed deal information",
        responses={200: {
            'type': 'object',
            'properties': {
                'deal_details': {'type': 'object'},
                'activity_history': {'type': 'array'},
                'next_actions': {'type': 'array'}
            }
        }}
    )
    def retrieve(self, request, pk=None):
        """Get detailed deal information"""
        
        deal_detail = {
            'id': int(pk),
            'client_name': 'ABC Corporation',
            'contact_person': 'Jane Doe',
            'contact_email': 'jane.doe@abccorp.com',
            'contact_phone': '+1-555-0123',
            'product': 'Corporate Life Insurance',
            'value': 45000,
            'stage': 'Proposal',
            'probability': 75,
            'close_date': '2024-11-15',
            'created_date': '2024-09-15',
            'adviser': {
                'name': 'John Smith',
                'email': 'john.smith@company.com',
                'phone': '+1-555-0198'
            },
            'deal_score': {
                'budget_fit': 0.85,
                'authority': 0.90,
                'need': 0.80,
                'timeline': 0.70,
                'overall': 0.81
            },
            'activity_history': [
                {
                    'date': '2024-10-28',
                    'type': 'proposal_sent',
                    'description': 'Comprehensive proposal sent via email',
                    'notes': 'Included 3 coverage options and competitive pricing',
                    'adviser': 'John Smith'
                },
                {
                    'date': '2024-10-25',
                    'type': 'meeting',
                    'description': 'Discovery call with decision makers',
                    'notes': 'Identified key requirements and budget parameters',
                    'adviser': 'John Smith'
                },
                {
                    'date': '2024-10-20',
                    'type': 'email',
                    'description': 'Follow-up email with additional information',
                    'notes': 'Sent industry-specific case studies',
                    'adviser': 'John Smith'
                }
            ],
            'next_actions': [
                {
                    'action': 'Follow up on proposal',
                    'due_date': '2024-10-30',
                    'priority': 'High',
                    'description': 'Call to discuss proposal questions'
                },
                {
                    'action': 'Schedule presentation',
                    'due_date': '2024-11-02',
                    'priority': 'Medium',
                    'description': 'Present to full board of directors'
                }
            ],
            'documents': [
                {'name': 'Proposal_ABC_Corp_v2.pdf', 'type': 'proposal', 'date': '2024-10-28'},
                {'name': 'Needs_Assessment.docx', 'type': 'assessment', 'date': '2024-10-25'},
                {'name': 'Competitive_Analysis.xlsx', 'type': 'analysis', 'date': '2024-10-20'}
            ]
        }
        
        return Response(deal_detail)

    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Get deals summary statistics"""
        return Response({
            "total_deals": 156,
            "total_value": 2850000.00,
            "avg_deal_size": 18269.23,
            "win_rate": 67,
            "active_deals": 123,
            "closed_won_this_month": 8,
            "pipeline_velocity": {
                "avg_days_to_close": 45,
                "fastest_close": 12,
                "longest_cycle": 180
            }
        })


@extend_schema_view(
    list=extend_schema(description="List all sales pipelines"),
    create=extend_schema(description="Create a new sales pipeline"),
    retrieve=extend_schema(description="Get pipeline details with stages"),
    update=extend_schema(description="Update pipeline configuration"),
    destroy=extend_schema(description="Delete pipeline"),
)
class PipelineViewSet(viewsets.ModelViewSet):
    """
    ViewSet for sales pipeline management.
    """
    queryset = Pipeline.objects.prefetch_related('stages').all()
    serializer_class = PipelineSerializer
    permission_classes = [permissions.IsAuthenticated]
    search_fields = ['name']
    ordering = ['name']


@extend_schema_view(
    list=extend_schema(description="List all pipeline stages"),
    create=extend_schema(description="Create a new stage"),
    retrieve=extend_schema(description="Get stage details"),
    update=extend_schema(description="Update stage configuration"),
    destroy=extend_schema(description="Delete stage"),
)
class StageViewSet(viewsets.ModelViewSet):
    """
    ViewSet for pipeline stage management.
    """
    queryset = Stage.objects.select_related('pipeline').all()
    serializer_class = StageSerializer
    permission_classes = [permissions.IsAuthenticated]
    ordering = ['pipeline', 'order']
