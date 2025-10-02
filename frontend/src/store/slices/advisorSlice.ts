import { StateCreator } from 'zustand';
import apiClient from '../../services/api';
import { Advisor, CreateAdvisorData, UpdateAdvisorData } from '../../types/advisor';

export interface AdvisorSlice {
  advisors: Advisor[];
  advisorsLoading: boolean;
  advisorsError: string | null;

  // Actions
  fetchAdvisors: () => Promise<void>;
  createAdvisor: (data: CreateAdvisorData) => Promise<Advisor>;
  updateAdvisor: (id: number, data: UpdateAdvisorData) => Promise<Advisor>;
  deleteAdvisor: (id: number) => Promise<void>;
  clearAdvisorsError: () => void;
}

export const advisorSlice: StateCreator<AdvisorSlice> = (set: any, get: any) => ({
  advisors: [],
  advisorsLoading: false,
  advisorsError: null,

  fetchAdvisors: async () => {
    set({ advisorsLoading: true, advisorsError: null });

    try {
      const response = await apiClient.get('/advisors');

      set({
        advisors: response.data,
        advisorsLoading: false,
        advisorsError: null,
      });
    } catch (error: any) {
      set({
        advisorsLoading: false,
        advisorsError: error.response?.data?.detail || 'Failed to fetch advisors',
      });
      throw error;
    }
  },

  createAdvisor: async (data: CreateAdvisorData) => {
    set({ advisorsLoading: true, advisorsError: null });

    try {
      const response = await apiClient.post('/advisors', data);
      const newAdvisor = response.data;

      set((state: any) => ({
        advisors: [...state.advisors, newAdvisor],
        advisorsLoading: false,
        advisorsError: null,
      }));

      return newAdvisor;
    } catch (error: any) {
      set({
        advisorsLoading: false,
        advisorsError: error.response?.data?.detail || 'Failed to create advisor',
      });
      throw error;
    }
  },

  updateAdvisor: async (id: number, data: UpdateAdvisorData) => {
    set({ advisorsLoading: true, advisorsError: null });

    try {
      const response = await apiClient.put(`/advisors/${id}`, data);
      const updatedAdvisor = response.data;

      set((state: any) => ({
        advisors: state.advisors.map((advisor: Advisor) =>
          advisor.id === id ? updatedAdvisor : advisor
        ),
        advisorsLoading: false,
        advisorsError: null,
      }));

      return updatedAdvisor;
    } catch (error: any) {
      set({
        advisorsLoading: false,
        advisorsError: error.response?.data?.detail || 'Failed to update advisor',
      });
      throw error;
    }
  },

  deleteAdvisor: async (id: number) => {
    set({ advisorsLoading: true, advisorsError: null });

    try {
      await apiClient.delete(`/advisors/${id}`);

      set((state: any) => ({
        advisors: state.advisors.filter((advisor: Advisor) => advisor.id !== id),
        advisorsLoading: false,
        advisorsError: null,
      }));
    } catch (error: any) {
      set({
        advisorsLoading: false,
        advisorsError: error.response?.data?.detail || 'Failed to delete advisor',
      });
      throw error;
    }
  },

  clearAdvisorsError: () => {
    set({ advisorsError: null });
  },
});
