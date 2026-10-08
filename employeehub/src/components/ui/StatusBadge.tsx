import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusStyles: Record<string, string> = {
  Active:       'bg-success-50 text-success-700 border-success-100',
  Present:      'bg-success-50 text-success-700 border-success-100',
  Approved:     'bg-success-50 text-success-700 border-success-100',
  Available:    'bg-success-50 text-success-700 border-success-100',
  Completed:    'bg-success-50 text-success-700 border-success-100',

  'On Leave':   'bg-warning-50 text-warning-700 border-warning-100',
  Pending:      'bg-warning-50 text-warning-700 border-warning-100',
  Late:         'bg-warning-50 text-warning-700 border-warning-100',
  'Half Day':   'bg-warning-50 text-warning-700 border-warning-100',
  Probation:    'bg-info-50 text-info-600 border-info-100',
  Maintenance:  'bg-warning-50 text-warning-700 border-warning-100',
  'In Progress':'bg-info-50 text-info-600 border-info-100',

  Absent:       'bg-danger-50 text-danger-700 border-danger-100',
  Rejected:     'bg-danger-50 text-danger-700 border-danger-100',
  Terminated:   'bg-danger-50 text-danger-700 border-danger-100',
  Lost:         'bg-danger-50 text-danger-700 border-danger-100',

  Resigned:     'bg-gray-100 text-gray-600 border-gray-200',
  Returned:     'bg-gray-100 text-gray-600 border-gray-200',
  WFH:          'bg-violet-50 text-violet-700 border-violet-100',
  Assigned:     'bg-info-50 text-info-600 border-info-100',
};

const dotColors: Record<string, string> = {
  Active: 'bg-success-500', Present: 'bg-success-500', Approved: 'bg-success-500', Available: 'bg-success-500',
  'On Leave': 'bg-warning-500', Pending: 'bg-warning-500', Late: 'bg-warning-500', Probation: 'bg-brand-500',
  Absent: 'bg-danger-500', Rejected: 'bg-danger-500', Terminated: 'bg-danger-500',
  Resigned: 'bg-gray-400', WFH: 'bg-violet-500', Assigned: 'bg-brand-500',
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-[3px] rounded-md text-[11px] font-semibold border leading-none',
        statusStyles[status] || 'bg-gray-100 text-gray-600 border-gray-200',
        className
      )}
    >
      <span className={cn('w-[5px] h-[5px] rounded-full flex-shrink-0', dotColors[status] || 'bg-gray-400')} />
      {status}
    </span>
  );
}
