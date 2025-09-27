/**
 * Unified Styling Utilities
 * Заменяет styled-jsx и унифицирует стилизацию с TailwindCSS
 */

import { twMerge } from 'tailwind-merge';
import { clsx, ClassValue } from 'clsx';
import { tv, type VariantProps } from 'tailwind-variants';

// Утилита для объединения классов TailwindCSS
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

// Variants для кнопок (замена для styled-jsx button styles)
export const buttonVariants = tv({
  base: "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  variants: {
    variant: {
      primary: "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700",
      secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
      outline: "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900",
      ghost: "hover:bg-slate-100 hover:text-slate-900",
      danger: "bg-red-500 text-white hover:bg-red-600",
      success: "bg-green-500 text-white hover:bg-green-600",
    },
    size: {
      sm: "h-9 px-3",
      default: "h-10 px-4 py-2",
      lg: "h-11 px-8",
      icon: "h-10 w-10",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "default",
  },
});

// Variants для карточек
export const cardVariants = tv({
  base: "rounded-lg border bg-white text-slate-950 shadow-sm",
  variants: {
    variant: {
      default: "border-slate-200",
      glass: "bg-white/80 backdrop-blur-lg border-white/20 shadow-xl",
      elevated: "shadow-lg hover:shadow-xl transition-shadow",
    },
    padding: {
      none: "p-0",
      sm: "p-4",
      default: "p-6", 
      lg: "p-8",
    },
  },
  defaultVariants: {
    variant: "default",
    padding: "default",
  },
});

// Variants для badges
export const badgeVariants = tv({
  base: "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2",
  variants: {
    variant: {
      primary: "border-transparent bg-blue-500 text-white hover:bg-blue-600",
      secondary: "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-200",
      success: "border-transparent bg-green-500 text-white hover:bg-green-600",
      warning: "border-transparent bg-yellow-500 text-white hover:bg-yellow-600",
      danger: "border-transparent bg-red-500 text-white hover:bg-red-600",
      outline: "text-slate-950 border-slate-200 hover:bg-slate-100",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

// Variants для input полей
export const inputVariants = tv({
  base: "flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  variants: {
    variant: {
      default: "border-slate-200",
      error: "border-red-500 focus-visible:ring-red-500",
      success: "border-green-500 focus-visible:ring-green-500",
    },
    size: {
      sm: "h-8 text-xs",
      default: "h-10 text-sm",
      lg: "h-12 text-base",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

// Стили для layout elements (замена для styled-jsx layout styles)
export const layoutStyles = {
  container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  grid: {
    2: "grid grid-cols-1 md:grid-cols-2 gap-6",
    3: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", 
    4: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
  },
  flexBetween: "flex items-center justify-between",
  flexCenter: "flex items-center justify-center",
  section: "space-y-6",
  pageHeader: "mb-8",
};

// Стили для анимаций (замена для styled-jsx animations)
export const animationStyles = {
  slideUp: "animate-in slide-in-from-bottom-4 duration-500",
  slideDown: "animate-in slide-in-from-top-4 duration-500",
  slideLeft: "animate-in slide-in-from-right-4 duration-500",
  slideRight: "animate-in slide-in-from-left-4 duration-500",
  fadeIn: "animate-in fade-in duration-500",
  scaleIn: "animate-in zoom-in-95 duration-200",
  loading: "animate-spin",
};

// Типы для props
export type ButtonVariants = VariantProps<typeof buttonVariants>;
export type CardVariants = VariantProps<typeof cardVariants>;
export type BadgeVariants = VariantProps<typeof badgeVariants>;
export type InputVariants = VariantProps<typeof inputVariants>;

// Утилиты для статистических карточек
export const statCardStyles = tv({
  base: "p-6 rounded-lg shadow-sm border transition-all hover:shadow-md",
  variants: {
    variant: {
      default: "bg-white border-slate-200",
      gradient: "bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200",
      glass: "bg-white/80 backdrop-blur-lg border-white/20",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

// Утилиты для таблиц
export const tableStyles = {
  container: "relative overflow-x-auto",
  table: "w-full text-sm text-left text-slate-500",
  header: "text-xs text-slate-700 uppercase bg-slate-50",
  headerCell: "px-6 py-3",
  row: "bg-white border-b hover:bg-slate-50",
  cell: "px-6 py-4",
  sortButton: "flex items-center space-x-1 hover:text-slate-900",
};

// Progress bar styles
export const progressStyles = tv({
  base: "w-full bg-slate-200 rounded-full overflow-hidden",
  variants: {
    size: {
      sm: "h-2",
      default: "h-3",
      lg: "h-4",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export const progressFillStyles = tv({
  base: "h-full rounded-full transition-all duration-300 ease-out",
  variants: {
    variant: {
      primary: "bg-gradient-to-r from-blue-500 to-purple-500",
      success: "bg-green-500",
      warning: "bg-yellow-500", 
      danger: "bg-red-500",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});
