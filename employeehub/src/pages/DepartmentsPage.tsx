import { Building2, Users } from 'lucide-react';
import { departments, employees } from '@/data/mock-data';
import { formatCurrency } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { Avatar } from '@/components/ui/Avatar';

export function DepartmentsPage() {
  return (
    <div className="space-y-5 animate-slide-up">
      <PageHeader
        title="Departments"
        subtitle={`${departments.length} departments across the organization`}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {departments.map((dept) => {
          const deptEmps = employees.filter(e => e.departmentId === dept.id);
          const head = employees.find(e => e.id === dept.headId);
          const activeCount = deptEmps.filter(e => e.status === 'Active').length;
          const avgSalary = deptEmps.length > 0
            ? deptEmps.reduce((s, e) => s + e.salary, 0) / deptEmps.length
            : 0;

          return (
            <Card key={dept.id} hover>
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-medium text-gray-400 flex items-center gap-1">
                  <Users className="w-3 h-3" /> {deptEmps.length}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-[15px] font-semibold text-gray-900 mb-0.5">{dept.name}</h3>
              <p className="text-[12px] text-gray-400 line-clamp-2 mb-4">{dept.description}</p>

              {/* Department Head */}
              {head && (
                <div className="flex items-center gap-2 mb-4 p-2 rounded-lg bg-gray-50 border border-gray-100">
                  <Avatar name={`${head.firstName} ${head.lastName}`} size="xs" />
                  <div className="min-w-0">
                    <p className="text-[12px] font-semibold text-gray-700 leading-tight truncate">{head.firstName} {head.lastName}</p>
                    <p className="text-[10px] text-gray-400 truncate">{head.designation}</p>
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider">Active</p>
                  <p className="text-[15px] font-bold text-gray-900 font-mono">{activeCount}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider">Avg Salary</p>
                  <p className="text-[15px] font-bold text-gray-900 font-mono">{formatCurrency(avgSalary)}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
