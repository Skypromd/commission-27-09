import React, { useState, useEffect, useRef } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { useGetNotificationsQuery } from '../api/notificationsApiSlice';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

const NotificationBell: React.FC = () => {
  const { data: notifications, isLoading } = useGetNotificationsQuery(undefined, {
    pollingInterval: 60000, // Опрашивать уведомления каждую минуту
  });
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const unreadCount = notifications?.filter(n => !n.read).length || 0;

  return (
    <div className="relative" ref={notificationRef}>
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <span className="sr-only">Просмотр уведомлений</span>
        <BellIcon className="h-6 w-6" aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 z-10 mt-2.5 w-80 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
          <div className="px-4 py-2 text-sm text-gray-900 border-b border-gray-200">
            <div className="font-medium">Уведомления</div>
          </div>
          {isLoading ? (
            <div className="p-4"><LoadingSpinner /></div>
          ) : notifications && notifications.length > 0 ? (
            notifications.map(notification => (
              <div key={notification.id} className="px-4 py-3 border-b border-gray-200 hover:bg-gray-50">
                <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                <p className="text-sm text-gray-500">{notification.description}</p>
              </div>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500">
              Нет новых уведомлений
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
