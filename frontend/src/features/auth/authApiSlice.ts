import { api } from '@/services/api';
import { logOut, setCredentials, User } from './authSlice';

export const authApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<{ token: string; user: any }, any>({
      query: (credentials) => ({
        url: 'users/auth/login/', // URL для входа в custom backend
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ token: data.token, user: data.user }));
        } catch (error) {
          // Обработка ошибок, если нужно
        }
      },
    }),
    getMe: builder.query<User, void>({
      query: () => 'users/users/me/',
      providesTags: ['Me'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Сохраняем пользователя в authSlice, но не трогаем токен
          dispatch(setCredentials({ user: data }));
        } catch (error) {
          // Если токен невалидный, выходим из системы
          dispatch(logOut());
        }
      },
    }),
    logout: builder.mutation({
      query: () => ({
        url: 'users/auth/logout/', // URL для выхода в custom backend
        method: 'POST',
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logOut());
          // Очищаем кэш API для сброса всех данных
          dispatch(api.util.resetApiState());
        } catch (err) {
          console.error('Failed to logout: ', err);
        }
      },
    }),
    register: builder.mutation<{ token: string; user: any }, any>({
      query: (userData) => ({
        url: 'users/auth/register/',
        method: 'POST',
        body: userData,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success) {
            dispatch(setCredentials({ token: data.token, user: data.user }));
          }
        } catch (error) {
          // Обработка ошибок регистрации
        }
      },
    }),
  }),
});

export const { useLoginMutation, useGetMeQuery, useLogoutMutation, useRegisterMutation } = authApiSlice;
