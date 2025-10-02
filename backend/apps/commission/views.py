from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action


class CommissionViewSet(viewsets.ViewSet):
    """Простой ViewSet для commissions"""
    permission_classes = [permissions.AllowAny]
    
    def list(self, request):
        return Response({
            "commissions": [
                {"id": 1, "adviser": "John Agent", "amount": 500, "policy": "POL001", "status": "paid"},
                {"id": 2, "adviser": "Mary Advisor", "amount": 340, "policy": "POL002", "status": "pending"},
                {"id": 3, "adviser": "Tom Broker", "amount": 840, "policy": "POL003", "status": "paid"},
            ]
        })
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        return Response({
            "total_commissions": 3,
            "paid_commissions": 2,
            "pending_amount": 340,
            "total_amount": 1680
        })
