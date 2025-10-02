export interface Process {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
  last_run: string;
  description: string;
}

