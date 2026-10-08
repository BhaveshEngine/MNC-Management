import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle2, XCircle, Info } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  variant?: 'danger' | 'warning' | 'info' | 'success';
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
}

const variantStyles = {
  danger: { iconBg: 'bg-danger-50', iconColor: 'text-danger-600', buttonBg: 'bg-danger-600 hover:bg-danger-700 text-white' },
  warning: { iconBg: 'bg-warning-50', iconColor: 'text-warning-600', buttonBg: 'bg-warning-600 hover:bg-warning-700 text-white' },
  info: { iconBg: 'bg-info-50', iconColor: 'text-info-600', buttonBg: 'bg-brand-600 hover:bg-brand-700 text-white' },
  success: { iconBg: 'bg-success-50', iconColor: 'text-success-600', buttonBg: 'bg-success-600 hover:bg-success-700 text-white' },
};

const variantIcons = {
  danger: XCircle,
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle2,
};

export function ConfirmDialog({
  open, onClose, onConfirm, title, description,
  variant = 'danger', confirmLabel = 'Confirm', cancelLabel = 'Cancel', loading = false,
}: ConfirmDialogProps) {
  if (!open) return null;

  const styles = variantStyles[variant];
  const Icon = variantIcons[variant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 animate-fade" />
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-xl p-6 animate-scale" onClick={e => e.stopPropagation()}>
        <div className="flex gap-4">
          <div className={cn('w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0', styles.iconBg)}>
            <Icon className={cn('w-5 h-5', styles.iconColor)} />
          </div>
          <div className="flex-1">
            <h3 className="text-[16px] font-semibold text-gray-900">{title}</h3>
            <p className="text-[13px] text-gray-500 mt-1.5 leading-relaxed">{description}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="h-9 px-4 rounded-lg text-[13px] font-medium text-gray-600 border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={cn('h-9 px-4 rounded-lg text-[13px] font-semibold transition-colors disabled:opacity-50', styles.buttonBg)}
          >
            {loading ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
