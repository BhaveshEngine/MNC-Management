import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
  wrapperClassName?: string;
}

export function Input({ label, icon, error, className, wrapperClassName, ...props }: InputProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', wrapperClassName)}>
      {label && (
        <label className="text-[12px] font-semibold text-gray-600 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            {icon}
          </div>
        )}
        <input
          className={cn(
            'w-full h-9 rounded-lg border border-gray-200 bg-gray-50 text-[13px] text-gray-700',
            'placeholder-gray-400 focus:bg-white focus:border-brand-400 focus:ring-2 focus:ring-brand-100',
            'transition-all duration-150',
            icon ? 'pl-9 pr-3' : 'px-3',
            error && 'border-danger-500 focus:border-danger-500 focus:ring-danger-100',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-[11px] text-danger-600 font-medium">{error}</p>}
    </div>
  );
}

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  shortcut?: string;
  wrapperClassName?: string;
}

export function SearchInput({ shortcut, className, wrapperClassName, ...props }: SearchInputProps) {
  return (
    <div className={cn('relative', wrapperClassName)}>
      <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      <input
        type="text"
        className={cn(
          'w-full pl-10 pr-4 h-[38px] rounded-lg border border-gray-200 bg-gray-50 text-[13px] text-gray-700',
          'placeholder-gray-400 focus:bg-white focus:border-brand-400 focus:ring-2 focus:ring-brand-100',
          'transition-all duration-150',
          className
        )}
        {...props}
      />
      {shortcut && (
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center px-1.5 py-0.5
                        rounded text-[10px] font-medium text-gray-400 bg-gray-100 border border-gray-200">
          {shortcut}
        </kbd>
      )}
    </div>
  );
}
