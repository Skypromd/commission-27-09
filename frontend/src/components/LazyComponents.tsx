import { lazy, ComponentType } from 'react';

// Основные страницы - проверяем существование и исправляем пути
export const Dashboard = lazy(() => import('../pages/Dashboard'));
export const Consultants = lazy(() => import('../pages/Consultants'));
export const Sales = lazy(() => import('../pages/Sales'));
export const Reports = lazy(() => import('../pages/Reports'));
export const Products = lazy(() => import('../pages/Products'));
export const Insurances = lazy(() => import('../pages/Insurances'));
export const Mortgages = lazy(() => import('../pages/Mortgages'));

// Дополнительные страницы
export const Clients = lazy(() => import('../pages/Clients'));
export const Settings = lazy(() => import('../pages/Settings'));
export const Login = lazy(() => import('../pages/Login'));

// Безопасная загрузка с fallback для несуществующих компонентов
const createSafeComponent = (importFn: () => Promise<{ default: ComponentType<any> }>) => {
  return lazy(() =>
    importFn().catch(() => ({
      default: () => <div>Компонент недоступен</div>
    }))
  );
};

// Компоненты, которые могут не существовать - загружаем безопасно
export const Commissions = createSafeComponent(() => import('../pages/Commissions'));
export const Profile = createSafeComponent(() => import('../pages/Profile'));
export const Processes = createSafeComponent(() => import('../pages/Processes'));
export const Permissions = createSafeComponent(() => import('../pages/Permissions'));
export const Financials = createSafeComponent(() => import('../pages/Financials'));
export const MLAnalytics = createSafeComponent(() => import('../pages/MLAnalytics'));

// UI компоненты с безопасной загрузкой
export const AnimatedButton = createSafeComponent(() => import('./ui/AnimatedButton'));
export const AnimatedCard = createSafeComponent(() => import('./ui/AnimatedCard'));
export const AnimatedModal = createSafeComponent(() => import('./ui/AnimatedModal'));
export const AnimatedToast = createSafeComponent(() => import('./ui/AnimatedToast'));

// Демо компоненты
export const UIComponentsDemo = createSafeComponent(() => import('../pages/UIComponentsDemo'));
export const CorporateStyleDemo = createSafeComponent(() => import('../pages/CorporateStyleDemo'));

// Экспорт списка всех доступных компонентов для маршрутизации
export const availableComponents = {
  // Основные страницы
  Dashboard,
  Consultants,
  Sales,
  Reports,
  Products,
  Insurances,
  Mortgages,
  Clients,
  Settings,
  Login,

  // Дополнительные страницы
  Commissions,
  Profile,
  Processes,
  Permissions,
  Financials,
  MLAnalytics,

  // Демо компоненты
  UIComponentsDemo,
  CorporateStyleDemo,

  // UI компоненты
  AnimatedButton,
  AnimatedCard,
  AnimatedModal,
  AnimatedToast
};

// Типизация для маршрутов
export interface RouteConfig {
  path: string;
  component: ComponentType<any>;
  exact?: boolean;
  title?: string;
  requireAuth?: boolean;
}

// Конфигурация маршрутов с lazy компонентами
export const routeConfigs: RouteConfig[] = [
  { path: '/', component: Dashboard, exact: true, title: 'Dashboard', requireAuth: true },
  { path: '/dashboard', component: Dashboard, title: 'Dashboard', requireAuth: true },
  { path: '/consultants', component: Consultants, title: 'Consultants', requireAuth: true },
  { path: '/sales', component: Sales, title: 'Sales', requireAuth: true },
  { path: '/reports', component: Reports, title: 'Reports', requireAuth: true },
  { path: '/products', component: Products, title: 'Products', requireAuth: true },
  { path: '/insurances', component: Insurances, title: 'Insurances', requireAuth: true },
  { path: '/mortgages', component: Mortgages, title: 'Mortgages', requireAuth: true },
  { path: '/clients', component: Clients, title: 'Clients', requireAuth: true },
  { path: '/settings', component: Settings, title: 'Settings', requireAuth: true },
  { path: '/login', component: Login, title: 'Login', requireAuth: false },
  { path: '/demo/ui', component: UIComponentsDemo, title: 'UI Demo', requireAuth: false },
  { path: '/demo/corporate', component: CorporateStyleDemo, title: 'Corporate Demo', requireAuth: false }
];

export default availableComponents;
