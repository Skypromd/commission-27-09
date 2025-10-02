/**
 * Modern Data Table Component using React Table v8
 * Заменяет устаревший react-table v7
 */

import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type Row,
} from '@tanstack/react-table';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { cn, tableStyles } from '../../utils/styling';
import { Button } from './Button';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchable?: boolean;
  pagination?: boolean;
  sortingEnabled?: boolean;
  onRowClick?: (row: Row<TData>) => void;
  className?: string;
  loading?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchable = true,
  pagination = true,
  sortingEnabled = true,
  onRowClick,
  className,
  loading = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = React.useState('');

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    enableSorting: sortingEnabled,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
  });

  if (loading) {
    return (
      <div className="w-full space-y-3">
        <div className="h-10 bg-slate-200 rounded animate-pulse" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 bg-slate-100 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search Input */}
      {searchable && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <input
              placeholder="Поиск по всем колонкам..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="h-10 px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Column Visibility Toggle */}
          <div className="ml-auto">
            <Button variant="outline" size="sm">
              Колонки
              <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className={tableStyles.container}>
        <table className={tableStyles.table}>
          <thead className={tableStyles.header}>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className={tableStyles.headerCell}>
                    {header.isPlaceholder ? null : (
                      <div
                        className={cn(
                          tableStyles.sortButton,
                          header.column.getCanSort() && "cursor-pointer select-none"
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() && (
                          <span className="ml-1">
                            {header.column.getIsSorted() === 'desc' ? (
                              <ChevronDownIcon className="h-4 w-4" />
                            ) : header.column.getIsSorted() === 'asc' ? (
                              <ChevronUpIcon className="h-4 w-4" />
                            ) : (
                              <div className="h-4 w-4" />
                            )}
                          </span>
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    tableStyles.row,
                    onRowClick && "cursor-pointer"
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className={tableStyles.cell}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="h-24 text-center text-slate-500"
                >
                  Нет данных для отображения.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Строк на странице</p>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                }}
                className="h-8 w-16 rounded border border-slate-200 px-2 text-sm"
              >
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Страница {table.getState().pagination.pageIndex + 1} из{" "}
              {table.getPageCount()}
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Назад
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Далее
              </Button>
            </div>
          </div>

          <div className="text-sm text-slate-500">
            {table.getFilteredSelectedRowModel().rows.length} из{" "}
            {table.getFilteredRowModel().rows.length} строк выбрано.
          </div>
        </div>
      )}
    </div>
  );
}

// Utility функции для создания колонок
export const createColumn = <T,>(
  accessorKey: keyof T,
  header: string,
  options?: Partial<ColumnDef<T>>
): ColumnDef<T> => ({
  accessorKey: accessorKey as string,
  header,
  ...options,
});

export const createActionColumn = <T,>(
  cell: (info: any) => React.ReactNode
): ColumnDef<T> => ({
  id: 'actions',
  header: 'Действия',
  cell,
  enableSorting: false,
  enableHiding: false,
});
