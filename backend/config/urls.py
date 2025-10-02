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
    # API Apps - ВСЕ МОДУЛИ
    path("api/advisers/", include("apps.advisers.urls")),
    path("api/users/", include("apps.users.urls")),
    path("api/clients/", include("apps.clients.urls")), 
    path("api/products/", include("apps.products.urls")),
    path("api/policies/", include("apps.policies.urls")),
    path("api/deals/", include("apps.deals.urls")),
    path("api/commission/", include("apps.commission.urls")),
    path("api/insurances/", include("apps.insurances.urls")),
    path("api/mortgage/", include("apps.mortgage.urls")),
    path("api/sales/", include("apps.sales.urls")),
    path("api/reports/", include("apps.reports.urls")),
    path("api/notifications/", include("apps.notifications.urls")),
    path("api/audit/", include("apps.audit.urls")),
    path("api/tasks/", include("apps.tasks.urls")),
    path("api/bi/", include("apps.bi_analytics.urls")),
    # path("api/sales/", include("apps.sales.urls")),
    # path("api/reports/", include("apps.reports.urls")),
    # path("api/notifications/", include("apps.notifications.urls")),
    # path("api/audit/", include("apps.audit.urls")),
    # path("api/tasks/", include("apps.tasks.urls")),
    # path("api/bi/", include("apps.bi_analytics.urls")),
    # Docs
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
