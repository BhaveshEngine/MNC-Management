import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, SlidersHorizontal, Download, Upload, ChevronLeft, ChevronRight,
  Eye, Pencil, MoreHorizontal, ArrowUpDown, ArrowUp, ArrowDown,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { employees, getDepartmentName, departments } from '@/data/mock-data';
import { formatSalary, formatDate, cn } from '@/lib/utils';
import type { Employee } from '@/types';

const PAGE_SIZE = 10;

export function EmployeesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const [sortField, setSortField] = useState<keyof Employee>('firstName');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    let result = employees.filter((emp) => {
      const term = search.toLowerCase();
      const matchesSearch = !term ||
        `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(term) ||
        emp.employeeId.toLowerCase().includes(term) ||
        emp.email.toLowerCase().includes(term) ||
        emp.designation.toLowerCase().includes(term);
      const matchesStatus = statusFilter === 'All' || emp.status === statusFilter;
      const matchesDept = deptFilter === 'All' || emp.departmentId === deptFilter;
      return matchesSearch && matchesStatus && matchesDept;
    });

    result.sort((a, b) => {
      const aVal = String(a[sortField]).toLowerCase();
      const bVal = String(b[sortField]).toLowerCase();
      return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
    return result;
  }, [search, statusFilter, deptFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (field: keyof Employee) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const toggleAll = () => {
    setSelected(prev => prev.size === paginated.length ? new Set() : new Set(paginated.map(e => e.id)));
  };

  const SortIndicator = ({ field }: { field: keyof Employee }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 text-gray-300" />;
    return sortDir === 'asc' ? <ArrowUp className="w-3 h-3 text-brand-600" /> : <ArrowDown className="w-3 h-3 text-brand-600" />;
  };

  return (
    <div className="space-y-5 animate-slide-up">
      {/* ── Header ── */}
      <PageHeader
        title="Employees"
        subtitle={`${employees.length} total employees · ${employees.filter(e => e.status === 'Active').length} active`}
        actions={
          <>
            <Button variant="outline" size="sm" icon={<Upload className="w-3.5 h-3.5" />}>Import</Button>
            <Button variant="outline" size="sm" icon={<Download className="w-3.5 h-3.5" />}>Export</Button>
          </>
        }
      />

      {/* ── Toolbar ── */}
      <Card padding="sm">
        <div className="flex flex-col md:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-[14px] h-[14px] text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search employees..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-8 pr-3 h-8 rounded-lg border border-gray-200 bg-gray-50 text-[12px]
                         placeholder-gray-400 focus:bg-white focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={deptFilter}
              onChange={(e) => { setDeptFilter(e.target.value); setPage(1); }}
              className="h-8 px-2.5 text-[12px] rounded-lg border border-gray-200 bg-white text-gray-600 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            >
              <option value="All">All Departments</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="h-8 px-2.5 text-[12px] rounded-lg border border-gray-200 bg-white text-gray-600 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            >
              <option value="All">All Status</option>
              <option>Active</option>
              <option>On Leave</option>
              <option>Probation</option>
              <option>Resigned</option>
              <option>Terminated</option>
            </select>
            <button className="h-8 px-2.5 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition-colors flex items-center gap-1.5 text-[12px]">
              <SlidersHorizontal className="w-3.5 h-3.5" /> More Filters
            </button>
          </div>
        </div>
        {selected.size > 0 && (
          <div className="flex items-center gap-3 mt-2.5 pt-2.5 border-t border-gray-100 text-[12px]">
            <span className="text-gray-500 font-medium">{selected.size} selected</span>
            <button className="text-danger-600 font-semibold hover:underline">Delete</button>
            <button className="text-gray-500 font-medium hover:underline" onClick={() => setSelected(new Set())}>Clear</button>
          </div>
        )}
      </Card>

      {/* ── Table ── */}
      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th className="w-10 pl-4 pr-2">
                  <input type="checkbox" checked={paginated.length > 0 && selected.size === paginated.length} onChange={toggleAll}
                    className="w-3.5 h-3.5 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
                </th>
                <th className="cursor-pointer hover:text-gray-700 select-none" onClick={() => handleSort('firstName')}>
                  <span className="inline-flex items-center gap-1">Employee <SortIndicator field="firstName" /></span>
                </th>
                <th className="cursor-pointer hover:text-gray-700 select-none" onClick={() => handleSort('employeeId')}>
                  <span className="inline-flex items-center gap-1">Emp ID <SortIndicator field="employeeId" /></span>
                </th>
                <th>Department</th>
                <th className="cursor-pointer hover:text-gray-700 select-none" onClick={() => handleSort('designation')}>
                  <span className="inline-flex items-center gap-1">Designation <SortIndicator field="designation" /></span>
                </th>
                <th>Location</th>
                <th className="cursor-pointer hover:text-gray-700 select-none text-right" onClick={() => handleSort('salary')}>
                  <span className="inline-flex items-center gap-1 justify-end">Salary <SortIndicator field="salary" /></span>
                </th>
                <th>Status</th>
                <th className="text-right pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((emp) => (
                <tr key={emp.id}>
                  <td className="pl-4 pr-2">
                    <input type="checkbox" checked={selected.has(emp.id)} onChange={() => toggleSelect(emp.id)}
                      className="w-3.5 h-3.5 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
                  </td>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <Avatar name={`${emp.firstName} ${emp.lastName}`} size="sm" />
                      <div>
                        <p className="text-[13px] font-semibold text-gray-900 leading-tight">{emp.firstName} {emp.lastName}</p>
                        <p className="text-[11px] text-gray-400">{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="text-[12px] font-mono font-medium text-brand-600">{emp.employeeId}</span>
                  </td>
                  <td className="text-[13px] text-gray-600">{getDepartmentName(emp.departmentId)}</td>
                  <td className="text-[13px] text-gray-600">{emp.designation}</td>
                  <td className="text-[12px] text-gray-500">{emp.workLocation}</td>
                  <td className="text-right">
                    <span className="text-[13px] font-mono font-medium text-gray-800">{formatSalary(emp.salary)}</span>
                  </td>
                  <td><StatusBadge status={emp.status} /></td>
                  <td className="text-right pr-4">
                    <div className="flex items-center justify-end gap-0.5">
                      <button onClick={() => navigate(`/employees/${emp.id}`)} className="w-7 h-7 rounded-md flex items-center justify-center text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition-colors" title="View">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button className="w-7 h-7 rounded-md flex items-center justify-center text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition-colors" title="Edit">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button className="w-7 h-7 rounded-md flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors" title="More">
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {paginated.length === 0 && (
          <div className="py-20 text-center animate-fade">
            <Search className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-[14px] font-medium text-gray-500">No employees found</p>
            <p className="text-[12px] text-gray-400 mt-1 mb-4">No employees match your current filters.</p>
            <button
              onClick={() => { setSearch(''); setStatusFilter('All'); setDeptFilter('All'); }}
              className="text-[12px] font-semibold text-brand-600 hover:text-brand-700"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-[12px] text-gray-500">
              Showing <span className="font-medium text-gray-700">{(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)}</span> of{' '}
              <span className="font-medium text-gray-700">{filtered.length}</span> employees
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-7 h-7 rounded-md flex items-center justify-center border border-gray-200 text-gray-500
                           hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn(
                    'w-7 h-7 rounded-md text-[12px] font-medium transition-colors',
                    p === page ? 'bg-brand-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                  )}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-7 h-7 rounded-md flex items-center justify-center border border-gray-200 text-gray-500
                           hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
