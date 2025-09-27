import React, { useMemo } from 'react';
import { useGetClientsQuery, useDeleteClientMutation } from '../api/clientsApiSlice';
import { Button } from '@/components/ui/Button';
import { ClientFormModal } from '../components/ClientFormModal';
import { ResourceTable } from '@/components/common/ResourceTable';
import { useToast } from '@/contexts/ToastContext';

const ClientsPage: React.FC = () => {
  const [deleteClient] = useDeleteClientMutation();
  const { addToast } = useToast();

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await deleteClient(id).unwrap();
        addToast('Client deleted successfully', 'success');
      } catch (err) {
        addToast('Failed to delete client', 'error');
      }
    }
  };

  const columns = useMemo(() => [
    { header: 'First Name', accessorKey: 'first_name', sortableField: 'first_name' },
    { header: 'Last Name', accessorKey: 'last_name', sortableField: 'last_name' },
    { header: 'Email', accessorKey: 'email', sortableField: 'email' },
    { header: 'Phone', accessorKey: 'phone_number' },
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
      resourceName="Clients"
      useGetDataQuery={useGetClientsQuery}
      columns={columns}
      renderFormModal={({ isOpen, onClose, item }) => (
        <ClientFormModal isOpen={isOpen} onClose={onClose} client={item} />
      )}
    />
  );
};

export default ClientsPage;
