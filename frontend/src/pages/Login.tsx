import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Layout, Card, Typography, Alert } from 'antd';
import { useLoginMutation } from '@/features/auth/authApiSlice';
import { setCredentials } from '@/features/auth/authSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const LoginPage = () => {
  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      // djoser возвращает токен в поле auth_token
      const { auth_token } = await login(values).unwrap();
      dispatch(setCredentials({ token: auth_token }));
      navigate('/');
    } catch (err) {
      // Ошибка уже обрабатывается состоянием `error` из хука
      console.error('Failed to login:', err);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5' }}>
      <Card style={{ width: 400 }}>
        <Title level={2} style={{ textAlign: 'center' }}>Вход в систему</Title>
        <Form
          name="normal_login"
          onFinish={onFinish}
        >
          {error && <Alert message="Неверное имя пользователя или пароль" type="error" showIcon style={{ marginBottom: 24 }} />}
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Пожалуйста, введите имя пользователя!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Имя пользователя" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Пожалуйста, введите пароль!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Пароль" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={isLoading}>
              Войти
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Layout>
  );
};

export default LoginPage;
