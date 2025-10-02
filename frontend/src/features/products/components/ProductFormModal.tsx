import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/ui/Button';
import { Product } from '../types';
import { useCreateProductMutation, useUpdateProductMutation } from '../api/productsApiSlice';
import { useToast } from '@/contexts/ToastContext';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({ isOpen, onClose, product }) => {
  const [formData, setFormData] = useState({ name: '', provider: '', product_type: 'other', commission_rate: 0 });
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const { addToast } = useToast();

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        provider: product.provider,
        product_type: product.product_type,
        commission_rate: product.commission_rate,
      });
    } else {
      setFormData({ name: '', provider: '', product_type: 'other', commission_rate: 0 });
    }
  }, [product, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'commission_rate' ? parseFloat(value) : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (product) {
        await updateProduct({ id: product.id, ...formData }).unwrap();
        addToast('Product updated successfully', 'success');
      } else {
        await createProduct(formData).unwrap();
        addToast('Product created successfully', 'success');
      }
      onClose();
    } catch (err) {
      addToast('Failed to save product', 'error');
      console.error('Failed to save the product:', err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product ? 'Edit Product' : 'Add Product'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
          <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
        </div>
        <div>
          <label htmlFor="provider" className="block text-sm font-medium text-gray-700">Provider</label>
          <input type="text" name="provider" id="provider" value={formData.provider} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
        </div>
        <div>
          <label htmlFor="product_type" className="block text-sm font-medium text-gray-700">Product Type</label>
          <select name="product_type" id="product_type" value={formData.product_type} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
            <option value="mortgage">Mortgage</option>
            <option value="insurance">Insurance</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="commission_rate" className="block text-sm font-medium text-gray-700">Commission Rate (%)</label>
          <input type="number" step="0.01" name="commission_rate" id="commission_rate" value={formData.commission_rate} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
        </div>
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={isCreating || isUpdating}>
            {isCreating || isUpdating ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
