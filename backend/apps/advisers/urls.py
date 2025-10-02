from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api_views import AdviserViewSet
from .views import AdviserViewSet as OldAdviserViewSet

router = DefaultRouter()
router.register(r'advisers', AdviserViewSet)
# Keep old viewset for compatibility
router.register(r'advisers-old', OldAdviserViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
