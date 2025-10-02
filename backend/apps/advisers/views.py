from rest_framework import viewsets
from .models import Adviser
from .serializers import AdviserSerializer

class AdviserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet для просмотра консультантов.
    """
    queryset = Adviser.objects.all().select_related('user', 'parent_adviser__user')
    serializer_class = AdviserSerializer

