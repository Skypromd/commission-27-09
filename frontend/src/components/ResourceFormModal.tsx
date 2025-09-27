import { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select } from 'antd';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select';
  required?: boolean;
  options?: { label: string; value: number }[];
}

interface ResourceFormModalProps {
  open: boolean;
  title: string;
  fields: FormField[];
  initialValues?: any;
  onOk: (values: any) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const ResourceFormModal = ({ open, title, fields, initialValues, onOk, onCancel, isLoading }: ResourceFormModalProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      form.setFieldsValue(initialValues || {});
    }
  }, [open, initialValues, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        onOk(values);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const renderField = (field: FormField) => {
    switch (field.type) {
      case 'number':
        return <InputNumber style={{ width: '100%' }} />;
      case 'select':
        return <Select options={field.options} />;
      default:
        return <Input />;
    }
  };

  return (
    <Modal
      open={open}
      title={title}
      okText={initialValues ? "Сохранить" : "Создать"}
      cancelText="Отмена"
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={isLoading}
    >
      <Form form={form} layout="vertical" name="resource_form">
        {fields.map((field) => (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
            rules={[{ required: field.required, message: `Пожалуйста, введите ${field.label.toLowerCase()}!` }]}
          >
            {renderField(field)}
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
};

export default ResourceFormModal;
