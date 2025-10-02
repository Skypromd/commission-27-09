/**
 * UK Commission Admin Panel - Advanced Animated Form Components
 * Формы с микро-анимациями, валидацией и современными эффектами
 */

import React, { useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

// Типизация для AnimatedInput
interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}

export const AnimatedInput = forwardRef<HTMLInputElement, AnimatedInputProps>(({
  className,
  type = 'text',
  label,
  error,
  success,
  placeholder,
  icon: Icon,
  disabled = false,
  required = false,
  ...props
}, ref) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const actualType = isPassword && showPassword ? 'text' : type;

  const inputVariants = {
    unfocused: {
      borderColor: error ? 'rgb(239 68 68)' : 'rgb(209 213 219)', // red-500 : gray-300
      boxShadow: '0 0 0 0px rgba(59, 130, 246, 0)',
    },
    focused: {
      borderColor: error ? 'rgb(239 68 68)' : 'rgb(59 130 246)', // red-500 : blue-500
      boxShadow: error ? '0 0 0 3px rgba(239, 68, 68, 0.1)' : '0 0 0 3px rgba(59, 130, 246, 0.1)',
      transition: { duration: 0.2 }
    }
  };

  const labelVariants = {
    unfocused: {
      top: '50%',
      left: Icon ? '2.5rem' : '0.75rem',
      fontSize: '1rem',
      color: 'rgb(156 163 175)', // gray-400
      transform: 'translateY(-50%)'
    },
    focused: {
      top: '0.5rem',
      left: '0.75rem',
      fontSize: '0.875rem',
      color: error ? 'rgb(239 68 68)' : 'rgb(59 130 246)', // red-500 : blue-500
      transform: 'translateY(0%)',
      transition: { duration: 0.2 }
    }
  };

  const hasValue = props.value !== undefined ? String(props.value).length > 0 : false;

  return (
    <div className="relative">
      <div className="relative">
        {/* Иконка слева */}
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
            <Icon className="h-5 w-5" />
          </div>
        )}

        {/* Поле ввода */}
        <motion.input
          ref={ref}
          type={actualType}
          className={cn(
            'w-full px-4 py-3 border-2 rounded-lg bg-white transition-colors duration-200',
            'focus:outline-none',
            Icon ? 'pl-12' : 'pl-4',
            isPassword ? 'pr-12' : 'pr-4',
            error && 'border-red-500',
            success && !error && 'border-green-500',
            disabled && 'bg-gray-50 cursor-not-allowed opacity-60',
            className
          )}
          variants={inputVariants}
          animate={focused ? 'focused' : 'unfocused'}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={label ? '' : placeholder}
          disabled={disabled}
          required={required}
          {...props}
        />

        {/* Анимированный лейбл */}
        {label && (
          <motion.label
            className="absolute pointer-events-none px-2 bg-white font-medium select-none"
            variants={labelVariants}
            animate={focused || hasValue ? 'focused' : 'unfocused'}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </motion.label>
        )}

        {/* Кнопка показать/скрыть пароль */}
        {isPassword && (
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
            onClick={() => setShowPassword(!showPassword)}
            disabled={disabled}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}

        {/* Иконка статуса */}
        {(error || success) && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10">
            {error ? (
              <AlertCircle className="h-5 w-5 text-red-500" />
            ) : success ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : null}
          </div>
        )}
      </div>

      {/* Сообщение об ошибке */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="mt-1 text-sm text-red-600 flex items-center"
          >
            <AlertCircle className="h-4 w-4 mr-1" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

AnimatedInput.displayName = 'AnimatedInput';

// Типизация для AnimatedTextarea
interface AnimatedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  success?: boolean;
}

export const AnimatedTextarea = forwardRef<HTMLTextAreaElement, AnimatedTextareaProps>(({
  className,
  label,
  error,
  success,
  disabled = false,
  required = false,
  rows = 4,
  ...props
}, ref) => {
  const [focused, setFocused] = useState(false);

  const textareaVariants = {
    unfocused: {
      borderColor: error ? 'rgb(239 68 68)' : 'rgb(209 213 219)',
      boxShadow: '0 0 0 0px rgba(59, 130, 246, 0)',
    },
    focused: {
      borderColor: error ? 'rgb(239 68 68)' : 'rgb(59 130 246)',
      boxShadow: error ? '0 0 0 3px rgba(239, 68, 68, 0.1)' : '0 0 0 3px rgba(59, 130, 246, 0.1)',
      transition: { duration: 0.2 }
    }
  };

  const hasValue = props.value !== undefined ? String(props.value).length > 0 : false;

  return (
    <div className="relative">
      <div className="relative">
        <motion.textarea
          ref={ref}
          className={cn(
            'w-full px-4 py-3 border-2 rounded-lg bg-white transition-colors duration-200',
            'focus:outline-none resize-none',
            error && 'border-red-500',
            success && !error && 'border-green-500',
            disabled && 'bg-gray-50 cursor-not-allowed opacity-60',
            className
          )}
          variants={textareaVariants}
          animate={focused ? 'focused' : 'unfocused'}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          required={required}
          rows={rows}
          {...props}
        />

        {label && (
          <motion.label
            className="absolute pointer-events-none px-2 bg-white font-medium select-none"
            initial={{ top: '1rem', left: '0.75rem', fontSize: '1rem', color: 'rgb(156 163 175)' }}
            animate={{
              top: focused || hasValue ? '0.5rem' : '1rem',
              fontSize: focused || hasValue ? '0.875rem' : '1rem',
              color: focused ? (error ? 'rgb(239 68 68)' : 'rgb(59 130 246)') : 'rgb(156 163 175)'
            }}
            transition={{ duration: 0.2 }}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </motion.label>
        )}
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="mt-1 text-sm text-red-600 flex items-center"
          >
            <AlertCircle className="h-4 w-4 mr-1" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

AnimatedTextarea.displayName = 'AnimatedTextarea';

// Типизация для AnimatedSelect
interface SelectOption {
  value: string;
  label: string;
}

interface AnimatedSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  error?: string;
  success?: boolean;
  options: SelectOption[];
  placeholder?: string;
}

export const AnimatedSelect = forwardRef<HTMLSelectElement, AnimatedSelectProps>(({
  className,
  label,
  error,
  success,
  options,
  placeholder,
  disabled = false,
  required = false,
  ...props
}, ref) => {
  const [focused, setFocused] = useState(false);

  const selectVariants = {
    unfocused: {
      borderColor: error ? 'rgb(239 68 68)' : 'rgb(209 213 219)',
      boxShadow: '0 0 0 0px rgba(59, 130, 246, 0)',
    },
    focused: {
      borderColor: error ? 'rgb(239 68 68)' : 'rgb(59 130 246)',
      boxShadow: error ? '0 0 0 3px rgba(239, 68, 68, 0.1)' : '0 0 0 3px rgba(59, 130, 246, 0.1)',
      transition: { duration: 0.2 }
    }
  };

  const hasValue = props.value !== undefined && props.value !== '';

  return (
    <div className="relative">
      <div className="relative">
        <motion.select
          ref={ref}
          className={cn(
            'w-full px-4 py-3 border-2 rounded-lg bg-white transition-colors duration-200',
            'focus:outline-none appearance-none',
            error && 'border-red-500',
            success && !error && 'border-green-500',
            disabled && 'bg-gray-50 cursor-not-allowed opacity-60',
            className
          )}
          variants={selectVariants}
          animate={focused ? 'focused' : 'unfocused'}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          required={required}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </motion.select>

        {label && (
          <motion.label
            className="absolute pointer-events-none px-2 bg-white font-medium select-none"
            animate={{
              top: focused || hasValue ? '0.5rem' : '50%',
              left: '0.75rem',
              fontSize: focused || hasValue ? '0.875rem' : '1rem',
              color: focused ? (error ? 'rgb(239 68 68)' : 'rgb(59 130 246)') : 'rgb(156 163 175)',
              transform: focused || hasValue ? 'translateY(0%)' : 'translateY(-50%)'
            }}
            transition={{ duration: 0.2 }}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </motion.label>
        )}

        {/* Стрелка выпадающего списка */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="mt-1 text-sm text-red-600 flex items-center"
          >
            <AlertCircle className="h-4 w-4 mr-1" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

AnimatedSelect.displayName = 'AnimatedSelect';

export default { AnimatedInput, AnimatedTextarea, AnimatedSelect };
