// Real-time Notification Bell Component
import React, { useState } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui';
import { cn } from '@/utils/cn';

const NotificationBell: React.FC = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAll,
    isConnected
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getNotificationIcon = (type: string) => {
    const icons = {
      commission: '💰',
      payment: '🎉',
      client: '👤',
      system: '📢',
      deadline: '⏰',
      achievement: '🏆'
    };
    return icons[type as keyof typeof icons] || '📋';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'border-l-red-500 bg-red-50',
      medium: 'border-l-blue-500 bg-blue-50',
      low: 'border-l-gray-500 bg-gray-50'
    };
    return colors[priority as keyof typeof colors] || 'border-l-gray-500 bg-gray-50';
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative p-2",
          !isConnected && "opacity-50"
        )}
      >
        <span className="text-lg">🔔</span>

        {/* Unread Count Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}

        {/* Connection Status Indicator */}
        <div className={cn(
          "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white",
          isConnected ? "bg-green-500" : "bg-red-500"
        )} />
      </Button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">Notifications</h3>
              <span className={cn(
                "w-2 h-2 rounded-full",
                isConnected ? "bg-green-500" : "bg-red-500"
              )} />
            </div>

            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={markAllAsRead}
                  className="text-xs"
                >
                  Mark all read
                </Button>
              )}

              {notifications.length > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={clearAll}
                  className="text-xs text-red-600"
                >
                  Clear all
                </Button>
              )}
            </div>
          </div>

          {/* Connection Status */}
          <div className={cn(
            "px-4 py-2 text-sm border-b",
            isConnected ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
          )}>
            {isConnected ? '🟢 Live updates active' : '🔴 Reconnecting...'}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <span className="text-4xl mb-2 block">📭</span>
                <p>No notifications yet</p>
                <p className="text-xs mt-1">You'll see real-time updates here</p>
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 cursor-pointer hover:bg-gray-50 border-l-4",
                      getPriorityColor(notification.priority),
                      !notification.read && "bg-blue-50"
                    )}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xl flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </span>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className={cn(
                            "font-medium text-sm",
                            !notification.read && "font-bold"
                          )}>
                            {notification.title}
                          </h4>

                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(notification.timestamp)}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>

                        {/* Priority Indicator */}
                        {notification.priority === 'high' && (
                          <span className="inline-flex items-center px-2 py-1 mt-2 text-xs font-medium bg-red-100 text-red-800 rounded">
                            🔴 High Priority
                          </span>
                        )}
                      </div>

                      {/* Unread Indicator */}
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t text-center">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => setIsOpen(false)}
              >
                View All Notifications
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationBell;
