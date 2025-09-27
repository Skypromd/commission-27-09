import React, { useState, useEffect, useMemo } from 'react';
import { Users, Mail, Phone, Building, MapPin, Plus, Search, Eye, Edit, TrendingUp, DollarSign } from 'lucide-react';

// Импортируем только существующие компоненты
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  DataTable,
  Input // Предполагаем наличие компонента Input для консистентности
import Layout from '../components/layout/Layout';
import '../styles/global-design-system.css';

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

interface ClientData {
  totalClients: number;
  activeClients: number;
  totalPremium: number;
  averagePremium: number;
  clients: Client[];
}

const Clients: React.FC = () => {
  const [data, setData] = useState<ClientData>({
    totalClients: 0,
    activeClients: 0,
    totalPremium: 0,
    averagePremium: 0,
    clients: []
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    // Моковые данные для демонстрации
    const mockData: ClientData = {
      totalClients: 156,
      activeClients: 142,
      totalPremium: 1245678,
      averagePremium: 7982,
      clients: [
        {
          id: '1',
          name: 'John Smith',
          email: 'john.smith@email.com',
          phone: '+44 20 1234 5678',
          company: 'Smith & Associates',
          address: 'London, UK',
          totalPolicies: 3,
          totalPremium: 2450,
          status: 'active',
          registrationDate: '2024-01-15',
          lastContact: '2024-12-18',
          assignedAdvisor: 'Sarah Johnson'
        },
        {
          id: '2',
          name: 'Emily Davis',
          email: 'emily.davis@email.com',
          phone: '+44 20 2345 6789',
          company: 'Davis Corporation',
          address: 'Manchester, UK',
          totalPolicies: 5,
          totalPremium: 3750,
          status: 'active',
          registrationDate: '2024-02-20',
          lastContact: '2024-12-15',
          assignedAdvisor: 'Michael Brown'
        },
        {
          id: '3',
          name: 'Robert Wilson',
          email: 'robert.wilson@email.com',
          phone: '+44 20 3456 7890',
          address: 'Birmingham, UK',
          totalPolicies: 2,
          totalPremium: 1850,
          status: 'prospective',
          registrationDate: '2024-12-10',
          lastContact: '2024-12-10'
        }
      ]
    };

    setData(mockData);
    setLoading(false);
  }, []);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  const clientColumns = [
  const clientColumns = useMemo(() => [
      accessorKey: 'name',
      header: 'Client',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-medium">
              {row.original.name.split(' ').map((n: string) => n[0]).join('')}
            </span>
          </div>
          <div>
            <div className="font-medium">{row.original.name}</div>
            {row.original.company && (
              <div className="text-sm text-gray-500">{row.original.company}</div>
            )}
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
          <div className="flex items-center gap-2 mt-1">
            <Phone className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">{row.original.phone}</span>
          </div>
        </div>
      )
    },
    {
      accessorKey: 'totalPolicies',
      header: 'Policies',
      cell: ({ row }: any) => (
        <div>
          <div className="font-medium">{row.original.totalPolicies} policies</div>
          <div className="text-sm text-green-600">
            {formatCurrency(row.original.totalPremium)}
          </div>
        </div>
      )
    },
    {
      accessorKey: 'assignedAdvisor',
      header: 'Advisor',
      cell: ({ row }: any) => row.original.assignedAdvisor || 'Unassigned'
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: any) => {
        const status = row.original.status;
        const statusClass = {
          active: 'bg-green-100 text-green-800',
          inactive: 'bg-red-100 text-red-800',
          prospective: 'bg-blue-100 text-blue-800'
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass[status as keyof typeof statusClass]}`}>
            {status}
          </span>
        );
      }
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Eye className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline">
            <Edit className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline">
            <Mail className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];
  ], []);
  const filteredClients = data.clients.filter(client => {
  const filteredClients = useMemo(() => data.clients.filter(client => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = client.name.toLowerCase().includes(searchTermLower) ||
                         client.email.toLowerCase().includes(searchTermLower) ||
                         client.company?.toLowerCase().includes(searchTermLower);
  });

  }), [data.clients, searchTerm, statusFilter]);
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
            <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
            <p className="text-gray-600 mt-1">Manage your client relationships and information</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Client
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold">{data.totalClients}</div>
                  <div className="text-gray-500">Total Clients</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold">{data.activeClients}</div>
                  <div className="text-gray-500">Active Clients</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold">{formatCurrency(data.totalPremium)}</div>
                  <div className="text-gray-500">Total Premium</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building className="w-8 h-8 text-orange-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold">{formatCurrency(data.averagePremium)}</div>
                  <div className="text-gray-500">Avg Premium</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
              className="pl-10 pr-4 py-2 w-full"

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="prospective">Prospective</option>
          </select>
        </div>

        {/* Clients Table */}
        <Card>
          <CardHeader>
            <CardTitle>Clients ({filteredClients.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={filteredClients}
              columns={clientColumns}
              pagination={true}
              searchable={false}
            />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Clients;
