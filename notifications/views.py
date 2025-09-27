from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_POST, require_GET
from django.contrib import messages
from django.core.paginator import Paginator
from .models import Notification

@login_required
def notification_list(request):
    """Отображает список уведомлений пользователя с пагинацией"""
    notifications_list = Notification.objects.filter(user=request.user)

    # Фильтрация
    notification_type = request.GET.get('type')
    if notification_type:
        notifications_list = notifications_list.filter(notification_type=notification_type)

    read_status = request.GET.get('read')
    if read_status:
        is_read = read_status == 'true'
        notifications_list = notifications_list.filter(read=is_read)

    # Пагинация
    paginator = Paginator(notifications_list, 10)  # 10 уведомлений на страницу
    page_number = request.GET.get('page')
    notifications = paginator.get_page(page_number)

    return render(request, 'notifications/list.html', {
        'notifications': notifications,
        'filter_type': notification_type,
        'filter_read': read_status
    })

@login_required
@require_POST
def mark_as_read(request, notification_id):
    """Отмечает уведомление как прочитанное"""
    try:
        notification = get_object_or_404(Notification, id=notification_id, user=request.user)
        notification.read = True
        notification.save()
        return JsonResponse({'status': 'success'})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

@login_required
def mark_all_as_read(request):
    """Отмечает все уведомления пользователя как прочитанные"""
    count = Notification.objects.filter(user=request.user, read=False).update(read=True)
    messages.success(request, f'Отмечено прочитанными: {count} уведомлений')
    return redirect('notification_list')

@login_required
@require_GET
def get_unread_count(request):
    """Возвращает количество непрочитанных уведомлений"""
    count = Notification.objects.filter(user=request.user, read=False).count()
    return JsonResponse({'count': count})

@login_required
@require_POST
def delete_notification(request, notification_id):
    """Удаляет уведомление"""
    try:
        notification = get_object_or_404(Notification, id=notification_id, user=request.user)
        notification.delete()
        return JsonResponse({'status': 'success'})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

@login_required
def delete_all_read(request):
    """Удаляет все прочитанные уведомления"""
    count = Notification.objects.filter(user=request.user, read=True).delete()[0]
    messages.success(request, f'Удалено {count} прочитанных уведомлений')
    return redirect('notification_list')
