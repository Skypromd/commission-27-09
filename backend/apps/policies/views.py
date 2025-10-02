from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action


class PolicyViewSet(viewsets.ViewSet):
    """Простой ViewSet для policies"""
    permission_classes = [permissions.AllowAny]
    
    def list(self, request):
        return Response({
            "policies": [
                {"id": 1, "policy_number": "POL001", "client": "John Smith", "premium": 1200, "status": "active"},
                {"id": 2, "policy_number": "POL002", "client": "Jane Doe", "premium": 850, "status": "pending"},
                {"id": 3, "policy_number": "POL003", "client": "Bob Wilson", "premium": 2100, "status": "active"},
            ]
        })
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        return Response({
            "total_policies": 3,
            "active_policies": 2,
            "total_premium": 4150
        })
