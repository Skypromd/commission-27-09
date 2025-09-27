/**
 * UK Commission Admin Panel - Advanced Animated Charts & Dashboard Components
 * Графики и дашборд компоненты с микро-анимациями и интерактивными эффектами
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Users, Target, Activity, ChevronRight, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '../../utils/cn';

// Типизация для компонентов
interface AnimatedStatsCardProps {
  title: string;
  value: string | number;
  change?: string | number;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ComponentType<{ className?: string }>;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  loading?: boolean;
  onClick?: () => void;
  className?: string;
}

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  showPercentage?: boolean;
  animated?: boolean;
  className?: string;
}

interface MiniChartData {
  value: number;
  label?: string;
}

interface AnimatedMiniChartProps {
  data: MiniChartData[];
  type?: 'line' | 'bar' | 'area';
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  height?: number;
  className?: string;
}

// Анимированная статистическая карточка
export const AnimatedStatsCard: React.FC<AnimatedStatsCardProps> = ({
  title,
  value,
  change,
  changeType = 'positive',
  icon: Icon,
  color = 'blue',
  loading = false,
  onClick,
  className,
  ...props
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (loading) return;

    const numericValue = parseFloat(String(value)) || 0;
    const duration = 1500;
    const steps = 60;
    const increment = numericValue / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        current = numericValue;
        clearInterval(timer);
      }
      setDisplayValue(Math.round(current));
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value, loading]);

  const colorConfig = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'text-blue-600',
      hover: 'hover:bg-blue-100'
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: 'text-green-600',
      hover: 'hover:bg-green-100'
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      icon: 'text-purple-600',
      hover: 'hover:bg-purple-100'
    },
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      icon: 'text-orange-600',
      hover: 'hover:bg-orange-100'
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'text-red-600',
      hover: 'hover:bg-red-100'
    }
  };

  const config = colorConfig[color];

  return (
    <motion.div
      className={cn(
        'p-6 bg-white border-2 rounded-xl transition-all duration-300',
        config.bg,
        config.border,
        onClick && 'cursor-pointer',
        onClick && config.hover,
        className
      )}
      whileHover={onClick ? { scale: 1.02, y: -2 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
      {...props}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>

          <div className="flex items-baseline space-x-2">
            {loading ? (
              <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              <motion.h3
                className="text-2xl font-bold text-gray-900"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {typeof value === 'string' ? value : displayValue.toLocaleString()}
              </motion.h3>
            )}

            {change && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className={cn(
                  'flex items-center text-sm font-medium',
                  changeType === 'positive' && 'text-green-600',
                  changeType === 'negative' && 'text-red-600',
                  changeType === 'neutral' && 'text-gray-600'
                )}
              >
                {changeType === 'positive' && <ArrowUpRight className="h-4 w-4 mr-1" />}
                {changeType === 'negative' && <ArrowDownRight className="h-4 w-4 mr-1" />}
                {change}
              </motion.div>
            )}
          </div>
        </div>

        {Icon && (
          <motion.div
            className={cn('p-3 rounded-lg', config.bg)}
            whileHover={{ rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <Icon className={cn('h-6 w-6', config.icon)} />
          </motion.div>
        )}
      </div>

      {onClick && (
        <motion.div
          className="mt-4 flex items-center text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <span>View details</span>
          <ChevronRight className="h-4 w-4 ml-1" />
        </motion.div>
      )}
    </motion.div>
  );
};

// Анимированный прогресс-бар
export const AnimatedProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  color = 'blue',
  showPercentage = true,
  animated = true,
  className
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!animated) {
      setDisplayValue(value);
      return;
    }

    const timer = setTimeout(() => {
      setDisplayValue(value);
    }, 100);

    return () => clearTimeout(timer);
  }, [value, animated]);

  const percentage = Math.min((displayValue / max) * 100, 100);

  const colorConfig = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500'
  };

  return (
    <div className={cn('w-full', className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          {showPercentage && (
            <span className="text-sm text-gray-500">{Math.round(percentage)}%</span>
          )}
        </div>
      )}

      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div
          className={cn('h-2 rounded-full', colorConfig[color])}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

// Миниатюрный анимированный график
export const AnimatedMiniChart: React.FC<AnimatedMiniChartProps> = ({
  data,
  type = 'line',
  color = 'blue',
  height = 60,
  className
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;

  const colorConfig = {
    blue: {
      stroke: 'stroke-blue-500',
      fill: 'fill-blue-100',
      dot: 'fill-blue-500'
    },
    green: {
      stroke: 'stroke-green-500',
      fill: 'fill-green-100',
      dot: 'fill-green-500'
    },
    purple: {
      stroke: 'stroke-purple-500',
      fill: 'fill-purple-100',
      dot: 'fill-purple-500'
    },
    orange: {
      stroke: 'stroke-orange-500',
      fill: 'fill-orange-100',
      dot: 'fill-orange-500'
    },
    red: {
      stroke: 'stroke-red-500',
      fill: 'fill-red-100',
      dot: 'fill-red-500'
    }
  };

  const config = colorConfig[color];

  const getY = (value: number) => {
    if (range === 0) return height / 2;
    return height - ((value - minValue) / range) * height;
  };

  const pathData = data.map((point, index) => {
    const x = (index / (data.length - 1)) * 200;
    const y = getY(point.value);
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  const areaData = `${pathData} L 200 ${height} L 0 ${height} Z`;

  return (
    <div className={cn('w-full', className)}>
      <svg width="100%" height={height} viewBox={`0 0 200 ${height}`} className="overflow-visible">
        {type === 'area' && (
          <motion.path
            d={areaData}
            className={config.fill}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 0.8 }}
          />
        )}

        {type === 'bar' ? (
          data.map((point, index) => {
            const x = (index / data.length) * 200;
            const barHeight = ((point.value - minValue) / range) * height;
            return (
              <motion.rect
                key={index}
                x={x}
                y={height - barHeight}
                width={200 / data.length - 2}
                height={barHeight}
                className={config.stroke.replace('stroke', 'fill')}
                initial={{ height: 0, y: height }}
                animate={{ height: barHeight, y: height - barHeight }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              />
            );
          })
        ) : (
          <motion.path
            d={pathData}
            fill="none"
            strokeWidth="2"
            className={config.stroke}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
          />
        )}

        {type === 'line' && data.map((point, index) => {
          const x = (index / (data.length - 1)) * 200;
          const y = getY(point.value);
          return (
            <motion.circle
              key={index}
              cx={x}
              cy={y}
              r="3"
              className={config.dot}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
            />
          );
        })}
      </svg>
    </div>
  );
};

// Анимированная метрика с трендом
export const TrendMetric: React.FC<{
  title: string;
  current: number;
  previous: number;
  format?: 'number' | 'currency' | 'percentage';
  className?: string;
}> = ({ title, current, previous, format = 'number', className }) => {
  const difference = current - previous;
  const percentageChange = previous !== 0 ? (difference / previous) * 100 : 0;
  const isPositive = difference > 0;

  const formatValue = (value: number) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      default:
        return value.toLocaleString();
    }
  };

  return (
    <motion.div
      className={cn('p-4 bg-white rounded-lg border', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <div className="flex items-center space-x-2">
        <span className="text-2xl font-bold text-gray-900">
          {formatValue(current)}
        </span>
        <div className={cn(
          'flex items-center text-sm font-medium',
          isPositive ? 'text-green-600' : 'text-red-600'
        )}>
          {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          <span className="ml-1">
            {Math.abs(percentageChange).toFixed(1)}%
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// Контейнер для дашборда с анимированной сеткой
export const AnimatedDashboardGrid = ({ children, columns = 4, className, ...props }) => {
  return (
    <motion.div
      className={cn(
        'grid gap-6',
        columns === 2 && 'grid-cols-1 md:grid-cols-2',
        columns === 3 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        columns === 4 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
        className
      )}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
      {...props}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20, scale: 0.9 },
            visible: { opacity: 1, y: 0, scale: 1 }
          }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default {
  AnimatedStatsCard,
  AnimatedProgressBar,
  AnimatedMiniChart,
  TrendMetric
};
