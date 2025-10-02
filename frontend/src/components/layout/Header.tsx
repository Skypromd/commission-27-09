import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bars3Icon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { LanguageSelector } from '../common/LanguageSelector';
import { NotificationBell } from '@/features/notifications';
import { useLogoutMutation } from '@/features/auth/authApiSlice';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/features/auth/authSlice';

// Типизация для пропсов Header
interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
  const user = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [logout] = useLogoutMutation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async (): Promise<void> => {
    try {
      await logout({}).unwrap();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const handleProfileClick = (): void => {
    navigate('/profile');
    setShowUserMenu(false);
  };

  const handleSettingsClick = (): void => {
    navigate('/settings');
    setShowUserMenu(false);
  };

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Открыть меню</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="relative flex flex-1"></div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <LanguageSelector />
          <NotificationBell />

          {/* Separator */}
          <div
            className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
            aria-hidden="true"
          />

          {/* Profile dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              className="-m-1.5 flex items-center p-1.5"
              id="user-menu-button"
              aria-expanded={showUserMenu}
              aria-haspopup="true"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <span className="sr-only">Открыть меню пользователя</span>
              {user?.avatar ? (
                <img
                  className="h-8 w-8 rounded-full bg-gray-50"
                  src={user.avatar}
                  alt={user.username}
                />
              ) : (
                <UserCircleIcon className="h-8 w-8 text-gray-400" />
              )}
              <span className="hidden lg:flex lg:items-center">
                <span
                  className="ml-4 text-sm font-semibold leading-6 text-gray-900"
                  aria-hidden="true"
                >
                  {user?.username || 'Пользователь'}
                </span>
              </span>
            </button>

            {/* User Menu Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 z-10 mt-2.5 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                <div className="px-4 py-2 text-sm text-gray-900 border-b border-gray-200">
                  <div className="font-medium">{user?.username}</div>
                  <div className="text-gray-500">{user?.email}</div>
                </div>

                <button
                  onClick={handleProfileClick}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  Профиль
                </button>

                <button
                  onClick={handleSettingsClick}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  Настройки
                </button>

                <div className="border-t border-gray-200 my-1"></div>

                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    <ArrowRightOnRectangleIcon className="mr-2 h-4 w-4" />
                    Выйти
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
