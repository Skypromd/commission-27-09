import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { ResourceTable, TableColumn } from './ResourceTable';

const meta: Meta<typeof ResourceTable> = {
    title: 'shared/ResourceTable',
    component: ResourceTable,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ResourceTable>;

interface MockItem {
    id: string;
    name: string;
    email: string;
    phone: string;
}

const columns: TableColumn<MockItem>[] = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
];

const items: MockItem[] = [
    { id: '1', name: 'John Doe', email: 'john.doe@example.com', phone: '123-456-7890' },
    { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', phone: '098-765-4321' },
    { id: '3', name: 'Peter Jones', email: 'peter.jones@example.com', phone: '555-555-5555' },
];

const baseArgs = {
    columns,
    items,
    onEdit: action('onEdit'),
    onDelete: action('onDelete'),
    onSave: action('onSave'),
    onSort: action('onSort'),
    onSearch: action('onSearch'),
    onPageChange: action('onPageChange'),
    onModalOpen: action('onModalOpen'),
    addEntityTitle: 'Add Item',
    searchPlaceholder: 'Search...',
    isModalOpen: false,
    editingItem: null,
    limit: 10,
    totalItems: items.length,
    page: 1,
    sortConfig: { key: 'name', direction: 'ascending' as const },
    searchTerm: '',
};

export const Default: Story = {
    args: {
        ...baseArgs,
    },
};

export const Loading: Story = {
    args: {
        ...baseArgs,
        items: [],
        isLoading: true,
    },
};

export const WithPagination: Story = {
    args: {
        ...baseArgs,
        totalItems: 30, // More items to show pagination
        page: 2,
    },
};

