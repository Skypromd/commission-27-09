import React, { useMemo } from 'react';
import { useGetDealsQuery, useDeleteDealMutation } from '../api/dealsApiSlice';
import { Button } from '@/components/ui/Button';
import { DealFormModal } from '../components/DealFormModal';
import { ResourceTable } from '@/components/common/ResourceTable';
import { useGetClientsQuery } from '@/features/clients';
import { useGetAdvisersQuery } from '@/features/advisers';
import { useGetProductsQuery } from '@/features/products';
import { useToast } from '@/contexts/ToastContext';

const DealsPage: React.FC = () => {
  const [deleteDeal] = useDeleteDealMutation();
  const { addToast } = useToast();

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this deal?')) {
      try {
        await deleteDeal(id).unwrap();
        addToast('Deal deleted successfully', 'success');
      } catch (err) {
        addToast('Failed to delete deal', 'error');
      }
    }
  };

  const columns = useMemo(() => [
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
      header: 'Product',
      accessorKey: 'product',
      cell: ({ row, table }: any) => table.options.meta.products?.[row.original.product] || row.original.product,
      sortableField: 'product'
    },
    {
      header: 'Status',
      accessorKey: 'status',
      sortableField: 'status'
    },
    {
      header: 'Deal Value',
      accessorKey: 'deal_value',
      sortableField: 'deal_value'
    },
    {
      header: 'Commission',
      accessorKey: 'commission_amount',
      sortableField: 'commission_amount'
    },
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
      resourceName="Deals"
      useGetDataQuery={useGetDealsQuery}
      columns={columns}
      renderFormModal={({ isOpen, onClose, item }) => (
        <DealFormModal isOpen={isOpen} onClose={onClose} deal={item} />
      )}
      relatedData={{
        clients: { useGetDataQuery: useGetClientsQuery, displayField: (item) => `${item.first_name} ${item.last_name}` },
        advisers: { useGetDataQuery: useGetAdvisersQuery, displayField: (item) => `${item.user.first_name} ${item.user.last_name}` },
        products: { useGetDataQuery: useGetProductsQuery, displayField: (item) => item.name },
      }}
    />
  );
};

export default DealsPage;
