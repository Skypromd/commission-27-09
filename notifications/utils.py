from django.contrib.auth.models import User
from .models import Notification


def send_notification(user, message, notification_type='info'):
    """
    Создает новое уведомление для пользователя

    :param user: объект пользователя или ID пользователя
    :param message: текст уведомления
    :param notification_type: тип уведомления ('info', 'warning', 'error', 'success')
    :return: объект созданного уведомления
    """
    if isinstance(user, int):
        user = User.objects.get(id=user)

    notification = Notification.objects.create(
        user=user,
        message=message,
        notification_type=notification_type
    )

    return notification


def send_notification_to_staff(message, notification_type='info'):
    """
    Отправляет уведомление всем пользователям со статусом is_staff=True

    :param message: текст уведомления
    :param notification_type: тип уведомления ('info', 'warning', 'error', 'success')
    :return: список созданных уведомлений
    """
    staff_users = User.objects.filter(is_staff=True)
    notifications = []

    for user in staff_users:
        notification = send_notification(user, message, notification_type)
        notifications.append(notification)

    return notifications


def send_notification_to_all(message, notification_type='info'):
    """
    Отправляет уведомление всем активным пользователям

    :param message: текст уведомления
    :param notification_type: тип уведомления ('info', 'warning', 'error', 'success')
    :return: список созданных уведомлений
    """
    active_users = User.objects.filter(is_active=True)
    notifications = []

    for user in active_users:
        notification = send_notification(user, message, notification_type)
        notifications.append(notification)

    return notifications

