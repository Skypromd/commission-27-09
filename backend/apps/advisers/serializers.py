from rest_framework import serializers
from .models import Adviser


class RecursiveAdviserSerializer(serializers.Serializer):
    """Вспомогательный сериализатор для рекурсивного отображения руководителя."""
    def to_representation(self, value):
        serializer = self.parent.parent.__class__(value, context=self.context)
        return serializer.data


class AdviserSerializer(serializers.ModelSerializer):
    """Сериализатор для модели Консультанта."""
    full_name = serializers.CharField(source='user.get_full_name', read_only=True)
    parent_adviser_details = RecursiveAdviserSerializer(source='parent_adviser', read_only=True)

    class Meta:
        model = Adviser
        fields = (
            "id",
            "full_name",
            "fee_percentage",
            "role",
            "status",
            "start_date",
            "parent_adviser", # Оставляем для записи ID
            "parent_adviser_details", # Добавляем для чтения полной информации
        )
        read_only_fields = ('parent_adviser_details',)
