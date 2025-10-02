import React, { useState, useEffect } from 'react';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [apiStatus, setApiStatus] = useState('checking');
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  
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
      // Загружаем данные из всех модулей
      const [dealsRes, policiesRes, commissionsRes, usersRes, clientsRes] = await Promise.all([
        fetch(`${API_BASE}/deals/deals/`).catch(() => null),
        fetch(`${API_BASE}/policies/policies/`).catch(() => null),
        fetch(`${API_BASE}/commission/commissions/`).catch(() => null),
        fetch(`${API_BASE}/users/users/`).catch(() => null),
        fetch(`${API_BASE}/clients/clients/`).catch(() => null),
      ]);

      const newData = {};
      
      if (dealsRes && dealsRes.ok) {
        newData.deals = await dealsRes.json();
      }
      if (policiesRes && policiesRes.ok) {
        newData.policies = await policiesRes.json();
      }
      if (commissionsRes && commissionsRes.ok) {
        newData.commissions = await commissionsRes.json();
      }
      if (usersRes && usersRes.ok) {
        newData.users = await usersRes.json();
      }
      if (clientsRes && clientsRes.ok) {
        newData.clients = await clientsRes.json();
      }

      setData(newData);
    } catch (error) {
      console.log('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadModuleData = async (module) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/${module}/${module}/`);
      if (response.ok) {
        const moduleData = await response.json();
        setData(prev => ({ ...prev, [module]: moduleData }));
      }
    } catch (error) {
      console.log(`Error loading ${module} data:`, error);
    } finally {
      setLoading(false);
    }
  };

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

      {/* Modules */}
      <div className="md:col-span-2 lg:col-span-3 bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Commission Tracker Modules</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Users', icon: '👤', desc: 'User Management' },
              { name: 'Advisers', icon: '🤵', desc: 'Adviser Profiles' },
              { name: 'Clients', icon: '👥', desc: 'Client Database' },
              { name: 'Products', icon: '🏷️', desc: 'Product Catalog' },
              { name: 'Policies', icon: '📋', desc: 'Policy Management' },
              { name: 'Commissions', icon: '💰', desc: 'Commission Tracking' },
              { name: 'Reports', icon: '📊', desc: 'Analytics & Reports' },
              { name: 'Settings', icon: '⚙️', desc: 'System Configuration' }
            ].map((module) => (
              <div key={module.name} className="text-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="text-2xl mb-2">{module.icon}</div>
                <div className="font-medium text-gray-900">{module.name}</div>
                <div className="text-xs text-gray-500">{module.desc}</div>
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
          {currentView === 'dashboard' && <DashboardView />}
        </div>
      </main>
    </div>
  );
}

export default App;