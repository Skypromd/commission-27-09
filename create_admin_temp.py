from django.contrib.auth import get_user_model
from backend.apps.commission.models import CustomUser

def run():
    # Проверяем, существует ли пользователь 'admin'
    if not CustomUser.objects.filter(username='admin').exists():
        # Создаем суперпользователя
        CustomUser.objects.create_superuser('admin', 'admin@example.com', 'password')
        print("Суперпользователь 'admin' успешно создан.")
    else:
        print("Суперпользователь 'admin' уже существует.")
