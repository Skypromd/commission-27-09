from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework import viewsets, permissions
from rest_framework.response import Response

class ReportsViewSet(viewsets.ViewSet):
    """Reports & Analytics ViewSet"""
    permission_classes = [permissions.AllowAny]
    
    def list(self, request):
        return Response({
            "results": [
                {"id": 1, "name": "Monthly Sales Report", "type": "sales", "generated": "2024-10-28", "status": "ready"},
                {"id": 2, "name": "Commission Analysis", "type": "commission", "generated": "2024-10-27", "status": "ready"},
                {"id": 3, "name": "Team Performance", "type": "team", "generated": "2024-10-26", "status": "processing"},
                {"id": 4, "name": "Client Portfolio Review", "type": "clients", "generated": "2024-10-25", "status": "ready"},
            ],
            "count": 4,
            "available_types": ["sales", "commission", "team", "clients", "financial"]
        })

router = DefaultRouter()
router.register(r'reports', ReportsViewSet, basename='reports-api')

urlpatterns = [
    path('', include(router.urls)),
]
