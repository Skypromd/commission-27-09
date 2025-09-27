import { api } from '@/services/api';
import { Client } from '../types';

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

interface GetClientsParams {
  search?: string;
  ordering?: string;
  page?: number;
}

export const clientsApiSlice = api.injectEndpoints({
  endpoints: builder => ({
    getClients: builder.query<PaginatedResponse<Client>, GetClientsParams | void>({
      query: (params) => ({
        url: '/clients',
        params: params || {},
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({ type: 'Client' as const, id })),
              { type: 'Client', id: 'LIST' },
            ]
          : [{ type: 'Client', id: 'LIST' }],
    }),
    createClient: builder.mutation<Client, Partial<Client>>({
      query: newClient => ({
        url: '/clients',
        method: 'POST',
        body: newClient,
      }),
      invalidatesTags: [{ type: 'Client', id: 'LIST' }],
    }),
    updateClient: builder.mutation<Client, Partial<Client> & Pick<Client, 'id'>>({
      query: ({ id, ...patch }) => ({
        url: `/clients/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Client', id }],
    }),
    deleteClient: builder.mutation<{ success: boolean; id: string }, string>({
      query: id => ({
        url: `/clients/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Client', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetClientsQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} = clientsApiSlice;
