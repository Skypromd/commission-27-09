export interface DashboardStats {
  totalDeals: number;
  totalCommission: number;
  newClients: number;
  pendingTasks: number;
}

export interface DealsByStatus {
  status: string;
  count: number;
}

export interface Activity {
  id: string;
  type: 'deal_created' | 'commission_paid' | 'client_added';
  description: string;
  timestamp: string;
}
