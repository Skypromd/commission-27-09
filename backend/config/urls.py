"""
Main URL configuration for the project.
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["GET"])
def api_root(request, format=None):
    """
    Корневой эндпоинт API. Предоставляет список всех доступных модулей.
    """
    return Response(
        {
            "advisers": "/api/advisers/",
            "users": "/api/users/",
            "clients": "/api/clients/",
            "products": "/api/products/",
            "policies": "/api/policies/",
            "deals": "/api/deals/",
            "commission": "/api/commission/",
            "insurances": "/api/insurances/",
            "mortgage": "/api/mortgage/",
            "sales": "/api/sales/",
            "reports": "/api/reports/",
            "notifications": "/api/notifications/",
            "audit": "/api/audit/",
            "tasks": "/api/tasks/",
            "bi_analytics": "/api/bi/",
            "docs": "/api/docs/",
            "redoc": "/api/redoc/",
        }
    )


urlpatterns = [
    path("admin/", admin.site.urls),
    # API Root
    path("api/", api_root, name="api-root"),
    # API Apps
    path("api/advisers/", include("apps.advisers.urls", namespace="advisers")),
    path("api/users/", include("apps.users.urls", namespace="users")),
    path("api/clients/", include("apps.clients.urls", namespace="clients")),
    path("api/products/", include("apps.products.urls", namespace="products")),
    path("api/policies/", include("apps.policies.urls", namespace="policies")),
    path("api/deals/", include("apps.deals.urls", namespace="deals")),
    path("api/commission/", include("apps.commission.urls", namespace="commission")),
    path("api/insurances/", include("apps.insurances.urls", namespace="insurances")),
    path("api/mortgage/", include("apps.mortgage.urls", namespace="mortgage")),
    path("api/sales/", include("apps.sales.urls", namespace="sales")),
    path("api/reports/", include("apps.reports.urls", namespace="reports")),
    path("api/notifications/", include("apps.notifications.urls", namespace="notifications")),
    path("api/audit/", include("apps.audit.urls", namespace="audit")),
    path("api/tasks/", include("apps.tasks.urls", namespace="tasks")),
    path("api/bi/", include("apps.bi_analytics.urls", namespace="bi_analytics")),
    # Docs
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
