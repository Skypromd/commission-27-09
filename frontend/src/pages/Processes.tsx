import React, { useState, useEffect } from 'react';
import { Workflow, Play, Pause, Settings, Plus, Eye, Edit, Trash2, CheckCircle, Clock } from 'lucide-react';

// Импортируем только существующие компоненты
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  DataTable
} from '../components/ui';

// Типизация для бизнес-процессов
interface ProcessStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  assignee?: string;
  dueDate?: string;
  duration?: number;
}

interface BusinessProcess {
  id: string;
  name: string;
  description: string;
  category: 'onboarding' | 'underwriting' | 'claims' | 'sales' | 'compliance';
  status: 'active' | 'inactive' | 'draft';
  steps: ProcessStep[];
  totalSteps: number;
  completedSteps: number;
  createdAt: string;
  lastModified: string;
}

interface ProcessData {
  totalProcesses: number;
  activeProcesses: number;
  completionRate: number;
  averageDuration: number;
  processes: BusinessProcess[];
}

const Processes: React.FC = () => {
  const [data, setData] = useState<ProcessData>({
    totalProcesses: 0,
    activeProcesses: 0,
    completionRate: 0,
    averageDuration: 0,
    processes: []
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('overview');

  useEffect(() => {
    // Моковые данные для демонстрации
    const mockData: ProcessData = {
      totalProcesses: 12,
      activeProcesses: 8,
      completionRate: 85.5,
      averageDuration: 72,
      processes: [
        {
          id: '1',
          name: 'Client Onboarding',
          description: 'Complete client registration and verification process',
          category: 'onboarding',
          status: 'active',
          steps: [],
          totalSteps: 5,
          completedSteps: 3,
          createdAt: '2024-01-15',
          lastModified: '2024-12-20'
        },
        {
          id: '2',
          name: 'Policy Underwriting',
          description: 'Risk assessment and policy approval workflow',
          category: 'underwriting',
          status: 'active',
          steps: [],
          totalSteps: 7,
          completedSteps: 7,
          createdAt: '2024-02-10',
          lastModified: '2024-12-18'
        },
        {
          id: '3',
          name: 'Claims Processing',
          description: 'Insurance claims review and settlement process',
          category: 'claims',
          status: 'active',
          steps: [],
          totalSteps: 6,
          completedSteps: 4,
          createdAt: '2024-03-05',
          lastModified: '2024-12-19'
        }
      ]
    };

    setData(mockData);
    setLoading(false);
  }, []);

  const processColumns = [
    { accessorKey: 'name', header: 'Process Name' },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }: any) => (
        <span className="capitalize">{row.original.category}</span>
      )
    },
    {
      accessorKey: 'completedSteps',
      header: 'Progress',
      cell: ({ row }: any) => {
        const progress = (row.original.completedSteps / row.original.totalSteps) * 100;
        return (
          <div className="flex items-center gap-2">
            <div className="w-16 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm">{Math.round(progress)}%</span>
          </div>
        );
      }
    },
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
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass[status]}`}>
            {status}
          </span>
        );
      }
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Eye className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline">
            <Edit className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline">
            <Play className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Business Processes</h1>
          <p className="text-gray-600 mt-1">Manage and optimize business workflows</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Process
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Workflow className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold">{data.totalProcesses}</div>
                <div className="text-gray-500">Total Processes</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Play className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold">{data.activeProcesses}</div>
                <div className="text-gray-500">Active Processes</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold">{data.completionRate}%</div>
                <div className="text-gray-500">Completion Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-orange-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold">{data.averageDuration}h</div>
                <div className="text-gray-500">Avg Duration</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg w-fit mb-8">
        {['overview', 'processes', 'templates', 'analytics'].map((tab) => (
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

      {/* Content based on active tab */}
      {activeTab === 'processes' && (
        <Card>
          <CardHeader>
            <CardTitle>All Processes</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={data.processes}
              columns={processColumns}
              pagination={true}
              searchable={true}
            />
          </CardContent>
        </Card>
      )}

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Process Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.processes.slice(0, 3).map((process) => {
                  const progress = (process.completedSteps / process.totalSteps) * 100;
                  return (
                    <div key={process.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{process.name}</div>
                        <div className="text-sm text-gray-500">{process.category}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{Math.round(progress)}% complete</div>
                        <div className="text-sm text-gray-500">{process.completedSteps}/{process.totalSteps} steps</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Process Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['onboarding', 'underwriting', 'claims', 'sales', 'compliance'].map((category) => {
                  const count = data.processes.filter(p => p.category === category).length;
                  return (
                    <div key={category} className="flex justify-between items-center">
                      <span className="capitalize font-medium">{category}</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                        {count} processes
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'templates' && (
        <Card>
          <CardHeader>
            <CardTitle>Process Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              Process templates functionality coming soon...
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'analytics' && (
        <Card>
          <CardHeader>
            <CardTitle>Process Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              Process analytics functionality coming soon...
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Processes;
