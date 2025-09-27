      {/* Commissions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Commissions</CardTitle>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            data={data.commissions}
            columns={columns}
            pagination={true}
            searchable={true}
          />
        </CardContent>
      </Card>
 */

import React, { useState, useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  Button,
  DataTable,
  cn
} from '../ui';

interface Commission {
  id: string;
  consultant: string;
  product: string;
  amount: number;
  status: 'pending' | 'paid' | 'processing';
  date: string;
}

interface FinancialsData {
  totalRevenue: number;
  monthlyGrowth: number;
  commissions: Commission[];
  metrics: {
    totalCommissions: number;
    pendingAmount: number;
    paidAmount: number;
  };
}

const ModernFinancials: React.FC = () => {
  const [data, setData] = useState<FinancialsData>({
    totalRevenue: 0,
    monthlyGrowth: 0,
    commissions: [],
    metrics: {
      totalCommissions: 0,
      pendingAmount: 0,
      paidAmount: 0
    }
  });
  const [loading, setLoading] = useState<boolean>(true);

  // Mock data load
  useEffect(() => {
    const fetchData = async () => {
      // Simulate API call
      setTimeout(() => {
        const mockData: FinancialsData = {
          totalRevenue: 456789.12,
          monthlyGrowth: 12.5,
          commissions: [
            {
              id: '1',
              consultant: 'John Smith',
              product: 'Life Insurance',
              amount: 2500.00,
              status: 'paid',
              date: '2024-12-20'
            },
            {
              id: '2',
              consultant: 'Sarah Johnson',
              product: 'Auto Insurance',
              amount: 1850.50,
              status: 'pending',
              date: '2024-12-21'
            },
            {
              id: '3',
              consultant: 'Mike Brown',
              product: 'Home Insurance',
              amount: 3200.75,
              status: 'processing',
              date: '2024-12-22'
            }
          ],
          metrics: {
            totalCommissions: 7551.25,
            pendingAmount: 1850.50,
            paidAmount: 5700.75
          }
        };
        setData(mockData);
        setLoading(false);
      }, 1000);
    };

    fetchData();
  }, []);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  const getStatusColor = (status: Commission['status']): string => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Column definitions with proper typing
  const columns: ColumnDef<Commission>[] = [
    {
      accessorKey: 'consultant',
      header: 'Consultant',
      cell: ({ row }) => (
        <div className="font-medium text-gray-900">
          {row.original.consultant}
        </div>
      )
    },
    {
      accessorKey: 'product',
      header: 'Product',
      cell: ({ row }) => (
        <div className="text-gray-700">
          {row.original.product}
        </div>
      )
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => (
        <div className="font-semibold text-gray-900">
          {formatCurrency(row.original.amount)}
        </div>
      )
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <span className={cn(
          'px-2 py-1 rounded-full text-xs font-medium',
          getStatusColor(row.original.status)
        )}>
          {row.original.status}
        </span>
      )
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => (
        <div className="text-sm text-gray-500">
          {new Date(row.original.date).toLocaleDateString()}
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-32" />
          ))}
        </div>
        <div className="bg-gray-200 rounded-lg h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="transform hover:scale-105 transition-transform duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(data.totalRevenue)}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-xl">💰</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm">
                <span className={cn(
                  'font-medium',
                  data.monthlyGrowth > 0 ? 'text-green-600' : 'text-red-600'
                )}>
                  {data.monthlyGrowth > 0 ? '+' : ''}{data.monthlyGrowth}%
                </span>
                <span className="text-gray-500 ml-1">vs last month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transform hover:scale-105 transition-transform duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Commissions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(data.metrics.totalCommissions)}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-xl">📊</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transform hover:scale-105 transition-transform duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Amount</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(data.metrics.pendingAmount)}
                </p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 text-xl">⏳</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

          </Card>
        )}
      </div>
    </div>
  );
};

export default ModernFinancials;
