/**
 * UK Commission Admin Panel - Advanced UI Components Demo Page
 * Демонстрация всех продвинутых анимированных компонентов
 */

import React, { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Upload,
  Settings,
  Bell,
  User,
  ChevronDown,
  Plus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';

// Импортируем только существующие компоненты
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  DataTable
} from '../components/ui';

interface UIComponentsDemoProps {}

const UIComponentsDemo: React.FC<UIComponentsDemoProps> = () => {
  const [activeTab, setActiveTab] = useState<string>('buttons');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Данные для демонстрации таблицы
  const sampleData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Pending' }
  ];

  const tableColumns = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'status', header: 'Status' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">UI Components Demo</h1>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg w-fit mb-8">
        {['buttons', 'cards', 'forms', 'tables'].map((tab) => (
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

      {/* Buttons Demo */}
      {activeTab === 'buttons' && (
        <Card>
          <CardHeader>
            <CardTitle>Button Variants</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button>Default Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="destructive">Destructive</Button>
              <Button disabled>Disabled Button</Button>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button size="sm">Small</Button>
              <Button size="default">Default Size</Button>
              <Button size="lg">Large</Button>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                With Icon
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="ghost">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cards Demo */}
      {activeTab === 'cards' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Simple Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p>This is a simple card with basic content.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistics Card</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <div className="text-sm text-gray-500">Total Users</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Interactive Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Card with actions</p>
                <div className="flex gap-2 mt-4">
                  <Button size="sm">Action 1</Button>
                  <Button size="sm" variant="outline">Action 2</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Forms Demo */}
      {activeTab === 'forms' && (
        <Card>
          <CardHeader>
            <CardTitle>Form Elements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Text Input</label>
              <input
                type="text"
                placeholder="Enter text..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Select</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Textarea</label>
              <textarea
                rows={4}
                placeholder="Enter description..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="checkbox" className="rounded" />
              <label htmlFor="checkbox" className="text-sm">I agree to the terms</label>
            </div>

            <div className="flex gap-4">
              <Button>Submit</Button>
              <Button variant="outline">Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tables Demo */}
      {activeTab === 'tables' && (
        <Card>
          <CardHeader>
            <CardTitle>Data Table</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={sampleData}
              columns={tableColumns}
              pagination={true}
              searchable={true}
            />
          </CardContent>
        </Card>
      )}

      {/* Modal Demo */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Demo Modal</h3>
            <p className="text-gray-600 mb-6">This is a simple modal dialog.</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setModalOpen(false)}>
                OK
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        <Button
          onClick={() => setModalOpen(true)}
          className="rounded-full w-12 h-12 p-0"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};

export default UIComponentsDemo;
