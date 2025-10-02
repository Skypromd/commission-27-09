import { useState } from 'react';
import { Table, Typography, Alert, Button, Flex, Space, Popconfirm, Select, notification } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { UseQuery } from '@reduxjs/toolkit/dist/query/react/buildHooks';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import ResourceFormModal, { FormField } from './ResourceFormModal';

const { Title } = Typography;

interface ResourcePageProps<T> {
  title: string;
  useGetDataQuery: UseQuery<any>;
  columns: ColumnsType<T>;
  // Пропсы для CRUD
  useAddItemMutation?: any;
  useUpdateItemMutation?: any;
  useDeleteItemMutation?: any;
  useUpdateStatusMutation?: any; // <-- Новый проп
  formFields?: FormField[];
  statusOptions?: { value: string; label: string }[]; // <-- Новый проп
}

const ResourcePage = <T extends { id: number; status: string }>({ title, useGetDataQuery, columns, useAddItemMutation, useUpdateItemMutation, useDeleteItemMutation, useUpdateStatusMutation, formFields, statusOptions }: ResourcePageProps<T>) => {
  const { data, error, isLoading } = useGetDataQuery();
  const [addItem, { isLoading: isAdding }] = useAddItemMutation ? useAddItemMutation() : [null, {}];
  const [updateItem, { isLoading: isUpdating }] = useUpdateItemMutation ? useUpdateItemMutation() : [null, {}];
  const [deleteItem] = useDeleteItemMutation ? useDeleteItemMutation() : [null];
  const [updateStatus] = useUpdateStatusMutation ? useUpdateStatusMutation() : [null];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<number | null>(null);

  const handleFormSubmit = async (values: any) => {
    const mutation = editingItem ? updateItem : addItem;
    const payload = editingItem ? { id: editingItem.id, ...values } : values;

    if (mutation) {
      try {
        await mutation(payload).unwrap();
        setIsModalOpen(false);
        setEditingItem(null);
        notification.success({
          message: 'Успешно',
          description: `Запись была успешно ${editingItem ? 'обновлена' : 'создана'}.`,
        });
      } catch (err) {
        console.error('Failed to save item:', err);
        notification.error({
          message: 'Ошибка',
          description: 'Не удалось сохранить запись.',
        });
      }
    }
  };

  const openEditModal = (item: T) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (deleteItem) {
      try {
        await deleteItem(id).unwrap();
        notification.success({
          message: 'Успешно',
          description: 'Запись была у��алена.',
        });
      } catch (err) {
        console.error('Failed to delete item:', err);
        notification.error({
          message: 'Ошибка',
          description: 'Не удалось удалить запись.',
        });
      }
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    if (updateStatus) {
      setUpdatingStatusId(id);
      try {
        await updateStatus({ id, status: newStatus }).unwrap();
        notification.success({
          message: 'Успешно',
          description: 'Статус был обновлен.',
        });
      } catch (err) {
        console.error('Failed to update status:', err);
        notification.error({
          message: 'Ошибка',
          description: 'Не удалось обновить статус.',
        });
      } finally {
        setUpdatingStatusId(null);
      }
    }
  };

  const actionColumn: ColumnsType<T>[0] = {
    title: 'Действия',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        {useUpdateItemMutation && <Button icon={<EditOutlined />} onClick={() => openEditModal(record)} />}
        {useDeleteItemMutation && (
          <Popconfirm title="Удалить запись?" onConfirm={() => handleDelete(record.id)} okText="Да" cancelText="Нет">
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        )}
      </Space>
    ),
  };

  // Заменяем рендеринг статуса, если передана мутация для его обновления
  const enhancedColumns = columns.map(col => {
    // @ts-ignore
    if (col.key === 'status' && useUpdateStatusMutation && statusOptions) {
      return {
        ...col,
        render: (status: string, record: T) => (
          <Select
            defaultValue={status}
            style={{ width: 150 }}
            onChange={(newStatus) => handleStatusChange(record.id, newStatus)}
            options={statusOptions}
            loading={updatingStatusId === record.id}
            disabled={updatingStatusId !== null && updatingStatusId !== record.id}
          />
        ),
      };
    }
    return col;
  });

  const tableColumns = [...enhancedColumns, actionColumn];

  if (error) {
    return <Alert message="Ошибка" description="Не удалось загрузить данные." type="error" showIcon />;
  }

  return (
    <div>
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <Title level={2} style={{ margin: 0 }}>{title}</Title>
        {useAddItemMutation && (
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
            Создать
          </Button>
        )}
      </Flex>
      <Table
        columns={tableColumns}
        dataSource={data}
        loading={isLoading}
        rowKey="id"
      />
      {formFields && (
        <ResourceFormModal
          open={isModalOpen}
          title={editingItem ? `Редактировать: ${title}` : `Создать: ${title}`}
          fields={formFields}
          initialValues={editingItem}
          onOk={handleFormSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingItem(null);
          }}
          isLoading={isAdding || isUpdating}
        />
      )}
    </div>
  );
};

export default ResourcePage;
