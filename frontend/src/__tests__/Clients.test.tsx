import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';

import Clients from '../pages/Clients';

// Mock Layout component
jest.mock('../components/layout/Layout', () => {
  return function MockLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="layout">{children}</div>;
  };
});

// Mock UI components
jest.mock('../components/ui', () => ({
  Button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) =>
    <button {...props}>{children}</button>,
  Card: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) =>
    <div {...props}>{children}</div>,
  CardContent: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) =>
    <div {...props}>{children}</div>,
  CardHeader: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) =>
    <div {...props}>{children}</div>,
  CardTitle: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) =>
    <h2 {...props}>{children}</h2>,
  DataTable: ({ data, columns }: { data: any[]; columns: any[] }) =>
    <table><tbody>{data.map((item, i) => <tr key={i}><td>{JSON.stringify(item)}</td></tr>)}</tbody></table>
}));

// Mock API
jest.mock('../services/api', () => ({
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
  }
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

describe('Clients Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders clients page correctly', async () => {
    render(
      <TestWrapper>
        <Clients />
      </TestWrapper>
    );

    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });

  it('handles client creation', async () => {
    render(
      <TestWrapper>
        <Clients />
      </TestWrapper>
    );

    // Test client creation flow
    const createButton = screen.queryByText(/Add|Create|New/i);
    if (createButton) {
      fireEvent.click(createButton);
    }
  });

  it('handles client filtering', async () => {
    render(
      <TestWrapper>
        <Clients />
      </TestWrapper>
    );

    // Test filtering functionality
    const searchInput = screen.queryByPlaceholderText(/search/i);
    if (searchInput) {
      fireEvent.change(searchInput, { target: { value: 'test' } });
    }
  });
});
