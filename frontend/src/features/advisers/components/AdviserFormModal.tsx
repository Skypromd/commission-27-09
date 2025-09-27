import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/ui/Button';
import { Adviser } from '../types';
import { useCreateAdviserMutation, useUpdateAdviserMutation } from '../api/advisersApiSlice';
import { useToast } from '@/contexts/ToastContext';

interface AdviserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  adviser?: Adviser | null;
}

export const AdviserFormModal: React.FC<AdviserFormModalProps> = ({ isOpen, onClose, adviser }) => {
  const [formData, setFormData] = useState({ first_name: '', last_name: '', email: '', agency: '', role: '' });
  const [createAdviser, { isLoading: isCreating }] = useCreateAdviserMutation();
  const [updateAdviser, { isLoading: isUpdating }] = useUpdateAdviserMutation();
  const { addToast } = useToast();

  useEffect(() => {
    if (adviser) {
      setFormData({
        first_name: adviser.user.first_name,
        last_name: adviser.user.last_name,
        email: adviser.user.email,
        agency: adviser.agency,
        role: adviser.role,
      });
    } else {
      setFormData({ first_name: '', last_name: '', email: '', agency: '', role: '' });
    }
  }, [adviser, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData = {
        user: {
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
        },
        agency: formData.agency,
        role: formData.role,
    };
    try {
      if (adviser) {
        await updateAdviser({ id: adviser.id, ...submissionData }).unwrap();
        addToast('Adviser updated successfully', 'success');
      } else {
        await createAdviser(submissionData).unwrap();
        addToast('Adviser created successfully', 'success');
      }
      onClose();
    } catch (err) {
      addToast('Failed to save adviser', 'error');
      console.error('Failed to save the adviser:', err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={adviser ? 'Edit Adviser' : 'Add Adviser'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First Name</label>
          <input type="text" name="first_name" id="first_name" value={formData.first_name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
        </div>
        <div>
          <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last Name</label>
          <input type="text" name="last_name" id="last_name" value={formData.last_name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
        </div>
        <div>
          <label htmlFor="agency" className="block text-sm font-medium text-gray-700">Agency</label>
          <input type="text" name="agency" id="agency" value={formData.agency} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
          <input type="text" name="role" id="role" value={formData.role} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
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
