from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Stage

class DealViewSetMixin:
    """
    Миксин с общей логикой для всех ViewSet-ов, работающих со сделками.
    """
    def get_queryset(self):
        """Возвращает queryset сделок в зависимости от роли пользователя."""
        user = self.request.user
        model_class = self.serializer_class.Meta.model

        if user.is_admin:
            return model_class.objects.all()

        if user.is_manager:
            team_ids = user.get_descendants(include_self=True).values_list('id', flat=True)
            return model_class.objects.filter(agent_id__in=team_ids)

        return model_class.objects.filter(agent=user)

    def perform_create(self, serializer):
        """Автоматически назначает агента и первую стадию воронки."""
        product = serializer.validated_data['product']
        initial_stage = None
        if product.category and hasattr(product.category, 'pipeline'):
            pipeline = product.category.pipeline
            initial_stage = pipeline.stages.order_by('order').first()

        serializer.save(agent=self.request.user, stage=initial_stage)

    @action(detail=True, methods=['post'])
    def move_to_stage(self, request, pk=None):
        """Перемещает сделку на новую стадию."""
        deal_obj = self.get_object()
        stage_id = request.data.get('stage_id')

        if not deal_obj.stage:
            return Response({'error': 'Невозможно переместить сделку, так как у нее нет начальной стадии. Проверьте настройки воронки для этой категории продукта.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            self.check_object_permissions(request, deal_obj)
            new_stage = Stage.objects.get(pk=stage_id, pipeline=deal_obj.stage.pipeline)
            deal_obj.stage = new_stage
            deal_obj.save(update_fields=['stage'])
            return Response(self.get_serializer(deal_obj).data)
        except Stage.DoesNotExist:
            return Response({'error': 'Указана неверная стадия.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

