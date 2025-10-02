/**
 * UK Commission Admin Panel - Mobile PWA Component
 * Progressive Web App с offline поддержкой и мобильной оптимизацией
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Bell, User, Home, Users, DollarSign, 
  BarChart, Settings, Wifi, WifiOff, Download, 
  Smartphone, RefreshCw 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useSwipeable } from 'react-swipeable';

interface MobileAppProps {
  children: React.ReactNode;
}

const MobileApp: React.FC<MobileAppProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notifications, setNotifications] = useState<any[]>([]);

  // PWA Installation
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Online/Offline detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Connection restored', { icon: '🟢' });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error('Working offline', { icon: '🔴' });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Service Worker registration
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }
  }, []);

  // Push notifications
  useEffect(() => {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          // Setup push notifications
          setupPushNotifications();
        }
      });
    }
  }, []);

  const setupPushNotifications = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.REACT_APP_VAPID_PUBLIC_KEY
      });

      // Send subscription to backend
      await fetch('/api/v1/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription)
      });
    } catch (error) {
      console.error('Error setting up push notifications:', error);
    }
  };

  const handleInstallApp = async () => {
    if (!installPrompt) return;

    installPrompt.prompt();
    const choiceResult = await installPrompt.userChoice;

    if (choiceResult.outcome === 'accepted') {
      toast.success('App installed successfully!');
      setInstallPrompt(null);
    }
  };

  // Swipe gestures
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setIsMenuOpen(false),
    onSwipedRight: () => setIsMenuOpen(true),
    trackMouse: true
  });

  const mobileNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'commissions', label: 'Commissions', icon: DollarSign },
    { id: 'analytics', label: 'Analytics', icon: BarChart },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const MobileHeader = () => (
    <div className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-3">
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu size={24} />
        </button>

        <h1 className="font-bold text-lg text-gray-900">UK Commission</h1>

        <div className="flex items-center space-x-2">
          {/* Connection status */}
          <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />

          {/* Install prompt */}
          {installPrompt && (
            <button
              onClick={handleInstallApp}
              className="p-2 rounded-lg bg-blue-500 text-white"
            >
              <Download size={16} />
            </button>
          )}

          {/* Notifications */}
          <button className="p-2 rounded-lg hover:bg-gray-100 relative">
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const MobileMenu = () => (
    <AnimatePresence>
      {isMenuOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setIsMenuOpen(false)}
          />

          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed left-0 top-0 bottom-0 w-80 bg-white shadow-xl z-50 overflow-y-auto"
          >
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Menu</h2>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="py-4">
              {mobileNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-6 py-4 text-left hover:bg-gray-50 transition-colors ${
                    activeTab === item.id ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                  }`}
                >
                  <item.icon size={20} className={activeTab === item.id ? 'text-blue-500' : 'text-gray-600'} />
                  <span className={`font-medium ${activeTab === item.id ? 'text-blue-500' : 'text-gray-900'}`}>
                    {item.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Offline indicator */}
            {!isOnline && (
              <div className="absolute bottom-4 left-4 right-4 bg-yellow-100 border border-yellow-400 rounded-lg p-3">
                <div className="flex items-center space-x-2 text-yellow-800">
                  <WifiOff size={16} />
                  <span className="text-sm font-medium">Working Offline</span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  const MobileBottomNav = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40 safe-area-bottom">
      <div className="flex items-center justify-around py-2">
        {mobileNavItems.slice(0, 4).map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg min-w-0 flex-1 ${
              activeTab === item.id ? 'text-blue-500' : 'text-gray-600'
            }`}
          >
            <item.icon size={20} />
            <span className="text-xs font-medium truncate">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  // Pull-to-refresh functionality
  const PullToRefresh = ({ children }: { children: React.ReactNode }) => {
    const [isPulling, setIsPulling] = useState(false);
    const [pullDistance, setPullDistance] = useState(0);

    const handleTouchStart = (e: React.TouchEvent) => {
      if (window.scrollY === 0) {
        setIsPulling(true);
      }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
      if (isPulling && window.scrollY === 0) {
        const touch = e.touches[0];
        const distance = Math.max(0, touch.clientY - 100);
        setPullDistance(Math.min(distance, 100));
      }
    };

    const handleTouchEnd = () => {
      if (pullDistance > 50) {
        // Trigger refresh
        toast.success('Refreshing...', { icon: <RefreshCw className="animate-spin" /> });
        // Add your refresh logic here
      }
      setIsPulling(false);
      setPullDistance(0);
    };

    return (
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative"
      >
        {isPulling && (
          <div 
            className="absolute top-0 left-1/2 transform -translate-x-1/2 text-blue-500 transition-opacity"
            style={{ opacity: pullDistance / 50 }}
          >
            <RefreshCw size={24} className={pullDistance > 50 ? 'animate-spin' : ''} />
          </div>
        )}
        <div style={{ transform: `translateY(${pullDistance / 4}px)` }}>
          {children}
        </div>
      </div>
    );
  };

  return (
    <div {...swipeHandlers} className="min-h-screen bg-gray-50">
      <MobileHeader />
      <MobileMenu />

      {/* Main content */}
      <PullToRefresh>
        <main className="pb-20 pt-4 px-4 max-w-screen-xl mx-auto">
          {children}
        </main>
      </PullToRefresh>

      <MobileBottomNav />

      {/* Offline notification */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-20 left-4 right-4 bg-yellow-500 text-white p-3 rounded-lg shadow-lg z-30"
          >
            <div className="flex items-center space-x-2">
              <WifiOff size={16} />
              <span className="text-sm font-medium">You're offline. Some features may be limited.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileApp;
