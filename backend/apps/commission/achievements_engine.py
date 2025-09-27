from .models import Deal, Badge, Achievement

def check_for_new_achievements(user):
    """
    Проверяет и присваивает пользователю новые достижения.
    """
    # Пример 1: Значок за первую сделку
    try:
        first_deal_badge = Badge.objects.get(name="First Deal")
        if Deal.objects.filter(user=user).count() == 1:
             # Проверяем, что у пользователя еще нет этого значка
            if not Achievement.objects.filter(user=user, badge=first_deal_badge).exists():
                Achievement.objects.create(user=user, badge=first_deal_badge)
    except Badge.DoesNotExist:
        # Создаем значок, если его нет
        Badge.objects.create(name="First Deal", description="Awarded for creating your first deal.", icon="fas fa-handshake")
