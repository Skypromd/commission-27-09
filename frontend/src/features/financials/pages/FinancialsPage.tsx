import React from 'react';
import { useGetFinancialSummaryQuery } from '../api/financialsApiSlice';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { Card } from '@/components/ui/Card';

const FinancialsPage: React.FC = () => {
  const { data: summary, isLoading, isError, error } = useGetFinancialSummaryQuery();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorMessage message={error?.toString() || 'Failed to load financial data.'} />;
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Financials</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <h3 className="text-lg font-semibold text-gray-500">Total Revenue</h3>
          <p className="text-3xl font-bold">{formatCurrency(summary?.total_revenue || 0)}</p>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold text-gray-500">Commission Paid</h3>
          <p className="text-3xl font-bold">{formatCurrency(summary?.total_commission_paid || 0)}</p>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold text-gray-500">Commission Pending</h3>
          <p className="text-3xl font-bold">{formatCurrency(summary?.total_commission_pending || 0)}</p>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold text-gray-500">Monthly Growth</h3>
          <p className="text-3xl font-bold">{summary?.monthly_growth || 0}%</p>
        </Card>
      </div>
      {/* Здесь можно будет добавить графики */}
    </div>
  );
};

export default FinancialsPage;

