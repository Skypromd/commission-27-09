import { api } from '@/services/api';
import { Commission } from '../types';

export const commissionsApiSlice = api.injectEndpoints({
  endpoints: builder => ({
    getCommissions: builder.query<Commission[], void>({
      query: () => '/commissions',
      providesTags: (result = []) => [
        'Commission',
        ...result.map(({ id }) => ({ type: 'Commission' as const, id })),
      ],
    }),
  }),
});

export const { useGetCommissionsQuery } = commissionsApiSlice;

