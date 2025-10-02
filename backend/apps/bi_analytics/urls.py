from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework import viewsets, permissions
from rest_framework.response import Response

class AnalyticsViewSet(viewsets.ViewSet):
    """Business Intelligence & Analytics ViewSet"""
    permission_classes = [permissions.AllowAny]
    
    def list(self, request):
        return Response({
            "dashboard_metrics": {
                "total_revenue": 2850000,
                "monthly_growth": 0.12,
                "client_acquisition": 45,
                "team_performance": 0.87,
                "market_share": 0.23
            },
            "kpi_data": [
                {"metric": "Revenue Growth", "value": "12%", "trend": "up", "period": "month"},
                {"metric": "Client Satisfaction", "value": "4.8", "trend": "stable", "period": "quarter"},
                {"metric": "Team Productivity", "value": "87%", "trend": "up", "period": "month"},
                {"metric": "Market Position", "value": "23%", "trend": "up", "period": "year"},
            ],
            "predictive_insights": {
                "next_month_forecast": "15% growth expected",
                "risk_factors": ["Seasonal slowdown", "Market competition"],
                "opportunities": ["New product launch", "Expanded territory"]
            }
        })

router = DefaultRouter()
router.register(r'analytics', AnalyticsViewSet, basename='analytics-api')

urlpatterns = [
    path('', include(router.urls)),
]
