from django.conf import settings
from django.db import models


class Report(models.Model):
    """Модель для хранения сгенерированных отчетов."""

    class ReportType(models.TextChoices):
        COMMISSION_SUMMARY = "commission_summary", "Сводка по комиссиям"
        PERFORMANCE_ANALYSIS = "performance_analysis", "Анализ производительности"
        FORECAST = "forecast", "Прогноз"

    class Status(models.TextChoices):
        PENDING = "PENDING", "В ожидании"
        IN_PROGRESS = "IN_PROGRESS", "В обработке"
        SUCCESS = "SUCCESS", "Успешно"
        FAILURE = "FAILURE", "Ошибка"

    name = models.CharField("Название отчета", max_length=255)
    report_type = models.CharField(
        "Тип отчета",
        max_length=50,
        choices=ReportType.choices,
        default=ReportType.COMMISSION_SUMMARY,
    )
    generated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name="Кем сгенериров��н",
    )
    created_at = models.DateTimeField("Дата создания", auto_now_add=True)
    data = models.JSONField("Данные отчета", default=dict, blank=True)
    task_id = models.CharField("ID задачи Celery", max_length=255, blank=True, null=True)
    status = models.CharField(
        "Статус генерации",
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )

    class Meta:
        verbose_name = "Отчет"
        verbose_name_plural = "О��четы"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} ({self.get_report_type_display()})"
