/**
 * UK Commission Admin Panel - Advanced Animated Navigation
 * Навигация с микро-анимациями и современными интерактивными эффектами
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Menu, X, Home, Users, DollarSign, BarChart3, Settings, Bell } from 'lucide-react';
import { cn } from '../../utils/cn';

// Типизация для навигации
interface NavItem {
  id: string;
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
  badge?: string | number;
  disabled?: boolean;
}

interface AnimatedNavigationProps {
  items: NavItem[];
  currentPath?: string;
  onItemClick?: (item: NavItem) => void;
  className?: string;
  vertical?: boolean;
}

interface AnimatedNavItemProps {
  item: NavItem;
  index: number;
  isActive?: boolean;
  onItemClick?: (item: NavItem) => void;
  vertical?: boolean;
}

const menuItemVariants = {
  hidden: {
    opacity: 0,
    x: -20,
    scale: 0.9
  },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      delay: index * 0.1,
      type: 'spring',
      stiffness: 300,
      damping: 25
    }
  }),
  hover: {
    scale: 1.05,
    x: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: '0.5rem',
    transition: { duration: 0.2 }
  }
};

const submenuVariants = {
  hidden: {
    opacity: 0,
    height: 0,
    scale: 0.95,
    y: -10
  },
  visible: {
    opacity: 1,
    height: 'auto',
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
      staggerChildren: 0.05
    }
  }
};

// Анимированный элемент навигации
export const AnimatedNavItem: React.FC<AnimatedNavItemProps> = ({
  item,
  index,
  isActive = false,
  onItemClick,
  vertical = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  const handleClick = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
    if (onItemClick) {
      onItemClick(item);
    }
  };

  return (
    <motion.li
      className="relative"
      variants={menuItemVariants}
      initial="hidden"
      animate="visible"
      whileHover={!item.disabled ? "hover" : undefined}
      custom={index}
    >
      <motion.button
        className={cn(
          'w-full flex items-center justify-between px-4 py-3 text-left transition-all duration-200',
          'hover:bg-blue-50 rounded-lg group',
          isActive && 'bg-blue-100 text-blue-700 font-medium',
          item.disabled && 'opacity-50 cursor-not-allowed',
          !vertical && 'flex-row',
          vertical && 'flex-col space-y-1'
        )}
        onClick={handleClick}
        disabled={item.disabled}
      >
        <div className="flex items-center space-x-3">
          {item.icon && (
            <motion.div
              whileHover={{ rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <item.icon className={cn(
                'h-5 w-5 transition-colors',
                isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600'
              )} />
            </motion.div>
          )}
          <span className={cn(
            'font-medium transition-colors',
            isActive ? 'text-blue-700' : 'text-gray-700 group-hover:text-blue-600'
          )}>
            {item.label}
          </span>
          {item.badge && (
            <motion.span
              className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              {item.badge}
            </motion.span>
          )}
        </div>

        {hasChildren && (
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </motion.div>
        )}
      </motion.button>

      {/* Подменю */}
      <AnimatePresence>
        {hasChildren && isExpanded && (
          <motion.ul
            className="mt-2 ml-6 space-y-2 border-l-2 border-blue-200 pl-4"
            variants={submenuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {item.children!.map((child, childIndex) => (
              <AnimatedNavItem
                key={child.id}
                item={child}
                index={childIndex}
                onItemClick={onItemClick}
                vertical={vertical}
              />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.li>
  );
};

// Главный компонент анимированной навигации
export const AnimatedNavigation: React.FC<AnimatedNavigationProps> = ({
  items,
  currentPath,
  onItemClick,
  className,
  vertical = false
}) => {
  return (
    <nav className={cn('w-full', className)}>
      <motion.ul
        className={cn(
          'space-y-2',
          !vertical && 'flex flex-wrap gap-2'
        )}
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        {items.map((item, index) => (
          <AnimatedNavItem
            key={item.id}
            item={item}
            index={index}
            isActive={currentPath === item.href}
            onItemClick={onItemClick}
            vertical={vertical}
          />
        ))}
      </motion.ul>
    </nav>
  );
};

// Мобильная навигация с гамбургер меню
interface MobileNavigationProps {
  items: NavItem[];
  currentPath?: string;
  onItemClick?: (item: NavItem) => void;
  className?: string;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  items,
  currentPath,
  onItemClick,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className={cn('relative', className)}>
      {/* Гамбургер кнопка */}
      <motion.button
        className="p-2 rounded-lg bg-white shadow-md border border-gray-200"
        onClick={toggleMenu}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu className="h-6 w-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Мобильное меню */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <AnimatedNavigation
              items={items}
              currentPath={currentPath}
              onItemClick={(item) => {
                onItemClick?.(item);
                setIsOpen(false);
              }}
              vertical={true}
              className="p-4"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Хлебные крошки с анимацией
interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AnimatedBreadcrumbsProps {
  items: BreadcrumbItem[];
  onItemClick?: (item: BreadcrumbItem) => void;
  className?: string;
}

export const AnimatedBreadcrumbs: React.FC<AnimatedBreadcrumbsProps> = ({
  items,
  onItemClick,
  className
}) => {
  return (
    <nav className={cn('flex items-center space-x-2', className)}>
      {items.map((item, index) => (
        <motion.div
          key={index}
          className="flex items-center space-x-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {index > 0 && (
            <ChevronDown className="h-4 w-4 text-gray-400 rotate-[-90deg]" />
          )}
          <motion.button
            className={cn(
              'text-sm font-medium transition-colors hover:text-blue-600',
              index === items.length - 1
                ? 'text-gray-900 cursor-default'
                : 'text-gray-500'
            )}
            onClick={() => index < items.length - 1 && onItemClick?.(item)}
            whileHover={index < items.length - 1 ? { scale: 1.05 } : undefined}
            disabled={index === items.length - 1}
          >
            {item.label}
          </motion.button>
        </motion.div>
      ))}
    </nav>
  );
};

// Предустановленные наборы навигационных элементов
export const defaultNavItems: NavItem[] = [
  {
    id: 'home',
    label: 'Dashboard',
    href: '/',
    icon: Home
  },
  {
    id: 'clients',
    label: 'Clients',
    href: '/clients',
    icon: Users,
    badge: '12'
  },
  {
    id: 'sales',
    label: 'Sales',
    href: '/sales',
    icon: DollarSign
  },
  {
    id: 'reports',
    label: 'Reports',
    href: '/reports',
    icon: BarChart3,
    children: [
      { id: 'sales-report', label: 'Sales Report', href: '/reports/sales' },
      { id: 'client-report', label: 'Client Report', href: '/reports/clients' }
    ]
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    icon: Settings
  }
];

export default {
  AnimatedNavigation,
  AnimatedNavItem,
  MobileNavigation,
  AnimatedBreadcrumbs,
  defaultNavItems
};
