import { StateCreator } from 'zustand';
import { toast } from 'react-hot-toast';

export interface Advisor {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  totalSales: number;
  totalCommission: number;
  status: 'active' | 'inactive';
  joinDate: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  contactPerson: string;
  industry: string;
  totalPolicies: number;
  totalPremium: number;
  status: 'active' | 'inactive';
  registrationDate: string;
}

export interface Commission {
  id: string;
  advisorId: string;
  clientId: string;
  policyType: string;
  amount: number;
  percentage: number;
  status: 'pending' | 'approved' | 'paid';
  date: string;
}

export interface DataSlice {
  advisors: Advisor[];
  clients: Client[];
  commissions: Commission[];
  isLoading: boolean;

  // Actions
  fetchAdvisors: () => Promise<void>;
  addAdvisor: (advisor: Omit<Advisor, 'id'>) => Promise<void>;
  updateAdvisor: (id: string, updates: Partial<Advisor>) => Promise<void>;
  deleteAdvisor: (id: string) => Promise<void>;

  fetchClients: () => Promise<void>;
  addClient: (client: Omit<Client, 'id'>) => Promise<void>;
  updateClient: (id: string, updates: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;

  fetchCommissions: () => Promise<void>;
  addCommission: (commission: Omit<Commission, 'id'>) => Promise<void>;
  updateCommission: (id: string, updates: Partial<Commission>) => Promise<void>;
  deleteCommission: (id: string) => Promise<void>;
}

// Mock данные
const mockAdvisors: Advisor[] = [
  {
    id: '1',
    name: 'Иван Петров',
    email: 'ivan.petrov@example.com',
    phone: '+44 20 7946 0958',
    specialization: 'Автострахование',
    totalSales: 45,
    totalCommission: 12500,
    status: 'active',
    joinDate: '2023-01-15',
  },
  {
    id: '2',
    name: 'Мария Сидорова',
    email: 'maria.sidorova@example.com',
    phone: '+44 20 7946 0959',
    specialization: 'Страхование жизни',
    totalSales: 38,
    totalCommission: 15200,
    status: 'active',
    joinDate: '2023-02-20',
  },
];

const mockClients: Client[] = [
  {
    id: '1',
    name: 'ООО "Рога и Копыта"',
    email: 'info@rogaikopyta.co.uk',
    phone: '+44 20 7946 0960',
    contactPerson: 'Джон Смит',
    industry: 'Производство',
    totalPolicies: 5,
    totalPremium: 25000,
    status: 'active',
    registrationDate: '2023-03-10',
  },
  {
    id: '2',
    name: 'British Motors Ltd',
    email: 'contact@britishmotors.co.uk',
    phone: '+44 20 7946 0961',
    contactPerson: 'Эмили Джонсон',
    industry: 'Автомобильная',
    totalPolicies: 12,
    totalPremium: 45000,
    status: 'active',
    registrationDate: '2023-01-25',
  },
];

export const dataSlice: StateCreator<DataSlice> = (set: any, get: any) => ({
  advisors: [],
  clients: [],
  commissions: [],
  isLoading: false,

  // Advisors
  fetchAdvisors: async () => {
    set({ isLoading: true });

    try {
      // Симуляция API вызова
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ advisors: mockAdvisors, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      toast.error('Ошибка при загрузке консультантов');
    }
  },

  addAdvisor: async (advisor: Omit<Advisor, 'id'>) => {
    try {
      const newAdvisor: Advisor = {
        ...advisor,
        id: Date.now().toString(),
      };

      set((state: any) => ({
        advisors: [...state.advisors, newAdvisor]
      }));

      toast.success('Консультант успешно добавлен');
    } catch (error) {
      toast.error('Ошибка при добавлении консультанта');
    }
  },

  updateAdvisor: async (id: string, updates: Partial<Advisor>) => {
    try {
      set((state: any) => ({
        advisors: state.advisors.map((advisor: Advisor) =>
          advisor.id === id ? { ...advisor, ...updates } : advisor
        )
      }));

      toast.success('Консультант успешно обновлен');
    } catch (error) {
      toast.error('Ошибка при обновлении консультанта');
    }
  },

  deleteAdvisor: async (id: string) => {
    try {
      set((state: any) => ({
        advisors: state.advisors.filter((advisor: Advisor) => advisor.id !== id)
      }));

      toast.success('Консультант успешно удален');
    } catch (error) {
      toast.error('Ошибка при удалении консультанта');
    }
  },

  // Clients
  fetchClients: async () => {
    set({ isLoading: true });

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ clients: mockClients, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      toast.error('Ошибка при загрузке клиентов');
    }
  },

  addClient: async (client: Omit<Client, 'id'>) => {
    try {
      const newClient: Client = {
        ...client,
        id: Date.now().toString(),
      };

      set((state: any) => ({
        clients: [...state.clients, newClient]
      }));

      toast.success('Клиент успешно добавлен');
    } catch (error) {
      toast.error('Ошибка при добавлении клиента');
    }
  },

  updateClient: async (id: string, updates: Partial<Client>) => {
    try {
      set((state: any) => ({
        clients: state.clients.map((client: Client) =>
          client.id === id ? { ...client, ...updates } : client
        )
      }));

      toast.success('Клиент успешно обновлен');
    } catch (error) {
      toast.error('Ошибка при обновлении клиента');
    }
  },

  deleteClient: async (id: string) => {
    try {
      set((state: any) => ({
        clients: state.clients.filter((client: Client) => client.id !== id)
      }));

      toast.success('Клиент успешно удален');
    } catch (error) {
      toast.error('Ошибка при удалении клиента');
    }
  },

  // Commissions
  fetchCommissions: async () => {
    set({ isLoading: true });

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ commissions: [], isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      toast.error('Ошибка при загрузке комиссий');
    }
  },

  addCommission: async (commission: Omit<Commission, 'id'>) => {
    try {
      const newCommission: Commission = {
        ...commission,
        id: Date.now().toString(),
      };

      set((state: any) => ({
        commissions: [...state.commissions, newCommission]
      }));

      toast.success('Комиссия успешно добавлена');
    } catch (error) {
      toast.error('Ошибка при добавлении комиссии');
    }
  },

  updateCommission: async (id: string, updates: Partial<Commission>) => {
    try {
      set((state: any) => ({
        commissions: state.commissions.map((commission: Commission) =>
          commission.id === id ? { ...commission, ...updates } : commission
        )
      }));

      toast.success('Комиссия успешно обновлена');
    } catch (error) {
      toast.error('Ошибка при обновлении комиссии');
    }
  },

  deleteCommission: async (id: string) => {
    try {
      set((state: any) => ({
        commissions: state.commissions.filter((commission: Commission) => commission.id !== id)
      }));

      toast.success('Комиссия успешно удалена');
    } catch (error) {
      toast.error('Ошибка при удалении комиссии');
    }
  },
});
