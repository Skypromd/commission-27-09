from django.contrib import admin
from .models import Deal, Pipeline, Stage

class StageInline(admin.TabularInline):
    model = Stage
    extra = 1
    ordering = ('order',)

@admin.register(Pipeline)
class PipelineAdmin(admin.ModelAdmin):
    list_display = ('name', 'product_type')
    inlines = [StageInline]

@admin.register(Deal)
class DealAdmin(admin.ModelAdmin):
    list_display = ('id', 'product', 'client', 'agent', 'amount', 'stage', 'deal_date')
    list_filter = ('stage', 'agent', 'deal_date')
    search_fields = ('client__first_name', 'client__last_name', 'product__name')
    readonly_fields = ('deal_date',)
