import { api } from '@/services/api';
import { Deal } from '../types';

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

interface GetDealsParams {
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export const dealsApiSlice = api.injectEndpoints({
  endpoints: builder => ({
    getDeals: builder.query<PaginatedResponse<Deal>, GetDealsParams | void>({
      query: (params) => ({
        url: '/deals',
        params: params || {},
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({ type: 'Deal' as const, id })),
              { type: 'Deal', id: 'LIST' },
            ]
          : [{ type: 'Deal', id: 'LIST' }],
    }),
    getDeal: builder.query<Deal, string>({
      query: id => `/deals/${id}`,
      providesTags: (result, error, id) => [{ type: 'Deal', id }],
    }),
    createDeal: builder.mutation<Deal, Partial<Deal>>({
      query: newDeal => ({
        url: '/deals',
        method: 'POST',
        body: newDeal,
      }),
      invalidatesTags: [{ type: 'Deal', id: 'LIST' }],
    }),
    updateDeal: builder.mutation<Deal, Partial<Deal> & Pick<Deal, 'id'>>({
      query: ({ id, ...patch }) => ({
        url: `/deals/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Deal', id }],
    }),
    deleteDeal: builder.mutation<{ success: boolean; id: string }, string>({
      query: id => ({
        url: `/deals/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Deal', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetDealsQuery,
  useGetDealQuery,
  useCreateDealMutation,
  useUpdateDealMutation,
  useDeleteDealMutation,
} = dealsApiSlice;
