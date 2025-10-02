import { api } from '@/services/api';
import { Client } from '@/types';

type NewClient = Omit<Client, 'id' | 'user'>;

export const clientsApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getClients: builder.query<Client[], void>({
      query: () => 'clients/',
      providesTags: (result = []) => [
        ...result.map(({ id }) => ({ type: 'Client' as const, id })),
        { type: 'Client', id: 'LIST' },
      ],
    }),
    addClient: builder.mutation<Client, NewClient>({
      query: (client) => ({
        url: 'clients/',
        method: 'POST',
        body: client,
      }),
      invalidatesTags: [{ type: 'Client', id: 'LIST' }],
    }),
    updateClient: builder.mutation<Client, Partial<Client> & Pick<Client, 'id'>>({
      query: ({ id, ...patch }) => ({
        url: `clients/${id}/`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Client', id }],
    }),
    deleteClient: builder.mutation<{ success: boolean; id: number }, number>({
      query(id) {
        return {
          url: `clients/${id}/`,
          method: 'DELETE',
        };
      },
      invalidatesTags: (result, error, id) => [{ type: 'Client', id: 'LIST' }],
    }),
  }),
});

export const { useGetClientsQuery, useAddClientMutation, useUpdateClientMutation, useDeleteClientMutation } = clientsApiSlice;

