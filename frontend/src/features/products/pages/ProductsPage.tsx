import React, { useMemo } from 'react';
import { useGetProductsQuery, useDeleteProductMutation } from '../api/productsApiSlice';
import { Button } from '@/components/ui/Button';
import { ProductFormModal } from '../components/ProductFormModal';
import { ResourceTable } from '@/components/common/ResourceTable';
import { useToast } from '@/contexts/ToastContext';

const ProductsPage: React.FC = () => {
  const [deleteProduct] = useDeleteProductMutation();
  const { addToast } = useToast();

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id).unwrap();
        addToast('Product deleted successfully', 'success');
      } catch (err) {
        addToast('Failed to delete product', 'error');
      }
    }
  };

  const columns = useMemo(() => [
    { header: 'Name', accessorKey: 'name', sortableField: 'name' },
    { header: 'Provider', accessorKey: 'provider', sortableField: 'provider' },
    { header: 'Type', accessorKey: 'product_type', sortableField: 'product_type' },
    { header: 'Commission Rate (%)', accessorKey: 'commission_rate', sortableField: 'commission_rate' },
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
      resourceName="Products"
      useGetDataQuery={useGetProductsQuery}
      columns={columns}
      renderFormModal={({ isOpen, onClose, item }) => (
        <ProductFormModal isOpen={isOpen} onClose={onClose} product={item} />
      )}
    />
  );
};

export default ProductsPage;
