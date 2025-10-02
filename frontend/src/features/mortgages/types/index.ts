export interface Mortgage {
  id: string;
  case_number: string;
  client: string; // Client ID
  adviser: string; // Adviser ID
  status: string;
  loan_amount: number;
  product_type: string;
  created_at: string;
}

