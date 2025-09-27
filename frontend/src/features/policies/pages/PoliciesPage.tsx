import React, { useMemo } from 'react';
import { useGetPoliciesQuery, useDeletePolicyMutation } from '../api/policiesApiSlice';
import { Button } from '@/components/ui/Button';
import { PolicyFormModal } from '../components/PolicyFormModal';
import { ResourceTable } from '@/components/common/ResourceTable';
import { useGetClientsQuery } from '@/features/clients';
import { useToast } from '@/contexts/ToastContext';

const PoliciesPage: React.FC = () => {
  const [deletePolicy] = useDeletePolicyMutation();
  const { addToast } = useToast();

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this policy?')) {
      try {
        await deletePolicy(id).unwrap();
        addToast('Policy deleted successfully', 'success');
      } catch (err) {
        addToast('Failed to delete policy', 'error');
      }
    }
  };

  const columns = useMemo(() => [
    {
      header: 'Policy Number',
      accessorKey: 'policy_number',
      sortableField: 'policy_number'
    },
    {
      header: 'Client',
      accessorKey: 'client',
      cell: ({ row, table }: any) => table.options.meta.clients?.[row.original.client] || row.original.client,
      sortableField: 'client'
    },
    {
      header: 'Provider',
      accessorKey: 'provider',
      sortableField: 'provider'
    },
    {
      header: 'Status',
      accessorKey: 'status',
      sortableField: 'status'
    },
    {
      header: 'Premium',
      accessorKey: 'premium_amount',
      sortableField: 'premium_amount'
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
      resourceName="Policies"
      useGetDataQuery={useGetPoliciesQuery}
      columns={columns}
      renderFormModal={({ isOpen, onClose, item }) => (
        <PolicyFormModal isOpen={isOpen} onClose={onClose} policy={item} />
      )}
      relatedData={{
        clients: { useGetDataQuery: useGetClientsQuery, displayField: (item) => `${item.first_name} ${item.last_name}` },
      }}
    />
  );
};

export default PoliciesPage;
