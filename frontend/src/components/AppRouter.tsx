import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UniversalLayout from './layout/UniversalLayout';
import ProtectedRoute from './auth/ProtectedRoute';
import LoadingSpinner from './common/LoadingSpinner';
import { LoginPage, PersistLogin } from '@/features/auth';

// Lazy load all page components directly
const DashboardPage = React.lazy(() => import('@/features/dashboard/pages/DashboardPage'));
const AdvisersPage = React.lazy(() => import('@/features/advisers/pages/AdvisersPage'));
const ClientsPage = React.lazy(() => import('@/features/clients/pages/ClientsPage'));
const MortgagesPage = React.lazy(() => import('@/features/mortgages/pages/MortgagesPage'));
const PoliciesPage = React.lazy(() => import('@/features/policies/pages/PoliciesPage'));
const ProductsPage = React.lazy(() => import('@/features/products/pages/ProductsPage'));
const DealsPage = React.lazy(() => import('@/features/deals/pages/DealsPage'));
const ReportsPage = React.lazy(() => import('@/features/reports/pages/ReportsPage'));
const SettingsPage = React.lazy(() => import('@/features/settings/pages/SettingsPage'));
const SalesPage = React.lazy(() => import('@/features/sales/pages/SalesPage'));
const CommissionsPage = React.lazy(() => import('@/features/commissions/pages/CommissionsPage'));
const ProcessesPage = React.lazy(() => import('@/features/processes/pages/ProcessesPage'));
const FinancialsPage = React.lazy(() => import('@/features/financials/pages/FinancialsPage'));
const PermissionsPage = React.lazy(() => import('@/features/permissions/pages/PermissionsPage'));
const ProfilePage = React.lazy(() => import('@/features/profile/pages/ProfilePage'));
const MLAnalytics = React.lazy(() => import('../pages/MLAnalytics'));

const AppRouter = () => {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<PersistLogin><UniversalLayout /></PersistLogin>}>
            <Route path="/" element={<ProtectedRoute element={DashboardPage} />} />
            <Route path="/clients" element={<ProtectedRoute element={ClientsPage} />} />
            <Route path="/mortgages" element={<ProtectedRoute element={MortgagesPage} />} />
            <Route path="/insurances" element={<ProtectedRoute element={PoliciesPage} />} />
            <Route path="/products" element={<ProtectedRoute element={ProductsPage} />} />
            <Route path="/deals" element={<ProtectedRoute element={DealsPage} />} />
            <Route path="/reports" element={<ProtectedRoute element={ReportsPage} />} />
            <Route path="/settings" element={<ProtectedRoute element={SettingsPage} />} />
            <Route path="/consultants" element={<ProtectedRoute element={AdvisersPage} />} />
            <Route path="/sales" element={<ProtectedRoute element={SalesPage} />} />
            <Route path="/commissions" element={<ProtectedRoute element={CommissionsPage} />} />
            <Route path="/processes" element={<ProtectedRoute element={ProcessesPage} />} />
            <Route path="/financials" element={<ProtectedRoute element={FinancialsPage} />} />
            <Route path="/permissions" element={<ProtectedRoute element={PermissionsPage} />} />
            <Route path="/profile" element={<ProtectedRoute element={ProfilePage} />} />
            <Route path="/ml-analytics" element={<ProtectedRoute element={MLAnalytics} />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRouter;
