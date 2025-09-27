// API response types with enhanced TypeScript support
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  timestamp?: string;
  request_id?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
  limit: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface ErrorResponse {
  detail: string;
  status_code: number;
  errors?: Record<string, string[]>;
  timestamp?: string;
  path?: string;
}

// Enhanced business entity types with stricter typing
export interface Client {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  date_of_birth?: string | null;
  address?: string | null;
  adviser_id?: number | null;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  full_name?: string; // computed field
  age?: number; // computed field
}

export interface Commission {
  id: number;
  client_id: number;
  user_id: number;
  product_id: number;
  amount: number;
  percentage: number;
  status: CommissionStatus;
  created_at: string;
  paid_at?: string | null;
  notes?: string | null;
  client?: Client;
  user?: User;
  product?: Product;
  currency: 'GBP' | 'USD' | 'EUR';
}

export interface Product {
  id: number;
  name: string;
  description?: string | null;
  category: ProductCategory;
  default_percentage: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  min_commission?: number | null;
  max_commission?: number | null;
}

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string | null;
  permissions?: string[];
}

// Enhanced enums with strict typing
export enum CommissionStatus {
  PENDING = 'pending',
  PAID = 'paid',
  CANCELLED = 'cancelled',
  PROCESSING = 'processing'
}

export enum ProductCategory {
  LIFE_INSURANCE = 'life_insurance',
  HEALTH_INSURANCE = 'health_insurance',
  INVESTMENT = 'investment',
  PENSION = 'pension',
  MORTGAGE = 'mortgage'
}

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  ADVISOR = 'advisor',
  VIEWER = 'viewer'
}

// API filter and search types
export interface ClientFilters {
  search?: string;
  adviser_id?: number;
  is_active?: boolean;
  created_from?: string;
  created_to?: string;
}

export interface CommissionFilters {
  status?: CommissionStatus;
  client_id?: number;
  user_id?: number;
  product_id?: number;
  amount_min?: number;
  amount_max?: number;
  date_from?: string;
  date_to?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// ML/Analytics types
export interface MLInsights {
  performance_trend: {
    direction: 'improving' | 'declining' | 'stable';
    trend_value: number;
    confidence: number;
  };
  top_products: Record<string, {
    name: string;
    commission_total: number;
    count: number;
  }>;
  best_months: string[];
  next_month_prediction: {
    predicted_commission: number;
    confidence: 'high' | 'medium' | 'low';
    factors: string[];
  };
  recommendations: Array<{
    type: 'product_focus' | 'client_follow_up' | 'timing_optimization';
    message: string;
    priority: 'high' | 'medium' | 'low';
    estimated_impact: number;
  }>;
}

// WebSocket message types
export interface WebSocketMessage {
  type: 'commission_created' | 'commission_updated' | 'commission_paid' |
        'client_assigned' | 'system_announcement' | 'deadline_reminder' |
        'connection' | 'pong' | 'error';
  title?: string;
  message: string;
  data?: any;
  timestamp: string;
  priority?: 'high' | 'medium' | 'low';
  user_id?: number;
}

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface FormResponse<T = any> {
  success: boolean;
  data?: T;
  errors?: ValidationError[];
  message?: string;
}
