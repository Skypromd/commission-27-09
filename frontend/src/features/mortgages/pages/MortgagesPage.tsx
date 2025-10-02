import React, { useMemo } from 'react';
import { useGetMortgagesQuery, useDeleteMortgageMutation } from '../api/mortgagesApiSlice';
import { Button } from '@/components/ui/Button';
import { MortgageFormModal } from '../components/MortgageFormModal';
import { ResourceTable } from '@/components/common/ResourceTable';
import { useGetClientsQuery } from '@/features/clients';
import { useGetAdvisersQuery } from '@/features/advisers';
import { useToast } from '@/contexts/ToastContext';

const MortgagesPage: React.FC = () => {
  const [deleteMortgage] = useDeleteMortgageMutation();
  const { addToast } = useToast();

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this mortgage case?')) {
      try {
        await deleteMortgage(id).unwrap();
        addToast('Mortgage case deleted successfully', 'success');
      } catch (err) {
        addToast('Failed to delete mortgage case', 'error');
      }
    }
  };

  const columns = useMemo(() => [
    {
      header: 'Case Number',
      accessorKey: 'case_number',
      sortableField: 'case_number'
    },
    {
      header: 'Client',
      accessorKey: 'client',
      cell: ({ row, table }: any) => table.options.meta.clients?.[row.original.client] || row.original.client,
      sortableField: 'client'
    },
    {
      header: 'Adviser',
      accessorKey: 'adviser',
      cell: ({ row, table }: any) => table.options.meta.advisers?.[row.original.adviser] || row.original.adviser,
      sortableField: 'adviser'
    },
    {
      header: 'Status',
      accessorKey: 'status',
      sortableField: 'status'
    },
    {
      header: 'Loan Amount',
      accessorKey: 'loan_amount',
      sortableField: 'loan_amount'
    },
    { header: 'Product', accessorKey: 'product_type', sortableField: 'product_type' },
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
      resourceName="Mortgages"
      useGetDataQuery={useGetMortgagesQuery}
      columns={columns}
      renderFormModal={({ isOpen, onClose, item }) => (
        <MortgageFormModal isOpen={isOpen} onClose={onClose} mortgage={item} />
      )}
      relatedData={{
        clients: { useGetDataQuery: useGetClientsQuery, displayField: (item) => `${item.first_name} ${item.last_name}` },
        advisers: { useGetDataQuery: useGetAdvisersQuery, displayField: (item) => `${item.user.first_name} ${item.user.last_name}` },
      }}
    />
  );
};

export default MortgagesPage;
