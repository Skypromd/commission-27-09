import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  text = 'Загрузка...',
  className = ''
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-2 ${className}`}>
      <div
        className={`${sizeClasses[size]} border-4 border-primary border-t-transparent rounded-full animate-spin`}
        style={{
          borderColor: 'var(--primary)',
          borderTopColor: 'transparent'
        }}
      />
      {text && (
        <p className="text-sm text-muted-foreground font-medium">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
