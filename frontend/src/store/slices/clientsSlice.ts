import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';

// Типизация для клиентов
interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  address: string;
  totalPolicies: number;
  totalPremium: number;
  status: 'active' | 'inactive' | 'prospective';
  registrationDate: string;
  lastContact: string;
  assignedAdvisor?: string;
}

interface ClientsFilters {
  search: string;
  status: string;
  adviser: string;
}

interface ClientsPagination {
  page: number;
  limit: number;
  total: number;
}

interface CachedData {
  data: Client[];
  timestamp: number;
}

interface ClientsState {
  items: Client[];
  loading: boolean;
  error: string | null;
  cache: Record<string, CachedData>;
  filters: ClientsFilters;
  pagination: ClientsPagination;
  selectedClient: Client | null;
}

interface FetchClientsParams {
  search?: string;
  status?: string;
  adviser?: string;
  page?: number;
  limit?: number;
}

interface ApiError {
  message: string;
  status?: number;
  data?: any;
}

// Правильная типизация для Redux state
interface RootState {
  clients: ClientsState;
}

// Async thunks с кэшированием
export const fetchClients = createAsyncThunk<
  { data: Client[]; cacheKey: string; timestamp: number },
  FetchClientsParams,
  { rejectValue: ApiError; state: RootState }
>(
  'clients/fetchClients',
  async (params = {}, { rejectWithValue, getState }) => {
    try {
      // Проверяем кэш
      const state = getState();
      const cacheKey = JSON.stringify(params);
      const cachedData = state.clients.cache[cacheKey];

      if (cachedData && Date.now() - cachedData.timestamp < 300000) { // 5 минут
        return {
          data: cachedData.data,
          cacheKey,
          timestamp: cachedData.timestamp
        };
      }

      const response = await api.get('/clients/', { params });
      return {
        data: response.data,
        cacheKey,
        timestamp: Date.now()
      };
    } catch (error: any) {
      return rejectWithValue({
        message: error?.message || 'Unknown error',
        status: error?.response?.status,
        data: error?.response?.data
      });
    }
  }
);

export const createClient = createAsyncThunk<
  Client,
  Partial<Client>,
  { rejectValue: ApiError }
>(
  'clients/createClient',
  async (clientData, { rejectWithValue }) => {
    try {
      const response = await api.post('/clients/', clientData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error?.message || 'Failed to create client',
        status: error?.response?.status,
        data: error?.response?.data
      });
    }
  }
);

export const updateClient = createAsyncThunk<
  Client,
  { id: string; data: Partial<Client> },
  { rejectValue: ApiError }
>(
  'clients/updateClient',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/clients/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error?.message || 'Failed to update client',
        status: error?.response?.status,
        data: error?.response?.data
      });
    }
  }
);

export const deleteClient = createAsyncThunk<
  string,
  string,
  { rejectValue: ApiError }
>(
  'clients/deleteClient',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/clients/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue({
        message: error?.message || 'Failed to delete client',
        status: error?.response?.status,
        data: error?.response?.data
      });
    }
  }
);

// Начальное состояние
const initialState: ClientsState = {
  items: [],
  loading: false,
  error: null,
  cache: {},
  filters: {
    search: '',
    status: '',
    adviser: ''
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0
  },
  selectedClient: null
};

// Slice
const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<ClientsFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPagination: (state, action: PayloadAction<Partial<ClientsPagination>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setSelectedClient: (state, action: PayloadAction<Client | null>) => {
      state.selectedClient = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCache: (state) => {
      state.cache = {};
    }
  },
  extraReducers: (builder) => {
    // Fetch clients
    builder
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.cache[action.payload.cacheKey] = {
          data: action.payload.data,
          timestamp: action.payload.timestamp
        };
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch clients';
      })

    // Create client
    builder
      .addCase(createClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createClient.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
        state.cache = {}; // Clear cache
      })
      .addCase(createClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create client';
      })

    // Update client
    builder
      .addCase(updateClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateClient.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(client => client.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.cache = {}; // Clear cache
        if (state.selectedClient?.id === action.payload.id) {
          state.selectedClient = action.payload;
        }
      })
      .addCase(updateClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update client';
      })

    // Delete client
    builder
      .addCase(deleteClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(client => client.id !== action.payload);
        state.cache = {}; // Clear cache
        if (state.selectedClient?.id === action.payload) {
          state.selectedClient = null;
        }
      })
      .addCase(deleteClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete client';
      });
  }
});

export const {
  setFilters,
  setPagination,
  setSelectedClient,
  clearError,
  clearCache
} = clientsSlice.actions;

export default clientsSlice.reducer;

// Селекторы
export const selectClients = (state: RootState) => state.clients.items;
export const selectClientsLoading = (state: RootState) => state.clients.loading;
export const selectClientsError = (state: RootState) => state.clients.error;
export const selectClientsFilters = (state: RootState) => state.clients.filters;
export const selectClientsPagination = (state: RootState) => state.clients.pagination;
export const selectSelectedClient = (state: RootState) => state.clients.selectedClient;

// Типы для экспорта
export type { Client, ClientsState, ClientsFilters, ClientsPagination };
