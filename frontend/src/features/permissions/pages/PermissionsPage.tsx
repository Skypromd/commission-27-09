import React, { useState, useEffect } from 'react';
import { useGetRolesQuery, useGetPermissionsQuery, useUpdateRolePermissionsMutation } from '../api/permissionsApiSlice';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Role, Permission } from '../types';

const RoleCard: React.FC<{ role: Role; allPermissions: Permission[] }> = ({ role, allPermissions }) => {
  const [checkedPermissions, setCheckedPermissions] = useState<string[]>(role.permissions);
  const [updateRolePermissions, { isLoading: isUpdating }] = useUpdateRolePermissionsMutation();

  useEffect(() => {
    setCheckedPermissions(role.permissions);
  }, [role.permissions]);

  const handleCheckboxChange = (permissionId: string, isChecked: boolean) => {
    setCheckedPermissions(prev => isChecked ? [...prev, permissionId] : prev.filter(id => id !== permissionId));
  };

  const handleSave = async () => {
    try {
      await updateRolePermissions({ roleId: role.id, permissions: checkedPermissions }).unwrap();
    } catch (err) {
      console.error('Failed to update permissions:', err);
    }
  };

  const hasChanges = JSON.stringify([...role.permissions].sort()) !== JSON.stringify([...checkedPermissions].sort());

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold capitalize">{role.name}</h2>
        <Button onClick={handleSave} disabled={isUpdating || !hasChanges}>
          {isUpdating ? 'Saving...' : 'Save'}
        </Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {allPermissions?.map(permission => (
          <div key={permission.id} className="flex items-center">
            <input
              type="checkbox"
              id={`${role.id}-${permission.id}`}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              checked={checkedPermissions.includes(permission.id)}
              onChange={(e) => handleCheckboxChange(permission.id, e.target.checked)}
            />
            <label htmlFor={`${role.id}-${permission.id}`} className="ml-2 block text-sm text-gray-900">
              {permission.name}
            </label>
          </div>
        ))}
      </div>
    </Card>
  );
};


const PermissionsPage: React.FC = () => {
  const { data: roles, isLoading: isLoadingRoles, isError: isErrorRoles, error: errorRoles } = useGetRolesQuery();
  const { data: permissions, isLoading: isLoadingPermissions, isError: isErrorPermissions, error: errorPermissions } = useGetPermissionsQuery();

  if (isLoadingRoles || isLoadingPermissions) {
    return <LoadingSpinner />;
  }

  if (isErrorRoles || isErrorPermissions) {
    return <ErrorMessage message={errorRoles?.toString() || errorPermissions?.toString() || 'Failed to load data.'} />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Roles and Permissions</h1>
      <div className="space-y-6">
        {roles?.map(role => (
          <RoleCard key={role.id} role={role} allPermissions={permissions || []} />
        ))}
      </div>
    </div>
  );
};

export default PermissionsPage;
