import React from 'react';

const ErrorMessage = ({
  message,
  title = 'Error',
  onRetry,
  onDismiss,
  type = 'error',
  showIcon = true
}) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'warning':
        return {
          container: 'bg-yellow-50 border-yellow-200',
          icon: 'text-yellow-400',
          title: 'text-yellow-800',
          message: 'text-yellow-700'
        };
      case 'info':
        return {
          container: 'bg-blue-50 border-blue-200',
          icon: 'text-blue-400',
          title: 'text-blue-800',
          message: 'text-blue-700'
        };
      default:
        return {
          container: 'bg-red-50 border-red-200',
          icon: 'text-red-400',
          title: 'text-red-800',
          message: 'text-red-700'
        };
    }
  };

  const styles = getTypeStyles();

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 002 0V6a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <div className={`rounded-md border p-4 ${styles.container}`}>
      <div className="flex">
        {showIcon && (
          <div className="flex-shrink-0">
            <div className={styles.icon}>
              {getIcon()}
            </div>
          </div>
        )}
        <div className={showIcon ? 'ml-3' : ''}>
          <h3 className={`text-sm font-medium ${styles.title}`}>
            {title}
          </h3>
          <div className={`mt-2 text-sm ${styles.message}`}>
            <p>{message}</p>
          </div>
          {(onRetry || onDismiss) && (
            <div className="mt-4">
              <div className="-mx-2 -my-1.5 flex">
                {onRetry && (
                  <button
                    type="button"
                    onClick={onRetry}
                    className={`px-2 py-1.5 rounded-md text-sm font-medium ${
                      type === 'warning'
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        : type === 'info'
                        ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      type === 'warning'
                        ? 'focus:ring-yellow-500'
                        : type === 'info'
                        ? 'focus:ring-blue-500'
                        : 'focus:ring-red-500'
                    }`}
                  >
                    Try Again
                  </button>
                )}
                {onDismiss && (
                  <button
                    type="button"
                    onClick={onDismiss}
                    className={`ml-3 px-2 py-1.5 rounded-md text-sm font-medium ${
                      type === 'warning'
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        : type === 'info'
                        ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      type === 'warning'
                        ? 'focus:ring-yellow-500'
                        : type === 'info'
                        ? 'focus:ring-blue-500'
                        : 'focus:ring-red-500'
                    }`}
                  >
                    Dismiss
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;