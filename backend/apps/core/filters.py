import django_filters

class ReportingFilter(django_filters.FilterSet):
    """
    Универсальный фильтр для отчетов, позволяющий фильтровать по диапазону дат.
    Имя поля для фильтрации (`date_field`) должно быть определено в Meta классе ViewSet.
    """
    start_date = django_filters.DateFilter(method='filter_by_start_date')
    end_date = django_filters.DateFilter(method='filter_by_end_date')

    def filter_by_start_date(self, queryset, name, value):
        date_field = getattr(self.Meta, 'date_field', 'created_at')
        return queryset.filter(**{f'{date_field}__gte': value})

    def filter_by_end_date(self, queryset, name, value):
        date_field = getattr(self.Meta, 'date_field', 'created_at')
        return queryset.filter(**{f'{date_field}__lte': value})
