export interface Policy {
  id: string;
  policy_number: string;
  client: string; // Client ID
  provider: string;
  status: string;
  premium_amount: number;
  created_at: string;
}

