export interface Client {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  user: number;
}

export interface Mortgage {
  id: number;
  name: string;
  status: string;
  loan_amount: number;
  client: number;
  user: number;
}

export interface Policy {
  id: number;
  name: string;
  status: string;
  premium_amount: number;
  client: number;
  user: number;
}
