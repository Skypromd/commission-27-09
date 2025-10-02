import React, { useState, useEffect } from 'react';
import { Building2, TrendingUp, Users, PieChart, Plus } from 'lucide-react';

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

// Типизация для страховых данных
interface InsuranceProduct {
  id: string;
  name: string;
  type: 'life' | 'health' | 'property' | 'auto';
  premium: number;
  coverage: number;
  clients: number;
  status: 'active' | 'inactive';
}

interface InsuranceData {
  totalPolicies: number;
  totalPremiums: number;
  activePolicies: number;
  claimsRatio: number;
  products: InsuranceProduct[];
}

const Insurances: React.FC = () => {
  const [data, setData] = useState<InsuranceData>({
    totalPolicies: 0,
    totalPremiums: 0,
    activePolicies: 0,
    claimsRatio: 0,
    products: []
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('overview');

  useEffect(() => {
    // Моковые данные
    const mockData: InsuranceData = {
      totalPolicies: 1543,
      totalPremiums: 2456789,
      activePolicies: 1234,
      claimsRatio: 12.5,
      products: [
        { id: '1', name: 'Life Insurance Plus', type: 'life', premium: 250, coverage: 100000, clients: 450, status: 'active' },
        { id: '2', name: 'Health Shield', type: 'health', premium: 180, coverage: 50000, clients: 320, status: 'active' },
        { id: '3', name: 'Home Protect', type: 'property', premium: 120, coverage: 300000, clients: 280, status: 'active' }
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

  const productColumns = [
    { accessorKey: 'name', header: 'Product Name' },
    { accessorKey: 'type', header: 'Type' },
    {
      accessorKey: 'premium',
      header: 'Premium',
      cell: ({ row }: any) => formatCurrency(row.original.premium)
    },
    {
      accessorKey: 'coverage',
      header: 'Coverage',
      cell: ({ row }: any) => formatCurrency(row.original.coverage)
    },
    { accessorKey: 'clients', header: 'Clients' },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: any) => {
        const status = row.original.status;
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {status}
          </span>
        );
      }
    }
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
            <h1 className="text-3xl font-bold text-gray-900">Insurance Management</h1>
            <p className="text-gray-600 mt-1">Manage insurance products and policies</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Product
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building2 className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold">{data.totalPolicies}</div>
                  <div className="text-gray-500">Total Policies</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold">{formatCurrency(data.totalPremiums)}</div>
                  <div className="text-gray-500">Total Premiums</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold">{data.activePolicies}</div>
                  <div className="text-gray-500">Active Policies</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <PieChart className="w-8 h-8 text-orange-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold">{data.claimsRatio}%</div>
                  <div className="text-gray-500">Claims Ratio</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg w-fit mb-8">
          {['overview', 'products', 'claims', 'reports'].map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "ghost"}
              onClick={() => setActiveTab(tab)}
              className="capitalize"
            >
              {tab}
            </Button>
          ))}
        </div>

        {/* Content based on active tab */}
        {activeTab === 'products' && (
          <Card>
            <CardHeader>
              <CardTitle>Insurance Products</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                data={data.products}
                columns={productColumns}
                pagination={true}
                searchable={true}
              />
            </CardContent>
          </Card>
        )}

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.type}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{product.clients} clients</div>
                        <div className="text-sm text-green-600">{formatCurrency(product.premium)}/month</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Claims Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-gray-500">Claims chart coming soon...</div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'claims' && (
          <Card>
            <CardHeader>
              <CardTitle>Claims Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                Claims management functionality coming soon...
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'reports' && (
          <Card>
            <CardHeader>
              <CardTitle>Insurance Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                Insurance reports functionality coming soon...
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Insurances;
