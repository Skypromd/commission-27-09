import React from 'react';
import { useGetReportsQuery, useCreateReportMutation } from '../api/reportsApiSlice';
import { DataTable } from '@/components/ui/DataTable';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { Report } from '../types';
import { Button } from '@/components/ui/Button';

const ReportsPage: React.FC = () => {
  const { data: reports, isLoading, isError, error, refetch } = useGetReportsQuery(undefined, {
    pollingInterval: 5000, // Опрашивать статус отчетов каждые 5 секунд
  });
  const [createReport, { isLoading: isCreating }] = useCreateReportMutation();

  const handleCreateReport = async () => {
    try {
      await createReport({ report_type: 'monthly_commission' }).unwrap();
    } catch (err) {
      console.error('Failed to create report:', err);
    }
  };

  const columns = React.useMemo(() => [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'report_type', header: 'Type' },
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'created_at', header: 'Created At' },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => (
        row.original.status === 'completed' && row.original.file_url ? (
          <a href={row.original.file_url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">
            Download
          </a>
        ) : null
      ),
    },
  ], []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorMessage message={error?.toString() || 'Failed to load reports.'} />;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Reports</h1>
        <Button onClick={handleCreateReport} disabled={isCreating}>
          {isCreating ? 'Generating...' : 'Generate Monthly Report'}
        </Button>
      </div>
      <DataTable columns={columns} data={reports || []} />
    </div>
  );
};

export default ReportsPage;

