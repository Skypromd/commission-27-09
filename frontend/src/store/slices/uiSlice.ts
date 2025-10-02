import { StateCreator } from 'zustand';
import { Theme, Notification } from '../../types/ui';

export interface UISlice {
  theme: Theme;
  sidebarCollapsed: boolean;
  notifications: Notification[];

  // Actions
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const uiSlice: StateCreator<UISlice> = (set: any, get: any) => ({
  theme: (localStorage.getItem('theme') as Theme) || 'light',
  sidebarCollapsed: localStorage.getItem('sidebarCollapsed') === 'true',
  notifications: [],

  setTheme: (theme: Theme) => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    set((state: any) => {
      return { ...state, theme };
    });
  },

  toggleSidebar: () => {
    set((state: any) => {
      const collapsed = !state.sidebarCollapsed;
      localStorage.setItem('sidebarCollapsed', collapsed.toString());
      return { ...state, sidebarCollapsed: collapsed };
    });
  },

  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };

    set((state: any) => ({
      ...state,
      notifications: [newNotification, ...state.notifications],
    }));

    // Auto-remove notification after 5 seconds for non-error types
    if (notification.type !== 'error') {
      setTimeout(() => {
        set((state: any) => ({
          ...state,
          notifications: state.notifications.filter((n: Notification) => n.id !== newNotification.id),
        }));
      }, 5000);
    }
  },

  removeNotification: (id: string) => {
    set((state: any) => ({
      ...state,
      notifications: state.notifications.filter((n: Notification) => n.id !== id),
    }));
  },

  clearNotifications: () => {
    set((state: any) => ({
      ...state,
      notifications: [],
    }));
  },
});
