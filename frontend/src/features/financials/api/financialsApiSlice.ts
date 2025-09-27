import { api } from '@/services/api';
import { FinancialSummary } from '../types';

export const financialsApiSlice = api.injectEndpoints({
  endpoints: builder => ({
    getFinancialSummary: builder.query<FinancialSummary, void>({
      query: () => '/financials/summary', // Предполагаемый эндпоинт
      providesTags: ['FinancialSummary'],
    }),
  }),
});

export const { useGetFinancialSummaryQuery } = financialsApiSlice;

