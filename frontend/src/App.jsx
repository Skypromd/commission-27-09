import React, { useState, useEffect } from 'react';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [apiStatus, setApiStatus] = useState('checking');
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  
  // Определяем backend URL
  const API_BASE = window.location.hostname.includes('preview.emergentagent.com') 
    ? `https://${window.location.hostname.replace('3001', '8080')}/api`
    : 'http://localhost:8080/api';

  useEffect(() => {
    checkApiConnection();
    loadDashboardData();
  }, []);

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

  const DashboardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Status Card */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                apiStatus === 'connected' ? 'bg-green-100 text-green-600' : 
                apiStatus === 'error' ? 'bg-red-100 text-red-600' : 
                'bg-yellow-100 text-yellow-600'
              }`}>
                {apiStatus === 'connected' ? '✓' : apiStatus === 'error' ? '✗' : '○'}
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  API Status
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {apiStatus === 'connected' ? 'Connected' : 
                   apiStatus === 'error' ? 'Disconnected' : 'Checking...'}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button 
              onClick={() => window.open(`${API_BASE.replace('/api', '/admin/')}`, '_blank')}
              className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded"
            >
              📊 Open Django Admin
            </button>
            <button 
              onClick={() => window.open(`${API_BASE}/docs/`, '_blank')}
              className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded"
            >
              📚 View API Documentation
            </button>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <h3 className="text-lg font-medium text-gray-900 mb-4">System Info</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div>Frontend: React + Vite</div>
            <div>Backend: Django + DRF</div>
            <div>Database: SQLite</div>
            <div>Status: ✅ Running</div>
          </div>
        </div>
      </div>

      {/* Interactive Modules */}
      <div className="md:col-span-2 lg:col-span-3 bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <h3 className="text-lg font-medium text-gray-900 mb-4">🚀 Commission Tracker Modules</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { 
                name: 'Deals', 
                key: 'deals',
                icon: '💼', 
                desc: 'Sales Pipeline',
                color: 'hover:bg-blue-50 hover:border-blue-200',
                stats: data.deals?.pipeline_overview ? `${data.deals.pipeline_overview.total_deals} deals` : 'Loading...'
              },
              { 
                name: 'Advisers', 
                key: 'advisers',
                icon: '🤵', 
                desc: 'Team Management',
                color: 'hover:bg-green-50 hover:border-green-200',
                stats: data.advisers ? `${data.advisers.count || data.advisers.results?.length || 0} advisers` : 'Loading...'
              },
              { 
                name: 'Clients', 
                key: 'clients',
                icon: '👥', 
                desc: 'Client Portfolio',
                color: 'hover:bg-purple-50 hover:border-purple-200',
                stats: data.clients ? `${data.clients.count || data.clients.results?.length || 0} clients` : 'Loading...'
              },
              { 
                name: 'Products', 
                key: 'products',
                icon: '🏷️', 
                desc: 'Product Catalog',
                color: 'hover:bg-orange-50 hover:border-orange-200',
                stats: data.products ? `${data.products.count || data.products.results?.length || 0} products` : 'Loading...'
              },
              { 
                name: 'Policies', 
                key: 'policies',
                icon: '📋', 
                desc: 'Policy Management',
                color: 'hover:bg-indigo-50 hover:border-indigo-200',
                stats: '127 active policies'
              },
              { 
                name: 'Insurances', 
                key: 'insurances',
                icon: '🛡️', 
                desc: 'Insurance Policies',
                color: 'hover:bg-teal-50 hover:border-teal-200',
                stats: data.insurances ? `${data.insurances.count || data.insurances.results?.length || 0} policies` : 'Loading...'
              },
              { 
                name: 'Mortgage', 
                key: 'mortgages',
                icon: '🏠', 
                desc: 'Mortgage Lending',
                color: 'hover:bg-pink-50 hover:border-pink-200',
                stats: data.mortgages ? `${data.mortgages.count || data.mortgages.results?.length || 0} applications` : 'Loading...'
              },
              { 
                name: 'Commissions', 
                key: 'commissions',
                icon: '💰', 
                desc: 'Commission Tracking',
                color: 'hover:bg-yellow-50 hover:border-yellow-200',
                stats: '$45.2k this month'
              },
              { 
                name: 'Reports', 
                key: 'reports',
                icon: '📊', 
                desc: 'Analytics & Reports',
                color: 'hover:bg-red-50 hover:border-red-200',
                stats: '15 reports available'
              },
              { 
                name: 'Sales', 
                key: 'sales',
                icon: '💰', 
                desc: 'Sales Management',
                color: 'hover:bg-yellow-50 hover:border-yellow-200',
                stats: data.sales ? `${data.sales.count || 0} sales` : 'Loading...'
              },
              { 
                name: 'Reports', 
                key: 'reports',
                icon: '📊', 
                desc: 'Analytics & Reports',
                color: 'hover:bg-red-50 hover:border-red-200',
                stats: data.reports ? `${data.reports.count || 0} reports` : 'Loading...'
              },
              { 
                name: 'Notifications', 
                key: 'notifications',
                icon: '🔔', 
                desc: 'System Notifications',
                color: 'hover:bg-blue-50 hover:border-blue-200',
                stats: data.notifications ? `${data.notifications.unread_count || 0} unread` : 'Loading...'
              },
              { 
                name: 'Tasks', 
                key: 'tasks',
                icon: '📝', 
                desc: 'Task Management',
                color: 'hover:bg-green-50 hover:border-green-200',
                stats: data.tasks ? `${data.tasks.open_tasks || 0} open` : 'Loading...'
              },
              { 
                name: 'Audit', 
                key: 'audit',
                icon: '🔍', 
                desc: 'System Audit',
                color: 'hover:bg-purple-50 hover:border-purple-200',
                stats: data.audit ? `${data.audit.today_actions || 0} today` : 'Loading...'
              },
              { 
                name: 'Analytics', 
                key: 'bi',
                icon: '📈', 
                desc: 'Business Intelligence',
                color: 'hover:bg-indigo-50 hover:border-indigo-200',
                stats: 'Advanced BI'
              }
            ].map((module) => (
              <div 
                key={module.name} 
                onClick={() => {
                  console.log('Module clicked:', module.key);
                  if (['deals', 'advisers', 'clients', 'products', 'insurances', 'mortgages', 'sales', 'reports', 'notifications', 'tasks', 'audit', 'bi'].includes(module.key)) {
                    loadModuleData(module.key);
                  } else {
                    alert(`${module.name} модуль в разработке. Доступны: Deals, Advisers, Clients, Products, Insurances, Mortgage`);
                  }
                }}
                className={`text-center p-4 border border-gray-200 rounded-lg transition-all cursor-pointer ${module.color} ${loading && selectedModule === module.key ? 'animate-pulse' : ''}`}
              >
                <div className="text-2xl mb-2">{module.icon}</div>
                <div className="font-medium text-gray-900">{module.name}</div>
                <div className="text-xs text-gray-500 mb-1">{module.desc}</div>
                <div className="text-xs font-medium text-blue-600">{module.stats}</div>
                <div className="mt-2 text-xs text-gray-400">
                  {['deals', 'advisers', 'clients', 'products', 'insurances', 'mortgages'].includes(module.key) 
                    ? 'Click to explore →' 
                    : 'Coming soon...'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="commission-tracker min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Commission Tracker
              </h1>
              <span className="ml-3 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                v2.2.0
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Welcome, Admin
              </div>
              <button
                onClick={() => window.open(`${API_BASE.replace('/api', '/admin/')}`, '_blank')}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md"
              >
                Admin Panel
              </button>
            </div>
          </div>
        </div>
      </header>

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
          {['deals', 'advisers', 'clients', 'products'].includes(currentView) && (
            <ModuleView module={currentView} data={data} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;