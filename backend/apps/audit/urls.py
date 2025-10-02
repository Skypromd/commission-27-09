from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework import viewsets, permissions
from rest_framework.response import Response

class AuditViewSet(viewsets.ViewSet):
    """System Audit & Logging ViewSet"""
    permission_classes = [permissions.AllowAny]
    
    def list(self, request):
        return Response({
            "results": [
                {"id": 1, "action": "User Login", "user": "john.smith", "ip": "192.168.1.100", "timestamp": "2024-10-28T10:30:00Z", "status": "success"},
                {"id": 2, "action": "Policy Created", "user": "sarah.johnson", "details": "Policy INS001 created", "timestamp": "2024-10-28T09:15:00Z", "status": "success"},
                {"id": 3, "action": "Commission Updated", "user": "admin", "details": "Commission rates updated", "timestamp": "2024-10-27T16:45:00Z", "status": "success"},
            ],
            "count": 3,
            "today_actions": 15,
            "security_events": 0
        })

router = DefaultRouter()
router.register(r'audit', AuditViewSet, basename='audit-api')

urlpatterns = [
    path('', include(router.urls)),
]
