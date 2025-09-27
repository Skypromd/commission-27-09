from django.urls import path
from .views import (
    MonthlyCommissionVolumeView,
    CommissionByLenderView,
    CommissionByStatusView,
    TopPerformersView,
    CommissionForecastView,
    CommissionByProductTypeView,
)

app_name = "bi_analytics"

urlpatterns = [
    path(
        "monthly-commission-volume/",
        MonthlyCommissionVolumeView.as_view(),
        name="monthly-commission-volume",
    ),
    path(
        "commission-by-lender/",
        CommissionByLenderView.as_view(),
        name="commission-by-lender",
    ),
    path(
        "commission-by-status/",
        CommissionByStatusView.as_view(),
        name="commission-by-status",
    ),
    path(
        "top-performers/",
        TopPerformersView.as_view(),
        name="top-performers",
    ),
    path(
        "commission-forecast/",
        CommissionForecastView.as_view(),
        name="commission-forecast",
    ),
    path(
        "commission-by-product-type/",
        CommissionByProductTypeView.as_view(),
        name="commission-by-product-type",
    ),
]
