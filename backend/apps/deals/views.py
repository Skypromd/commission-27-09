from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action


class DealViewSet(viewsets.ViewSet):
    """Простой ViewSet для deals"""
    permission_classes = [permissions.AllowAny]
    
    def list(self, request):
        return Response({
            "deals": [
                {"id": 1, "name": "Deal 1", "amount": 10000, "status": "active"},
                {"id": 2, "name": "Deal 2", "amount": 25000, "status": "pending"},
                {"id": 3, "name": "Deal 3", "amount": 15000, "status": "completed"},
            ]
        })
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        return Response({
            "total_deals": 3,
            "total_amount": 50000,
            "active_deals": 1
        })
