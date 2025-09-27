from django.urls import path
from . import views

urlpatterns = [
    path('', views.notification_list, name='notification_list'),
    path('mark-read/<int:notification_id>/', views.mark_as_read, name='mark_as_read'),
    path('mark-all-read/', views.mark_all_as_read, name='mark_all_as_read'),
    path('unread-count/', views.get_unread_count, name='notification_unread_count'),
    path('delete/<int:notification_id>/', views.delete_notification, name='delete_notification'),
    path('delete-all-read/', views.delete_all_read, name='delete_all_read'),
]
