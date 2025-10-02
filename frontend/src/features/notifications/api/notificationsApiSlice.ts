import { api } from '@/services/api';
import { Notification } from '../types';

export const notificationsApiSlice = api.injectEndpoints({
  endpoints: builder => ({
    getNotifications: builder.query<Notification[], void>({
      query: () => '/notifications', // Предполагаемый эндпоинт
      providesTags: (result = []) => [
        'Notification',
        ...result.map(({ id }) => ({ type: 'Notification' as const, id })),
      ],
    }),
  }),
});

export const { useGetNotificationsQuery } = notificationsApiSlice;

