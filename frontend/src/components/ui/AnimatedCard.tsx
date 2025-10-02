/**
 * UK Commission Admin Panel - Advanced Animated Card Component
 * Карточка с микро-анимациями и современными интерактивными эффектами
 */

import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

// Типизация для AnimatedCard
interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  clickable?: boolean;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
}

export const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(({
  className,
  children,
  hoverable = true,
  clickable = false,
  onClick,
  variant = 'default',
  ...props
}, ref) => {
  const cardVariants = {
    default: 'bg-white border-gray-200',
    elevated: 'bg-white border-gray-200 shadow-md',
    outlined: 'bg-white border-2 border-blue-200',
    filled: 'bg-blue-50 border-blue-200'
  };

  const motionProps = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.95 },
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
      duration: 0.3
    },
    ...(hoverable && {
      whileHover: {
        y: -4,
        scale: 1.02,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        transition: { duration: 0.2 }
      }
    }),
    ...(clickable && {
      whileTap: { scale: 0.98 }
    })
  };

  return (
    <motion.div
      ref={ref}
      className={cn(
        'rounded-lg border bg-card text-card-foreground shadow-sm',
        'transition-all duration-300 ease-in-out',
        cardVariants[variant],
        hoverable && 'hover:shadow-lg',
        clickable && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      {...motionProps}
      {...props}
    >
      {children}
    </motion.div>
  );
});

AnimatedCard.displayName = 'AnimatedCard';

// Типизация для CardHeader
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  >
    {children}
  </div>
));

CardHeader.displayName = 'CardHeader';

// Типизация для CardTitle
interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export const CardTitle = forwardRef<HTMLParagraphElement, CardTitleProps>(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
    {...props}
  >
    {children}
  </h3>
));

CardTitle.displayName = 'CardTitle';

// Типизация для CardDescription
interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  >
    {children}
  </p>
));

CardDescription.displayName = 'CardDescription';

// Типизация для CardContent
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props}>
    {children}
  </div>
));

CardContent.displayName = 'CardContent';

// Типизация для CardFooter
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  >
    {children}
  </div>
));

CardFooter.displayName = 'CardFooter';

// Специализированные анимированные карточки
export const GlassCard = forwardRef<HTMLDivElement, AnimatedCardProps>(({ className, children, ...props }, ref) => (
  <AnimatedCard
    ref={ref}
    className={cn(
      'backdrop-blur-lg bg-white/70 border-white/20',
      'shadow-xl shadow-black/5',
      className
    )}
    {...props}
  >
    {children}
  </AnimatedCard>
));

GlassCard.displayName = 'GlassCard';

export const GradientCard = forwardRef<HTMLDivElement, AnimatedCardProps>(({ className, children, ...props }, ref) => (
  <AnimatedCard
    ref={ref}
    className={cn(
      'bg-gradient-to-br from-blue-50 to-indigo-100',
      'border-blue-200/50',
      className
    )}
    {...props}
  >
    {children}
  </AnimatedCard>
));

GradientCard.displayName = 'GradientCard';

export const MetricCard = forwardRef<HTMLDivElement, AnimatedCardProps & {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
}>(({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  className,
  children,
  ...props
}, ref) => (
  <AnimatedCard ref={ref} className={cn('p-6', className)} {...props}>
    <div className="flex items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </div>
    <div>
      <div className="text-2xl font-bold">{value}</div>
      {change && (
        <p className={cn(
          'text-xs',
          changeType === 'positive' && 'text-green-600',
          changeType === 'negative' && 'text-red-600',
          changeType === 'neutral' && 'text-gray-600'
        )}>
          {change}
        </p>
      )}
    </div>
    {children}
  </AnimatedCard>
));

MetricCard.displayName = 'MetricCard';

// Предустановленные варианты карточек
export const cardVariants = {
  default: {
    className: 'bg-white border-gray-200'
  },
  elevated: {
    className: 'bg-white border-gray-200 shadow-md'
  },
  outlined: {
    className: 'bg-white border-2 border-blue-200'
  },
  filled: {
    className: 'bg-blue-50 border-blue-200'
  }
};

export default {
  AnimatedCard,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  GlassCard,
  GradientCard,
  MetricCard
};
