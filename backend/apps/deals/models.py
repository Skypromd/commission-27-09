from django.db import models
from apps.products.models import ProductCategory


class Pipeline(models.Model):
    """
    Воронка продаж (пайплайн).
    Теперь однозначно привязана к категории продукта.
    """
    name = models.CharField(max_length=100, verbose_name='Название воронки')
    category = models.OneToOneField(
        ProductCategory,
        on_delete=models.CASCADE,
        related_name='pipeline',
        verbose_name='Категория продуктов'
    )

    def __str__(self):
        return f"{self.name} ({self.category.name})"


class Stage(models.Model):
    """
    Стадия в воронке продаж.
    """
    pipeline = models.ForeignKey(Pipeline, on_delete=models.CASCADE, related_name='stages', verbose_name='Воронка')
    name = models.CharField(max_length=100, verbose_name='Название стадии')
    order = models.PositiveIntegerField(default=0, verbose_name='Порядок')
    is_closing_stage = models.BooleanField(
        default=False,
        verbose_name='Это закрывающая стадия?',
        help_text='При переходе на эту стадию будет запущена калькуляция комиссии.'
    )

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f'{self.pipeline.name} - {self.name}'
