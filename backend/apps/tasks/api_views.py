from rest_framework import viewsets, permissions
from django.db.models import Q
from .models import Task
from .serializers import TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
// ...existing code...
    def get_queryset(self):
        """
        Advisers see tasks assigned to them.
        Managers see tasks they created OR tasks assigned to their subordinates.
        """
        user = self.request.user
        if not hasattr(user, 'adviser_profile'):
            return Task.objects.none()

        adviser_profile = user.adviser_profile

        if adviser_profile.role == 'MANAGER':
            # Get advisers who report to this manager
            subordinates = adviser_profile.subordinates.all()
            return Task.objects.filter(
                Q(created_by=adviser_profile) | Q(assigned_to__in=subordinates)
            ).distinct()

        # Regular adviser sees tasks assigned to them
        return Task.objects.filter(assigned_to=adviser_profile)

