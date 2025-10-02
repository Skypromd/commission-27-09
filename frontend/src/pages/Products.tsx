import React, { useState, useEffect } from 'react';
import { Package, TrendingUp, DollarSign, BarChart, Plus, Search, Filter, Download, Eye, Edit } from 'lucide-react';

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

// Типизация для продуктов
interface Product {
  id: string;
  name: string;
  category: 'life' | 'health' | 'property' | 'auto' | 'investment';
  price: number;
  commission: number;
  sales: number;
  status: 'active' | 'inactive' | 'draft';
  description: string;
  dateAdded: string;
}

interface ProductsData {
  totalProducts: number;
  totalSales: number;
  totalRevenue: number;
  averageCommission: number;
  products: Product[];
}

const Products: React.FC = () => {
  const [data, setData] = useState<ProductsData>({
    totalProducts: 0,
    totalSales: 0,
    totalRevenue: 0,
    averageCommission: 0,
    products: []
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    // Моковые данные
    const mockData: ProductsData = {
      totalProducts: 24,
      totalSales: 1456,
      totalRevenue: 2345678,
      averageCommission: 12.5,
      products: [
        {
          id: '1',
          name: 'Premium Life Insurance',
          category: 'life',
          price: 299.99,
          commission: 15.0,
          sales: 234,
          status: 'active',
          description: 'Comprehensive life insurance coverage',
          dateAdded: '2024-01-15'
        },
        {
          id: '2',
          name: 'Health Shield Plus',
          category: 'health',
          price: 199.99,
          commission: 12.0,
          sales: 189,
          status: 'active',
          description: 'Complete health insurance package',
          dateAdded: '2024-02-20'
        },
        {
          id: '3',
          name: 'Home Protection',
          category: 'property',
          price: 149.99,
          commission: 10.0,
          sales: 156,
          status: 'active',
          description: 'Comprehensive home insurance',
          dateAdded: '2024-03-10'
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

  const filteredProducts = data.products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const productColumns = [
    { accessorKey: 'name', header: 'Product Name' },
    { accessorKey: 'category', header: 'Category' },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }: any) => formatCurrency(row.original.price)
    },
    {
      accessorKey: 'commission',
      header: 'Commission',
      cell: ({ row }: any) => `${row.original.commission}%`
    },
    { accessorKey: 'sales', header: 'Sales' },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: any) => {
        const status = row.original.status;
        const statusClass = {
          active: 'bg-green-100 text-green-800',
          inactive: 'bg-red-100 text-red-800',
          draft: 'bg-yellow-100 text-yellow-800'
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
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm">
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      )
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
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600 mt-1">Manage your insurance products and offerings</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold">{data.totalProducts}</div>
                  <div className="text-gray-500">Total Products</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-green-600" />
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
                <DollarSign className="w-8 h-8 text-purple-600" />
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
                <BarChart className="w-8 h-8 text-orange-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold">{data.averageCommission}%</div>
                  <div className="text-gray-500">Avg Commission</div>
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
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="life">Life Insurance</option>
            <option value="health">Health Insurance</option>
            <option value="property">Property Insurance</option>
            <option value="auto">Auto Insurance</option>
            <option value="investment">Investment</option>
          </select>

          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>

          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>Products ({filteredProducts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={filteredProducts}
              columns={productColumns}
              pagination={true}
              searchable={false}
            />
          </CardContent>
        </Card>

        {/* Top Performing Products */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Top Performing Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.products
                .sort((a, b) => b.sales - a.sales)
                .slice(0, 3)
                .map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.category} • {product.commission}% commission</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{product.sales} sales</div>
                      <div className="text-sm text-green-600">{formatCurrency(product.price)}</div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Products;
