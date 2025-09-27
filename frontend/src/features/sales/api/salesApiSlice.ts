import { api } from '@/services/api';
import { Sale } from '../types';

export const salesApiSlice = api.injectEndpoints({
  endpoints: builder => ({
    getSales: builder.query<Sale[], void>({
      query: () => '/sales',
      providesTags: (result = []) => [
        'Sale',
        ...result.map(({ id }) => ({ type: 'Sale' as const, id })),
      ],
    }),
  }),
});

export const { useGetSalesQuery } = salesApiSlice;

