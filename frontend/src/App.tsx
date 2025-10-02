import React, { useState, useEffect } from 'react';
import Registration from './components/Registration.jsx';
import TwoFactorAuth from './components/TwoFactorAuth.jsx';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [apiStatus, setApiStatus] = useState('checking');
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  
  // Система авторизации
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login', 'register', '2fa'
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [pendingUser, setPendingUser] = useState(null);
  
  // Определяем backend URL - используем относительный путь для работы через прокси
  const API_BASE = '/api';

  useEffect(() => {
    // Проверяем авторизацию при загрузке
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      checkApiConnection();
      loadDashboardData();
    }
  }, [isAuthenticated]);

  const checkAuthStatus = async () => {
    // Проверяем сохраненную сессию
    const savedAuth = localStorage.getItem('commissionTracker_auth');
    const savedUser = localStorage.getItem('commissionTracker_user');
    const savedToken = localStorage.getItem('commissionTracker_token');
    
    if (savedAuth && savedUser && savedToken) {
      try {
        // Проверяем действительность токена через API
        const response = await fetch(`${API_BASE}/users/users/me/`, {
          headers: {
            'Authorization': `Token ${savedToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          setIsAuthenticated(true);
          setUser(JSON.parse(savedUser));
        } else {
          // Токен недействителен, очищаем данные
          localStorage.removeItem('commissionTracker_auth');
          localStorage.removeItem('commissionTracker_user');
          localStorage.removeItem('commissionTracker_token');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        // В случае ошибки сети, используем локальные данные
        setIsAuthenticated(true);
        setUser(JSON.parse(savedUser));
      }
    }
  };

  const handleLogin = async (credentials) => {
    console.log('🔄 Starting login with credentials:', credentials);
    console.log('🔗 API_BASE:', API_BASE);
    setLoginLoading(true);
    
    try {
      const url = `${API_BASE}/users/auth/login/`;
      console.log('📡 Making request to:', url);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password
        })
      });

      console.log('📥 Response status:', response.status);
      const data = await response.json();
      console.log('📄 Response data:', data);
      
      if (response.ok && data.success) {
        const userData = {
          id: data.user.id,
          username: data.user.username,
          firstName: data.user.first_name || '',
          lastName: data.user.last_name || '',
          email: data.user.email,
          role: data.user.role,
          avatar: '👤',
          twoFactorEnabled: data.requires_2fa || false
        };
        
        // Сохраняем токен
        localStorage.setItem('commissionTracker_token', data.token);
        
        // Если включена 2FA, переходим к верификации
        if (userData.twoFactorEnabled) {
          setPendingUser(userData);
          setAuthMode('2fa');
          return { success: true, requiresTwoFactor: true };
        }
        
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('commissionTracker_auth', 'true');
        localStorage.setItem('commissionTracker_user', JSON.stringify(userData));
        
        return { success: true };
      } else {
        console.error('Login failed:', data);
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: `Connection error: ${error.message}` };
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (userData) => {
    setLoginLoading(true);
    
    try {
      const response = await fetch(`${API_BASE}/users/auth/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userData.username,
          email: userData.email,
          password: userData.password,
          first_name: userData.firstName || '',
          last_name: userData.lastName || ''
        })
      });

      console.log('📥 Response status:', response.status);
      const data = await response.json();
      console.log('📄 Response data:', data);
      
      if (response.ok && data.success) {
        const newUser = {
          id: data.user.id,
          username: data.user.username,
          firstName: data.user.first_name || '',
          lastName: data.user.last_name || '',
          email: data.user.email,
          role: data.user.role,
          avatar: '👤',
          twoFactorEnabled: data.requires_2fa || false
        };
        
        // Сохраняем токен
        localStorage.setItem('commissionTracker_token', data.token);
        
        // После регистрации можно сразу войти или требовать 2FA
        if (newUser.twoFactorEnabled) {
          setPendingUser(newUser);
          setAuthMode('2fa');
          return { success: true, message: 'Registration successful! Please verify your 2FA code.' };
        } else {
          setUser(newUser);
          setIsAuthenticated(true);
          localStorage.setItem('commissionTracker_auth', 'true');
          localStorage.setItem('commissionTracker_user', JSON.stringify(newUser));
          return { success: true, message: 'Registration successful! You are now logged in.' };
        }
      } else {
        return { success: false, error: data.errors || data.error || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Connection error' };
    } finally {
      setLoginLoading(false);
    }
  };

  const handleTwoFactorVerification = async (code) => {
    setLoginLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Простая проверка 2FA кода (в реальности это будет проверка TOTP)
      if (code === '123456') {
        setUser(pendingUser);
        setIsAuthenticated(true);
        setPendingUser(null);
        setTwoFactorCode('');
        
        localStorage.setItem('commissionTracker_auth', 'true');
        localStorage.setItem('commissionTracker_user', JSON.stringify(pendingUser));
        
        return { success: true };
      } else {
        return { success: false, error: 'Invalid 2FA code' };
      }
    } catch (error) {
      return { success: false, error: 'Verification failed' };
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('commissionTracker_token');
    
    if (token) {
      try {
        await fetch(`${API_BASE}/users/auth/logout/`, {
          method: 'POST',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    
    setIsAuthenticated(false);
    setUser(null);
    setCurrentView('dashboard');
    setData({});
    setAuthMode('login');
    
    // Очищаем localStorage
    localStorage.removeItem('commissionTracker_auth');
    localStorage.removeItem('commissionTracker_user');
    localStorage.removeItem('commissionTracker_token');
  };

  const checkApiConnection = async () => {
    try {
      const response = await fetch(`${API_BASE}/`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      
      if (response.status === 403 || response.status === 401) {
        setApiStatus('connected');
      } else if (response.ok) {
        setApiStatus('connected');
      } else {
        setApiStatus('error');
      }
    } catch (error) {
      console.log('API connection error:', error);
      setApiStatus('error');
    }
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Загружаем данные из ВСЕХ модулей
      const [dealsRes, advisersRes, clientsRes, productsRes, insurancesRes, mortgagesRes, salesRes, reportsRes, notificationsRes, tasksRes, auditRes, analyticsRes] = await Promise.all([
        fetch(`${API_BASE}/deals/deals/`).catch(() => null),
        fetch(`${API_BASE}/advisers/advisers/`).catch(() => null),
        fetch(`${API_BASE}/clients/clients/`).catch(() => null),
        fetch(`${API_BASE}/products/products/`).catch(() => null),
        fetch(`${API_BASE}/insurances/insurances/`).catch(() => null),
        fetch(`${API_BASE}/mortgage/mortgages/`).catch(() => null),
        fetch(`${API_BASE}/sales/sales/`).catch(() => null),
        fetch(`${API_BASE}/reports/reports/`).catch(() => null),
        fetch(`${API_BASE}/notifications/notifications/`).catch(() => null),
        fetch(`${API_BASE}/tasks/tasks/`).catch(() => null),
        fetch(`${API_BASE}/audit/audit/`).catch(() => null),
        fetch(`${API_BASE}/bi/analytics/`).catch(() => null),
      ]);

      const newData = {};
      
      if (dealsRes && dealsRes.ok) {
        newData.deals = await dealsRes.json();
      }
      if (advisersRes && advisersRes.ok) {
        newData.advisers = await advisersRes.json();
      }
      if (clientsRes && clientsRes.ok) {
        newData.clients = await clientsRes.json();
      }
      if (productsRes && productsRes.ok) {
        newData.products = await productsRes.json();
      }
      if (insurancesRes && insurancesRes.ok) {
        newData.insurances = await insurancesRes.json();
      }
      if (mortgagesRes && mortgagesRes.ok) {
        newData.mortgages = await mortgagesRes.json();
      }
      if (salesRes && salesRes.ok) {
        newData.sales = await salesRes.json();
      }
      if (reportsRes && reportsRes.ok) {
        newData.reports = await reportsRes.json();
      }
      if (notificationsRes && notificationsRes.ok) {
        newData.notifications = await notificationsRes.json();
      }
      if (tasksRes && tasksRes.ok) {
        newData.tasks = await tasksRes.json();
      }
      if (auditRes && auditRes.ok) {
        newData.audit = await auditRes.json();
      }
      if (analyticsRes && analyticsRes.ok) {
        newData.bi = await analyticsRes.json();
      }

      setData(newData);
    } catch (error) {
      console.log('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadModuleData = async (module) => {
    console.log('Loading module:', module);
    setLoading(true);
    setSelectedModule(module);
    
    try {
      // Правильные URL для каждого модуля
      const moduleUrls = {
        'deals': `${API_BASE}/deals/deals/`,
        'advisers': `${API_BASE}/advisers/advisers/`,
        'clients': `${API_BASE}/clients/clients/`,
        'products': `${API_BASE}/products/products/`,
        'insurances': `${API_BASE}/insurances/insurances/`,
        'mortgages': `${API_BASE}/mortgage/mortgages/`,
        'sales': `${API_BASE}/sales/sales/`,
        'reports': `${API_BASE}/reports/reports/`,
        'notifications': `${API_BASE}/notifications/notifications/`,
        'tasks': `${API_BASE}/tasks/tasks/`,
        'audit': `${API_BASE}/audit/audit/`,
        'bi': `${API_BASE}/bi/analytics/`,
      };

      const url = moduleUrls[module];
      if (!url) {
        alert(`Модуль ${module} еще не настроен`);
        return;
      }

      console.log('Fetching URL:', url);
      
      const response = await fetch(url);
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const moduleData = await response.json();
        console.log('Module data loaded:', moduleData);
        setData(prev => ({ ...prev, [module]: moduleData }));
        setCurrentView(module);
      } else {
        console.error('API Error:', response.status, response.statusText);
        alert(`Ошибка загрузки модуля ${module}: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error loading ${module} data:`, error);
      alert(`Ошибка подключения к модулю ${module}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const ModuleView = ({ module, data }) => {
    const moduleConfigs = {
      deals: {
        title: '💼 Sales Pipeline',
        color: 'bg-blue-600',
        metrics: data?.deals || {},
        actions: ['View Pipeline', 'Create Deal', 'Analytics']
      },
      advisers: {
        title: '🤵 Team Management', 
        color: 'bg-green-600',
        metrics: data?.advisers || {},
        actions: ['View Team', 'Performance', 'Training']
      },
      clients: {
        title: '👥 Client Portfolio',
        color: 'bg-purple-600', 
        metrics: data?.clients || {},
        actions: ['Client List', 'Analytics', 'Communications']
      },
      products: {
        title: '🏷️ Product Catalog',
        color: 'bg-orange-600',
        metrics: data?.products || {},
        actions: ['Product List', 'Sales Analytics', 'Inventory']
      },
      insurances: {
        title: '🛡️ Insurance Policies',
        color: 'bg-teal-600',
        metrics: data?.insurances || {},
        actions: ['Policy List', 'Claims', 'Renewals']
      },
      mortgages: {
        title: '🏠 Mortgage Lending',
        color: 'bg-pink-600', 
        metrics: data?.mortgages || {},
        actions: ['Applications', 'Approvals', 'Payments']
      },
      sales: {
        title: '💰 Sales Management',
        color: 'bg-yellow-600',
        metrics: data?.sales || {},
        actions: ['Sales List', 'Targets', 'Performance']
      },
      reports: {
        title: '📊 Reports & Analytics',
        color: 'bg-red-600',
        metrics: data?.reports || {},
        actions: ['Generate Reports', 'Dashboards', 'Exports']
      },
      notifications: {
        title: '🔔 Notifications',
        color: 'bg-blue-600',
        metrics: data?.notifications || {},
        actions: ['View All', 'Settings', 'History']
      },
      tasks: {
        title: '📝 Task Management',
        color: 'bg-green-600',
        metrics: data?.tasks || {},
        actions: ['Task List', 'Assignments', 'Calendar']
      },
      audit: {
        title: '🔍 System Audit',
        color: 'bg-purple-600',
        metrics: data?.audit || {},
        actions: ['Audit Log', 'Security', 'Compliance']
      },
      bi: {
        title: '📈 Business Intelligence',
        color: 'bg-indigo-600',
        metrics: data?.bi || {},
        actions: ['KPI Dashboard', 'Forecasting', 'Insights']
      }
    };

    const config = moduleConfigs[module];
    if (!config) return <div>Module not found</div>;

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{config.title}</h2>
            <p className="text-gray-600">Comprehensive {module} management</p>
          </div>
          <button 
            onClick={() => setCurrentView('dashboard')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Module-specific content */}
        {module === 'deals' && <DealsModule data={config.metrics} />}
        {module === 'advisers' && <AdvisersModule data={config.metrics} />}
        {module === 'clients' && <ClientsModule data={config.metrics} />}
        {module === 'products' && <ProductsModule data={config.metrics} />}
        {module === 'insurances' && <InsurancesModule data={config.metrics} />}
        {module === 'mortgages' && <MortgagesModule data={config.metrics} />}
        {module === 'sales' && <SalesModule data={config.metrics} />}
        {module === 'reports' && <ReportsModule data={config.metrics} />}
        {module === 'notifications' && <NotificationsModule data={config.metrics} />}
        {module === 'tasks' && <TasksModule data={config.metrics} />}
        {module === 'audit' && <AuditModule data={config.metrics} />}
        {module === 'bi' && <BiAnalyticsModule data={config.metrics} />}
      </div>
    );
  };

  const DealsModule = ({ data }) => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">🔥 Sales Pipeline Overview</h3>
          {data.pipeline_overview ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{data.pipeline_overview.total_deals}</div>
                <div className="text-sm text-gray-600">Total Deals</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">${(data.pipeline_overview.total_value / 1000).toFixed(0)}k</div>
                <div className="text-sm text-gray-600">Pipeline Value</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{(data.pipeline_overview.win_rate * 100).toFixed(0)}%</div>
                <div className="text-sm text-gray-600">Win Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{data.pipeline_overview.avg_cycle_time}d</div>
                <div className="text-sm text-gray-600">Avg Cycle</div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">Loading pipeline data...</div>
          )}
        </div>

        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">📊 Recent Deals</h3>
          {data.recent_deals ? (
            <div className="space-y-3">
              {data.recent_deals.slice(0, 5).map((deal, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{deal.client_name}</div>
                    <div className="text-sm text-gray-600">{deal.product}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${deal.value.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">{deal.stage}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">No deals data</div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">🎯 This Month</h3>
          {data.performance_metrics?.this_month ? (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Deals Closed:</span>
                <span className="font-bold">{data.performance_metrics.this_month.deals_closed}</span>
              </div>
              <div className="flex justify-between">
                <span>Revenue:</span>
                <span className="font-bold">${(data.performance_metrics.this_month.revenue / 1000).toFixed(0)}k</span>
              </div>
              <div className="flex justify-between">
                <span>Target:</span>
                <span className="font-bold">{(data.performance_metrics.this_month.target_achievement * 100).toFixed(0)}%</span>
              </div>
            </div>
          ) : (
            <div>Loading performance data...</div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">🏆 Top Performers</h3>
          {data.team_leaderboard ? (
            <div className="space-y-2">
              {data.team_leaderboard.slice(0, 4).map((performer, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{performer.adviser}</div>
                    <div className="text-xs text-gray-600">{performer.deals_closed} deals</div>
                  </div>
                  <div className="text-sm font-semibold text-green-600">
                    ${(performer.revenue / 1000).toFixed(0)}k
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">Loading leaderboard...</div>
          )}
        </div>
      </div>
    </div>
  );

  const AdvisersModule = ({ data }) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">👨‍💼 Team Overview</h3>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{data.results?.length || 0}</div>
            <div className="text-sm text-gray-600">Active Advisers</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">92%</div>
            <div className="text-sm text-gray-600">Avg Performance</div>
          </div>
        </div>
        
        {data.results?.length > 0 ? (
          <div className="space-y-3">
            {data.results.slice(0, 5).map((adviser, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{adviser.user?.first_name} {adviser.user?.last_name}</div>
                  <div className="text-sm text-gray-600">{adviser.role || 'Adviser'}</div>
                </div>
                <div className="text-sm">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">Active</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">Loading advisers...</div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">📈 Performance Metrics</h3>
        <div className="space-y-4">
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="text-lg font-semibold text-purple-600">Team Revenue</div>
            <div className="text-2xl font-bold">$1.2M</div>
            <div className="text-sm text-gray-600">+15% vs last month</div>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <div className="text-lg font-semibold text-orange-600">Client Satisfaction</div>
            <div className="text-2xl font-bold">4.8/5</div>
            <div className="text-sm text-gray-600">Based on 234 reviews</div>
          </div>
        </div>
      </div>
    </div>
  );

  const ClientsModule = ({ data }) => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">👥 Client Portfolio</h3>
        {data.results?.length > 0 ? (
          <div className="space-y-3">
            {data.results.slice(0, 8).map((client, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-semibold">{client.name?.[0] || 'C'}</span>
                  </div>
                  <div>
                    <div className="font-medium">{client.name}</div>
                    <div className="text-sm text-gray-600">{client.email}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">3 Policies</div>
                  <div className="text-xs text-gray-500">$4,500 premium</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">Loading clients...</div>
        )}
      </div>

      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-4">📊 Client Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Total Clients:</span>
              <span className="font-bold">{data.count || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Active Policies:</span>
              <span className="font-bold">127</span>
            </div>
            <div className="flex justify-between">
              <span>Avg LTV:</span>
              <span className="font-bold">$15.2k</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">🎯 Opportunities</h3>
          <div className="space-y-3">
            <div className="p-3 bg-yellow-50 rounded border-l-4 border-yellow-400">
              <div className="text-sm font-medium">Cross-sell Travel Insurance</div>
              <div className="text-xs text-gray-600">23 clients identified</div>
            </div>
            <div className="p-3 bg-green-50 rounded border-l-4 border-green-400">
              <div className="text-sm font-medium">Policy Renewals Due</div>
              <div className="text-xs text-gray-600">15 policies this month</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ProductsModule = ({ data }) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">🏷️ Product Catalog</h3>
        {data.results?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.results.slice(0, 6).map((product, index) => (
              <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{product.name}</div>
                  <span className={`px-2 py-1 text-xs rounded-full ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    {product.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-2">{product.provider}</div>
                <div className="text-xs text-gray-500">{product.description?.substring(0, 60)}...</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">Loading products...</div>
        )}
      </div>

      <div className="space-y-6">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-4">📈 Sales Analytics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Total Products:</span>
              <span className="font-bold">{data.count || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Best Seller:</span>
              <span className="font-bold">Life Insurance</span>
            </div>
            <div className="flex justify-between">
              <span>This Month:</span>
              <span className="font-bold">45 sold</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">🔥 Top Performers</h3>
          <div className="space-y-2">
            {['Life Insurance Premium', 'Health Coverage Plus', 'Family Protection'].map((product, index) => (
              <div key={index} className="flex justify-between items-center p-2">
                <div className="text-sm">{product}</div>
                <div className="text-sm font-semibold text-green-600">{25 - index * 3} sales</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Компоненты для новых модулей
  const InsurancesModule = ({ data }) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">🛡️ Insurance Policies</h3>
        {data.results ? (
          <div className="space-y-3">
            {data.results.map((policy, index) => (
              <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{policy.policy_number}</div>
                  <div className="text-sm text-gray-600">{policy.type}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${policy.premium}</div>
                  <div className="text-sm text-gray-600">{policy.status}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">Loading policies...</div>
        )}
      </div>
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">📊 Policy Stats</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Total Policies:</span>
            <span className="font-bold">{data.count || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Active:</span>
            <span className="font-bold">85%</span>
          </div>
          <div className="flex justify-between">
            <span>Claims Ratio:</span>
            <span className="font-bold">12%</span>
          </div>
        </div>
      </div>
    </div>
  );

  const MortgagesModule = ({ data }) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">🏠 Mortgage Applications</h3>
        {data.results ? (
          <div className="space-y-3">
            {data.results.map((mortgage, index) => (
              <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{mortgage.client}</div>
                  <div className="text-sm text-gray-600">{mortgage.application_number}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${mortgage.amount.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">{mortgage.rate}% - {mortgage.status}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">Loading applications...</div>
        )}
      </div>
      <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">📈 Lending Stats</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Applications:</span>
            <span className="font-bold">{data.count || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Approval Rate:</span>
            <span className="font-bold">78%</span>
          </div>
          <div className="flex justify-between">
            <span>Avg Rate:</span>
            <span className="font-bold">3.5%</span>
          </div>
        </div>
      </div>
    </div>
  );

  const SalesModule = ({ data }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">💰 Sales Performance</h3>
      {data.results ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.results.map((sale, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{sale.adviser}</div>
                  <div className="text-sm text-gray-600">{sale.client}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${sale.amount.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">{sale.status}</div>
                </div>
              </div>
            </div>
          ))}
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-lg font-semibold text-green-600">Total Sales</div>
            <div className="text-2xl font-bold">${data.total_sales?.toLocaleString() || 0}</div>
            <div className="text-sm text-gray-600">Target: ${data.monthly_target?.toLocaleString() || 0}</div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500">Loading sales data...</div>
      )}
    </div>
  );

  const ReportsModule = ({ data }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">📊 Available Reports</h3>
      {data.results ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.results.map((report, index) => (
            <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="font-medium">{report.name}</div>
              <div className="text-sm text-gray-600 mt-1">{report.type}</div>
              <div className="text-xs text-gray-500 mt-2">Generated: {report.generated}</div>
              <div className="mt-3">
                <span className={`px-2 py-1 text-xs rounded-full ${report.status === 'ready' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {report.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">Loading reports...</div>
      )}
    </div>
  );

  const NotificationsModule = ({ data }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">🔔 Recent Notifications</h3>
      {data.results ? (
        <div className="space-y-3">
          {data.results.map((notification, index) => (
            <div key={index} className={`p-4 border rounded-lg ${!notification.read ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'}`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-medium">{notification.title}</div>
                  <div className="text-sm text-gray-600 mt-1">{notification.message}</div>
                  <div className="text-xs text-gray-500 mt-2">{new Date(notification.created).toLocaleString()}</div>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full ml-2 mt-1"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">Loading notifications...</div>
      )}
    </div>
  );

  const TasksModule = ({ data }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">📝 Task Management</h3>
      {data.results ? (
        <div className="space-y-3">
          {data.results.map((task, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-medium">{task.title}</div>
                  <div className="text-sm text-gray-600 mt-1">{task.description}</div>
                  <div className="text-xs text-gray-500 mt-2">Due: {task.due_date} | Assigned: {task.assigned_to}</div>
                </div>
                <div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    task.status === 'completed' ? 'bg-green-100 text-green-800' :
                    task.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">Loading tasks...</div>
      )}
    </div>
  );

  const AuditModule = ({ data }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">🔍 System Audit Log</h3>
      {data.results ? (
        <div className="space-y-2">
          {data.results.map((log, index) => (
            <div key={index} className="p-3 border rounded-lg text-sm">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium">{log.action}</span>
                  <span className="text-gray-600 ml-2">by {log.user}</span>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(log.timestamp).toLocaleString()}
                </div>
              </div>
              {log.details && (
                <div className="text-gray-600 text-xs mt-1">{log.details}</div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">Loading audit logs...</div>
      )}
    </div>
  );

  const BiAnalyticsModule = ({ data }) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">📈 Key Performance Indicators</h3>
        {data.kpi_data ? (
          <div className="space-y-4">
            {data.kpi_data.map((kpi, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{kpi.metric}</div>
                  <div className="text-xs text-gray-600">{kpi.period}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{kpi.value}</div>
                  <div className={`text-xs ${kpi.trend === 'up' ? 'text-green-600' : kpi.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                    {kpi.trend === 'up' ? '↗️' : kpi.trend === 'down' ? '↘️' : '→'} {kpi.trend}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">Loading KPIs...</div>
        )}
      </div>
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">🎯 Business Insights</h3>
        {data.predictive_insights ? (
          <div className="space-y-3">
            <div>
              <div className="font-medium">Forecast:</div>
              <div className="text-sm">{data.predictive_insights.next_month_forecast}</div>
            </div>
            <div>
              <div className="font-medium">Opportunities:</div>
              <div className="text-sm">{data.predictive_insights.opportunities?.join(', ')}</div>
            </div>
          </div>
        ) : (
          <div>Loading insights...</div>
        )}
      </div>
    </div>
  );

  const DashboardView = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Executive Summary Header */}
      <div className="bg-white shadow-lg border-b border-gray-200 mb-8">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Commission Management Platform
              </h1>
              <p className="text-gray-600 mt-1">Enterprise-grade commission tracking and business intelligence</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right mr-4">
                <div className="text-sm text-gray-500">Welcome back,</div>
                <div className="text-sm font-semibold text-gray-800">{user?.firstName} {user?.lastName}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">System Status</div>
                <div className={`text-sm font-semibold ${apiStatus === 'connected' ? 'text-green-600' : 'text-red-600'}`}>
                  {apiStatus === 'connected' ? '🟢 All Systems Operational' : '🔴 Connection Issues'}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Dashboard */}
      <div className="px-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Total Revenue</p>
                <p className="text-3xl font-bold">$2.85M</p>
                <p className="text-sm text-green-100">+12% from last month</p>
              </div>
              <div className="text-4xl opacity-80">💰</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Active Deals</p>
                <p className="text-3xl font-bold">{data.deals?.pipeline_overview?.total_deals || 156}</p>
                <p className="text-sm text-blue-100">Pipeline value: $4.2M</p>
              </div>
              <div className="text-4xl opacity-80">📊</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Team Performance</p>
                <p className="text-3xl font-bold">94%</p>
                <p className="text-sm text-purple-100">Target achievement</p>
              </div>
              <div className="text-4xl opacity-80">🎯</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Client Satisfaction</p>
                <p className="text-3xl font-bold">4.8/5</p>
                <p className="text-sm text-orange-100">Based on 1,247 reviews</p>
              </div>
              <div className="text-4xl opacity-80">⭐</div>
            </div>
          </div>
        </div>
      </div>

      {/* Business Intelligence Modules */}
      <div className="px-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Business Intelligence Modules</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sales & Revenue Management */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
              <h3 className="text-xl font-semibold text-white mb-2">💼 Sales & Revenue</h3>
              <p className="text-blue-100">Pipeline management and revenue tracking</p>
            </div>
            <div className="p-6 space-y-4">
              <div 
                onClick={() => loadModuleData('deals')}
                className="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white text-lg">💼</div>
                  <div>
                    <div className="font-semibold text-gray-900">Sales Pipeline</div>
                    <div className="text-sm text-gray-600">{data.deals?.pipeline_overview?.total_deals || 156} active deals</div>
                  </div>
                </div>
                <div className="text-blue-600">→</div>
              </div>

              <div 
                onClick={() => loadModuleData('sales')}
                className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center text-white text-lg">💰</div>
                  <div>
                    <div className="font-semibold text-gray-900">Sales Management</div>
                    <div className="text-sm text-gray-600">{data.sales?.count || 0} transactions</div>
                  </div>
                </div>
                <div className="text-yellow-600">→</div>
              </div>
            </div>
          </div>

          {/* Client & Relationship Management */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-6">
              <h3 className="text-xl font-semibold text-white mb-2">👥 Client Management</h3>
              <p className="text-green-100">Customer relationships and portfolios</p>
            </div>
            <div className="p-6 space-y-4">
              <div 
                onClick={() => loadModuleData('clients')}
                className="flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white text-lg">👥</div>
                  <div>
                    <div className="font-semibold text-gray-900">Client Portfolio</div>
                    <div className="text-sm text-gray-600">{data.clients?.count || 0} active clients</div>
                  </div>
                </div>
                <div className="text-green-600">→</div>
              </div>

              <div 
                onClick={() => loadModuleData('advisers')}
                className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-lg">🤵</div>
                  <div>
                    <div className="font-semibold text-gray-900">Team Management</div>
                    <div className="text-sm text-gray-600">{data.advisers?.count || data.advisers?.results?.length || 0} advisers</div>
                  </div>
                </div>
                <div className="text-indigo-600">→</div>
              </div>
            </div>
          </div>

          {/* Product & Service Management */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6">
              <h3 className="text-xl font-semibold text-white mb-2">🏷️ Product Services</h3>
              <p className="text-purple-100">Insurance, mortgage and product management</p>
            </div>
            <div className="p-6 space-y-4">
              <div 
                onClick={() => loadModuleData('products')}
                className="flex items-center justify-between p-4 bg-purple-50 rounded-lg hover:bg-purple-100 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white text-lg">🏷️</div>
                  <div>
                    <div className="font-semibold text-gray-900">Product Catalog</div>
                    <div className="text-sm text-gray-600">{data.products?.count || 0} products</div>
                  </div>
                </div>
                <div className="text-purple-600">→</div>
              </div>

              <div 
                onClick={() => loadModuleData('insurances')}
                className="flex items-center justify-between p-4 bg-teal-50 rounded-lg hover:bg-teal-100 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center text-white text-lg">🛡️</div>
                  <div>
                    <div className="font-semibold text-gray-900">Insurance Policies</div>
                    <div className="text-sm text-gray-600">{data.insurances?.count || 0} policies</div>
                  </div>
                </div>
                <div className="text-teal-600">→</div>
              </div>

              <div 
                onClick={() => loadModuleData('mortgages')}
                className="flex items-center justify-between p-4 bg-pink-50 rounded-lg hover:bg-pink-100 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-pink-600 rounded-lg flex items-center justify-center text-white text-lg">🏠</div>
                  <div>
                    <div className="font-semibold text-gray-900">Mortgage Lending</div>
                    <div className="text-sm text-gray-600">{data.mortgages?.count || 0} applications</div>
                  </div>
                </div>
                <div className="text-pink-600">→</div>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics & Operations Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Analytics & Reporting */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-6">
              <h3 className="text-xl font-semibold text-white mb-2">📊 Analytics & Intelligence</h3>
              <p className="text-indigo-100">Business intelligence and reporting</p>
            </div>
            <div className="p-6 space-y-4">
              <div 
                onClick={() => loadModuleData('bi')}
                className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-lg">📈</div>
                  <div>
                    <div className="font-semibold text-gray-900">Business Intelligence</div>
                    <div className="text-sm text-gray-600">Advanced KPI analytics</div>
                  </div>
                </div>
                <div className="text-indigo-600">→</div>
              </div>

              <div 
                onClick={() => loadModuleData('reports')}
                className="flex items-center justify-between p-4 bg-red-50 rounded-lg hover:bg-red-100 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white text-lg">📊</div>
                  <div>
                    <div className="font-semibold text-gray-900">Reports & Analytics</div>
                    <div className="text-sm text-gray-600">{data.reports?.count || 0} reports available</div>
                  </div>
                </div>
                <div className="text-red-600">→</div>
              </div>
            </div>
          </div>

          {/* Operations & Management */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-orange-600 to-orange-700 p-6">
              <h3 className="text-xl font-semibold text-white mb-2">⚙️ Operations</h3>
              <p className="text-orange-100">System management and monitoring</p>
            </div>
            <div className="p-6 space-y-4">
              <div 
                onClick={() => loadModuleData('tasks')}
                className="flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white text-lg">📝</div>
                  <div>
                    <div className="font-semibold text-gray-900">Task Management</div>
                    <div className="text-sm text-gray-600">{data.tasks?.open_tasks || 0} open tasks</div>
                  </div>
                </div>
                <div className="text-green-600">→</div>
              </div>

              <div 
                onClick={() => loadModuleData('notifications')}
                className="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white text-lg">🔔</div>
                  <div>
                    <div className="font-semibold text-gray-900">Notifications</div>
                    <div className="text-sm text-gray-600">{data.notifications?.unread_count || 0} unread</div>
                  </div>
                </div>
                <div className="text-blue-600">→</div>
              </div>

              <div 
                onClick={() => loadModuleData('audit')}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center text-white text-lg">🔍</div>
                  <div>
                    <div className="font-semibold text-gray-900">System Audit</div>
                    <div className="text-sm text-gray-600">{data.audit?.today_actions || 0} actions today</div>
                  </div>
                </div>
                <div className="text-gray-600">→</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Access Panel */}
        <div className="mt-8 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">🚀 Quick Access</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => window.open(`${API_BASE.replace('/api', '/admin/')}`, '_blank')}
              className="flex items-center justify-center space-x-3 p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-white"
            >
              <span className="text-xl">⚙️</span>
              <span>Django Admin Panel</span>
            </button>
            <button 
              onClick={() => window.open(`${API_BASE}/docs/`, '_blank')}
              className="flex items-center justify-center space-x-3 p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-white"
            >
              <span className="text-xl">📚</span>
              <span>API Documentation</span>
            </button>
            <button 
              className="flex items-center justify-center space-x-3 p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-white"
            >
              <span className="text-xl">📈</span>
              <span>System Status</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Компонент страницы входа
  const LoginPage = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      
      const result = await handleLogin(credentials);
      if (!result.success) {
        setError(result.error);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Commission Tracker
              </h1>
              <p className="text-gray-600 mt-2">Enterprise Management Platform</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your username"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your password"
                  required
                />
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 font-medium"
              >
                {loginLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <button
                onClick={() => setAuthMode('register')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Don't have an account? Create one
              </button>
            </div>
            
            <div className="mt-4 text-center">
              <div className="text-xs text-gray-500 bg-gray-50 p-4 rounded-lg">
                <strong>Create an account or use demo:</strong><br/>
                Demo Username: admin<br/>
                Demo Password: admin
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Показываем соответствующую страницу авторизации если не авторизован
  if (!isAuthenticated) {
    if (authMode === 'register') {
      return (
        <Registration
          onRegistrationSuccess={handleRegister}
          onBackToLogin={() => setAuthMode('login')}
          loading={loginLoading}
        />
      );
    } else if (authMode === '2fa') {
      return (
        <TwoFactorAuth
          onTwoFactorSuccess={handleTwoFactorVerification}
          onBackToLogin={() => {
            setAuthMode('login');
            setPendingUser(null);
            setTwoFactorCode('');
          }}
          loading={loginLoading}
          user={pendingUser}
        />
      );
    } else {
      return <LoginPage />;
    }
  }

  return (
    <div className="commission-tracker min-h-screen bg-gray-50">
      {/* Modern Header integrated into Dashboard */}

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {loading && (
            <div className="fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Loading...</span>
              </div>
            </div>
          )}
          
          {currentView === 'dashboard' && <DashboardView />}
          {['deals', 'advisers', 'clients', 'products', 'insurances', 'mortgages', 'sales', 'reports', 'notifications', 'tasks', 'audit', 'bi'].includes(currentView) && (
            <ModuleView module={currentView} data={data} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;