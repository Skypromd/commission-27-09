/**
 * UK Commission Admin Panel - Advanced Animated Notifications & Toast
 * Уведомления с микро-анимациями и современными переходами
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../../utils/cn';

// Типизация для Toast
interface ToastProps {
  id: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
  action?: {
    label: string;
    onClick: () => void;
  };
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  className?: string;
}

interface ToastContextType {
  toasts: ToastProps[];
  addToast: (toast: Omit<ToastProps, 'id' | 'onClose'>) => void;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

const notificationVariants = {
  hidden: {
    opacity: 0,
    x: 100,
    scale: 0.9,
    filter: 'blur(4px)'
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
      duration: 0.4
    }
  },
  exit: {
    opacity: 0,
    x: 100,
    scale: 0.9,
    filter: 'blur(4px)',
    transition: { duration: 0.2 }
  }
};

const iconVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 20,
      delay: 0.2
    }
  }
};

const progressVariants = {
  hidden: { width: '100%' },
  visible: (duration: number) => ({
    width: '0%',
    transition: { duration: duration / 1000, ease: 'linear' }
  })
};

export const AnimatedToast: React.FC<ToastProps> = ({
  id,
  type = 'info',
  title,
  message,
  duration = 5000,
  onClose,
  action,
  position = 'top-right',
  className
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose(id), 200);
      }, duration);

      const countdown = setInterval(() => {
        setTimeLeft(prev => Math.max(0, prev - 100));
      }, 100);

      return () => {
        clearTimeout(timer);
        clearInterval(countdown);
      };
    }
  }, [id, duration, onClose]);

  const typeConfig = {
    success: {
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
      progress: 'bg-green-500'
    },
    error: {
      icon: AlertCircle,
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      progress: 'bg-red-500'
    },
    warning: {
      icon: AlertTriangle,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      progress: 'bg-orange-500'
    },
    info: {
      icon: Info,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      progress: 'bg-blue-500'
    }
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(id), 200);
  };

  if (!isVisible) return null;

  return (
    <motion.div
      className={cn(
        'relative max-w-md w-full bg-white rounded-lg shadow-lg border-2 overflow-hidden',
        config.bg,
        config.border,
        className
      )}
      variants={notificationVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
    >
      {/* Progress Bar */}
      {duration > 0 && (
        <motion.div
          className={cn('absolute bottom-0 left-0 h-1', config.progress)}
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
        />
      )}

      <div className="p-4">
        <div className="flex items-start">
          <motion.div
            className="flex-shrink-0"
            variants={iconVariants}
            initial="hidden"
            animate="visible"
          >
            <Icon className={cn('h-6 w-6', config.color)} />
          </motion.div>

          <div className="ml-3 w-0 flex-1">
            <motion.p
              className="text-sm font-medium text-gray-900"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {title}
            </motion.p>

            {message && (
              <motion.p
                className="mt-1 text-sm text-gray-600"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {message}
              </motion.p>
            )}

            {action && (
              <motion.div
                className="mt-3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <button
                  onClick={action.onClick}
                  className={cn(
                    'text-sm font-medium rounded-md px-3 py-1.5 hover:scale-105 transition-transform',
                    config.color,
                    'hover:bg-white'
                  )}
                >
                  {action.label}
                </button>
              </motion.div>
            )}
          </div>

          <motion.button
            className="flex-shrink-0 ml-4 p-1 rounded-full hover:bg-gray-200 transition-colors"
            onClick={handleClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <X className="h-4 w-4 text-gray-400" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Toast Container Component
interface ToastContainerProps {
  toasts: ToastProps[];
  position?: ToastProps['position'];
  className?: string;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  position = 'top-right',
  className
}) => {
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
  };

  return (
    <div className={cn(
      'fixed z-50 pointer-events-none',
      positionClasses[position],
      className
    )}>
      <div className="space-y-4 pointer-events-auto">
        <AnimatePresence>
          {toasts.map((toast) => (
            <AnimatedToast key={toast.id} {...toast} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Toast Hook для удобного использования
export const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = (toast: Omit<ToastProps, 'id' | 'onClose'>) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newToast: ToastProps = {
      ...toast,
      id,
      onClose: removeToast
    };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const clearAll = () => {
    setToasts([]);
  };

  // Предустановленные методы для разных типов уведомлений
  const success = (title: string, message?: string, options?: Partial<ToastProps>) => {
    addToast({ type: 'success', title, message, ...options });
  };

  const error = (title: string, message?: string, options?: Partial<ToastProps>) => {
    addToast({ type: 'error', title, message, ...options });
  };

  const warning = (title: string, message?: string, options?: Partial<ToastProps>) => {
    addToast({ type: 'warning', title, message, ...options });
  };

  const info = (title: string, message?: string, options?: Partial<ToastProps>) => {
    addToast({ type: 'info', title, message, ...options });
  };

  return {
    toasts,
    addToast,
    removeToast,
    clearAll,
    success,
    error,
    warning,
    info
  };
};

export default { AnimatedToast, ToastContainer, useToast };
