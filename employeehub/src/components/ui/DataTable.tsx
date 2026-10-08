import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
import { Card } from './Card';

interface Column<T> {
  key: string;
  header: string;
  className?: string;
  headerClassName?: string;
  render: (item: T, index: number) => ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  emptyState?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function DataTable<T>({ columns, data, keyExtractor, emptyState, footer, className }: DataTableProps<T>) {
  return (
    <Card padding="none" className={cn('overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} className={cn(col.headerClassName)}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={keyExtractor(item)}>
                {columns.map((col) => (
                  <td key={col.key} className={cn(col.className)}>
                    {col.render(item, index)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && emptyState && (
        <div className="py-16">{emptyState}</div>
      )}

      {footer && (
        <div className="border-t border-gray-100">
          {footer}
        </div>
      )}
    </Card>
  );
}
