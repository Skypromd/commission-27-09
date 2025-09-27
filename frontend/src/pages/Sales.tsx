import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Calendar, Users, Plus, Filter, Download } from 'lucide-react';

// Импортируем только существующие компоненты
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  DataTable
} from '../components/ui';
import Layout from '../components/layout/Layout';
import '../styles/global-design-system.css';

// Типизация для продаж
interface Transaction {
  id: string;
  clientName: string;
  productName: string;
  amount: number;
  commission: number;
  status: 'completed' | 'pending' | 'cancelled';
  date: string;
}

interface TopProduct {
  id: string;
  name: string;
  category: string;
  sales: number;
  revenue: number;
}

interface SalesData {
  totalSales: number;
  totalRevenue: number;
  averageOrderValue: number;
  conversionRate: number;
  recentTransactions: Transaction[];
  topProducts: TopProduct[];
}

const Sales: React.FC = () => {
  const [data, setData] = useState<SalesData>({
    totalSales: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    conversionRate: 0,
    recentTransactions: [],
    topProducts: []
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Моковые данные
    const mockData: SalesData = {
      totalSales: 1456,
      totalRevenue: 2456789,
      averageOrderValue: 1687,
      conversionRate: 23.5,
      recentTransactions: [
        {
          id: '1',
          clientName: 'John Smith',
          productName: 'Premium Life Insurance',
          amount: 2500,
          commission: 375,
          status: 'completed',
          date: '2024-12-20'
        },
        {
          id: '2',
          clientName: 'Sarah Johnson',
          productName: 'Health Shield Plus',
          amount: 1800,
          commission: 216,
          status: 'completed',
          date: '2024-12-19'
        },
        {
          id: '3',
          clientName: 'Mike Brown',
          productName: 'Home Protection',
          amount: 1200,
          commission: 120,
          status: 'pending',
          date: '2024-12-18'
        }
      ],
      topProducts: [
        { id: '1', name: 'Premium Life Insurance', category: 'Life', sales: 234, revenue: 585000 },
        { id: '2', name: 'Health Shield Plus', category: 'Health', sales: 189, revenue: 340200 },
        { id: '3', name: 'Home Protection', category: 'Property', sales: 156, revenue: 187200 }
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

  const transactionColumns = [
    { accessorKey: 'clientName', header: 'Client' },
    { accessorKey: 'productName', header: 'Product' },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }: any) => formatCurrency(row.original.amount)
    },
    {
      accessorKey: 'commission',
      header: 'Commission',
      cell: ({ row }: any) => formatCurrency(row.original.commission)
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: any) => {
        const status = row.original.status;
        const statusClass = status === 'completed' ? 'bg-green-100 text-green-800' :
                          status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800';
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>
            {status}
          </span>
        );
      }
    },
    { accessorKey: 'date', header: 'Date' }
  ];

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
            <h1 className="text-3xl font-bold text-gray-900">Sales</h1>
            <p className="text-gray-600 mt-1">Track your sales performance and transactions</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Sale
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold">{data.totalSales}</div>
                  <div className="text-gray-500">Total Sales</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold">{formatCurrency(data.totalRevenue)}</div>
                  <div className="text-gray-500">Total Revenue</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold">{formatCurrency(data.averageOrderValue)}</div>
                  <div className="text-gray-500">Avg Order Value</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-orange-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold">{data.conversionRate}%</div>
                  <div className="text-gray-500">Conversion Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.topProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.category}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{product.sales} sales</div>
                      <div className="text-sm text-green-600">{formatCurrency(product.revenue)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sales Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Sales Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-gray-500">Chart visualization coming soon...</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={data.recentTransactions}
              columns={transactionColumns}
              pagination={true}
              searchable={true}
            />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Sales;
