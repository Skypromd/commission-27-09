from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .services import BIMetricService


class MonthlyCommissionVolumeView(APIView):
    """
    Возвращает общий объем комиссий, сгруппированный по месяцам.
    Предназначено для использования BI-системами.
    """
    def get(self, request, *args, **kwargs):
        data = BIMetricService.get_monthly_commission_volume(request)
        return Response(data, status=status.HTTP_200_OK)


class CommissionByLenderView(APIView):
    """
    Возвращает общий объем комиссий, сгруппированный по кредиторам.
    Предназначено для использования BI-системами.
    """
    def get(self, request, *args, **kwargs):
        data = BIMetricService.get_commission_by_lender(request)
        return Response(data, status=status.HTTP_200_OK)


class CommissionByStatusView(APIView):
    """
    Возвращает общий объем комиссий, сгруппированный по статусам.
    Предназначено для использования BI-системами.
    """
    def get(self, request, *args, **kwargs):
        data = BIMetricService.get_commission_by_status(request)
        return Response(data, status=status.HTTP_200_OK)


class TopPerformersView(APIView):
    """
    Возвращает рейтинг лучших консультантов по объему комиссий.
    Поддерживает параметры `period` и `limit`.
    """
    def get(self, request, *args, **kwargs):
        data = BIMetricService.get_top_performers(request)
        return Response(data, status=status.HTTP_200_OK)


class CommissionForecastView(APIView):
    """
    Возвращает прогноз по комиссиям, сгруппированный по месяцам.
    """
    def get(self, request, *args, **kwargs):
        data = BIMetricService.get_commission_forecast(request)
        return Response(data, status=status.HTTP_200_OK)


class CommissionByProductTypeView(APIView):
    """
    Возвращает общий объем комиссий, сгруппированный по типам продуктов.
    """
    def get(self, request, *args, **kwargs):
        data = BIMetricService.get_commission_by_product_type(request)
        return Response(data, status=status.HTTP_200_OK)
