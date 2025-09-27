import { api } from '@/services/api';
import { UserSettings } from '../types';

export const settingsApiSlice = api.injectEndpoints({
  endpoints: builder => ({
    getSettings: builder.query<UserSettings, void>({
      query: () => '/users/me/settings', // Пример эндпоинта
      providesTags: ['Settings'],
    }),
    updateSettings: builder.mutation<UserSettings, Partial<UserSettings>>({
      query: (payload) => ({
        url: '/users/me/settings',
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['Settings'],
    }),
  }),
});

export const { useGetSettingsQuery, useUpdateSettingsMutation } = settingsApiSlice;

