import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, LogIn, LogOut, CheckCircle, XCircle, AlertCircle, Plus, X } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/AppStore';
import { currentEmployee, empAttendanceSummary } from '@/data/employee-mock-data';
import { cn, formatDate } from '@/lib/utils';

export function EmployeeAttendancePage() {
  const { getAttendanceByEmployee, requestAttendanceCorrection } = useAppStore();
  const attendanceRecords = getAttendanceByEmployee(currentEmployee.id);
  const [filter, setFilter] = useState('All Status');
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [correctionForm, setCorrectionForm] = useState({ date: '', reason: '' });

  const filteredRecords = filter === 'All Status' 
    ? attendanceRecords 
    : attendanceRecords.filter(r => r.status === filter);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Present': return <CheckCircle className="w-4 h-4 text-success-500" />;
      case 'Absent': return <XCircle className="w-4 h-4 text-danger-500" />;
      case 'Late': return <AlertCircle className="w-4 h-4 text-warning-500" />;
      default: return null;
    }
  };

  const handleCorrectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionForm.date || !correctionForm.reason) return;
    
    requestAttendanceCorrection({
      employeeId: currentEmployee.id,
      employeeName: `${currentEmployee.firstName} ${currentEmployee.lastName}`,
      date: correctionForm.date,
      reason: correctionForm.reason
    });
    
    setShowCorrectionModal(false);
    setCorrectionForm({ date: '', reason: '' });
  };

  // Generate calendar days for October 2026 (starts on Thursday)
  // Just a simple visual mock
  const generateCalendar = () => {
    const days = [];
    // 3 empty for Mon, Tue, Wed
    for (let i = 0; i < 3; i++) days.push(null);
    for (let i = 1; i <= 31; i++) {
      let status = 'Weekend';
      const dayOfWeek = (i + 2) % 7; // 1=Thu, ..., 5=Mon, 6=Tue, 0=Wed
      if (dayOfWeek !== 5 && dayOfWeek !== 6) {
        if (i === 2) status = 'Absent';
        else if (i === 3 || i === 26) status = 'Late';
        else if (i === 20) status = 'Leave';
        else if (i >= 31) status = 'Holiday';
        else status = 'Present';
      }
      days.push({ day: i, status });
    }
    return days;
  };

  const getColorClass = (status: string) => {
    switch(status) {
      case 'Present': return 'bg-success-100 text-success-700 border-success-200';
      case 'Absent': return 'bg-danger-100 text-danger-700 border-danger-200';
      case 'Late': return 'bg-warning-100 text-warning-700 border-warning-200';
      case 'Leave': return 'bg-brand-100 text-brand-700 border-brand-200';
      case 'Holiday': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Weekend': return 'bg-gray-50 text-gray-400 border-gray-100';
      default: return 'bg-white';
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto animate-slide-up">
      <PageHeader
        title="Attendance Logs"
        subtitle="View your daily check-in and check-out history"
        actions={
          <div className="flex gap-3">
            <select className="h-10 px-3 rounded-lg border border-gray-200 bg-white text-[13px] text-gray-700 font-medium focus:border-brand-500 focus:ring-2 focus:ring-brand-100">
              <option>October 2026</option>
              <option>September 2026</option>
              <option>August 2026</option>
            </select>
            <Button variant="outline" icon={<AlertCircle className="w-4 h-4" />} onClick={() => setShowCorrectionModal(true)}>
              Request Correction
            </Button>
          </div>
        }
      />

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <p className="text-[12px] text-gray-500 font-medium mb-1">Present Days</p>
          <p className="text-[24px] font-bold text-gray-900 font-mono">{empAttendanceSummary.present}</p>
        </Card>
        <Card>
          <p className="text-[12px] text-gray-500 font-medium mb-1">Absent Days</p>
          <p className="text-[24px] font-bold text-gray-900 font-mono">{empAttendanceSummary.absent}</p>
        </Card>
        <Card>
          <p className="text-[12px] text-gray-500 font-medium mb-1">Late Arrivals</p>
          <p className="text-[24px] font-bold text-gray-900 font-mono">{empAttendanceSummary.late}</p>
        </Card>
        <Card>
          <p className="text-[12px] text-gray-500 font-medium mb-1">Total Hours</p>
          <p className="text-[24px] font-bold text-gray-900 font-mono">{empAttendanceSummary.workingHours}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Calendar View */}
        <Card className="lg:col-span-1">
          <h3 className="text-[16px] font-semibold text-gray-900 mb-4 flex items-center justify-between">
            Calendar View
            <span className="text-[12px] font-normal text-gray-500">Oct 2026</span>
          </h3>
          <div className="grid grid-cols-7 gap-1 mb-4 text-center">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <div key={i} className="text-[11px] font-bold text-gray-400 py-1">{d}</div>
            ))}
            {generateCalendar().map((d, i) => (
              <div 
                key={i} 
                className={cn(
                  "aspect-square rounded flex items-center justify-center text-[12px] font-medium border cursor-default",
                  d ? getColorClass(d.status) : "border-transparent"
                )}
                title={d?.status}
              >
                {d?.day}
              </div>
            ))}
          </div>
          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-sm bg-success-500"></div><span className="text-[11px] text-gray-600">Present</span></div>
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-sm bg-danger-500"></div><span className="text-[11px] text-gray-600">Absent</span></div>
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-sm bg-warning-500"></div><span className="text-[11px] text-gray-600">Late</span></div>
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-sm bg-brand-500"></div><span className="text-[11px] text-gray-600">Leave</span></div>
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-sm bg-purple-500"></div><span className="text-[11px] text-gray-600">Holiday</span></div>
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-sm bg-gray-300"></div><span className="text-[11px] text-gray-600">Weekend</span></div>
          </div>
        </Card>

        {/* History Table */}
        <Card padding="none" className="overflow-hidden lg:col-span-2 flex flex-col h-full">
          <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-[16px] font-semibold text-gray-900">Attendance History</h3>
            <div className="flex gap-2">
              <select className="h-8 px-2.5 text-[12px] rounded-lg border border-gray-200 bg-white text-gray-600">
                <option>This Month</option>
                <option>Last Month</option>
              </select>
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="h-8 px-2.5 text-[12px] rounded-lg border border-gray-200 bg-white text-gray-600 focus:border-brand-400"
              >
                <option>All Status</option>
                <option>Present</option>
                <option>Late</option>
                <option>Absent</option>
              </select>
            </div>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Total Hours</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-[13px] text-gray-400 py-8">
                      No attendance records found.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((record) => (
                    <tr key={record.id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-[13px] font-medium text-gray-800">
                            {formatDate(record.date)}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <LogIn className="w-4 h-4 text-gray-400" />
                          <span className="text-[13px] font-mono text-gray-700">{record.checkIn || '—'}</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <LogOut className="w-4 h-4 text-gray-400" />
                          <span className="text-[13px] font-mono text-gray-700">{record.checkOut || '—'}</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-[13px] font-mono font-medium text-gray-900">{record.hours}</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          {getStatusIcon(record.status)}
                          <StatusBadge status={record.status} />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between text-[12px] text-gray-500 bg-gray-50">
            <span>Showing 1-{Math.min(5, filteredRecords.length)} of {filteredRecords.length} records</span>
            <div className="flex gap-2">
              <button className="px-2 py-1 border border-gray-200 rounded text-gray-400 cursor-not-allowed bg-white">Prev</button>
              <button className="px-2 py-1 border border-gray-200 rounded text-gray-600 hover:bg-gray-100 bg-white">Next</button>
            </div>
          </div>
        </Card>
      </div>

      {/* Correction Modal */}
      {showCorrectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade">
          <Card className="w-full max-w-[400px] mx-4 p-0 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h3 className="text-[16px] font-bold text-gray-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-brand-600" /> Request Correction
              </h3>
              <button onClick={() => setShowCorrectionModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCorrectionSubmit} className="p-5 space-y-4">
              <p className="text-[13px] text-gray-600 mb-2">Submit a request to Admin/HR if your attendance was recorded incorrectly.</p>
              <div>
                <label className="block text-[12px] font-semibold text-gray-700 mb-1">Select Date</label>
                <input 
                  type="date" 
                  required 
                  value={correctionForm.date} 
                  onChange={e => setCorrectionForm(s => ({ ...s, date: e.target.value }))} 
                  className="w-full" 
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-gray-700 mb-1">Reason / Explanation</label>
                <textarea 
                  required 
                  rows={3}
                  placeholder="E.g. Forgot to punch in due to network issue..."
                  value={correctionForm.reason} 
                  onChange={e => setCorrectionForm(s => ({ ...s, reason: e.target.value }))} 
                  className="w-full" 
                />
              </div>
              <div className="pt-2 flex gap-3">
                <Button variant="ghost" className="w-full" onClick={() => setShowCorrectionModal(false)}>Cancel</Button>
                <Button type="submit" className="w-full">Submit Request</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
