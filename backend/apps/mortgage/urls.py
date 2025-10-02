from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework import viewsets, permissions
from rest_framework.response import Response

class MortgageViewSet(viewsets.ViewSet):
    """Простой ViewSet для ипотеки"""
    permission_classes = [permissions.AllowAny]
    
    def list(self, request):
        return Response({
            "results": [
                {"id": 1, "application_number": "MTG001", "amount": 250000, "rate": 3.5, "status": "approved", "client": "Johnson Family"},
                {"id": 2, "application_number": "MTG002", "amount": 180000, "rate": 3.2, "status": "processing", "client": "Smith Ltd"},
                {"id": 3, "application_number": "MTG003", "amount": 320000, "rate": 3.8, "status": "pending", "client": "Wilson Corp"},
            ],
            "count": 3
        })

router = DefaultRouter()
router.register(r'mortgages', MortgageViewSet, basename='mortgage-api')

urlpatterns = [
    path('', include(router.urls)),
]
