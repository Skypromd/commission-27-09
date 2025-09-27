// Advanced Real-time Notification System
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import { BellIcon } from '@heroicons/react/24/outline';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useAuth } from '../contexts/AuthContext';

interface NotificationData {
  id: string;
  type: 'commission' | 'payment' | 'client' | 'system' | 'deadline' | 'achievement';
  title: string;
  message: string;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
  read: boolean;
  actionUrl?: string;
  data?: any;
}

interface NotificationContextValue {
  notifications: NotificationData[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  isConnected: boolean;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const { isConnected, sendMessage } = useWebSocket();
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  const addNotification = (notification: NotificationData) => {
    setNotifications(prev => [notification, ...prev].slice(0, 50)); // Keep last 50 notifications
  };

  useEffect(() => {
    // Listen for WebSocket messages
    const handleWebSocketMessage = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail) {
        const message = customEvent.detail;
        const notification: NotificationData = {
          id: `${Date.now()}-${Math.random()}`,
          type: mapMessageTypeToNotificationType(message.type),
          title: message.title || 'New Update',
          message: message.message,
          timestamp: message.timestamp || new Date().toISOString(),
          read: false,
          priority: message.priority || 'medium'
        };

        addNotification(notification);
        showToastNotification(notification);
      }
    };

    window.addEventListener('websocket-message', handleWebSocketMessage as EventListener);

    return () => {
      window.removeEventListener('websocket-message', handleWebSocketMessage as EventListener);
    };
  }, []);

  const mapMessageTypeToNotificationType = (messageType: string): NotificationData['type'] => {
    const mapping: Record<string, NotificationData['type']> = {
      'commission_created': 'commission',
      'commission_updated': 'commission',
      'commission_paid': 'payment',
      'client_assigned': 'client',
      'system_announcement': 'system',
      'deadline_reminder': 'deadline'
    };
    return mapping[messageType] || 'system';
  };

  const showToastNotification = (notification: NotificationData) => {
    const icons = {
      commission: '💰',
      payment: '🎉',
      client: '👤',
      system: '📢',
      deadline: '⏰',
      achievement: '🏆'
    };

    const colors = {
      high: { background: '#EF4444', color: 'white' },
      medium: { background: '#3B82F6', color: 'white' },
      low: { background: '#6B7280', color: 'white' }
    };

    toast(notification.message, {
      icon: icons[notification.type],
      duration: notification.priority === 'high' ? 8000 : 4000,
      style: colors[notification.priority],
      position: 'top-right'
    });
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const contextValue: NotificationContextValue = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAll,
    isConnected
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextValue => {
  const context = useContext(NotificationContext);

  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }

  return context;
};
