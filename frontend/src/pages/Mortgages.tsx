import React from 'react';
import type { ColumnsType } from 'antd/es/table';
import { useGetMortgagesQuery, useAddMortgageMutation } from '@/features/mortgages/mortgagesApiSlice';
import { Mortgage } from '@/types';
import ResourcePage from '@/components/ResourcePage';
import { FormField } from '@/components/ResourceFormModal';

const columns: ColumnsType<Mortgage> = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Название',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Сумма кредита',
    dataIndex: 'loan_amount',
    key: 'loan_amount',
    render: (amount) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(amount),
  },
  {
    title: 'Статус',
    dataIndex: 'status',
    key: 'status',
  },
];

const formFields: FormField[] = [
  { name: 'name', label: 'Название сделки', type: 'text', required: true },
  { name: 'loan_amount', label: 'Сумма кредита', type: 'number', required: true },
  // Поле client будет добавлено позже, когда у нас будет страница клиентов
  // { name: 'client', label: 'Клиент ID', type: 'number', required: true },
];

const MortgagesPage = () => {
  return (
    <ResourcePage
      title="Ипотечные сделки"
      useGetDataQuery={useGetMortgagesQuery}
      columns={columns}
      useAddItemMutation={useAddMortgageMutation}
      formFields={formFields}
    />
  );
};

export default MortgagesPage;
