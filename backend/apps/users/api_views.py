from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from .models import User
from .serializers import UserSerializer, UserProfileSerializer, UserRegistrationSerializer, UserLoginSerializer
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


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_user(request):
    """
    API endpoint для регистрации нового пользователя.
    """
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        # Создаем пользователя
        user = User.objects.create(
            username=serializer.validated_data['username'],
            email=serializer.validated_data['email'],
            first_name=serializer.validated_data.get('first_name', ''),
            last_name=serializer.validated_data.get('last_name', ''),
            password=make_password(serializer.validated_data['password'])
        )
        
        # Создаем токен
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'success': True,
            'message': 'User registered successfully',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': user.role
            },
            'token': token.key,
            'requires_2fa': False  # For now, we'll implement 2FA later
        }, status=status.HTTP_201_CREATED)
    
    return Response({
        'success': False,
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_user(request):
    """
    API endpoint для входа пользователя.
    """
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        
        user = authenticate(username=username, password=password)
        if user is not None and user.is_active:
            # Получаем или создаем токен
            token, created = Token.objects.get_or_create(user=user)
            
            return Response({
                'success': True,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'role': user.role
                },
                'token': token.key,
                'requires_2fa': False  # For now
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'success': False,
                'error': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)
    
    return Response({
        'success': False,
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_user(request):
    """
    API endpoint для выхода пользователя.
    """
    try:
        # Удаляем токен пользователя
        request.user.auth_token.delete()
        return Response({
            'success': True,
            'message': 'Successfully logged out'
        }, status=status.HTTP_200_OK)
    except:
        return Response({
            'success': False,
            'error': 'Error logging out'
        }, status=status.HTTP_400_BAD_REQUEST)
