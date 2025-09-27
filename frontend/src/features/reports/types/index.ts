export interface Report {
  id: string;
  name: string;
  report_type: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  file_url?: string; // URL to download the report
}

