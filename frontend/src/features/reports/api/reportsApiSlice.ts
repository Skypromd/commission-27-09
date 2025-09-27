import { api } from '@/services/api';
import { Report } from '../types';

type CreateReportPayload = {
  report_type: string;
  // ... other params like date ranges
};

export const reportsApiSlice = api.injectEndpoints({
  endpoints: builder => ({
    getReports: builder.query<Report[], void>({
      query: () => '/reports',
      providesTags: (result = []) => [
        'Report',
        ...result.map(({ id }) => ({ type: 'Report' as const, id })),
      ],
    }),
    createReport: builder.mutation<Report, CreateReportPayload>({
      query: (payload) => ({
        url: '/reports',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Report'],
    }),
  }),
});

export const { useGetReportsQuery, useCreateReportMutation } = reportsApiSlice;

