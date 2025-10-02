from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Deal, Pipeline, Stage
from .serializers import DealSerializer, StageSerializer, PipelineSerializer
from apps.users.services import get_all_subordinates

class DealViewSet(viewsets.ModelViewSet):
    """
    API endpoint для управления сделками.
    """
    serializer_class = DealSerializer
    permission_classes = [permissions.IsAuthenticated] # Добавим права позже

    def get_serializer_context(self):
        return {'request': self.request}

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Deal.objects.all()

        subordinate_ids = get_all_subordinates(user).values_list('id', flat=True)
        allowed_user_ids = list(subordinate_ids) + [user.id]

        return Deal.objects.filter(agent_id__in=allowed_user_ids)

    def perform_create(self, serializer):
        """
        При создании сделки, она автоматически привязывается к текущему пользователю
        и устанавливается на первую стадию соответствующей воронки.
        """
        product = serializer.validated_data['product']
        try:
            pipeline = Pipeline.objects.get(product_type=product.product_type)
            initial_stage = pipeline.stages.order_by('order').first()
        except (Pipeline.DoesNotExist, AttributeError):
            initial_stage = None

        serializer.save(agent=self.request.user, stage=initial_stage)

    @action(detail=True, methods=['post'])
    def move_to_stage(self, request, pk=None):
        """
        Перемещает сделку на новую стадию.
        Ожидает в теле запроса: {"stage_id": ID_новой_стадии}
        """
        deal = self.get_object()
        stage_id = request.data.get('stage_id')

        if not stage_id:
            return Response({'error': 'Необходимо указать stage_id.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Проверяем, что новая стадия принадлежит той же воронке, что и текущая
            new_stage = Stage.objects.get(pk=stage_id, pipeline=deal.stage.pipeline)
            deal.stage = new_stage
            deal.save(update_fields=['stage'])
            return Response(DealSerializer(deal).data)
        except Stage.DoesNotExist:
            return Response({'error': 'Указана неверная или недопустимая стадия.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PipelineViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint для просмотра воронок и их стадий.
    """
    queryset = Pipeline.objects.prefetch_related('stages').all()
    serializer_class = PipelineSerializer
    permission_classes = [permissions.IsAuthenticated]
