import type { ColumnsType } from 'antd/es/table';
import { useGetPoliciesQuery, useAddPolicyMutation, useUpdatePolicyMutation, useDeletePolicyMutation, useUpdatePolicyStatusMutation } from '@/features/policies/policiesApiSlice';
import { Policy } from '@/types';
import ResourcePage from '@/components/ResourcePage';
import { FormField } from '@/components/ResourceFormModal';

const columns: ColumnsType<Policy> = [
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
		title: 'Сумма премии',
		dataIndex: 'premium_amount',
		key: 'premium_amount',
		render: (amount) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(amount),
	},
	{
		title: 'Статус',
		dataIndex: 'status',
		key: 'status',
	},
];

const formFields: FormField[] = [
	{ name: 'name', label: 'Название полиса', type: 'text', required: true },
	{ name: 'premium_amount', label: 'Сумма премии', type: 'number', required: true },
];

const statusOptions = [
	{ value: 'NEW', label: 'Новый' },
	{ value: 'ACTIVE', label: 'Активен' },
	{ value: 'CANCELLED', label: 'Отменен' },
];

const PoliciesPage = () => {
	return (
		<ResourcePage
			title="Страховые полисы"
			useGetDataQuery={useGetPoliciesQuery}
			columns={columns}
			useAddItemMutation={useAddPolicyMutation}
			useUpdateItemMutation={useUpdatePolicyMutation}
			useDeleteItemMutation={useDeletePolicyMutation}
			useUpdateStatusMutation={useUpdatePolicyStatusMutation}
			formFields={formFields}
			statusOptions={statusOptions}
		/>
	);
};

export default PoliciesPage;
