# В этом файле будет располагаться бизнес-логика, связанная с пользователями.
# Например, функции для работы с иерархией, сменой ролей и т.д.

def get_all_subordinates(user):
    """
    Рекурсивно собирает всех подчиненных для данного пользователя.
    Возвращает queryset пользователей.
    """
    from .models import User
    subordinates = user.subordinates.all()
    all_subordinates = list(subordinates)
    for sub in subordinates:
        all_subordinates.extend(get_all_subordinates(sub))

    # Возвращаем queryset из ID, чтобы избежать дубликатов и работать с ORM
    user_ids = {u.id for u in all_subordinates}
    return User.objects.filter(id__in=user_ids)
