import { App as AntApp, Button, Layout, Menu, theme, Dropdown, Space, Avatar } from 'antd';
import { Link, Route, Routes, useNavigate, Outlet } from 'react-router-dom';
import { HomeOutlined, DollarOutlined, FileProtectOutlined, LogoutOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import Dashboard from '@/pages/Dashboard';
import MortgagesPage from '@/pages/Mortgages';
import PoliciesPage from '@/pages/Policies';
import ClientsPage from '@/pages/Clients';
import LoginPage from '@/pages/Login';
import ProtectedRoutes from '@/components/ProtectedRoutes';
import { logOut, selectCurrentUser } from '@/features/auth/authSlice';
import { useGetMeQuery } from '@/features/auth/authApiSlice';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { ToastProvider } from './contexts/ToastContext';

// UK Commission Admin Panel - Professional Government Theme
// Author: Ianioglo Vladimir (skypromd@gmail.com)

const { Header, Content, Footer, Sider } = Layout;

const AppLayout = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Получаем данные о пользователе из Redux store или загружаем их
  const user = useSelector(selectCurrentUser);
  const { data: userData } = useGetMeQuery(undefined, {
    skip: !!user, // Пропускаем запрос, если пользователь уже есть в store
  });


  const handleLogout = () => {
    dispatch(logOut());
    navigate('/login');
  };

  const menuItems = [
    {
      key: '1',
      label: (
        <a onClick={handleLogout}>
          <LogoutOutlined style={{ marginRight: 8 }} />
          Выход
        </a>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider>
        <div className="demo-logo-vertical text-white text-lg text-center py-4">Commission Tracker</div>
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key="1" icon={<HomeOutlined />}>
            <Link to="/">Панель управления</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<DollarOutlined />}>
            <Link to="/mortgages">Ипотека</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<FileProtectOutlined />}>
            <Link to="/policies">Полисы</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<TeamOutlined />}>
            <Link to="/clients">Клиенты</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ padding: '0 16px', background: colorBgContainer, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Dropdown menu={{ items: menuItems }} placement="bottomRight">
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                <Avatar icon={<UserOutlined />} />
                {user?.username || userData?.username}
              </Space>
            </a>
          </Dropdown>
        </Header>
        <Content style={{ margin: '16px' }}>
          <div style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Commission Tracker ©2023</Footer>
      </Layout>
    </Layout>
  );
};

function App() {
  return (
    <Provider store={store}>
      <ToastProvider>
        <AntApp>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoutes />}>
              {/* Все защищенные маршруты теперь здесь */}
              <Route path="/" element={<AppLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="mortgages" element={<MortgagesPage />} />
                <Route path="policies" element={<PoliciesPage />} />
                <Route path="clients" element={<ClientsPage />} />
              </Route>
            </Route>
          </Routes>
        </AntApp>
      </ToastProvider>
    </Provider>
  );
}

export default App;
