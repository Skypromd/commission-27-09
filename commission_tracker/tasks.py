from celery import shared_task
from django.contrib.contenttypes.models import ContentType
from django.core.mail import send_mail


@shared_task
def send_generic_status_change_email(content_type_id, object_id, old_status, new_status):
    """
    Универсальная асинхронная задача для отправки email при изменении статуса.
    """
    try:
        model_class = ContentType.objects.get_for_id(content_type_id).model_class()
    except ContentType.DoesNotExist:
        return f"ContentType with id {content_type_id} not found."

    try:
        instance = model_class.objects.get(pk=object_id)
        user = instance.user
        instance_name = getattr(instance, 'name', f'ID: {instance.pk}')
        model_name_verbose = model_class._meta.verbose_name.lower()

        if user.email:
            subject = f'Статус вашего объекта "{instance_name}" ({model_name_verbose}) изменен'
            message = (
                f'Здравствуйте, {user.username}.\n\n'
                f'Статус вашего объекта "{instance_name}" ({model_name_verbose}) был изменен.\n'
                f'Предыдущий статус: {old_status}\n'
                f'Новый статус: {new_status}\n\n'
                'С уважением,\nКоманда Commission Tracker'
            )
            send_mail(
                subject,
                message,
                'noreply@commission-tracker.com',
                [user.email],
                fail_silently=False,
            )
            return f"Email for {model_name_verbose} {object_id} sent to {user.email}"
    except model_class.DoesNotExist:
        return f"Object with id {object_id} of type {model_class._meta.verbose_name} not found."
    except Exception as e:
        return f"Failed to send email for {model_class._meta.verbose_name} {object_id}: {str(e)}"
