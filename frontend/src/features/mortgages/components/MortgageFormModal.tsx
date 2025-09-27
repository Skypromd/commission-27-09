import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/ui/Button';
import { Mortgage } from '../types';
import { useCreateMortgageMutation, useUpdateMortgageMutation } from '../api/mortgagesApiSlice';
import { useGetClientsQuery } from '@/features/clients';
import { useGetAdvisersQuery } from '@/features/advisers';
import { useToast } from '@/contexts/ToastContext';

interface MortgageFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mortgage?: Mortgage | null;
}

export const MortgageFormModal: React.FC<MortgageFormModalProps> = ({ isOpen, onClose, mortgage }) => {
  const [formData, setFormData] = useState({ case_number: '', client: '', adviser: '', status: '', loan_amount: 0, product_type: '' });

  const [createMortgage, { isLoading: isCreating }] = useCreateMortgageMutation();
  const [updateMortgage, { isLoading: isUpdating }] = useUpdateMortgageMutation();
  const { addToast } = useToast();

  const { data: clients } = useGetClientsQuery();
  const { data: advisers } = useGetAdvisersQuery();

  useEffect(() => {
    if (mortgage) {
      setFormData({
        case_number: mortgage.case_number,
        client: mortgage.client,
        adviser: mortgage.adviser,
        status: mortgage.status,
        loan_amount: mortgage.loan_amount,
        product_type: mortgage.product_type,
      });
    } else {
      setFormData({ case_number: '', client: '', adviser: '', status: '', loan_amount: 0, product_type: '' });
    }
  }, [mortgage, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'loan_amount' ? parseFloat(value) : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mortgage) {
        await updateMortgage({ id: mortgage.id, ...formData }).unwrap();
        addToast('Mortgage case updated successfully', 'success');
      } else {
        await createMortgage(formData).unwrap();
        addToast('Mortgage case created successfully', 'success');
      }
      onClose();
    } catch (err) {
      addToast('Failed to save mortgage case', 'error');
      console.error('Failed to save the mortgage case:', err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mortgage ? 'Edit Mortgage Case' : 'Add Mortgage Case'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="case_number" className="block text-sm font-medium text-gray-700">Case Number</label>
          <input type="text" name="case_number" id="case_number" value={formData.case_number} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
        </div>
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
          <label htmlFor="product_type" className="block text-sm font-medium text-gray-700">Product</label>
          <input type="text" name="product_type" id="product_type" value={formData.product_type} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
        </div>
        <div>
          <label htmlFor="loan_amount" className="block text-sm font-medium text-gray-700">Loan Amount</label>
          <input type="number" step="0.01" name="loan_amount" id="loan_amount" value={formData.loan_amount} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
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
