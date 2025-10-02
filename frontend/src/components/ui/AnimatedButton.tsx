/**
 * UK Commission Admin Panel - Advanced Animated Button Component
 * Кнопка с микро-анимациями и современными интерактивными эффектами
 */

import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

// Типизация для кнопки
interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  loading?: boolean;
  children?: React.ReactNode;
}

const buttonVariants = {
  default: {
    backgroundColor: 'rgb(59 130 246)', // blue-500
    color: 'white',
    borderColor: 'transparent'
  },
  destructive: {
    backgroundColor: 'rgb(239 68 68)', // red-500
    color: 'white',
    borderColor: 'transparent'
  },
  outline: {
    backgroundColor: 'transparent',
    color: 'rgb(59 130 246)', // blue-500
    borderColor: 'rgb(59 130 246)'
  },
  secondary: {
    backgroundColor: 'rgb(156 163 175)', // gray-400
    color: 'white',
    borderColor: 'transparent'
  },
  ghost: {
    backgroundColor: 'transparent',
    color: 'rgb(75 85 99)', // gray-600
    borderColor: 'transparent'
  },
  link: {
    backgroundColor: 'transparent',
    color: 'rgb(59 130 246)', // blue-500
    borderColor: 'transparent'
  }
};

const sizeVariants = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 rounded-md px-3',
  lg: 'h-11 rounded-md px-8',
  icon: 'h-10 w-10'
};

const variantClasses = {
  default: 'bg-blue-500 text-white hover:bg-blue-600',
  destructive: 'bg-red-500 text-white hover:bg-red-600',
  outline: 'border border-blue-500 text-blue-500 hover:bg-blue-50',
  secondary: 'bg-gray-400 text-white hover:bg-gray-500',
  ghost: 'text-gray-600 hover:bg-gray-100',
  link: 'text-blue-500 hover:underline'
};

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(({
  className,
  variant = 'default',
  size = 'default',
  loading = false,
  disabled = false,
  children,
  onClick,
  ...props
}, ref) => {
  const baseClasses = cn(
    'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    sizeVariants[size],
    variantClasses[variant],
    className
  );

  const buttonMotionProps = {
    whileHover: disabled || loading ? {} : {
      scale: 1.02,
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
    },
    whileTap: disabled || loading ? {} : {
      scale: 0.98,
      transition: { duration: 0.1 }
    },
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
      duration: 0.2
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (loading || disabled) return;
    onClick?.(e);
  };

  return (
    <motion.button
      ref={ref}
      className={baseClasses}
      disabled={disabled || loading}
      onClick={handleClick}
      {...buttonMotionProps}
      {...props}
    >
      {loading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mr-2"
        >
          <Loader2 className="h-4 w-4 animate-spin" />
        </motion.div>
      )}
      {children}
    </motion.button>
  );
});

AnimatedButton.displayName = 'AnimatedButton';

// Предустановленные варианты кнопок
export const PrimaryButton = forwardRef<HTMLButtonElement, Omit<AnimatedButtonProps, 'variant'>>(
  (props, ref) => <AnimatedButton ref={ref} variant="default" {...props} />
);
PrimaryButton.displayName = 'PrimaryButton';

export const SecondaryButton = forwardRef<HTMLButtonElement, Omit<AnimatedButtonProps, 'variant'>>(
  (props, ref) => <AnimatedButton ref={ref} variant="secondary" {...props} />
);
SecondaryButton.displayName = 'SecondaryButton';

export const OutlineButton = forwardRef<HTMLButtonElement, Omit<AnimatedButtonProps, 'variant'>>(
  (props, ref) => <AnimatedButton ref={ref} variant="outline" {...props} />
);
OutlineButton.displayName = 'OutlineButton';

export const GhostButton = forwardRef<HTMLButtonElement, Omit<AnimatedButtonProps, 'variant'>>(
  (props, ref) => <AnimatedButton ref={ref} variant="ghost" {...props} />
);
GhostButton.displayName = 'GhostButton';

export const DestructiveButton = forwardRef<HTMLButtonElement, Omit<AnimatedButtonProps, 'variant'>>(
  (props, ref) => <AnimatedButton ref={ref} variant="destructive" {...props} />
);
DestructiveButton.displayName = 'DestructiveButton';

export const LinkButton = forwardRef<HTMLButtonElement, Omit<AnimatedButtonProps, 'variant'>>(
  (props, ref) => <AnimatedButton ref={ref} variant="link" {...props} />
);
LinkButton.displayName = 'LinkButton';

// Кнопки с иконками
export const IconButton = forwardRef<HTMLButtonElement, Omit<AnimatedButtonProps, 'size'>>(
  (props, ref) => <AnimatedButton ref={ref} size="icon" {...props} />
);
IconButton.displayName = 'IconButton';

export default {
  AnimatedButton,
  PrimaryButton,
  SecondaryButton,
  OutlineButton,
  GhostButton,
  DestructiveButton,
  LinkButton,
  IconButton
};
