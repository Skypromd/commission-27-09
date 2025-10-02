// Custom hooks for data fetching with React Query integration
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { apiClient } from '@/api/client';
import { User, Client, Commission, Product } from '@/types/api';

// Query keys for cache management
export const queryKeys = {
  users: ['users'] as const,
  user: (id: number) => ['users', id] as const,
  clients: ['clients'] as const,
  client: (id: number) => ['clients', id] as const,
  commissions: ['commissions'] as const,
  commission: (id: number) => ['commissions', id] as const,
  products: ['products'] as const,
  product: (id: number) => ['products', id] as const,
  analytics: ['analytics'] as const,
} as const;

// User hooks
export const useUsers = (params?: { search?: string; skip?: number; limit?: number }) => {
  return useQuery({
    queryKey: [...queryKeys.users, params],
    queryFn: () => apiClient.getUsers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (previousData) => previousData,
  });
};

export const useUser = (userId: number) => {
  return useQuery({
    queryKey: queryKeys.user(userId),
    queryFn: () => apiClient.getUserById(userId),
    enabled: !!userId,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: any) => apiClient.createUser(userData),
    onSuccess: (newUser) => {
      // Invalidate users list to refresh data
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      toast.success(`User ${newUser.username} created successfully`);
    },
    onError: (error: any) => {
      const message = error?.data?.detail || 'Failed to create user';
      toast.error(message);
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, userData }: { userId: number; userData: any }) =>
      apiClient.updateUser(userId, userData),
    onSuccess: (updatedUser, variables) => {
      // Update specific user in cache
      queryClient.setQueryData(queryKeys.user(variables.userId), updatedUser);
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      toast.success('User updated successfully');
    },
    onError: (error: any) => {
      const message = error?.data?.detail || 'Failed to update user';
      toast.error(message);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => apiClient.deleteUser(userId),
    onSuccess: (_, deletedUserId) => {
      // Remove user from cache
      queryClient.removeQueries({ queryKey: queryKeys.user(deletedUserId) });
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      toast.success('User deleted successfully');
    },
    onError: (error: any) => {
      const message = error?.data?.detail || 'Failed to delete user';
      toast.error(message);
    },
  });
};

// Client hooks
export const useClients = (params?: { search?: string; skip?: number; limit?: number }) => {
  return useQuery({
    queryKey: [...queryKeys.clients, params],
    queryFn: () => apiClient.getClients(params),
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (clientData: any) => apiClient.createClient(clientData),
    onSuccess: (newClient) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients });
      toast.success(`Client ${newClient.first_name} ${newClient.last_name} created successfully`);
    },
    onError: (error: any) => {
      const message = error?.data?.detail || 'Failed to create client';
      toast.error(message);
    },
  });
};

// Commission hooks
export const useCommissions = (params?: {
  status?: string;
  userId?: number;
  skip?: number;
  limit?: number
}) => {
  return useQuery({
    queryKey: [...queryKeys.commissions, params],
    queryFn: () => apiClient.getCommissions(params),
    staleTime: 2 * 60 * 1000, // 2 minutes (more frequent updates for financial data)
    placeholderData: (previousData) => previousData,
  });
};

export const useCreateCommission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commissionData: any) => apiClient.createCommission(commissionData),
    onSuccess: (newCommission) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.commissions });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics });
      toast.success(`Commission of £${newCommission.amount} created successfully`);
    },
    onError: (error: any) => {
      const message = error?.data?.detail || 'Failed to create commission';
      toast.error(message);
    },
  });
};

// Product hooks
export const useProducts = (params?: { type?: string; skip?: number; limit?: number }) => {
  return useQuery({
    queryKey: [...queryKeys.products, params],
    queryFn: () => apiClient.getProducts(params),
    staleTime: 10 * 60 * 1000, // 10 minutes (products change less frequently)
    placeholderData: (previousData) => previousData,
  });
};

// Analytics hooks
export const useAnalytics = (params?: {
  dateFrom?: string;
  dateTo?: string;
  type?: string
}) => {
  return useQuery({
    queryKey: [...queryKeys.analytics, params],
    queryFn: () => apiClient.getAnalytics(params),
    staleTime: 1 * 60 * 1000, // 1 minute (analytics need frequent updates)
    placeholderData: (previousData) => previousData,
  });
};

// Utility hooks
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};
