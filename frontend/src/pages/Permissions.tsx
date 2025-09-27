import React, { useState, useEffect } from 'react';
import { Shield, Users, Settings, Lock, Unlock, Eye, Edit, Trash2, Plus } from 'lucide-react';

// Импортируем только существующие компоненты
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  DataTable
} from '../components/ui';

// Типизация для системы разрешений
interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  level: 'read' | 'write' | 'admin';
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  userCount: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: 'active' | 'inactive';
}

const Permissions: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('roles');
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Моковые данные для демонстрации
  useEffect(() => {
    const mockRoles: Role[] = [
      {
        id: '1',
        name: 'Admin',
        description: 'Full system access',
        permissions: [],
        userCount: 2
      },
      {
        id: '2',
        name: 'Manager',
        description: 'Management access',
        permissions: [],
        userCount: 5
      },
      {
        id: '3',
        name: 'User',
        description: 'Basic user access',
        permissions: [],
        userCount: 20
      }
    ];

    const mockPermissions: Permission[] = [
      {
        id: '1',
        name: 'users.view',
        description: 'View users',
        category: 'Users',
        level: 'read'
      },
      {
        id: '2',
        name: 'users.create',
        description: 'Create users',
        category: 'Users',
        level: 'write'
      },
      {
        id: '3',
        name: 'settings.manage',
        description: 'Manage settings',
        category: 'System',
        level: 'admin'
      }
    ];

    setRoles(mockRoles);
    setPermissions(mockPermissions);
    setLoading(false);
  }, []);

  // Колонки для таблицы ролей
  const roleColumns = [
    { accessorKey: 'name', header: 'Role Name' },
    { accessorKey: 'description', header: 'Description' },
    { accessorKey: 'userCount', header: 'Users' },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Edit className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="destructive">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  // Колонки для таблицы разрешений
  const permissionColumns = [
    { accessorKey: 'name', header: 'Permission' },
    { accessorKey: 'description', header: 'Description' },
    { accessorKey: 'category', header: 'Category' },
    { accessorKey: 'level', header: 'Level' }
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
          <h1 className="text-3xl font-bold text-gray-900">Permissions & Roles</h1>
          <p className="text-gray-600 mt-1">Manage user roles and system permissions</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Role
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg w-fit mb-8">
        {['roles', 'permissions', 'users'].map((tab) => (
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

      {/* Roles Tab */}
      {activeTab === 'roles' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              System Roles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={roles}
              columns={roleColumns}
              pagination={true}
              searchable={true}
            />
          </CardContent>
        </Card>
      )}

      {/* Permissions Tab */}
      {activeTab === 'permissions' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              System Permissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={permissions}
              columns={permissionColumns}
              pagination={true}
              searchable={true}
            />
          </CardContent>
        </Card>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              User Role Assignments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              User management functionality coming soon...
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold">{roles.length}</div>
                <div className="text-gray-500">Total Roles</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Lock className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold">{permissions.length}</div>
                <div className="text-gray-500">Permissions</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold">
                  {roles.reduce((sum, role) => sum + role.userCount, 0)}
                </div>
                <div className="text-gray-500">Total Users</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Permissions;
