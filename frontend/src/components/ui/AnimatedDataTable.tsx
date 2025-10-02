/**
 * UK Commission Admin Panel - Advanced Animated Data Table
 * Таблица с микро-анимациями, сортировкой, фильтрацией и интерактивными элементами
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, Search, Filter, MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';
import { cn } from '../../utils/cn';

// Типизация для компонента
interface Column {
  accessorKey: string;
  header: string;
  cell?: ({ row }: { row: { original: any } }) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
}

interface Action {
  label: string;
  onClick: (row: any) => void;
  icon?: React.ReactNode;
  variant?: 'default' | 'destructive';
}

interface AnimatedDataTableProps {
  data?: any[];
  columns?: Column[];
  searchable?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  actions?: Action[];
  onRowClick?: (row: any) => void;
  loading?: boolean;
  className?: string;
}

const tableVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25
    }
  },
  hover: {
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    scale: 1.01,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    transition: { duration: 0.2 }
  }
};

const actionButtonVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
  hover: { scale: 1.1 },
  tap: { scale: 0.95 }
};

export const AnimatedDataTable: React.FC<AnimatedDataTableProps> = ({
  data = [],
  columns = [],
  searchable = true,
  sortable = true,
  filterable = true,
  pagination = true,
  pageSize = 10,
  actions = [],
  onRowClick,
  loading = false,
  className,
  ...props
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string | null; direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, any>>({});

  // Фильтрация и поиск данных
  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Поиск
    if (searchTerm) {
      filtered = filtered.filter(item =>
        Object.values(item).some(value =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Фильтрация
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter(item =>
          item[key]?.toString().toLowerCase().includes(value.toLowerCase())
        );
      }
    });

    // Сортировка
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [data, searchTerm, filters, sortConfig]);

  // Пагинация
  const paginatedData = useMemo(() => {
    if (!pagination) return filteredData;

    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize, pagination]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const handleSort = (key: string) => {
    if (!sortable) return;

    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFilter = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className={cn("w-full p-6 text-center", className)}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2 text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)} {...props}>
      {/* Поиск и фильтры */}
      {searchable && (
        <div className="mb-4 flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {filterable && (
            <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50">
              <Filter className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Таблица */}
      <motion.div
        className="overflow-x-auto border border-gray-200 rounded-lg"
        variants={tableVariants}
        initial="hidden"
        animate="visible"
      >
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.accessorKey}
                  className={cn(
                    "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                    sortable && "cursor-pointer hover:bg-gray-100"
                  )}
                  onClick={() => handleSort(column.accessorKey)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {sortable && sortConfig.key === column.accessorKey && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {sortConfig.direction === 'asc' ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </motion.div>
                    )}
                  </div>
                </th>
              ))}
              {actions.length > 0 && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <AnimatePresence>
              {paginatedData.map((row, index) => (
                <motion.tr
                  key={index}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  whileHover="hover"
                  className={cn(
                    "transition-colors duration-200",
                    onRowClick && "cursor-pointer"
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => (
                    <td key={column.accessorKey} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {column.cell ? column.cell({ row: { original: row } }) : row[column.accessorKey]}
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {actions.map((action, actionIndex) => (
                          <motion.button
                            key={actionIndex}
                            variants={actionButtonVariants}
                            initial="hidden"
                            animate="visible"
                            whileHover="hover"
                            whileTap="tap"
                            onClick={(e) => {
                              e.stopPropagation();
                              action.onClick(row);
                            }}
                            className={cn(
                              "p-1 rounded transition-colors duration-200",
                              action.variant === 'destructive'
                                ? "text-red-600 hover:bg-red-50"
                                : "text-blue-600 hover:bg-blue-50"
                            )}
                          >
                            {action.icon}
                          </motion.button>
                        ))}
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </motion.div>

      {/* Пагинация */}
      {pagination && totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="px-3 py-1 border border-gray-300 rounded bg-blue-50 text-blue-600">
              {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Предустановленные действия для таблицы
export const tableActions = {
  view: {
    icon: <Eye className="h-4 w-4" />,
    label: 'Просмотр',
    className: 'text-blue-600 hover:text-blue-800'
  },
  edit: {
    icon: <Edit className="h-4 w-4" />,
    label: 'Редактировать',
    className: 'text-green-600 hover:text-green-800'
  },
  delete: {
    icon: <Trash2 className="h-4 w-4" />,
    label: 'Удалить',
    className: 'text-red-600 hover:text-red-800'
  },
  menu: {
    icon: <MoreHorizontal className="h-4 w-4" />,
    label: 'Меню',
    className: 'text-gray-600 hover:text-gray-800'
  }
};
