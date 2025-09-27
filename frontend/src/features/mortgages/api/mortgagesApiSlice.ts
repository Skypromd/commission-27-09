import { api } from '@/services/api';
import { Mortgage } from '../types';

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

interface GetMortgagesParams {
  search?: string;
  ordering?: string;
  page?: number;
}

export const mortgagesApiSlice = api.injectEndpoints({
  endpoints: builder => ({
    getMortgages: builder.query<PaginatedResponse<Mortgage>, GetMortgagesParams | void>({
      query: (params) => ({
        url: '/mortgages',
        params: params || {},
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({ type: 'Mortgage' as const, id })),
              { type: 'Mortgage', id: 'LIST' },
            ]
          : [{ type: 'Mortgage', id: 'LIST' }],
    }),
    createMortgage: builder.mutation<Mortgage, Partial<Mortgage>>({
      query: newMortgage => ({
        url: '/mortgages',
        method: 'POST',
        body: newMortgage,
      }),
      invalidatesTags: [{ type: 'Mortgage', id: 'LIST' }],
    }),
    updateMortgage: builder.mutation<Mortgage, Partial<Mortgage> & Pick<Mortgage, 'id'>>({
      query: ({ id, ...patch }) => ({
        url: `/mortgages/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Mortgage', id }],
    }),
    deleteMortgage: builder.mutation<{ success: boolean; id: string }, string>({
      query: id => ({
        url: `/mortgages/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Mortgage', id: 'LIST' }],
    }),
  }),
});

export const { useGetMortgagesQuery, useCreateMortgageMutation, useUpdateMortgageMutation, useDeleteMortgageMutation } = mortgagesApiSlice;
