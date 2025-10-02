from rest_framework.routers import DefaultRouter
from .views import ClientViewSet, AdviserViewSet

router = DefaultRouter()
router.register(r'clients', ClientViewSet)
router.register(r'advisers', AdviserViewSet)

urlpatterns = router.urls

