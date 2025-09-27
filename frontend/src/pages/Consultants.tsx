import React, { useState, useEffect, useMemo } from 'react';
import { Users, Plus, Search, Mail, Phone, TrendingUp, DollarSign, Star } from 'lucide-react';

// Импортируем только существующие компоненты
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  DataTable,
  Input
} from '../components/ui';
import api from '../services/api';
import Layout from '../components/layout/Layout';
import '../styles/global-design-system.css';

// Типизация для консультантов
interface Consultant {
  id: string;
  full_name: string; // Обновлено для соответствия API
  email: string;
  username: string; // Добавлено из API
  role: string; // Обновлено
  is_active: boolean; // Обновлено
  created_at: string; // Обновлено
  // Моковые поля, которых нет в API, но которые могут быть полезны
  phone?: string;
  totalSales?: number;
  totalCommission?: number;
  rating?: number;
}

interface ConsultantData {
  totalConsultants: number;
  activeConsultants: number;
  totalSales: number; // Это значение нужно будет считать отдельно
  averageRating: number; // Это значение нужно будет считать отдельно
  consultants: Consultant[];
}

const Consultants: React.FC = () => {
  const [data, setData] = useState<ConsultantData>({
    totalConsultants: 0,
    activeConsultants: 0,
    totalSales: 54350, // Моковое значение
    averageRating: 4.5, // Моковое значение
    consultants: []
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    fetchConsultants();
  }, []);

  const fetchConsultants = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users/');
      // Фильтруем, чтобы оставить только консультантов
      const consultantsData: Consultant[] = response.data.filter((user: any) =>
        ['adviser', 'insurance_consultant', 'mortgage_broker'].includes(user.role)
      ).map((user: any) => ({ // Приводим к нашему интерфейсу
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        username: user.username,
        role: user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        is_active: user.is_active,
        created_at: user.created_at,
        // Добавляем моковые данные для полноты
        phone: '+44 20 1234 5678',
        totalSales: Math.floor(Math.random() * 50000),
        rating: (Math.random() * (5 - 3) + 3).toFixed(1)
      }));

      setData(prevData => ({
        ...prevData,
        consultants: consultantsData,
        totalConsultants: consultantsData.length,
        activeConsultants: consultantsData.filter(c => c.is_active).length
      }));
    } catch (error) {
      console.error('Ошибка загрузки консультантов:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  const consultantColumns = useMemo(() => [
    {
      accessorKey: 'full_name',
      header: 'Consultant',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-medium">
              {row.original.full_name.split(' ').map((n: string) => n[0]).join('')}
            </span>
          </div>
          <div>
            <div className="font-medium">{row.original.full_name}</div>
            <div className="text-sm text-gray-500">{row.original.role}</div>
          </div>
        </div>
      )
    },
    {
      accessorKey: 'email',
      header: 'Contact',
      cell: ({ row }: any) => (
        <div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="text-sm">{row.original.email}</span>
          </div>
          {row.original.phone && (
            <div className="flex items-center gap-2 mt-1">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">{row.original.phone}</span>
            </div>
          )}
        </div>
      )
    },
    {
      accessorKey: 'totalSales',
      header: 'Total Sales',
      cell: ({ row }: any) => formatCurrency(row.original.totalSales || 0)
    },
    {
      accessorKey: 'rating',
      header: 'Rating',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-400" />
          <span className="font-medium">{row.original.rating}</span>
        </div>
      )
    },
    {
      accessorKey: 'is_active',
      header: 'Status',
      cell: ({ row }: any) => {
        const isActive = row.original.is_active;
        const statusClass = isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>
            {isActive ? 'Active' : 'Inactive'}
          </span>
        );
      }
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline">Edit</Button>
          <Button size="sm" variant="outline">Clients</Button>
        </div>
      )
    }
  ], []);

  const filteredConsultants = useMemo(() => data.consultants.filter(consultant =>
    consultant.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    consultant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    consultant.role.toLowerCase().includes(searchTerm.toLowerCase())
  ), [data.consultants, searchTerm]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Consultants</h1>
            <p className="text-gray-600 mt-1">Manage your team of consultants</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Consultant
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold">{data.totalConsultants}</div>
                  <div className="text-gray-500">Total Consultants</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold">{data.activeConsultants}</div>
                  <div className="text-gray-500">Active Consultants</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold">{formatCurrency(data.totalSales)}</div>
                  <div className="text-gray-500">Total Sales</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="w-8 h-8 text-orange-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold">{data.averageRating}</div>
                  <div className="text-gray-500">Average Rating</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Consultants ({filteredConsultants.length})</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search consultants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              data={filteredConsultants}
              columns={consultantColumns}
              pagination={true}
              searchable={false}
            />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Consultants;
