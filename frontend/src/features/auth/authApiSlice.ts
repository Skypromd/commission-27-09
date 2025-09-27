import { api } from '@/services/api';
import { logOut, setCredentials, User } from './authSlice';

export const authApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<{ auth_token: string }, any>({
      query: (credentials) => ({
        url: 'auth/token/login/', // URL для входа в djoser
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ token: data.auth_token }));
          // После успешного входа, запрашиваем данные пользователя
          dispatch(authApiSlice.endpoints.getMe.initiate());
        } catch (error) {
          // Обработка ошибок, если нужно
        }
      },
    }),
    getMe: builder.query<User, void>({
      query: () => 'auth/users/me/',
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
        url: 'auth/token/logout/', // URL для выхода в djoser
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
  }),
});

export const { useLoginMutation, useGetMeQuery, useLogoutMutation } = authApiSlice;
