import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  UsersIcon,
  UserGroupIcon,
  BuildingOffice2Icon,
  ShieldCheckIcon,
  CogIcon,
  ChartBarIcon,
  BanknotesIcon,
  ClipboardDocumentListIcon,
  KeyIcon,
  ShoppingCartIcon,
  DocumentChartBarIcon,
  SwatchIcon,
  CodeBracketIcon,
  CurrencyDollarIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const location = useLocation();

  // FORCED UPDATE v2.0 - 2025-01-25-16:00 - MUST SHOW ALL 16 MODULES IN REACT APP
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, color: 'from-blue-600 to-blue-700' },
    { name: 'Консультанты', href: '/consultants', icon: UserGroupIcon, color: 'from-blue-500 to-blue-600' },
    { name: 'Клиенты', href: '/clients', icon: UsersIcon, color: 'from-blue-500 to-cyan-600' },
    { name: 'Продукты', href: '/products', icon: ClipboardDocumentListIcon, color: 'from-blue-600 to-indigo-600' },
    { name: 'Продажи', href: '/sales', icon: ShoppingCartIcon, color: 'from-green-500 to-emerald-600' },
    { name: 'Ипотека', href: '/mortgages', icon: BuildingOffice2Icon, color: 'from-blue-600 to-blue-700' },
    { name: 'Страхование', href: '/insurances', icon: ShieldCheckIcon, color: 'from-teal-500 to-cyan-600' },
    { name: 'Комиссии', href: '/commissions', icon: CurrencyDollarIcon, color: 'from-yellow-500 to-orange-600' },
    { name: 'Процессы', href: '/processes', icon: CogIcon, color: 'from-slate-500 to-slate-600' },
    { name: 'Финансы', href: '/financials', icon: BanknotesIcon, color: 'from-green-600 to-emerald-600' },
    { name: 'Отчеты', href: '/reports', icon: DocumentChartBarIcon, color: 'from-blue-500 to-indigo-600' },
    { name: 'ML Аналитика', href: '/ml-analytics', icon: CpuChipIcon, color: 'from-purple-500 to-pink-600' },
    { name: 'Настройки', href: '/settings', icon: CogIcon, color: 'from-slate-600 to-slate-700' },
    { name: 'Разрешения', href: '/permissions', icon: KeyIcon, color: 'from-red-600 to-red-700' },
    { name: 'UI Компоненты', href: '/ui-components-demo', icon: CodeBracketIcon, color: 'from-cyan-500 to-blue-600' },
    { name: 'Корпоративный стиль', href: '/corporate-style-demo', icon: SwatchIcon, color: 'from-blue-500 to-blue-600' },
    { name: 'Сделки', href: '/deals', icon: ClipboardDocumentListIcon, color: 'from-blue-600 to-indigo-600' } // Добавлена ссылка на страницу "Сделки"
  ];

  // Debug log to verify all 16 modules are loaded
  React.useEffect(() => {
    console.log('🔥 SIDEBAR FORCE UPDATE v2.0 - LOADED WITH', navigation.length, 'MODULES');
    console.log('📋 ALL MODULES:', navigation.map(n => n.name).join(', '));
    if (navigation.length !== 16) {
      console.error('❌ EXPECTED 16 MODULES, GOT:', navigation.length);
    } else {
      console.log('✅ ALL 16 MODULES LOADED SUCCESSFULLY!');
    }
  }, []);

  const isActive = (href) => {
    if (href === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname === href;
  };

  return (
    <div className="flex flex-col w-64 h-full bg-gradient-to-br from-slate-800 via-blue-900 to-slate-800 shadow-2xl" style={{backgroundColor: '#2c3e50'}}>
      {/* Header Section with Glass Effect */}
      <div className="flex flex-col items-center flex-shrink-0 px-6 py-6 bg-white/10 backdrop-blur-lg border-b border-white/20" style={{backgroundColor: '#34495e'}}>
        <div className="flex items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl blur opacity-75 animate-pulse"></div>
            <BuildingOffice2Icon className="relative w-10 h-10 text-white" />
          </div>
          <div className="ml-4">
            <h1 className="text-xl font-bold text-white bg-gradient-to-r from-blue-300 to-blue-400 bg-clip-text text-transparent">
              UK Commission
            </h1>
            <p className="text-sm text-white/90 font-medium">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* User Profile Section - показываем всегда */}
      <div className="flex items-center px-6 py-4 bg-white/10 backdrop-blur border-b border-white/10" style={{backgroundColor: 'rgba(52, 73, 94, 0.8)'}}>
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white/20">
            <span className="text-sm font-bold text-white">P</span>
          </div>
        </div>
        <div className="ml-3 min-w-0 flex-1">
          <p className="text-sm font-semibold text-white truncate">
            Production Administrator
          </p>
          <p className="text-xs text-blue-300 truncate capitalize font-medium">
            Administrator
          </p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto scrollbar-hide">
        {navigation.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={`group relative flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 transform hover:scale-105 ${
                active
                  ? 'bg-gradient-to-r from-blue-600/20 to-blue-700/20 text-white shadow-lg ring-1 ring-blue-400/30 backdrop-blur-sm'
                  : 'text-white/80 hover:bg-blue-600/10 hover:text-white hover:shadow-md'
              }`}
              style={{
                animationDelay: `${index * 50}ms`
              }}
            >
              {/* Active indicator */}
              {active && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-purple-500 rounded-r-lg"></div>
              )}

              {/* Icon with gradient background */}
              <div className={`relative mr-3 p-2 rounded-lg ${active ? `bg-gradient-to-r ${item.color}` : 'bg-white/10'} transition-all duration-300 group-hover:shadow-lg`}>
                <Icon
                  className={`h-5 w-5 transition-all duration-300 ${
                    active ? 'text-white' : 'text-white/80 group-hover:text-white'
                  }`}
                  aria-hidden="true"
                />
              </div>

              <span className="relative z-10 font-medium">
                {item.name}
              </span>

              {/* Hover glow effect */}
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer with Animated Elements */}
      <div className="flex-shrink-0 px-6 py-4 bg-white/5 backdrop-blur border-t border-white/10">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="ml-2 text-xs text-white/80 font-medium">Online</span>
          </div>
          <p className="text-xs text-white/60">
            © 2024 UK Commission Admin
          </p>
          <p className="text-xs text-white/40 mt-1 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-semibold">
            v1.0.0 Pro
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
