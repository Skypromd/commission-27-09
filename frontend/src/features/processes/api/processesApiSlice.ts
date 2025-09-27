import { api } from '@/services/api';
import { Process } from '../types';

export const processesApiSlice = api.injectEndpoints({
  endpoints: builder => ({
    getProcesses: builder.query<Process[], void>({
      query: () => '/processes', // Предполагаемый эндпоинт
      providesTags: (result = []) => [
        'Process',
        ...result.map(({ id }) => ({ type: 'Process' as const, id })),
      ],
    }),
  }),
});

export const { useGetProcessesQuery } = processesApiSlice;

