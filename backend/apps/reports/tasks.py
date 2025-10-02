from celery import shared_task
from django.contrib.auth import get_user_model
from django.http import HttpRequest, QueryDict

from apps.audit.models import AuditLog
from apps.notifications.models import Notification
from .models import Report
from .serializers import CommissionSerializer
from .services import ReportServiceFactory, DetailedReportService

User = get_user_model()


@shared_task
def generate_and_save_report_task(report_id, user_id, query_params_dict):
    """
    Фоновая задача для генерации отчета и сохранения его в БД.
    """
    report = None
    try:
        report = Report.objects.get(id=report_id)
        user = User.objects.get(id=user_id)

        report.status = Report.Status.IN_PROGRESS
        report.save()

        # Воссоздаем объект request для сервиса
        request = HttpRequest()
        request.user = user
        request.query_params = QueryDict(mutable=True)
        request.query_params.update(query_params_dict)

        # ��спользуем фабрику для получения нужного сервиса
        service = ReportServiceFactory.get_service(report.report_type, request)

        # Обрабатываем разные типы сервисов
        if isinstance(service, DetailedReportService):
            queryset = service.get_queryset()
            report_data = CommissionSerializer(queryset, many=True).data
        else:
            report_data = service.generate_report()

        if "error" in report_data:
            raise ValueError(report_data["error"])

        report.data = report_data
        report.status = Report.Status.SUCCESS
        report.save()

        Notification.objects.create(
            user=user,
            message=f"Ваш отчет '{report.name}' успешно сгенерирован.",
            content_object=report,
        )
        AuditLog.objects.create(
            user=user,
            action=f"Отчет '{report.name}' успешно сгенерирован",
            content_object=report,
        )

    except Exception as e:
        if report:
            report.status = Report.Status.FAILURE
            report.data = {"error": str(e)}
            report.save()
            Notification.objects.create(
                user=report.generated_by,
                message=f"Ошибка при генерации отчета '{report.name}'.",
                content_object=report,
            )
            AuditLog.objects.create(
                user=report.generated_by,
                action=f"Ошибка генерации отчета '{report.name}'",
                content_object=report,
                details=str(e),
            )
