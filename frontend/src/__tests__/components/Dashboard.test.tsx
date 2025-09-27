import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';

import Dashboard from '../../pages/Dashboard';

// Mock всех зависимостей
jest.mock('../../components/layout/Layout', () => {
  return function MockLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="layout">{children}</div>;
  };
});

jest.mock('../../components/ui', () => ({
  Card: ({ children, className }: { children: React.ReactNode; className?: string }) =>
    <div className={className} data-testid="card">{children}</div>,
  CardContent: ({ children }: { children: React.ReactNode }) =>
    <div data-testid="card-content">{children}</div>,
  CardHeader: ({ children }: { children: React.ReactNode }) =>
    <div data-testid="card-header">{children}</div>,
  CardTitle: ({ children }: { children: React.ReactNode }) =>
    <h2 data-testid="card-title">{children}</h2>,
  Button: ({ children, onClick, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) =>
    <button onClick={onClick} {...props}>{children}</button>,
  DataTable: ({ data }: { data: any[] }) =>
    <div data-testid="data-table">Table with {data.length} items</div>
}));

jest.mock('../../services/api', () => ({
  default: {
    get: jest.fn().mockResolvedValue({ data: [] }),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
  }
}));

jest.mock('recharts', () => ({
  BarChart: ({ children }: { children: React.ReactNode }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) =>
    <div data-testid="responsive-container">{children}</div>
}));

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false }
  }
});

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = createTestQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders dashboard correctly', async () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });

  it('displays dashboard cards', async () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    // Wait for cards to render
    const cards = await screen.findAllByTestId('card');
    expect(cards.length).toBeGreaterThan(0);
  });
});
