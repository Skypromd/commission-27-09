import { api } from '@/services/api';
import { DashboardStats, DealsByStatus, Activity } from '../types';

interface DateRangeParams {
  date_from?: string;
  date_to?: string;
}

export const dashboardApiSlice = api.injectEndpoints({
  endpoints: builder => ({
    getDashboardStats: builder.query<DashboardStats, DateRangeParams | void>({
      query: (params) => ({
        url: '/dashboard/stats',
        params: params || {},
      }),
      providesTags: ['DashboardStats'],
    }),
    getDealsByStatus: builder.query<DealsByStatus[], DateRangeParams | void>({
      query: (params) => ({
        url: '/dashboard/deals-by-status',
        params: params || {},
      }),
      providesTags: ['DealsByStatus'],
    }),
    getLiveActivity: builder.query<Activity[], void>({
      query: () => '/dashboard/activity',
      providesTags: ['Activity'],
    }),
  }),
});

export const { useGetDashboardStatsQuery, useGetDealsByStatusQuery, useGetLiveActivityQuery } = dashboardApiSlice;
