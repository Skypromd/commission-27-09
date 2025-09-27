export interface Deal {
  id: string;
  client: string; // Assuming client is represented by its ID
  adviser: string; // Assuming adviser is represented by their ID
  product: string; // Assuming product is represented by its ID
  status: 'pending' | 'completed' | 'cancelled';
  deal_value: number;
  commission_amount?: number;
  created_at: string;
  updated_at: string;
}

