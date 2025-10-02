import React from 'react';
import { Card } from '@/components/ui/Card';
import { useGetDealsByStatusQuery } from '../api/dashboardApiSlice';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';

interface DealsByStatusChartProps {
  params: {
    date_from?: string;
    date_to?: string;
  };
}

const DealsByStatusChart: React.FC<DealsByStatusChartProps> = React.memo(({ params }) => {
  const { t } = useTranslation();
  const { data: chartData, isLoading } = useGetDealsByStatusQuery(params);

  if (isLoading) {
    return (
      <Card>
        <h3 className="text-lg font-semibold mb-4">{t('dashboard.dealsByStatus')}</h3>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">{t('dashboard.dealsByStatus')}</h3>
      {(!chartData || chartData.length === 0) ? (
        <div className="flex justify-center items-center h-[300px]">
          <p className="text-gray-500">{t('dashboard.noData')}</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
});

export default DealsByStatusChart;
