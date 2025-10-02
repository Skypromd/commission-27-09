import { StateCreator } from 'zustand';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: number;
  autoClose?: boolean;
}

export interface UISlice {
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
  notifications: Notification[];

  // Actions
  toggleTheme: () => void;
  toggleSidebar: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const uiSlice: StateCreator<UISlice> = (set: any, get: any) => ({
  theme: 'light',
  sidebarCollapsed: false,
  notifications: [],

  toggleTheme: () => {
    set((state: any) => ({
      ...state,
      theme: state.theme === 'light' ? 'dark' : 'light',
    }));
  },

  toggleSidebar: () => {
    set((state: any) => ({
      ...state,
      sidebarCollapsed: !state.sidebarCollapsed,
    }));
  },

  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };

    set((state: any) => ({
      ...state,
      notifications: [...state.notifications, newNotification],
    }));

    // Автоматическое удаление через 5 секунд
    if (notification.autoClose !== false) {
      setTimeout(() => {
        set((state: any) => ({
          ...state,
          notifications: state.notifications.filter((n: Notification) => n.id !== newNotification.id)
        }));
      }, 5000);
    }
  },

  removeNotification: (id: string) => {
    set((state: any) => ({
      ...state,
      notifications: state.notifications.filter((n: Notification) => n.id !== id)
    }));
  },

  clearNotifications: () => {
    set((state: any) => ({
      ...state,
      notifications: []
    }));
  },
});
