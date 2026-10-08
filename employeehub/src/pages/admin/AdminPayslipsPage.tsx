import { useState } from 'react';
import { Search, Download, Receipt } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/AppStore';

export function AdminPayslipsPage() {
  const { state } = useAppStore();
  
  const [selectedMonth, setSelectedMonth] = useState('September 2026');
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');

  const departments = ['All', ...Array.from(new Set((state.employees || []).map(e => e.department)))];

  const currentMonthPayslips = (state.payslips || []).filter(p => p.month === selectedMonth);

  const payslipRows = (state.employees || []).filter(emp => emp.status === 'Active').map(emp => {
    const ps = currentMonthPayslips.find(p => p.employeeId === emp.id);
    const st = (state.salaryStructures || []).find(s => s.employeeId === emp.id) || { gross: 0, net: 0, components: [] };
    return {
      employeeId: emp.id,
      name: `${emp.firstName} ${emp.lastName}`,
      department: emp.department,
      payslip: ps,
      salaryStructure: st,
    };
  }).filter(row => {
    const matchesSearch = row.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === 'All' || row.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="max-w-[1400px] mx-auto animate-slide-up space-y-6">
      <PageHeader
        title="Payslips"
        subtitle="View and download generated payslips for all employees."
      />

      <Card padding="none" className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between border-b-0 rounded-b-none">
        <div className="relative flex-1 w-full max-w-sm">
          <Input placeholder="Search employees..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} icon={<Search className="w-4 h-4" />} />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="h-10 px-3 rounded-lg border border-gray-200 text-[13px] text-gray-700 bg-white">
            <option>September 2026</option>
            <option>August 2026</option>
            <option>July 2026</option>
          </select>
          <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="h-10 px-3 rounded-lg border border-gray-200 bg-white text-[13px] text-gray-700 w-full md:w-[160px]">
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </Card>

      <Card padding="none" className="overflow-hidden rounded-t-none border-t border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">Employee</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">Gross</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">Net Salary</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">Status</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payslipRows.map(row => (
                <tr key={row.employeeId} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div className="text-[14px] font-medium text-gray-900">{row.name}</div>
                    <div className="text-[12px] text-gray-500">{row.department}</div>
                  </td>
                  <td className="px-6 py-4 text-[14px] text-gray-700">₹{row.payslip ? row.payslip.grossSalary.toLocaleString('en-IN') : row.salaryStructure.gross.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-[14px] font-medium text-gray-900">
                    {row.payslip ? `₹${row.payslip.netSalary.toLocaleString('en-IN')}` : '—'}
                  </td>
                  <td className="px-6 py-4">
                    {row.payslip ? (
                      <Badge variant={row.payslip.status === 'Paid' ? 'success' : row.payslip.status === 'Processed' ? 'primary' : 'warning'}>{row.payslip.status}</Badge>
                    ) : (
                      <Badge variant="default">Draft</Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {row.payslip && (
                      <Button variant="outline" size="sm" icon={<Download className="w-4 h-4" />}>PDF</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
