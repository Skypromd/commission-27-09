from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework import viewsets, permissions
from rest_framework.response import Response

class TasksViewSet(viewsets.ViewSet):
    """Task Management ViewSet"""
    permission_classes = [permissions.AllowAny]
    
    def list(self, request):
        return Response({
            "results": [
                {"id": 1, "title": "Follow up with ABC Corp", "description": "Send additional policy information", "assigned_to": "John Smith", "due_date": "2024-11-01", "priority": "high", "status": "open"},
                {"id": 2, "title": "Prepare monthly report", "description": "Compile October sales data", "assigned_to": "Sarah Johnson", "due_date": "2024-10-31", "priority": "medium", "status": "in_progress"},
                {"id": 3, "title": "Client meeting preparation", "description": "Prepare presentation for XYZ Ltd", "assigned_to": "Mike Wilson", "due_date": "2024-10-30", "priority": "high", "status": "completed"},
            ],
            "count": 3,
            "open_tasks": 2,
            "overdue_tasks": 0
        })

router = DefaultRouter()
router.register(r'tasks', TasksViewSet, basename='tasks-api')

urlpatterns = [
    path('', include(router.urls)),
]
