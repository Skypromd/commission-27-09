import React from 'react';
import { useGetProcessesQuery } from '../api/processesApiSlice';
import { DataTable } from '@/components/ui/DataTable';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { Process } from '../types';

const ProcessesPage: React.FC = () => {
  const { data: processes, isLoading, isError, error } = useGetProcessesQuery();

  const columns = React.useMemo(() => [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'last_run', header: 'Last Run' },
    { accessorKey: 'description', header: 'Description' },
  ], []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorMessage message={error?.toString() || 'Failed to load processes.'} />;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Processes</h1>
      </div>
      <DataTable columns={columns} data={processes || []} />
    </div>
  );
};

export default ProcessesPage;

