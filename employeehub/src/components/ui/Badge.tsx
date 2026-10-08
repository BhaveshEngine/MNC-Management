import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

const variantStyles = {
  default: 'bg-gray-100 text-gray-600 border-gray-200',
  primary: 'bg-brand-50 text-brand-600 border-brand-100',
  success: 'bg-success-50 text-success-700 border-success-100',
  warning: 'bg-warning-50 text-warning-700 border-warning-100',
  danger: 'bg-danger-50 text-danger-700 border-danger-100',
  info: 'bg-info-50 text-info-600 border-info-100',
  purple: 'bg-violet-50 text-violet-700 border-violet-100',
};

const dotColors = {
  default: 'bg-gray-400',
  primary: 'bg-brand-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  danger: 'bg-danger-500',
  info: 'bg-brand-500',
  purple: 'bg-violet-500',
};

export function Badge({ children, variant = 'default', size = 'sm', dot = false, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold border rounded-md leading-none',
        size === 'sm' ? 'gap-1.5 px-2 py-[3px] text-[11px]' : 'gap-1.5 px-2.5 py-1 text-[12px]',
        variantStyles[variant],
        className
      )}
    >
      {dot && <span className={cn('w-[5px] h-[5px] rounded-full flex-shrink-0', dotColors[variant])} />}
      {children}
    </span>
  );
}
