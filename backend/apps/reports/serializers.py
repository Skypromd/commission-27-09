from rest_framework import serializers

from .models import Report


class ReportSerializer(serializers.ModelSerializer):
    """Сериализатор для модели отчетов."""

    generated_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Report
        fields = [
            "id",
            "name",
            "report_type",
            "generated_by",
            "created_at",
            "status",
            "task_id",
            "data",
        ]
        read_only_fields = [
            "id",
            "generated_by",
            "created_at",
            "status",
            "task_id",
            "data",
        ]
