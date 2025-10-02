import React, { useMemo } from 'react';
import { useGetAdvisersQuery, useDeleteAdviserMutation } from '../api/advisersApiSlice';
import { Button } from '@/components/ui/Button';
import { AdviserFormModal } from '../components/AdviserFormModal';
import { ResourceTable } from '@/components/common/ResourceTable';
import { Adviser } from '../types';
import { useToast } from '@/contexts/ToastContext';

const AdvisersPage: React.FC = () => {
  const [deleteAdviser] = useDeleteAdviserMutation();
  const { addToast } = useToast();

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this adviser?')) {
      try {
        await deleteAdviser(id).unwrap();
        addToast('Adviser deleted successfully', 'success');
      } catch (err) {
        addToast('Failed to delete adviser', 'error');
      }
    }
  };

  const columns = useMemo(() => [
    {
      header: 'Name',
      accessorFn: (row: Adviser) => `${row.user.first_name} ${row.user.last_name}`,
      sortableField: 'user__first_name',
    },
    {
      header: 'Email',
      accessorKey: 'user.email',
      sortableField: 'user__email',
    },
    { header: 'Agency', accessorKey: 'agency', sortableField: 'agency' },
    { header: 'Role', accessorKey: 'role', sortableField: 'role' },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row, table }: any) => (
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={() => table.options.meta.openModal(row.original)}>Edit</Button>
          <Button variant="destructive" size="sm" onClick={() => handleDelete(row.original.id)}>Delete</Button>
        </div>
      ),
    },
  ], []);

  return (
    <ResourceTable
      resourceName="Advisers"
      useGetDataQuery={useGetAdvisersQuery}
      columns={columns}
      renderFormModal={({ isOpen, onClose, item }) => (
        <AdviserFormModal isOpen={isOpen} onClose={onClose} adviser={item} />
      )}
    />
  );
};

export default AdvisersPage;
