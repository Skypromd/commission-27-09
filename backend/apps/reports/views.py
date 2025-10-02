import csv
from datetime import timedelta, datetime
from django.http import HttpResponse
from django.utils import timezone
from django.db.models import Sum, F, DecimalField
from django.db.models.functions import Coalesce
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response

from apps.audit.models import AuditLog
from apps.mortgage.models import Commission, MortgageCase
from apps.mortgage.serializers import CommissionSerializer
from apps.users.models import User
from .models import Report
from .serializers import ReportSerializer
from .filters import CommissionFilter
from .services import FinancialReportService, DetailedReportService
from .tasks import generate_and_save_report_task


class DetailedReportView(APIView):
    """
    Получение детализированного отчета по комиссиям в реальном времени.

    Поддерживает фильтрацию по:
    - `start_date` (YYYY-MM-DD)
    - `end_date` (YYYY-MM-DD)
    - `adviser` (ID пользователя)
    - `lender` (название кредитора)
    - `status` (статус ипотечного случая)
    """
    def get(self, request, *args, **kwargs):
        service = DetailedReportService(request)
        queryset = service.get_queryset()
        serializer = CommissionSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class DetailedReportExportView(APIView):
    """
    Экспорт детализированного отчета по комиссиям в формате CSV.

    Принимает те же параметры фильтрации, что и эндпоинт детализированного отчета.
    """
    def get(self, request, *args, **kwargs):
        service = DetailedReportService(request)
        queryset = service.get_queryset()

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="detailed_report_{timezone.now().strftime("%Y-%m-%d")}.csv"'

        writer = csv.writer(response)
        # Write headers
        headers = [
            'Case ID', 'Adviser', 'Client', 'Lender', 'Loan Amount',
            'Status', 'Gross Commission', 'Net Commission', 'Payment Status', 'Date Received'
        ]
        writer.writerow(headers)

        # Write data rows
        for commission in queryset:
            case = commission.mortgage_case
            writer.writerow([
                case.id,
                case.adviser.username if case.adviser else '',
                str(case.client),
                case.lender.name,
                case.loan_amount,
                case.get_status_display(),
                commission.gross_commission,
                commission.net_commission,
                commission.payment_status,
                commission.date_received,
            ])

        return response


class FinancialReportView(APIView):
    """
    DEPRECATED: Синхронная генерация финансового отчета.

    Этот эндпоинт ��старел. Используйте асинхронное создание отчетов
    через POST-запрос на `/api/reports/`.
    """

    def get(self, request, *args, **kwargs):
        return Response(
            {"error": "This report must be generated asynchronously via the /api/reports/ endpoint."},
            status=status.HTTP_400_BAD_REQUEST
        )


class ReportViewSet(viewsets.ModelViewSet):
    """
    Просмотр и создание асинхронных отчетов.

    **Создание отчета (POST):**
    1. Отправьте POST-запрос с полями `name` и `report_type`.
    2. В ответ вы получите `202 Accepted` и объект отчета с `task_id` и статусом `PENDING`.
    3. Используйте `id` отчета для получения его статуса и результата через GET-запрос.

    **Типы отчетов (`report_type`):**
    - `forecast`: Финансовый прогноз.
    - `commission_summary`: Детализированная сводка по комиссиям.
    - `performance_analysis`: Анализ производительности.
    """

    queryset = Report.objects.all()
    serializer_class = ReportSerializer

    def get_queryset(self):
        """
        Пользователи могут видеть только свои отчеты, если они не администраторы.
        """
        user = self.request.user
        if user.is_superuser or user.is_manager:
            return Report.objects.all()
        return Report.objects.filter(generated_by=user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Создаем отчет со статусом PENDING
        report = serializer.save(
            generated_by=request.user, status=Report.Status.PENDING
        )

        # Логируем действие
        AuditLog.objects.create(
            user=request.user,
            action=f"Запрошен отчет: '{report.name}'",
            content_object=report,
            details=f"Тип: {report.get_report_type_display()}, Парамет��ы: {request.query_params.dict()}"
        )

        # Запускаем фоновую задачу
        task = generate_and_save_report_task.delay(
            report.id, request.user.id, request.query_params.dict()
        )

        # Со��раняем ID задачи
        report.task_id = task.id
        report.save()

        # Возвращаем созданный объект отчета со статусом 202
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_202_ACCEPTED, headers=headers
        )
