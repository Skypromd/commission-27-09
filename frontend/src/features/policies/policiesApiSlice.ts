import { api } from '@/services/api';
import { Policy } from '@/types';

type NewPolicy = Omit<Policy, 'id' | 'user' | 'status'>;

export const policiesApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getPolicies: builder.query<Policy[], void>({
      query: () => 'policies/',
      providesTags: (result = []) => [
        ...result.map(({ id }) => ({ type: 'Policy' as const, id })),
        { type: 'Policy', id: 'LIST' },
      ],
    }),
    addPolicy: builder.mutation<Policy, NewPolicy>({
      query: (policy) => ({
        url: 'policies/',
        method: 'POST',
        body: policy,
      }),
      invalidatesTags: [{ type: 'Policy', id: 'LIST' }],
    }),
    updatePolicy: builder.mutation<Policy, Partial<Policy> & Pick<Policy, 'id'>>({
      query: ({ id, ...patch }) => ({
        url: `policies/${id}/`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Policy', id }],
    }),
    deletePolicy: builder.mutation<{ success: boolean; id: number }, number>({
      query(id) {
        return {
          url: `policies/${id}/`,
          method: 'DELETE',
        };
      },
      invalidatesTags: (result, error, id) => [{ type: 'Policy', id: 'LIST' }],
    }),
    updatePolicyStatus: builder.mutation<Policy, { id: number; status: string }>({
      query: ({ id, status }) => ({
        url: `policies/${id}/status/`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Policy', id }],
    }),
  }),
});

// Экспортируем хук для использования в компонентах
export const { useGetPoliciesQuery, useAddPolicyMutation, useUpdatePolicyMutation, useDeletePolicyMutation, useUpdatePolicyStatusMutation } = policiesApiSlice;
