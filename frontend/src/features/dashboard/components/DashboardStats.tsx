import React from 'react';
import { Card } from '@/components/ui/Card';
import { useGetDashboardStatsQuery } from '../api/dashboardApiSlice';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useTranslation } from 'react-i18next';

interface DashboardStatsProps {
  params: {
    date_from?: string;
    date_to?: string;
  };
}

const DashboardStats: React.FC<DashboardStatsProps> = React.memo(({ params }) => {
  const { t } = useTranslation();
  const { data: stats, isLoading } = useGetDashboardStatsQuery(params);

  if (isLoading) {
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"><LoadingSpinner /></div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <h3 className="text-lg font-semibold text-gray-500">{t('dashboard.totalDeals')}</h3>
        <p className="text-3xl font-bold">{stats?.totalDeals || 0}</p>
      </Card>
      <Card>
        <h3 className="text-lg font-semibold text-gray-500">{t('dashboard.totalCommission')}</h3>
        <p className="text-3xl font-bold">${stats?.totalCommission.toLocaleString() || 0}</p>
      </Card>
      <Card>
        <h3 className="text-lg font-semibold text-gray-500">{t('dashboard.newClients')}</h3>
        <p className="text-3xl font-bold">{stats?.newClients || 0}</p>
      </Card>
      <Card>
        <h3 className="text-lg font-semibold text-gray-500">{t('dashboard.pendingTasks')}</h3>
        <p className="text-3xl font-bold">{stats?.pendingTasks || 0}</p>
      </Card>
    </div>
  );
});

export default DashboardStats;
