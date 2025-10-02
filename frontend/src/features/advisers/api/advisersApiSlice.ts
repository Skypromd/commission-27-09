import { api } from '@/services/api';
import { Adviser } from '../types';

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

interface GetAdvisersParams {
  search?: string;
  ordering?: string;
  page?: number;
}

export const advisersApiSlice = api.injectEndpoints({
  endpoints: builder => ({
    getAdvisers: builder.query<PaginatedResponse<Adviser>, GetAdvisersParams | void>({
      query: (params) => ({
        url: '/advisers',
        params: params || {},
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({ type: 'Adviser' as const, id })),
              { type: 'Adviser', id: 'LIST' },
            ]
          : [{ type: 'Adviser', id: 'LIST' }],
    }),
    createAdviser: builder.mutation<Adviser, Partial<Adviser>>({
      query: newAdviser => ({
        url: '/advisers',
        method: 'POST',
        body: newAdviser,
      }),
      invalidatesTags: [{ type: 'Adviser', id: 'LIST' }],
    }),
    updateAdviser: builder.mutation<Adviser, Partial<Adviser> & Pick<Adviser, 'id'>>({
      query: ({ id, ...patch }) => ({
        url: `/advisers/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Adviser', id }],
    }),
    deleteAdviser: builder.mutation<{ success: boolean; id: string }, string>({
      query: id => ({
        url: `/advisers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Adviser', id: 'LIST' }],
    }),
  }),
});

export const { useGetAdvisersQuery, useCreateAdviserMutation, useUpdateAdviserMutation, useDeleteAdviserMutation } = advisersApiSlice;
