import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, Check, X } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Анимированный выпадающий список с поиском и множественным выбором
 */

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface AnimatedDropdownProps {
  options: DropdownOption[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  placeholder?: string;
  searchable?: boolean;
  multiple?: boolean;
  disabled?: boolean;
  error?: boolean;
  maxSelections?: number;
  className?: string;
}

const dropdownVariants = {
  hidden: {
    opacity: 0,
    y: -10,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: 'easeOut'
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.15
    }
  }
};

const itemVariants = {
  hidden: {
    opacity: 0,
    x: -20
  },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: index * 0.05,
      duration: 0.2
    }
  }),
  hover: {
    x: 5,
    transition: {
      duration: 0.1
    }
  }
};

export const AnimatedDropdown: React.FC<AnimatedDropdownProps> = ({
  options,
  value = [],
  onChange,
  placeholder = 'Select options...',
  searchable = true,
  multiple = true,
  disabled = false,
  error = false,
  maxSelections,
  className,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const selectRef = useRef<HTMLDivElement>(null);

  const normalizedValue = Array.isArray(value) ? value : value ? [value] : [];

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOptions = options.filter(option =>
    normalizedValue.includes(option.value)
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    if (!multiple) {
      onChange?.(optionValue);
      setIsOpen(false);
      return;
    }

    const newValue = normalizedValue.includes(optionValue)
      ? normalizedValue.filter(v => v !== optionValue)
      : maxSelections && normalizedValue.length >= maxSelections
        ? normalizedValue
        : [...normalizedValue, optionValue];

    onChange?.(newValue);
  };

  const removeSelection = (optionValue: string) => {
    onChange?.(normalizedValue.filter(v => v !== optionValue));
  };

  return (
    <div className="relative" ref={selectRef} {...props}>
      <motion.div
        className={cn(
          'w-full min-h-[48px] px-3 py-2 border-2 rounded-lg cursor-pointer transition-all duration-200',
          'bg-white text-gray-900',
          isOpen && 'border-blue-500 ring-2 ring-blue-500/20',
          error && 'border-red-500',
          disabled && 'bg-gray-50 cursor-not-allowed opacity-60',
          className
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap items-center gap-2 min-h-[32px]">
          {selectedOptions.length > 0 ? (
            selectedOptions.map((option) => (
              <motion.div
                key={option.value}
                className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <span>{option.label}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSelection(option.value);
                  }}
                  className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </motion.div>
            ))
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}

          <motion.div
            className="ml-auto"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-hidden"
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {searchable && (
              <div className="p-3 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search options..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                </div>
              </div>
            )}

            <div className="max-h-48 overflow-y-auto py-1">
              {filteredOptions.map((option, index) => {
                const isSelected = normalizedValue.includes(option.value);
                const isDisabled = maxSelections && !isSelected && normalizedValue.length >= maxSelections;

                return (
                  <motion.div
                    key={option.value}
                    className={cn(
                      'px-4 py-3 text-sm cursor-pointer flex items-center justify-between',
                      'hover:bg-blue-50 transition-colors duration-150',
                      isSelected && 'bg-blue-50 text-blue-700',
                      isDisabled && 'opacity-50 cursor-not-allowed'
                    )}
                    variants={itemVariants}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    whileHover={isDisabled ? {} : 'hover'}
                    onClick={() => !isDisabled && handleSelect(option.value)}
                  >
                    <span>{option.label}</span>

                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Check className="h-4 w-4 text-blue-600" />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Экспортируем компонент с типизацией
export { AnimatedDropdown };
export type { DropdownOption, AnimatedDropdownProps };
export default AnimatedDropdown;
