from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework import viewsets, permissions
from rest_framework.response import Response

class NotificationsViewSet(viewsets.ViewSet):
    """Notifications Management ViewSet"""
    permission_classes = [permissions.AllowAny]
    
    def list(self, request):
        return Response({
            "results": [
                {"id": 1, "title": "New client inquiry", "message": "ABC Corp requested insurance quote", "type": "client", "read": False, "created": "2024-10-28T10:30:00Z"},
                {"id": 2, "title": "Commission payment processed", "message": "Your October commission has been processed", "type": "commission", "read": True, "created": "2024-10-27T15:45:00Z"},
                {"id": 3, "title": "Policy renewal reminder", "message": "5 policies expiring next month", "type": "policy", "read": False, "created": "2024-10-26T09:15:00Z"},
            ],
            "count": 3,
            "unread_count": 2
        })

router = DefaultRouter()
router.register(r'notifications', NotificationsViewSet, basename='notifications-api')

urlpatterns = [
    path('', include(router.urls)),
]
