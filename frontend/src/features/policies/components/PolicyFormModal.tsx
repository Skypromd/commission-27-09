import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/ui/Button';
import { Policy } from '../types';
import { useCreatePolicyMutation, useUpdatePolicyMutation } from '../api/policiesApiSlice';
import { useGetClientsQuery } from '@/features/clients';
import { useToast } from '@/contexts/ToastContext';

interface PolicyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  policy?: Policy | null;
}

export const PolicyFormModal: React.FC<PolicyFormModalProps> = ({ isOpen, onClose, policy }) => {
  const [formData, setFormData] = useState({ policy_number: '', client: '', provider: '', status: '', premium_amount: 0 });

  const [createPolicy, { isLoading: isCreating }] = useCreatePolicyMutation();
  const [updatePolicy, { isLoading: isUpdating }] = useUpdatePolicyMutation();
  const { addToast } = useToast();

  const { data: clients } = useGetClientsQuery();

  useEffect(() => {
    if (policy) {
      setFormData({
        policy_number: policy.policy_number,
        client: policy.client,
        provider: policy.provider,
        status: policy.status,
        premium_amount: policy.premium_amount,
      });
    } else {
      setFormData({ policy_number: '', client: '', provider: '', status: '', premium_amount: 0 });
    }
  }, [policy, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'premium_amount' ? parseFloat(value) : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (policy) {
        await updatePolicy({ id: policy.id, ...formData }).unwrap();
        addToast('Policy updated successfully', 'success');
      } else {
        await createPolicy(formData).unwrap();
        addToast('Policy created successfully', 'success');
      }
      onClose();
    } catch (err) {
      addToast('Failed to save policy', 'error');
      console.error('Failed to save the policy:', err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={policy ? 'Edit Policy' : 'Add Policy'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="policy_number" className="block text-sm font-medium text-gray-700">Policy Number</label>
          <input type="text" name="policy_number" id="policy_number" value={formData.policy_number} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
        </div>
        <div>
          <label htmlFor="client" className="block text-sm font-medium text-gray-700">Client</label>
          <select name="client" id="client" value={formData.client} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required>
            <option value="">Select a client</option>
            {clients?.map(c => <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="provider" className="block text-sm font-medium text-gray-700">Provider</label>
          <input type="text" name="provider" id="provider" value={formData.provider} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <input type="text" name="status" id="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
        </div>
        <div>
          <label htmlFor="premium_amount" className="block text-sm font-medium text-gray-700">Premium Amount</label>
          <input type="number" step="0.01" name="premium_amount" id="premium_amount" value={formData.premium_amount} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
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
