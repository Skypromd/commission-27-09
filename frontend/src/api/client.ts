// Modern API client with TypeScript support and enhanced error handling
import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { AuthTokens, User, LoginRequest, LoginResponse } from '@/types/auth';
import { ApiResponse, PaginatedResponse } from '@/types/api';

interface ApiConfig {
  baseURL: string;
  timeout: number;
  withCredentials: boolean;
}

class ApiClient {
  private client: AxiosInstance;
  private authTokens: AuthTokens | null = null;

  constructor(config: ApiConfig) {
    this.client = axios.create(config);
    this.setupInterceptors();
    this.loadTokensFromStorage();
  }

  private setupInterceptors(): void {
    // Request interceptor - Add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add request timestamp for monitoring
        config.metadata = { startTime: new Date() };

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - Handle errors and token refresh
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log response time for monitoring
        const duration = new Date().getTime() - response.config.metadata?.startTime?.getTime();
        console.debug(`API Call: ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`);

        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config;

        // Handle 401 - Token expired
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            await this.refreshToken();
            const token = this.getAccessToken();
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            this.handleAuthError();
            return Promise.reject(refreshError);
          }
        }

        // Handle other errors
        return this.handleApiError(error);
      }
    );
  }

  private handleApiError(error: AxiosError): Promise<never> {
    const apiError = {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      code: error.code
    };

    // Log error for monitoring
    console.error('API Error:', apiError);

    return Promise.reject(apiError);
  }

  private handleAuthError(): void {
    this.clearTokens();
    window.location.href = '/login';
  }

  // Authentication methods
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.client.post<LoginResponse>('/auth/login', credentials);

    this.authTokens = {
      accessToken: response.data.access_token,
      tokenType: response.data.token_type,
      expiresIn: response.data.expires_in
    };

    this.saveTokensToStorage();
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await this.client.post('/auth/logout');
    } finally {
      this.clearTokens();
    }
  }

  async refreshToken(): Promise<void> {
    const response = await this.client.post<{
      access_token: string;
      token_type: string;
      expires_in: number;
    }>('/auth/refresh');

    this.authTokens = {
      accessToken: response.data.access_token,
      tokenType: response.data.token_type,
      expiresIn: response.data.expires_in
    };

    this.saveTokensToStorage();
  }

  async getProfile(): Promise<User> {
    const response = await this.client.get<User>('/auth/profile');
    return response.data;
  }

  // User management
  async getUsers(params?: {
    skip?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<User>> {
    const response = await this.client.get<PaginatedResponse<User>>('/users', { params });
    return response.data;
  }

  async getUserById(userId: number): Promise<User> {
    const response = await this.client.get<User>(`/users/${userId}`);
    return response.data;
  }

  async createUser(userData: any): Promise<User> {
    const response = await this.client.post<User>('/users', userData);
    return response.data;
  }

  async updateUser(userId: number, userData: any): Promise<User> {
    const response = await this.client.put<User>(`/users/${userId}`, userData);
    return response.data;
  }

  async deleteUser(userId: number): Promise<void> {
    await this.client.delete(`/users/${userId}`);
  }

  // Client management
  async getClients(params?: {
    skip?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<any>> {
    const response = await this.client.get<PaginatedResponse<any>>('/clients', { params });
    return response.data;
  }

  async createClient(clientData: any): Promise<any> {
    const response = await this.client.post('/clients', clientData);
    return response.data;
  }

  // Commission management
  async getCommissions(params?: {
    skip?: number;
    limit?: number;
    status?: string;
    userId?: number;
  }): Promise<PaginatedResponse<any>> {
    const response = await this.client.get<PaginatedResponse<any>>('/commissions', { params });
    return response.data;
  }

  async createCommission(commissionData: any): Promise<any> {
    const response = await this.client.post('/commissions', commissionData);
    return response.data;
  }

  // Product management
  async getProducts(params?: {
    skip?: number;
    limit?: number;
    type?: string;
  }): Promise<PaginatedResponse<any>> {
    const response = await this.client.get<PaginatedResponse<any>>('/products', { params });
    return response.data;
  }

  // Analytics
  async getAnalytics(params?: {
    dateFrom?: string;
    dateTo?: string;
    type?: string;
  }): Promise<any> {
    const response = await this.client.get('/analytics', { params });
    return response.data;
  }

  // Generic HTTP methods
  async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.client.get<T>(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.post<T>(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.put<T>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<T>(url);
    return response.data;
  }

  // Token management methods
  private getAccessToken(): string | null {
    return this.authTokens?.accessToken || null;
  }

  private loadTokensFromStorage(): void {
    try {
      const stored = localStorage.getItem('auth_tokens');
      if (stored) {
        this.authTokens = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load tokens from storage:', error);
      this.clearTokens();
    }
  }

  private saveTokensToStorage(): void {
    if (this.authTokens) {
      localStorage.setItem('auth_tokens', JSON.stringify(this.authTokens));
    }
  }

  private clearTokens(): void {
    this.authTokens = null;
    localStorage.removeItem('auth_tokens');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.authTokens?.accessToken;
  }

  getAuthHeaders(): Record<string, string> {
    const token = this.getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

// Create singleton instance
const apiConfig: ApiConfig = {
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api', // Убедитесь, что URL соответствует вашим роутам в Django
  timeout: 10000,
  withCredentials: false
};

export const apiClient = new ApiClient(apiConfig);
export default apiClient;
