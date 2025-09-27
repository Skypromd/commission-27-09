from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'policies', views.PolicyViewSet, basename='policy')

urlpatterns = router.urls

