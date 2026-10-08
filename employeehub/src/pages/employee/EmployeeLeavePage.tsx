import { useState } from 'react';
import { CalendarDays, Plus, X } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useAppStore } from '@/store/AppStore';
import { currentEmployee } from '@/data/employee-mock-data';
import { cn, formatDate } from '@/lib/utils';

export function EmployeeLeavePage() {
  const { getLeavesByEmployee, getLeaveBalance, submitLeave } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');

  // Form state
  const [leaveType, setLeaveType] = useState('Annual Leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [formError, setFormError] = useState('');

  const leaves = getLeavesByEmployee(currentEmployee.id);
  const balance = getLeaveBalance(currentEmployee.id);
  const pendingCount = leaves.filter(l => l.status === 'Pending').length;

  const filtered = statusFilter === 'All' ? leaves : leaves.filter(l => l.status === statusFilter);

  const calcDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!startDate) { setFormError('Please select a start date'); return; }
    if (!endDate) { setFormError('Please select an end date'); return; }
    if (new Date(endDate) < new Date(startDate)) { setFormError('End date must be after start date'); return; }
    if (!reason.trim()) { setFormError('Please provide a reason'); return; }

    submitLeave({
      employeeId: currentEmployee.id,
      employeeName: `${currentEmployee.firstName} ${currentEmployee.lastName}`,
      type: leaveType,
      startDate,
      endDate,
      days: calcDays(),
      reason: reason.trim(),
    });

    // Reset form
    setShowForm(false);
    setLeaveType('Annual Leave');
    setStartDate('');
    setEndDate('');
    setReason('');
  };

  const annualBal = balance?.annual || { total: 14, used: 0 };
  const sickBal = balance?.sick || { total: 8, used: 0 };
  const casualBal = balance?.casual || { total: 5, used: 0 };

  return (
    <div className="max-w-[1600px] mx-auto animate-slide-up">
      <PageHeader
        title="Leave Management"
        subtitle="Apply for leave and track your requests"
        actions={
          <Button icon={<Plus className="w-4 h-4" />} onClick={() => setShowForm(true)}>
            Apply for Leave
          </Button>
        }
      />

      {/* ── Balance Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Annual Leave', remaining: annualBal.total - annualBal.used, total: annualBal.total, used: annualBal.used, color: '#2563EB' },
          { label: 'Sick Leave', remaining: sickBal.total - sickBal.used, total: sickBal.total, used: sickBal.used, color: '#EF4444' },
          { label: 'Casual Leave', remaining: casualBal.total - casualBal.used, total: casualBal.total, used: casualBal.used, color: '#F59E0B' },
          { label: 'Pending Requests', remaining: pendingCount, total: null, used: null, color: '#7C3AED' },
        ].map(b => (
          <Card key={b.label}>
            <p className="text-[12px] text-gray-400 font-medium mb-2">{b.label}</p>
            <div className="flex items-end justify-between mb-3">
              <span className="text-[28px] font-bold text-gray-900 font-mono leading-none">{b.remaining}</span>
              {b.total !== null && <span className="text-[12px] text-gray-400">of {b.total}</span>}
            </div>
            {b.total !== null && b.used !== null && (
              <>
                <div className="w-full h-2 rounded-full bg-gray-100">
                  <div className="h-2 rounded-full transition-all" style={{ width: `${(b.used / b.total) * 100}%`, backgroundColor: b.color }} />
                </div>
                <p className="text-[11px] text-gray-400 mt-1.5">{b.used} used</p>
              </>
            )}
          </Card>
        ))}
      </div>

      {/* ── Apply Form (modal overlay) ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade">
          <Card className="w-full max-w-[500px] mx-4 relative">
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-[18px] font-bold text-gray-900 mb-5">Apply for Leave</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[12px] font-semibold text-gray-600 uppercase tracking-wider block mb-1.5">Leave Type</label>
                <select value={leaveType} onChange={e => setLeaveType(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-[13px] text-gray-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-100">
                  <option>Annual Leave</option>
                  <option>Sick Leave</option>
                  <option>Casual Leave</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[12px] font-semibold text-gray-600 uppercase tracking-wider block mb-1.5">Start Date</label>
                  <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-[13px] text-gray-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
                </div>
                <div>
                  <label className="text-[12px] font-semibold text-gray-600 uppercase tracking-wider block mb-1.5">End Date</label>
                  <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-[13px] text-gray-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
                </div>
              </div>
              {calcDays() > 0 && (
                <p className="text-[13px] font-medium text-brand-600 bg-brand-50 px-3 py-2 rounded-lg">
                  Duration: {calcDays()} day{calcDays() > 1 ? 's' : ''}
                </p>
              )}
              <div>
                <label className="text-[12px] font-semibold text-gray-600 uppercase tracking-wider block mb-1.5">Reason</label>
                <textarea value={reason} onChange={e => setReason(e.target.value)} rows={3} placeholder="Briefly describe the reason..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-[13px] text-gray-700 placeholder-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 resize-none" />
              </div>
              {formError && (
                <p className="text-[12px] text-danger-600 font-medium bg-danger-50 px-3 py-2 rounded-lg">{formError}</p>
              )}
              <div className="flex justify-end gap-2.5 pt-2">
                <Button variant="ghost" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button type="submit">Submit Request</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* ── Leave Requests Table ── */}
      <Card padding="none" className="overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-[16px] font-semibold text-gray-900">My Leave Requests</h3>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="h-8 px-2.5 text-[12px] rounded-lg border border-gray-200 bg-white text-gray-600 focus:border-brand-400">
            <option value="All">All Status</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Rejected</option>
          </select>
        </div>
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Days</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center text-[13px] text-gray-400 py-12">No leave requests found</td></tr>
            ) : (
              filtered.map(lv => (
                <tr key={lv.id}>
                  <td className="text-[13px] font-medium text-gray-800">{lv.type}</td>
                  <td className="text-[13px] text-gray-600">{formatDate(lv.startDate)}</td>
                  <td className="text-[13px] text-gray-600">{formatDate(lv.endDate)}</td>
                  <td className="text-[13px] font-mono font-semibold text-gray-900">{lv.days}</td>
                  <td className="text-[13px] text-gray-500 max-w-[200px] truncate">{lv.reason}</td>
                  <td><StatusBadge status={lv.status} /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
