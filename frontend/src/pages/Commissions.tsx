import React, { useState, useEffect, useMemo } from 'react';
import { DollarSign, TrendingUp, Users, Calculator, Plus, Search, Filter, Download } from 'lucide-react';

// Импортируем только существующие компоненты
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  DataTable,
  Input // Предполагаем наличие компонента Input
} from '../components/ui';
import Layout from '../components/layout/Layout';
import '../styles/global-design-system.css';

// Типизация для комиссий
interface Commission {
  id: string;
  advisorName: string;
  productName: string;
  clientName: string;
  saleAmount: number;
  commissionRate: number;
  commissionAmount: number;
  status: 'pending' | 'paid' | 'processing' | 'cancelled';
  saleDate: string;
  paymentDate?: string;
}

interface CommissionData {
  totalCommissions: number;
  pendingCommissions: number;
  paidCommissions: number;
  averageRate: number;
  commissions: Commission[];
}

const Commissions: React.FC = () => {
  const [data, setData] = useState<CommissionData>({
    totalCommissions: 0,
    pendingCommissions: 0,
    paidCommissions: 0,
    averageRate: 0,
    commissions: []
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    // Моковые данные для демонстрации
    const mockData: CommissionData = {
      totalCommissions: 45678.90,
      pendingCommissions: 12345.60,
      paidCommissions: 33333.30,
      averageRate: 8.5,
      commissions: [
        {
          id: '1',
          advisorName: 'John Smith',
          productName: 'Premium Life Insurance',
          clientName: 'Alice Johnson',
          saleAmount: 5000,
          commissionRate: 12.5,
          commissionAmount: 625,
          status: 'paid',
          saleDate: '2024-12-15',
          paymentDate: '2024-12-20'
        },
        {
          id: '2',
          advisorName: 'Sarah Davis',
          productName: 'Auto Insurance Plus',
          clientName: 'Bob Wilson',
          saleAmount: 2400,
          commissionRate: 8.0,
          commissionAmount: 192,
          status: 'pending',
          saleDate: '2024-12-18'
        },
        {
          id: '3',
          advisorName: 'Michael Brown',
          productName: 'Home Protection',
          clientName: 'Carol Miller',
          saleAmount: 3200,
          commissionRate: 10.0,
          commissionAmount: 320,
          status: 'processing',
          saleDate: '2024-12-20'
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

  const filteredCommissions = useMemo(() => data.commissions.filter(commission => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = commission.advisorName.toLowerCase().includes(searchTermLower) ||
                         commission.productName.toLowerCase().includes(searchTermLower) ||
                         commission.clientName.toLowerCase().includes(searchTermLower);
    const matchesStatus = statusFilter === 'all' || commission.status === statusFilter;
    return matchesSearch && matchesStatus;
  }), [data.commissions, searchTerm, statusFilter]);

  const commissionColumns = useMemo(() => [
    { accessorKey: 'advisorName', header: 'Advisor' },
    { accessorKey: 'productName', header: 'Product' },
    { accessorKey: 'clientName', header: 'Client' },
    {
      accessorKey: 'saleAmount',
      header: 'Sale Amount',
      cell: ({ row }: any) => formatCurrency(row.original.saleAmount)
    },
    {
      accessorKey: 'commissionRate',
      header: 'Rate',
      cell: ({ row }: any) => `${row.original.commissionRate}%`
    },
    {
      accessorKey: 'commissionAmount',
      header: 'Commission',
      cell: ({ row }: any) => formatCurrency(row.original.commissionAmount)
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: any) => {
        const status = row.original.status;
        const statusClass = {
          paid: 'bg-green-100 text-green-800',
          pending: 'bg-yellow-100 text-yellow-800',
          processing: 'bg-blue-100 text-blue-800',
          cancelled: 'bg-red-100 text-red-800'
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass[status as keyof typeof statusClass]}`}>
            {status}
          </span>
        );
      }
    },
    { accessorKey: 'saleDate', header: 'Sale Date' }
  ], []);

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
            <h1 className="text-3xl font-bold text-gray-900">Commission Management</h1>
            <p className="text-gray-600 mt-1">Track and manage advisor commissions</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Calculator className="w-4 h-4 mr-2" />
              Calculate
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Commission
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold">{formatCurrency(data.totalCommissions)}</div>
                  <div className="text-gray-500">Total Commissions</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold">{formatCurrency(data.paidCommissions)}</div>
                  <div className="text-gray-500">Paid Commissions</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold">{formatCurrency(data.pendingCommissions)}</div>
                  <div className="text-gray-500">Pending Commissions</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calculator className="w-8 h-8 text-orange-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold">{data.averageRate}%</div>
                  <div className="text-gray-500">Average Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search commissions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>

        {/* Commissions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Commissions ({filteredCommissions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={filteredCommissions}
              columns={commissionColumns}
              pagination={true}
              searchable={false}
            />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Commissions;
