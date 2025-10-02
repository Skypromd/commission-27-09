from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer, UserProfileSerializer
from .permissions import IsAdminOrOwnerOrManagerReadOnly
from .services import get_all_subordinates

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint, который позволяет просматривать и редактировать пользователей.
    - Администраторы видят и могут редактировать всех.
    - Руководители могут просматривать свою команду.
    - Обычные пользователи могут видеть только себя через /me/.
    """
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrOwnerOrManagerReadOnly]

    def get_queryset(self):
        """
        Определяет список пользователей, видимых для текущего юзера.
        """
        user = self.request.user
        if user.is_staff:
            return User.objects.all().order_by('username')

        # Руководитель видит себя и всю свою команду
        subordinate_ids = get_all_subordinates(user).values_list('id', flat=True)
        return User.objects.filter(id__in=list(subordinate_ids) + [user.id]).order_by('username')

    def get_serializer_class(self):
        """
        Используем разный сериализатор для action 'me'.
        """
        if self.action == 'me':
            return UserProfileSerializer
        return UserSerializer

    @action(detail=False, methods=['get', 'put', 'patch'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        """
        Эндпоинт для просмотра и редактирования профиля текущего пользователя.
        """
        user = request.user
        if request.method == 'GET':
            serializer = self.get_serializer(user)
            return Response(serializer.data)
        elif request.method in ['PUT', 'PATCH']:
            serializer = self.get_serializer(user, data=request.data, partial=request.method == 'PATCH')
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
