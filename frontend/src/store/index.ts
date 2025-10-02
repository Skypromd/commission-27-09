import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authSlice, AuthSlice } from './authSlice';
import { dataSlice, DataSlice } from './dataSlice';
import { uiSlice, UISlice } from './uiSlice';

// Объединяем все слайсы
export interface AppState extends AuthSlice, DataSlice, UISlice {}

export const useStore = create<AppState>()(
  persist(
    (set, get, api) => ({
      ...authSlice(set, get, api),
      ...dataSlice(set, get, api),
      ...uiSlice(set, get, api),
    }),
    {
      name: 'uk-commission-store',
      partialize: (state) => ({
        // Сохраняем только нужные части состояния
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);

// Селекторы для удобства использования
export const useAuth = () => useStore((state) => ({
  user: state.user,
  isAuthenticated: state.isAuthenticated,
  login: state.login,
  logout: state.logout,
}));

export const useData = () => useStore((state) => ({
  advisors: state.advisors,
  clients: state.clients,
  commissions: state.commissions,
  fetchAdvisors: state.fetchAdvisors,
  fetchClients: state.fetchClients,
  fetchCommissions: state.fetchCommissions,
  addAdvisor: state.addAdvisor,
  updateAdvisor: state.updateAdvisor,
  deleteAdvisor: state.deleteAdvisor,
}));

export const useUI = () => useStore((state) => ({
  theme: state.theme,
  sidebarCollapsed: state.sidebarCollapsed,
  toggleSidebar: state.toggleSidebar,
  setTheme: state.toggleTheme,
}));

// Функция инициализации
export const initializeStore = () => {
  // Любая дополнительная инициализация
  console.log('Store initialized');
};