export interface Adviser {
  id: string;
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
  agency: string;
  role: string;
}

