import React from 'react';
import { useGetDealsQuery } from '../features/deals/dealsApiSlice';
import { DataTable } from '../components/ui/DataTable';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { Deal } from '../types/deal';

const DealsPage: React.FC = () => {
  const { data: deals, isLoading, isError, error } = useGetDealsQuery();

  const columns = [
    { accessor: 'id', Header: 'ID' },
    { accessor: 'client', Header: 'Client ID' },
    { accessor: 'adviser', Header: 'Adviser ID' },
    { accessor: 'product', Header: 'Product ID' },
    { accessor: 'status', Header: 'Status' },
    { accessor: 'deal_value', Header: 'Deal Value' },
    { accessor: 'commission_amount', Header: 'Commission' },
  ];

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorMessage message={error?.toString() || 'Failed to load deals.'} />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Deals</h1>
      <DataTable<Deal> columns={columns} data={deals || []} />
    </div>
  );
};

export default DealsPage;

