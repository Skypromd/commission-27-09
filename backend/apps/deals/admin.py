from django.contrib import admin
from .models import Pipeline, Stage

class StageInline(admin.TabularInline):
    model = Stage
    extra = 1
    ordering = ('order',)

@admin.register(Pipeline)
class PipelineAdmin(admin.ModelAdmin):
    list_display = ('name', 'category')
    inlines = [StageInline]

@admin.register(Stage)
class StageAdmin(admin.ModelAdmin):
    list_display = ('name', 'pipeline', 'order', 'is_closing_stage')
    list_filter = ('pipeline', 'is_closing_stage')
    ordering = ('pipeline', 'order')
