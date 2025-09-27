import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '@/store/store';

const baseQuery = fetchBaseQuery({
  baseUrl: '/api/',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      // Используем 'Token', как ожидает DRF TokenAuthentication
      headers.set('authorization', `Token ${token}`);
    }
    return headers;
  },
});

// Создаем базовый API-сервис, от которого будут наследоваться другие.
// Это позволяет нам иметь единую точку конфигурации для всех запросов.
export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQuery,
  tagTypes: ['Mortgage', 'Policy'], // Определяем теги для кэширования
  endpoints: () => ({}), // Эндпоинты будут добавлены в других файлах
});
