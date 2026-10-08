import { useState } from 'react';
import { Search, UserCheck, UserX, Clock, Calendar, CheckCircle2, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/AppStore';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

export function AdminAttendancePage() {
  const { state, approveAttendanceCorrection, rejectAttendanceCorrection } = useAppStore();
  const { user } = useAuth();
  const adminName = user?.name || 'Administrator';
  
  const [activeTab, setActiveTab] = useState<'Daily' | 'Corrections'>('Daily');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);
  const [deptFilter, setDeptFilter] = useState('All');
  
  // Daily Attendance data
  const departments = ['All', ...Array.from(new Set((state.employees || []).map(e => e.department)))];
  
  const selectedDateAttendance = (state.attendance || []).filter(a => a.date === dateFilter);
  
  const dailyRows = (state.employees || []).map(emp => {
    const att = selectedDateAttendance.find(a => a.employeeId === emp.id);
    return {
      id: emp.id,
      name: `${emp.firstName} ${emp.lastName}`,
      department: emp.department,
      checkIn: att?.checkIn || '—',
      checkOut: att?.checkOut || '—',
      hours: att?.hours || '—',
      status: att?.status || 'Absent',
    };
  }).filter(row => {
    const matchesSearch = row.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === 'All' || row.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  // Stats
  const present = dailyRows.filter(r => r.status === 'Present').length;
  const absent = dailyRows.filter(r => r.status === 'Absent').length;
  const late = dailyRows.filter(r => r.status === 'Late').length;
  const onLeave = dailyRows.filter(r => r.status === 'On Leave').length;
  const wfh = dailyRows.filter(r => r.status === 'WFH').length;

  // Corrections
  const pendingCorrections = (state.attendanceCorrections || []).filter(c => c.status === 'Pending');

  return (
    <div className="max-w-[1400px] mx-auto animate-slide-up space-y-6">
      <PageHeader
        title="Attendance Management"
        subtitle="Track daily attendance and manage correction requests."
        actions={
          <Button variant="outline" icon={<Calendar className="w-4 h-4" />}>
            View Calendar
          </Button>
        }
      />

      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('Daily')}
          className={cn("pb-3 px-2 text-[14px] font-medium border-b-2 transition-colors", activeTab === 'Daily' ? "border-brand-600 text-brand-600" : "border-transparent text-gray-500 hover:text-gray-700")}
        >
          Daily Attendance
        </button>
        <button
          onClick={() => setActiveTab('Corrections')}
          className={cn("pb-3 px-2 text-[14px] font-medium border-b-2 transition-colors flex items-center gap-2", activeTab === 'Corrections' ? "border-brand-600 text-brand-600" : "border-transparent text-gray-500 hover:text-gray-700")}
        >
          Correction Requests
          {pendingCorrections.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-danger-100 text-danger-700 text-[10px] font-bold">
              {pendingCorrections.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'Daily' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card className="p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] font-medium text-gray-500">Present</span>
                <UserCheck className="w-4 h-4 text-success-500" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{present}</span>
            </Card>
            <Card className="p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] font-medium text-gray-500">Absent</span>
                <UserX className="w-4 h-4 text-danger-500" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{absent}</span>
            </Card>
            <Card className="p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] font-medium text-gray-500">Late</span>
                <Clock className="w-4 h-4 text-warning-500" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{late}</span>
            </Card>
            <Card className="p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] font-medium text-gray-500">On Leave</span>
                <Calendar className="w-4 h-4 text-purple-500" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{onLeave}</span>
            </Card>
            <Card className="p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] font-medium text-gray-500">WFH</span>
                <UserCheck className="w-4 h-4 text-brand-500" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{wfh}</span>
            </Card>
          </div>

          <Card padding="none" className="p-4 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full max-w-sm">
              <Input 
                placeholder="Search employees..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="w-4 h-4" />}
              />
            </div>
            <div className="flex gap-4 w-full md:w-auto ml-auto">
              <input
                type="date"
                value={dateFilter}
                onChange={e => setDateFilter(e.target.value)}
                className="h-10 px-3 rounded-lg border border-gray-200 text-[13px] text-gray-700 bg-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
              />
              <select 
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="h-10 px-3 rounded-lg border border-gray-200 bg-white text-[13px] text-gray-700 w-full md:w-[160px]"
              >
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <Button variant="outline">Export CSV</Button>
            </div>
          </Card>

          <Card padding="none" className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">Employee</th>
                    <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">Department</th>
                    <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">Check In</th>
                    <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">Check Out</th>
                    <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">Hours</th>
                    <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {dailyRows.map(row => (
                    <tr key={row.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 text-[14px] font-medium text-gray-900">{row.name}</td>
                      <td className="px-6 py-4 text-[13px] text-gray-600">{row.department}</td>
                      <td className="px-6 py-4 text-[13px] text-gray-600">{row.checkIn}</td>
                      <td className="px-6 py-4 text-[13px] text-gray-600">{row.checkOut}</td>
                      <td className="px-6 py-4 text-[13px] text-gray-600">{row.hours}</td>
                      <td className="px-6 py-4">
                        <Badge variant={
                          row.status === 'Present' ? 'success' :
                          row.status === 'Absent' ? 'danger' :
                          row.status === 'Late' ? 'warning' : 'default'
                        }>{row.status}</Badge>
                      </td>
                    </tr>
                  ))}
                  {dailyRows.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-[13px] text-gray-500">No attendance records found for this date.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'Corrections' && (
        <Card padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">Employee</th>
                  <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">Date</th>
                  <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">Requested Times</th>
                  <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">Reason</th>
                  <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pendingCorrections.map(req => (
                  <tr key={req.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 text-[14px] font-medium text-gray-900">{req.employeeName}</td>
                    <td className="px-6 py-4 text-[13px] text-gray-600">{new Date(req.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="text-[13px] text-gray-900 font-medium">{req.checkIn} — {req.checkOut}</div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[13px] text-gray-600 max-w-[200px] truncate" title={req.reason}>{req.reason}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" size="sm" onClick={() => rejectAttendanceCorrection(req.id, adminName)}>Reject</Button>
                        <Button size="sm" onClick={() => approveAttendanceCorrection(req.id, adminName)}>Approve</Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pendingCorrections.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-[13px] text-gray-500">
                      <CheckCircle2 className="w-8 h-8 text-success-300 mx-auto mb-3" />
                      All caught up! No pending correction requests.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
