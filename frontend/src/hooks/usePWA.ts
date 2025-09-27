/**
 * UK Commission Admin Panel - PWA Hook
 * React hook for Progressive Web App functionality
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-hot-toast';

interface PWAInstallPrompt extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
}

interface PWACapabilities {
  isStandalone: boolean;
  canInstall: boolean;
  isOnline: boolean;
  hasNotificationPermission: boolean;
  hasPushSupport: boolean;
  hasBackgroundSync: boolean;
  hasPeriodicSync: boolean;
}

interface ServiceWorkerMessage {
  type: string;
  payload?: any;
}

interface CacheStatus {
  version: string;
  caches: Array<{
    name: string;
    entries: number;
  }>;
  totalSize: number;
}

export const usePWA = () => {
  const [installPrompt, setInstallPrompt] = useState<PWAInstallPrompt | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [swRegistration, setSWRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [cacheStatus, setCacheStatus] = useState<CacheStatus | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');

  const swRef = useRef<ServiceWorker | null>(null);
  const messageChannelRef = useRef<MessageChannel | null>(null);

  // PWA capabilities detection
  const [capabilities, setCapabilities] = useState<PWACapabilities>({
    isStandalone: false,
    canInstall: false,
    isOnline: navigator.onLine,
    hasNotificationPermission: false,
    hasPushSupport: false,
    hasBackgroundSync: false,
    hasPeriodicSync: false
  });

  // Initialize PWA
  useEffect(() => {
    detectCapabilities();
    registerServiceWorker();
    setupEventListeners();

    return () => {
      cleanup();
    };
  }, []);

  const detectCapabilities = useCallback(() => {
    const caps: PWACapabilities = {
      isStandalone: window.matchMedia('(display-mode: standalone)').matches ||
                    (window.navigator as any).standalone ||
                    document.referrer.includes('android-app://'),
      canInstall: 'BeforeInstallPromptEvent' in window,
      isOnline: navigator.onLine,
      hasNotificationPermission: Notification.permission === 'granted',
      hasPushSupport: 'PushManager' in window && 'serviceWorker' in navigator,
      hasBackgroundSync: 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype,
      hasPeriodicSync: 'serviceWorker' in navigator && 'periodicSync' in window.ServiceWorkerRegistration.prototype
    };

    setCapabilities(caps);
    setIsInstalled(caps.isStandalone);
  }, []);

  const registerServiceWorker = useCallback(async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
          updateViaCache: 'none'
        });

        setSWRegistration(registration);

        // Handle service worker updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setUpdateAvailable(true);
                toast('New version available!', {
                  icon: '🔄',
                  duration: 5000
                });
              }
            });
          }
        });

        // Set up message channel for SW communication
        messageChannelRef.current = new MessageChannel();
        messageChannelRef.current.port1.onmessage = handleServiceWorkerMessage;

        // Send port to service worker
        if (registration.active) {
          registration.active.postMessage({
            type: 'INIT_MESSAGE_CHANNEL'
          }, [messageChannelRef.current.port2]);
        }

        console.log('PWA: Service worker registered successfully');

      } catch (error) {
        console.error('PWA: Service worker registration failed:', error);
      }
    }
  }, []);

  const setupEventListeners = useCallback(() => {
    // Install prompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as PWAInstallPrompt);
      setIsInstallable(true);
    };

    // Online/Offline events
    const handleOnline = () => {
      setIsOnline(true);
      setCapabilities(prev => ({ ...prev, isOnline: true }));
      toast.success('Connection restored', { icon: '🟢' });
    };

    const handleOffline = () => {
      setIsOnline(false);
      setCapabilities(prev => ({ ...prev, isOnline: false }));
      toast.error('Working offline', { icon: '🔴' });
    };

    // App installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setInstallPrompt(null);
      toast.success('App installed successfully!', { icon: '📱' });
    };

    // Service worker message handler
    const handleSWMessage = (event: MessageEvent) => {
      handleServiceWorkerMessage(event);
    };

    // Register event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('appinstalled', handleAppInstalled);
    navigator.serviceWorker?.addEventListener('message', handleSWMessage);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('appinstalled', handleAppInstalled);
      navigator.serviceWorker?.removeEventListener('message', handleSWMessage);
    };
  }, []);

  const handleServiceWorkerMessage = (event: MessageEvent) => {
    const { type, payload } = event.data as ServiceWorkerMessage;

    switch (type) {
      case 'SYNC_SUCCESS':
        setSyncStatus('success');
        toast.success('Data synchronized successfully', { icon: '✅' });
        setTimeout(() => setSyncStatus('idle'), 3000);
        break;

      case 'SYNC_FAILED':
        setSyncStatus('error');
        toast.error('Failed to sync data', { icon: '❌' });
        setTimeout(() => setSyncStatus('idle'), 3000);
        break;

      case 'DASHBOARD_REFRESHED':
        toast('Dashboard data updated', { icon: '🔄' });
        // Trigger data refresh in components
        window.dispatchEvent(new CustomEvent('dashboard-refresh'));
        break;

      case 'CACHE_STATUS':
        setCacheStatus(payload);
        break;

      default:
        console.log('PWA: Unknown SW message:', type, payload);
    }
  };

  // Install PWA
  const installApp = useCallback(async () => {
    if (!installPrompt) {
      toast.error('App installation not available');
      return false;
    }

    try {
      await installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;

      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
        setInstallPrompt(null);
        return true;
      } else {
        toast('Installation cancelled');
        return false;
      }
    } catch (error) {
      console.error('PWA: Installation failed:', error);
      toast.error('Installation failed');
      return false;
    }
  }, [installPrompt]);

  // Update service worker
  const updateServiceWorker = useCallback(async () => {
    if (!swRegistration) return;

    try {
      const newWorker = swRegistration.waiting;
      if (newWorker) {
        newWorker.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }
    } catch (error) {
      console.error('PWA: Update failed:', error);
      toast.error('Update failed');
    }
  }, [swRegistration]);

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      toast.error('Notifications not supported');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';

      setCapabilities(prev => ({ 
        ...prev, 
        hasNotificationPermission: granted 
      }));

      if (granted) {
        toast.success('Notifications enabled', { icon: '🔔' });
      } else {
        toast.error('Notifications denied');
      }

      return granted;
    } catch (error) {
      console.error('PWA: Notification permission failed:', error);
      toast.error('Failed to enable notifications');
      return false;
    }
  }, []);

  // Subscribe to push notifications
  const subscribeToPush = useCallback(async () => {
    if (!swRegistration || !capabilities.hasPushSupport) {
      toast.error('Push notifications not supported');
      return null;
    }

    try {
      const subscription = await swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.REACT_APP_VAPID_PUBLIC_KEY
      });

      // Send subscription to backend
      const response = await fetch('/api/v1/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(subscription)
      });

      if (response.ok) {
        toast.success('Push notifications enabled', { icon: '📱' });
        return subscription;
      } else {
        throw new Error('Failed to register push subscription');
      }
    } catch (error) {
      console.error('PWA: Push subscription failed:', error);
      toast.error('Failed to enable push notifications');
      return null;
    }
  }, [swRegistration, capabilities.hasPushSupport]);

  // Clear cache
  const clearCache = useCallback(async () => {
    if (!swRegistration) return;

    try {
      setSyncStatus('syncing');
      await sendMessageToSW({ type: 'CLEAR_CACHE' });
      toast.success('Cache cleared', { icon: '🗑️' });
      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 2000);
    } catch (error) {
      console.error('PWA: Clear cache failed:', error);
      toast.error('Failed to clear cache');
      setSyncStatus('error');
    }
  }, [swRegistration]);

  // Get cache status
  const getCacheStatus = useCallback(async (): Promise<CacheStatus | null> => {
    if (!swRegistration) return null;

    try {
      const response = await sendMessageToSW({ type: 'GET_CACHE_STATUS' });
      setCacheStatus(response);
      return response;
    } catch (error) {
      console.error('PWA: Get cache status failed:', error);
      return null;
    }
  }, [swRegistration]);

  // Send message to service worker
  const sendMessageToSW = useCallback(async (message: ServiceWorkerMessage): Promise<any> => {
    if (!swRegistration?.active || !messageChannelRef.current) {
      throw new Error('Service worker not available');
    }

    return new Promise((resolve, reject) => {
      const channel = new MessageChannel();

      channel.port1.onmessage = (event) => {
        if (event.data.error) {
          reject(new Error(event.data.error));
        } else {
          resolve(event.data);
        }
      };

      // Send message with transfer
      if (swRegistration.active) {
        swRegistration.active.postMessage(message, [channel.port2]);
      } else {
        console.warn('ServiceWorker not active');
      }
    });
  }, [swRegistration]);

  // Store auth token in service worker
  const storeAuthToken = useCallback(async (token: string) => {
    if (!swRegistration) return;

    try {
      await sendMessageToSW({
        type: 'STORE_AUTH_TOKEN',
        payload: { token }
      });
    } catch (error) {
      console.error('PWA: Failed to store auth token:', error);
    }
  }, [sendMessageToSW]);

  // Register background sync
  const requestBackgroundSync = useCallback(async (tag: string): Promise<boolean> => {
    if (!swRegistration || !capabilities.hasBackgroundSync) return false;

    try {
      // Check if ServiceWorkerRegistration has sync property
      if ('sync' in swRegistration) {
        await (swRegistration as any).sync.register(tag);
        toast('Changes queued for sync', { icon: '🔄' });
        return true;
      } else {
        console.warn('PWA: Background sync not supported');
        return false;
      }
    } catch (error) {
      console.error('PWA: Background sync registration failed:', error);
      return false;
    }
  }, [swRegistration, capabilities.hasBackgroundSync]);

  // Register periodic sync
  const registerPeriodicSync = useCallback(async (tag: string, minInterval: number) => {
    if (!swRegistration || !capabilities.hasPeriodicSync) return false;

    try {
      await (swRegistration as any).periodicSync.register(tag, {
        minInterval: minInterval
      });
      console.log('PWA: Periodic sync registered:', tag);
      return true;
    } catch (error) {
      console.error('PWA: Periodic sync registration failed:', error);
      return false;
    }
  }, [swRegistration, capabilities.hasPeriodicSync]);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (messageChannelRef.current) {
      messageChannelRef.current.port1.close();
      messageChannelRef.current = null;
    }
  }, []);

  // Check if app is running in standalone mode
  const isStandalone = capabilities.isStandalone;

  return {
    // State
    capabilities,
    isInstallable,
    isInstalled,
    isOnline,
    updateAvailable,
    cacheStatus,
    syncStatus,
    isStandalone,

    // Actions
    installApp,
    updateServiceWorker,
    requestNotificationPermission,
    subscribeToPush,
    clearCache,
    getCacheStatus,
    storeAuthToken,
    requestBackgroundSync,
    registerPeriodicSync,
    sendMessageToSW
  };
};

export default usePWA;
