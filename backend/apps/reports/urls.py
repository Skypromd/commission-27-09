from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    ReportViewSet,
    DetailedReportView,
    FinancialReportView,
    DetailedReportExportView,
)

router = DefaultRouter()
router.register(r"", ReportViewSet, basename="report")

app_name = "reports"

urlpatterns = [
    path("", include(router.urls)),
    path("detailed/", DetailedReportView.as_view(), name="detailed-report"),
    path("detailed/export/", DetailedReportExportView.as_view(), name="detailed-report-export"),
    path("financial/", FinancialReportView.as_view(), name="financial-report"),
]
