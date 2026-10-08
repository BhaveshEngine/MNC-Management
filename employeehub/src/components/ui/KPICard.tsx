import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: { value: string; positive: boolean };
  className?: string;
}

export function KPICard({ label, value, subtitle, icon, trend, className }: KPICardProps) {
  return (
    <div className={cn(
      'bg-white rounded-xl border border-gray-200/80 px-6 py-5 min-h-[124px] flex flex-col justify-between',
      className
    )}>
      <div className="flex items-start justify-between">
        <p className="text-[13px] font-medium text-gray-500">{label}</p>
        <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 flex-shrink-0">
          {icon}
        </div>
      </div>

      <div>
        <p className="text-[30px] font-bold text-gray-900 leading-none tracking-tight font-mono">{value}</p>
        <div className="flex items-center gap-2 mt-2">
          {trend && (
            <span className={cn(
              'inline-flex items-center gap-1 text-[12px] font-semibold',
              trend.positive ? 'text-success-600' : 'text-danger-600'
            )}>
              {trend.positive
                ? <TrendingUp className="w-3.5 h-3.5" />
                : <TrendingDown className="w-3.5 h-3.5" />
              }
              {trend.value}
            </span>
          )}
          {subtitle && (
            <span className="text-[12px] text-gray-400">{subtitle}</span>
          )}
        </div>
      </div>
    </div>
  );
}
