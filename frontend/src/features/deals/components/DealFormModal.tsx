import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/ui/Button';
import { Deal } from '../types';
import { useCreateDealMutation, useUpdateDealMutation } from '../api/dealsApiSlice';
import { useGetClientsQuery } from '@/features/clients';
import { useGetAdvisersQuery } from '@/features/advisers';
import { useGetProductsQuery } from '@/features/products';

interface DealFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  deal?: Deal | null;
}

export const DealFormModal: React.FC<DealFormModalProps> = ({ isOpen, onClose, deal }) => {
  const [formData, setFormData] = useState({ client: '', adviser: '', product: '', status: 'pending', deal_value: 0 });

  const [createDeal, { isLoading: isCreating }] = useCreateDealMutation();
  const [updateDeal, { isLoading: isUpdating }] = useUpdateDealMutation();

  const { data: clients } = useGetClientsQuery();
  const { data: advisers } = useGetAdvisersQuery();
  const { data: products } = useGetProductsQuery();

  useEffect(() => {
    if (deal) {
      setFormData({
        client: deal.client,
        adviser: deal.adviser,
        product: deal.product,
        status: deal.status,
        deal_value: deal.deal_value,
      });
    } else {
      setFormData({ client: '', adviser: '', product: '', status: 'pending', deal_value: 0 });
    }
  }, [deal, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'deal_value' ? parseFloat(value) : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (deal) {
        await updateDeal({ id: deal.id, ...formData }).unwrap();
      } else {
        await createDeal(formData).unwrap();
      }
      onClose();
    } catch (err) {
      console.error('Failed to save the deal:', err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={deal ? 'Edit Deal' : 'Add Deal'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="client" className="block text-sm font-medium text-gray-700">Client</label>
          <select name="client" id="client" value={formData.client} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required>
            <option value="">Select a client</option>
            {clients?.map(c => <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="adviser" className="block text-sm font-medium text-gray-700">Adviser</label>
          <select name="adviser" id="adviser" value={formData.adviser} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required>
            <option value="">Select an adviser</option>
            {advisers?.map(a => <option key={a.id} value={a.id}>{a.user.first_name} {a.user.last_name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="product" className="block text-sm font-medium text-gray-700">Product</label>
          <select name="product" id="product" value={formData.product} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required>
            <option value="">Select a product</option>
            {products?.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <select name="status" id="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label htmlFor="deal_value" className="block text-sm font-medium text-gray-700">Deal Value</label>
          <input type="number" step="0.01" name="deal_value" id="deal_value" value={formData.deal_value} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
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

