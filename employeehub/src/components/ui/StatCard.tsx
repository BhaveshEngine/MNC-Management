import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: { value: string; positive: boolean };
  sparkData?: number[];
  sparkColor?: string;
  className?: string;
}

export function StatCard({ label, value, subtitle, icon, trend, sparkData, sparkColor = '#3b82f6', className }: StatCardProps) {
  return (
    <div className={cn(
      'bg-white rounded-2xl border border-[#E5EAF3] shadow-[0_1px_3px_rgba(0,0,0,0.04)] px-6 py-5 flex flex-col justify-between min-h-[130px] relative overflow-hidden',
      className
    )}>
      {/* Sparkline background */}
      {sparkData && sparkData.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-[50px] opacity-[0.12]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkData.map((v, i) => ({ v, i }))} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id={`spark-${label.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={sparkColor} stopOpacity={0.6} />
                  <stop offset="100%" stopColor={sparkColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke={sparkColor}
                strokeWidth={1.5}
                fill={`url(#spark-${label.replace(/\s+/g, '')})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="flex items-start justify-between relative z-10">
        <p className="text-[13px] font-medium text-gray-500">{label}</p>
        <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 flex-shrink-0">
          {icon}
        </div>
      </div>

      <div className="relative z-10">
        <p className="text-[28px] font-bold text-gray-900 leading-none tracking-tight font-mono">{value}</p>
        <div className="flex items-center gap-2 mt-2">
          {trend && (
            <span className={cn(
              'inline-flex items-center gap-1 text-[12px] font-semibold px-1.5 py-0.5 rounded-md',
              trend.positive
                ? 'text-success-600 bg-success-50'
                : 'text-danger-600 bg-danger-50'
            )}>
              {trend.positive
                ? <TrendingUp className="w-3 h-3" />
                : <TrendingDown className="w-3 h-3" />
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
