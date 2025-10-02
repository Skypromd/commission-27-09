import React from 'react';
import { useGetSalesQuery } from '../api/salesApiSlice';
import { DataTable } from '@/components/ui/DataTable';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { Sale } from '../types';
import { Button } from '@/components/ui/Button';

const SalesPage: React.FC = () => {
  const { data: sales, isLoading, isError, error } = useGetSalesQuery();

  const columns = React.useMemo(() => [
    { accessorKey: 'deal', header: 'Deal ID' },
    { accessorKey: 'adviser', header: 'Adviser ID' },
    { accessorKey: 'amount', header: 'Amount' },
    { accessorKey: 'sale_date', header: 'Date' },
  ], []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorMessage message={error?.toString() || 'Failed to load sales.'} />;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Sales</h1>
      </div>
      <DataTable columns={columns} data={sales || []} />
    </div>
  );
};

export default SalesPage;

