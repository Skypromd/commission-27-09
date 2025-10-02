import { api } from '@/services/api';
import { Deal } from '../../types/deal';

export const dealsApiSlice = api.injectEndpoints({
  endpoints: builder => ({
    getDeals: builder.query<Deal[], void>({
      query: () => '/deals',
      providesTags: (result = []) => [
        'Deal',
        ...result.map(({ id }) => ({ type: 'Deal' as const, id })),
      ],
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
      invalidatesTags: ['Deal'],
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
      invalidatesTags: (result, error, id) => [{ type: 'Deal', id }],
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
