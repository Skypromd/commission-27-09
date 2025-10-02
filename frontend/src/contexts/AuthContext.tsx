import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextValue, LoginRequest, LoginResponse } from '@/types/auth';
import { apiClient } from '@/api/client';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user has specific permission
  const hasPermission = (permission: string): boolean => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission) || user.role === 'admin' || user.role === 'production_admin';
  };

  // Login function
  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      const response = await apiClient.login(credentials);
      const { access_token, user: userData, permissions } = response;

      // Store token in localStorage
      localStorage.setItem('access_token', access_token);

      // Update user with permissions
      const userWithPermissions = { ...userData, permissions };
      setUser(userWithPermissions);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  // Logout function
  const logout = (): void => {
    localStorage.removeItem('access_token');
    setUser(null);
  };

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Verify token and get user data
        const userData = await apiClient.getProfile();
        setUser(userData);
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('access_token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const value: AuthContextValue = {
    user,
    login,
    logout,
    hasPermission,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
