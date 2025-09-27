import React, { useState, useMemo } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

type Sort = {
  field: string;
  direction: 'asc' | 'desc';
};

interface RelatedDataConfig {
  useGetDataQuery: (params?: any) => { data?: { results: any[] } };
  displayField: (item: any) => string;
}

interface ResourceTableProps {
  resourceName: string;
  useGetDataQuery: (params: any) => {
    data: { results: any[], count: number, next: string | null, previous: string | null } | undefined;
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    error: any;
  };
  columns: any[];
  renderFormModal: (props: { isOpen: boolean; onClose: () => void; item: any | null }) => React.ReactNode;
  relatedData?: Record<string, RelatedDataConfig>;
}

export const ResourceTable: React.FC<ResourceTableProps> = ({
  resourceName,
  useGetDataQuery,
  columns,
  renderFormModal,
  relatedData = {},
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [sorting, setSorting] = useState<Sort | null>(null);
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const relatedDataMaps = Object.entries(relatedData).reduce((acc, [key, config]) => {
    const { data } = config.useGetDataQuery();
    acc[key] = useMemo(() => data?.results.reduce((map, item) => {
      map[item.id] = config.displayField(item);
      return map;
    }, {} as Record<string, string>) || {}, [data]);
    return acc;
  }, {} as Record<string, Record<string, string>>);

  const queryParams = useMemo(() => {
    const params: { search?: string; ordering?: string; page?: number } = { page };
    if (debouncedSearchTerm) params.search = debouncedSearchTerm;
    if (sorting) params.ordering = `${sorting.direction === 'desc' ? '-' : ''}${sorting.field}`;
    return params;
  }, [debouncedSearchTerm, sorting, page]);

  const { data: response, isLoading, isFetching, isError, error } = useGetDataQuery(queryParams);

  const handleOpenModal = (item: any | null = null) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleSort = (field: string) => {
    const isAsc = sorting?.field === field && sorting.direction === 'asc';
    setSorting({ field, direction: isAsc ? 'desc' : 'asc' });
  };

  const renderSortIcon = (field: string) => {
    if (sorting?.field !== field) return null;
    return sorting.direction === 'asc' ? <FaArrowUp className="ml-2 inline" /> : <FaArrowDown className="ml-2 inline" />;
  };

  const enhancedColumns = useMemo(() => columns.map(col => ({
    ...col,
    header: col.sortableField
      ? () => <button onClick={() => handleSort(col.sortableField)} className="font-bold">{col.header} {renderSortIcon(col.sortableField)}</button>
      : col.header,
  })), [columns, sorting]);

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorMessage message={error?.toString() || `Failed to load ${resourceName.toLowerCase()}.`} />;

  const totalPages = response ? Math.ceil(response.count / 10) : 0;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{resourceName}</h1>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder={`Search ${resourceName.toLowerCase()}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <Button onClick={() => handleOpenModal()}>Add {resourceName.slice(0, -1)}</Button>
        </div>
      </div>
      <div className="relative">
        {isFetching && <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10"><LoadingSpinner /></div>}
        <DataTable
          columns={enhancedColumns}
          data={response?.results || []}
          meta={{
            openModal: handleOpenModal,
            ...relatedDataMaps
          }}
        />
        {!isFetching && response?.results.length === 0 && (
          <div className="text-center py-10"><p className="text-gray-500">No {resourceName.toLowerCase()} found.</p></div>
        )}
      </div>
      {totalPages > 0 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-700">Page {page} of {totalPages}</span>
          <div className="flex space-x-2">
            <Button onClick={() => setPage(p => p - 1)} disabled={!response?.previous}>Previous</Button>
            <Button onClick={() => setPage(p => p + 1)} disabled={!response?.next}>Next</Button>
          </div>
        </div>
      )}
      {renderFormModal({ isOpen: isModalOpen, onClose: handleCloseModal, item: selectedItem })}
    </div>
  );
};
