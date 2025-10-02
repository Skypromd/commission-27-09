// UI Components exports
export { Button } from './Button';
export { Card, CardHeader, CardTitle, CardContent } from './Card';
export { DataTable } from './DataTable';
export { default as LoadingSpinner } from './LoadingSpinner';
export { default as ErrorBoundary } from './ErrorBoundary';
export { default as NotificationBell } from './NotificationBell';
export { default as LiveActivityFeed } from './LiveActivityFeed';

// Utility styles and functions (будем добавлять по мере необходимости)
export const layoutStyles = {
  container: 'container mx-auto px-4 py-6',
  section: 'space-y-6',
  grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  flexBetween: 'flex items-center justify-between',
  pageHeader: 'mb-6 pb-4 border-b border-gray-200',
};

export const animationStyles = {
  fadeIn: 'animate-fade-in',
  slideIn: 'animate-slide-in',
  pulse: 'animate-pulse',
};

export const statCardStyles = {
  base: 'bg-white rounded-lg shadow-md p-6',
  title: 'text-sm font-medium text-gray-500',
  value: 'text-2xl font-bold text-gray-900 mt-2',
};

export const progressStyles = {
  container: 'w-full bg-gray-200 rounded-full h-2',
};

export const progressFillStyles = {
  base: 'h-2 rounded-full transition-all duration-300',
};

// Table utility functions
export const createColumn = (accessor: string, header: string, cell?: any) => ({
  accessorKey: accessor,
  header,
  cell,
});

export const createActionColumn = (render: any) => ({
  id: 'actions',
  header: 'Actions',
  cell: render,
});
