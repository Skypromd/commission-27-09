export interface Deal {
  id: string;
  client: string;
  adviser: string;
  product: string;
  status: 'pending' | 'completed' | 'cancelled';
  deal_value: number;
  commission_amount?: number;
  created_at: string;
  updated_at: string;
}

