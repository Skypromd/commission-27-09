import { StateCreator } from 'zustand';
import { User, LoginRequest } from '../types/auth';

export interface AuthSlice {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  permissions: string[];

  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  clearError: () => void;
}

export const authSlice: StateCreator<AuthSlice> = (set: any, get: any) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  permissions: [],

  login: async (credentials: LoginRequest) => {
    set({ isLoading: true, error: null });

    try {
      // Симуляция API вызова - заменить на реальный API
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockUser: User = {
        id: 1,
        username: credentials.username,
        email: `${credentials.username}@example.com`,
        full_name: 'Test User',
        role: 'admin',
        is_active: true,
        created_at: new Date().toISOString(),
        permissions: ['analytics:view', 'system:admin', 'users:manage'],
      };

      set({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        permissions: mockUser.permissions,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Login failed',
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });

    try {
      // Очистка токенов и состояния
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');

      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        permissions: [],
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Logout failed',
      });
    }
  },

  hasPermission: (permission: string) => {
    const state = get();
    return state.permissions.includes(permission) || state.user?.role === 'production_admin';
  },

  hasRole: (role: string) => {
    const state = get();
    return state.user?.role === role;
  },

  clearError: () => {
    set({ error: null });
  },
});
