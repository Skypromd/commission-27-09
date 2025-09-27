export interface Commission {
  id: string;
  deal: string; // Deal ID
  adviser: string; // Adviser ID
  amount: number;
  status: 'pending' | 'paid' | 'cancelled';
  calculation_date: string;
}

