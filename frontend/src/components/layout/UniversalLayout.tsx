import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../styles/corporate-design-system.css';
import '../../styles/sidebar-layout.css';

const UniversalLayout = ({ children }) => {
  const location = useLocation();
  const [currentModule, setCurrentModule] = useState('dashboard');

  // Все модули проекта - серьезные названия без эмодзи
  const modules = [
    { id: 'dashboard', name: 'Dashboard', path: '/', icon: '' },
    { id: 'consultants', name: 'Consultants', path: '/consultants', icon: '' },
    { id: 'clients', name: 'Clients', path: '/clients', icon: '' },
    { id: 'mortgages', name: 'Mortgages', path: '/mortgages', icon: '' },
    { id: 'insurances', name: 'Insurances', path: '/insurances', icon: '' },
    { id: 'products', name: 'Products', path: '/products', icon: '' },
    { id: 'sales', name: 'Sales', path: '/sales', icon: '' },
    { id: 'processes', name: 'Processes', path: '/processes', icon: '' },
    { id: 'financials', name: 'Financials', path: '/financials', icon: '' },
    { id: 'reports', name: 'Reports', path: '/reports', icon: '' },
    { id: 'settings', name: 'Settings', path: '/settings', icon: '' },
    { id: 'permissions', name: 'Permissions', path: '/permissions', icon: '' }
  ];

  useEffect(() => {
    const currentPath = location.pathname;
    const module = modules.find(m => m.path === currentPath) || modules[0];
    setCurrentModule(module.id);
  }, [location]);

  const getCurrentModuleName = () => {
    const module = modules.find(m => m.id === currentModule);
    return module ? module.name : 'UK Commission Management System';
  };

  return (
    <div className="page-container">
      <div className="content-wrapper">
        {/* Профессиональный заголовок системы */}
        <div className="card mb-lg">
          <div className="card-header text-center">
            <h1 className="page-title">
              UK Commission Management System
            </h1>
            <p className="text-secondary">
              Professional Commission Management for Financial Services
            </p>
          </div>
        </div>

        {/* Профессиональная навигация по все�� модулям */}
        <div className="nav-bar">
          {modules.map(module => (
            <Link
              key={module.id}
              to={module.path}
              className={`nav-tab ${currentModule === module.id ? 'active' : ''}`}
            >
              {module.name}
            </Link>
          ))}
        </div>

        {/* Хлебные крошки */}
        <div className="card mb-md">
          <div className="card-header" style={{padding: '16px 24px'}}>
            <div className="d-flex justify-content-between align-items-center">
              <div className="breadcrumb">
                <span className="text-secondary">Home</span>
                <span className="text-muted" style={{margin: '0 8px'}}>/</span>
                <span className="text-primary">{getCurrentModuleName()}</span>
              </div>
              <div className="system-status">
                <div className="d-flex align-items-center gap-sm">
                  <div className="status-indicator" style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--success-color)'
                  }}></div>
                  <span className="text-secondary" style={{fontSize: '14px'}}>System Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Основной контент всех модулей */}
        <div className="module-content fade-in">
          {children}
        </div>

        {/* Профессиональный футер */}
        <div className="card mt-lg">
          <div className="card-header">
            <div className="d-flex justify-content-between align-items-center">
              <div className="system-info">
                <p className="text-secondary mb-0">
                  Last updated: {new Date().toLocaleString('en-GB')}
                </p>
                <p className="text-muted mb-0" style={{fontSize: '12px'}}>
                  System Version: 2.0 | All modules integrated
                </p>
              </div>
              <div className="system-actions d-flex gap-md">
                <button className="btn btn-outline btn-small">
                  Refresh Data
                </button>
                <button className="btn btn-primary btn-small">
                  Export Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversalLayout;
