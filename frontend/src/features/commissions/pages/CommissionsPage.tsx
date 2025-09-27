import React from 'react';
import { useGetCommissionsQuery } from '../api/commissionsApiSlice';
import { DataTable } from '@/components/ui/DataTable';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { Commission } from '../types';

const CommissionsPage: React.FC = () => {
  const { data: commissions, isLoading, isError, error } = useGetCommissionsQuery();

  const columns = React.useMemo(() => [
    { accessorKey: 'deal', header: 'Deal ID' },
    { accessorKey: 'adviser', header: 'Adviser ID' },
    { accessorKey: 'amount', header: 'Amount' },
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'calculation_date', header: 'Calculation Date' },
  ], []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorMessage message={error?.toString() || 'Failed to load commissions.'} />;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Commissions</h1>
      </div>
      <DataTable columns={columns} data={commissions || []} />
    </div>
  );
};

export default CommissionsPage;

