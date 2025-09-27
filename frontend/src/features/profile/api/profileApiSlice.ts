import { api } from '@/services/api';
import { User } from '@/features/auth/authSlice';

export const profileApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    updateProfile: builder.mutation<User, Partial<Pick<User, 'username' | 'email'>>>({
      query: (patch) => ({
        url: 'auth/users/me/',
        method: 'PATCH',
        body: patch,
      }),
      // После успешного обновления, инвалидируем тег 'Me', чтобы getMe выполнился заново
      invalidatesTags: ['Me'],
    }),
    changePassword: builder.mutation<void, any>({
      query: (body) => ({
        url: 'auth/users/set_password/',
        method: 'POST',
        body: body,
      }),
    }),
  }),
});

export const { useUpdateProfileMutation, useChangePasswordMutation } = profileApiSlice;

