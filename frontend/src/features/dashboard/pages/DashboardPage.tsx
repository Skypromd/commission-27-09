import React, { useState } from 'react';
import DashboardStats from '../components/DashboardStats';
import DealsByStatusChart from '../components/DealsByStatusChart';
import LiveActivityFeed from '../components/LiveActivityFeed';
import RecentDeals from '../components/RecentDeals';
import { DateRangePicker } from '@/components/common/DateRangePicker';
import { useTranslation } from 'react-i18next';

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });

  const queryParams = {
    date_from: dateRange.from?.toISOString().split('T')[0],
    date_to: dateRange.to?.toISOString().split('T')[0],
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('dashboard.title')}</h1>
        <DateRangePicker onChange={setDateRange} />
      </div>
      <DashboardStats params={queryParams} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DealsByStatusChart params={queryParams} />
        <LiveActivityFeed />
      </div>
      <div>
        <RecentDeals />
      </div>
    </div>
  );
};

export default DashboardPage;
