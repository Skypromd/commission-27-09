import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

/**
 * Переключатели и слайдеры с микро-анимациями и современными эффектами
 */

// Типизация для компонентов
interface ToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  color?: 'blue' | 'green' | 'purple' | 'red';
  className?: string;
}

interface SliderProps {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  label?: string;
  className?: string;
}

interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  value?: string;
  onChange?: (value: string) => void;
  options: RadioOption[];
  disabled?: boolean;
  direction?: 'horizontal' | 'vertical';
  className?: string;
}

// Анимированный переключатель
export const AnimatedToggle: React.FC<ToggleProps> = ({
  checked = false,
  onChange,
  disabled = false,
  label,
  description,
  color = 'blue',
  className
}) => {
  const colorConfig = {
    blue: {
      bg: checked ? 'bg-blue-600' : 'bg-gray-200',
      thumb: 'bg-white',
      translate: checked ? 'translate-x-5' : 'translate-x-1'
    },
    green: {
      bg: checked ? 'bg-green-600' : 'bg-gray-200',
      thumb: 'bg-white',
      translate: checked ? 'translate-x-5' : 'translate-x-1'
    },
    purple: {
      bg: checked ? 'bg-purple-600' : 'bg-gray-200',
      thumb: 'bg-white',
      translate: checked ? 'translate-x-5' : 'translate-x-1'
    },
    red: {
      bg: checked ? 'bg-red-600' : 'bg-gray-200',
      thumb: 'bg-white',
      translate: checked ? 'translate-x-5' : 'translate-x-1'
    }
  };

  const config = colorConfig[color];

  const handleToggle = () => {
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={handleToggle}
        disabled={disabled}
        className={cn(
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          config.bg,
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <span
          className={cn(
            'inline-block transform rounded-full bg-white shadow-lg transition-transform duration-200',
            config.thumb,
            checked ? config.translate : 'translate-x-1'
          )}
        />
      </button>

      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <span className={cn('text-sm font-medium', disabled && 'text-gray-400')}>
              {label}
            </span>
          )}
          {description && (
            <span className={cn('text-xs text-gray-500', disabled && 'text-gray-400')}>
              {description}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// Анимированный слайдер
export const AnimatedSlider: React.FC<SliderProps> = ({
  value = 0,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  label,
  className
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    onChange?.(newValue);
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <div className="flex justify-between mb-2">
          <label className={cn('text-sm font-medium', disabled && 'text-gray-400')}>
            {label}
          </label>
          <span className={cn('text-sm text-gray-500', disabled && 'text-gray-400')}>
            {value}
          </span>
        </div>
      )}

      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={cn(
            'w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer transition-opacity duration-200',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          style={{
            background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${percentage}%, #E5E7EB ${percentage}%, #E5E7EB 100%)`
          }}
        />
      </div>
    </div>
  );
};

// Анимированная группа радио-кнопок
export const AnimatedRadioGroup: React.FC<RadioGroupProps> = ({
  value,
  onChange,
  options,
  disabled = false,
  direction = 'vertical',
  className
}) => {
  const handleChange = (optionValue: string) => {
    if (!disabled && onChange) {
      onChange(optionValue);
    }
  };

  return (
    <div
      className={cn(
        'flex gap-3',
        direction === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
        className
      )}
    >
      {options.map((option) => (
        <label
          key={option.value}
          className={cn(
            'flex items-center gap-2 cursor-pointer transition-opacity duration-200',
            (disabled || option.disabled) && 'opacity-50 cursor-not-allowed'
          )}
        >
          <input
            type="radio"
            value={option.value}
            checked={value === option.value}
            onChange={() => handleChange(option.value)}
            disabled={disabled || option.disabled}
            className="sr-only"
          />
          <div
            className={cn(
              'w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200',
              value === option.value
                ? 'border-blue-600 bg-blue-600'
                : 'border-gray-300 bg-white hover:border-gray-400'
            )}
          >
            {value === option.value && (
              <div className="w-2 h-2 rounded-full bg-white" />
            )}
          </div>
          <span className="text-sm font-medium">
            {option.label}
          </span>
        </label>
      ))}
    </div>
  );
};

// Экспорт компонентов с типизацией
export type { ToggleProps, SliderProps, RadioGroupProps };
export default { AnimatedToggle, AnimatedSlider, AnimatedRadioGroup };
