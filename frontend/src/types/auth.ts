// Authentication types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
  permissions: string[];
}

export interface AuthTokens {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface TokenPayload {
  sub: string;
  exp: number;
  iat: number;
  user_id: number;
  username: string;
  role: UserRole;
  permissions: string[];
}

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  permissions?: string[];
}

export type UserRole =
  | 'production_admin'
  | 'admin'
  | 'manager'
  | 'financial_adviser'
  | 'consultant'
  | 'viewer';

export interface AuthContextValue {
  user: User | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  loading: boolean;
}
