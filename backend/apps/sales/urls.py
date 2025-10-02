from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework import viewsets, permissions
from rest_framework.response import Response

class SalesViewSet(viewsets.ViewSet):
    """Sales Management ViewSet"""
    permission_classes = [permissions.AllowAny]
    
    def list(self, request):
        return Response({
            "results": [
                {"id": 1, "sale_id": "SAL001", "adviser": "John Smith", "client": "ABC Corp", "amount": 15000, "status": "closed", "date": "2024-10-15"},
                {"id": 2, "sale_id": "SAL002", "adviser": "Sarah Johnson", "client": "XYZ Ltd", "amount": 22000, "status": "pending", "date": "2024-10-20"},
                {"id": 3, "sale_id": "SAL003", "adviser": "Mike Wilson", "client": "Tech Inc", "amount": 8500, "status": "closed", "date": "2024-10-25"},
            ],
            "count": 3,
            "total_sales": 45500,
            "monthly_target": 100000
        })

router = DefaultRouter()
router.register(r'sales', SalesViewSet, basename='sales-api')

urlpatterns = [
    path('', include(router.urls)),
]
