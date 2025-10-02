import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

// Типизация для продуктов
interface Product {
  id: number;
  name: string;
  provider: string;
  category: string;
  commissionRate: number;
  baseRate: number;
  description: string;
  status: 'Active' | 'Inactive' | 'Pending';
  minPremium: number;
  maxPremium: number;
  createdAt: string;
  updatedAt: string;
}

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProduct: (id: number, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
}

export const useProducts = (): UseProductsReturn => {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Mock данные продуктов
  const mockProducts: Product[] = [
    {
      id: 1,
      name: 'Term Life Insurance',
      provider: 'Legal & General',
      category: 'Life Insurance',
      commissionRate: 3.5,
      baseRate: 2.0,
      description: 'Comprehensive term life insurance with flexible coverage options',
      status: 'Active',
      minPremium: 100,
      maxPremium: 10000,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20'
    },
    {
      id: 2,
      name: 'Whole of Life Insurance',
      provider: 'Aviva',
      category: 'Life Insurance',
      commissionRate: 4.2,
      baseRate: 2.5,
      description: 'Permanent life insurance with investment component',
      status: 'Active',
      minPremium: 200,
      maxPremium: 50000,
      createdAt: '2024-01-10',
      updatedAt: '2024-01-18'
    },
    {
      id: 3,
      name: 'Critical Illness Cover',
      provider: 'Vitality',
      category: 'Life Insurance',
      commissionRate: 5.0,
      baseRate: 3.0,
      description: 'Protection against serious illnesses and conditions',
      status: 'Active',
      minPremium: 150,
      maxPremium: 15000,
      createdAt: '2024-01-12',
      updatedAt: '2024-01-22'
    },
    {
      id: 4,
      name: 'Motor Insurance Comprehensive',
      provider: 'Direct Line',
      category: 'Motor Insurance',
      commissionRate: 2.8,
      baseRate: 1.5,
      description: 'Full comprehensive motor insurance coverage',
      status: 'Active',
      minPremium: 300,
      maxPremium: 5000,
      createdAt: '2024-01-08',
      updatedAt: '2024-01-25'
    },
    {
      id: 5,
      name: 'Home Insurance Plus',
      provider: 'Churchill',
      category: 'Home Insurance',
      commissionRate: 3.0,
      baseRate: 2.0,
      description: 'Enhanced home insurance with additional benefits',
      status: 'Active',
      minPremium: 200,
      maxPremium: 8000,
      createdAt: '2024-01-05',
      updatedAt: '2024-01-19'
    },
    {
      id: 6,
      name: 'Travel Insurance Annual',
      provider: 'AXA',
      category: 'Travel Insurance',
      commissionRate: 6.0,
      baseRate: 4.0,
      description: 'Annual multi-trip travel insurance',
      status: 'Inactive',
      minPremium: 50,
      maxPremium: 1000,
      createdAt: '2024-01-03',
      updatedAt: '2024-01-16'
    }
  ];

  // Симуляция загрузки данных
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        // Симуляция API запроса
        await new Promise(resolve => setTimeout(resolve, 1000));
        setProducts(mockProducts);
      } catch (err) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token]);

  // Добавление продукта
  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Симуляция API запроса
      await new Promise(resolve => setTimeout(resolve, 500));

      const newProduct: Product = {
        ...productData,
        id: Math.max(...products.map(p => p.id), 0) + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setProducts(prev => [newProduct, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Обновление продукта
  const updateProduct = async (id: number, updates: Partial<Product>): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Симуляция API запроса
      await new Promise(resolve => setTimeout(resolve, 500));

      setProducts(prev => prev.map(product =>
        product.id === id
          ? { ...product, ...updates, updatedAt: new Date().toISOString() }
          : product
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Удаление продукта
  const deleteProduct = async (id: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Симуляция API запроса
      await new Promise(resolve => setTimeout(resolve, 500));

      setProducts(prev => prev.filter(product => product.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Обновление данных
  const refetch = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProducts(mockProducts);
    } catch (err) {
      setError('Failed to reload products');
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    loading,
    error,
    refetch,
    addProduct,
    updateProduct,
    deleteProduct
  };
};

// Дополнительные хуки для работы с продуктами
export const useProduct = (id: number) => {
  const { products, loading, error } = useProducts();
  const product = products.find(p => p.id === id);

  return {
    product: product || null,
    loading,
    error: product ? null : 'Product not found'
  };
};

export const useProductsByCategory = (category: string) => {
  const { products, loading, error, ...rest } = useProducts();
  const filteredProducts = products.filter(p => p.category === category);

  return {
    products: filteredProducts,
    loading,
    error,
    ...rest
  };
};

// Экспорт типов
export type { Product, UseProductsReturn };
