import { api } from '@/services/api';

interface DashboardStats {
  total_mortgages: number;
  total_policies: number;
  total_loan_amount: number;
  total_premium_amount: number;
  deals_by_status: { name: string; value: number }[];
}

export const dashboardApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => 'dashboard/stats/',
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApiSlice;

