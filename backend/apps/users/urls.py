from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet
from .api_views import register_user, login_user, logout_user

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('auth/register/', register_user, name='auth-register'),
    path('auth/login/', login_user, name='auth-login'),
    path('auth/logout/', logout_user, name='auth-logout'),
] + router.urls
