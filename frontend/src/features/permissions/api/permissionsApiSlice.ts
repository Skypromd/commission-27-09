import { api } from '@/services/api';
import { Role, Permission } from '../types';

export const permissionsApiSlice = api.injectEndpoints({
  endpoints: builder => ({
    getRoles: builder.query<Role[], void>({
      query: () => '/roles', // Предполагаемый эндпоинт
      providesTags: (result = []) => [
        'Role',
        ...result.map(({ id }) => ({ type: 'Role' as const, id })),
      ],
    }),
    getPermissions: builder.query<Permission[], void>({
        query: () => '/permissions', // Предполагаемый эндпоинт
        providesTags: ['Permission'],
    }),
    updateRolePermissions: builder.mutation<Role, { roleId: string; permissions: string[] }>({
        query: ({ roleId, permissions }) => ({
            url: `/roles/${roleId}/permissions`,
            method: 'PUT',
            body: { permissions },
        }),
        invalidatesTags: (result, error, { roleId }) => [{ type: 'Role', id: roleId }],
    }),
  }),
});

export const { useGetRolesQuery, useGetPermissionsQuery, useUpdateRolePermissionsMutation } = permissionsApiSlice;

