from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework import viewsets, permissions
from rest_framework.response import Response

class InsuranceViewSet(viewsets.ViewSet):
    """Простой ViewSet для страхования"""
    permission_classes = [permissions.AllowAny]
    
    def list(self, request):
        return Response({
            "results": [
                {"id": 1, "policy_number": "INS001", "type": "Life Insurance", "premium": 1200, "status": "active"},
                {"id": 2, "policy_number": "INS002", "type": "Health Insurance", "premium": 850, "status": "active"},
                {"id": 3, "policy_number": "INS003", "type": "Travel Insurance", "premium": 300, "status": "pending"},
            ],
            "count": 3
        })

router = DefaultRouter()
router.register(r'insurances', InsuranceViewSet, basename='insurance-api')

urlpatterns = [
    path('', include(router.urls)),
]
