import React from 'react';
import { useToast } from '../../contexts/ToastContext';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Toast = () => {
  const { toasts, removeToast } = useToast();

  const getToastIcon = (type) => {
    const iconClass = "h-6 w-6";
    switch (type) {
      case 'success':
        return <CheckCircleIcon className={`${iconClass} text-green-400`} />;
      case 'error':
        return <XCircleIcon className={`${iconClass} text-red-400`} />;
      case 'warning':
        return <ExclamationTriangleIcon className={`${iconClass} text-yellow-400`} />;
      case 'info':
      default:
        return <InformationCircleIcon className={`${iconClass} text-blue-400`} />;
    }
  };

  const getToastStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-white border-l-4 border-green-400 shadow-lg';
      case 'error':
        return 'bg-white border-l-4 border-red-400 shadow-lg';
      case 'warning':
        return 'bg-white border-l-4 border-yellow-400 shadow-lg';
      case 'info':
      default:
        return 'bg-white border-l-4 border-blue-400 shadow-lg';
    }
  };

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`max-w-sm rounded-lg p-4 ${getToastStyles(toast.type)} animate-slide-in-right`}
        >
          <div className="flex">
            <div className="flex-shrink-0">
              {getToastIcon(toast.type)}
            </div>
            <div className="ml-3 flex-1">
              <div className="text-sm font-medium text-gray-900">
                {toast.message}
              </div>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
                onClick={() => removeToast(toast.id)}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Toast;
