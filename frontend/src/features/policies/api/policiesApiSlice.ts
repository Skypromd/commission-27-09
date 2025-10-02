import { api } from '@/services/api';
import { Policy } from '../types';

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

interface GetPoliciesParams {
  search?: string;
  ordering?: string;
  page?: number;
}

export const policiesApiSlice = api.injectEndpoints({
  endpoints: builder => ({
    getPolicies: builder.query<PaginatedResponse<Policy>, GetPoliciesParams | void>({
      query: (params) => ({
        url: '/insurances', // Эндпоинт соответствует backend app 'insurances'
        params: params || {},
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({ type: 'Policy' as const, id })),
              { type: 'Policy', id: 'LIST' },
            ]
          : [{ type: 'Policy', id: 'LIST' }],
    }),
    createPolicy: builder.mutation<Policy, Partial<Policy>>({
      query: newPolicy => ({
        url: '/insurances',
        method: 'POST',
        body: newPolicy,
      }),
      invalidatesTags: [{ type: 'Policy', id: 'LIST' }],
    }),
    updatePolicy: builder.mutation<Policy, Partial<Policy> & Pick<Policy, 'id'>>({
      query: ({ id, ...patch }) => ({
        url: `/insurances/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Policy', id }],
    }),
    deletePolicy: builder.mutation<{ success: boolean; id: string }, string>({
      query: id => ({
        url: `/insurances/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Policy', id: 'LIST' }],
    }),
  }),
});

export const { useGetPoliciesQuery, useCreatePolicyMutation, useUpdatePolicyMutation, useDeletePolicyMutation } = policiesApiSlice;
