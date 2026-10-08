import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarCheck, CalendarDays, Clock, TrendingUp,
  ArrowRight, MapPin, LogOut, LogIn, FileText, Monitor,
  Users, Megaphone, GitPullRequest, Wallet,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useAppStore } from '@/store/AppStore';
import { currentEmployee, empUpcomingEvents } from '@/data/employee-mock-data';
import { cn } from '@/lib/utils';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

function getCurrentDate() {
  return new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function getCurrentTimeStr() {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export function EmployeeDashboard() {
  const navigate = useNavigate();
  const { getAttendanceByEmployee, getLeaveBalance, checkIn, checkOut } = useAppStore();
  const [time, setTime] = useState(getCurrentTimeStr());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Get today's record from store
  const today = new Date().toISOString().split('T')[0];
  const todayRecord = getAttendanceByEmployee(currentEmployee.id).find(a => a.date === today);
  const isCheckedIn = !!todayRecord?.checkIn;
  const isCheckedOut = !!todayRecord?.checkOut;

  // Leave balance from store
  const balance = getLeaveBalance(currentEmployee.id);
  const annualBal = balance?.annual || { total: 14, used: 0 };
  const sickBal = balance?.sick || { total: 8, used: 0 };
  const casualBal = balance?.casual || { total: 5, used: 0 };
  const totalLeaveRemaining = (annualBal.total - annualBal.used) + (sickBal.total - sickBal.used) + (casualBal.total - casualBal.used);
  const totalLeaveUsed = annualBal.used + sickBal.used + casualBal.used;
  const totalLeave = annualBal.total + sickBal.total + casualBal.total;

  // Live timer
  useEffect(() => {
    if (isCheckedIn && !isCheckedOut) {
      const start = 7 * 3600 + 22 * 60;
      setElapsedSeconds(start);
      const interval = setInterval(() => setElapsedSeconds(s => s + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [isCheckedIn, isCheckedOut]);

  useEffect(() => {
    const interval = setInterval(() => setTime(getCurrentTimeStr()), 30000);
    return () => clearInterval(interval);
  }, []);

  const formatElapsed = useCallback((s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return `${h}h ${m.toString().padStart(2, '0')}m`;
  }, []);

  const handleToggle = () => {
    if (!isCheckedIn) checkIn(currentEmployee.id);
    else if (!isCheckedOut) checkOut(currentEmployee.id);
  };

  const quickActions = [
    { icon: CalendarDays, label: 'Apply Leave', path: '/employee/leave', color: 'text-brand-600 bg-brand-50' },
    { icon: Wallet, label: 'View Payslip', path: '/employee/payroll', color: 'text-emerald-600 bg-emerald-50' },
    { icon: GitPullRequest, label: 'Raise Request', path: '/employee/requests', color: 'text-amber-600 bg-amber-50' },
    { icon: Monitor, label: 'My Assets', path: '/employee/assets', color: 'text-violet-600 bg-violet-50' },
    { icon: FileText, label: 'Company Docs', path: '/employee/documents', color: 'text-rose-600 bg-rose-50' },
    { icon: Users, label: 'View Directory', path: '/employee/directory', color: 'text-cyan-600 bg-cyan-50' },
  ];

  return (
    <div className="max-w-[1600px] mx-auto animate-slide-up">
      <PageHeader
        title={`${getGreeting()}, ${currentEmployee.firstName} ${currentEmployee.lastName} 👋`}
        subtitle="Here's your work summary for today."
        actions={
          <div className="text-right hidden sm:block">
            <p className="text-[14px] font-medium text-gray-700">{getCurrentDate()}</p>
            <p className="text-[13px] text-gray-400 mt-0.5">{time}</p>
          </div>
        }
      />

      {/* ── 4 Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="flex items-start justify-between mb-3">
            <p className="text-[13px] font-medium text-gray-500">Attendance</p>
            <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600">
              <CalendarCheck className="w-[18px] h-[18px]" />
            </div>
          </div>
          <p className="text-[28px] font-bold text-gray-900 leading-none font-mono">22</p>
          <p className="text-[12px] text-gray-400 mt-1">Days this month</p>
        </Card>

        <Card>
          <div className="flex items-start justify-between mb-3">
            <p className="text-[13px] font-medium text-gray-500">Leave Balance</p>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CalendarDays className="w-[18px] h-[18px]" />
            </div>
          </div>
          <p className="text-[28px] font-bold text-gray-900 leading-none font-mono">{totalLeaveRemaining}</p>
          <p className="text-[12px] text-gray-400 mt-1">{totalLeaveUsed} used of {totalLeave}</p>
        </Card>

        <Card>
          <div className="flex items-start justify-between mb-3">
            <p className="text-[13px] font-medium text-gray-500">Working Hours</p>
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-[18px] h-[18px]" />
            </div>
          </div>
          <p className="text-[28px] font-bold text-gray-900 leading-none font-mono">164h 30m</p>
          <p className="text-[12px] text-gray-400 mt-1">This month</p>
        </Card>

        <Card>
          <div className="flex items-start justify-between mb-3">
            <p className="text-[13px] font-medium text-gray-500">Performance</p>
            <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600">
              <TrendingUp className="w-[18px] h-[18px]" />
            </div>
          </div>
          <p className="text-[28px] font-bold text-gray-900 leading-none font-mono">92%</p>
          <p className="text-[12px] text-success-600 font-medium mt-1">Excellent</p>
        </Card>
      </div>

      {/* ── Today's Attendance + Upcoming Events ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <Card>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[16px] font-semibold text-gray-900">Today's Attendance</h3>
            <StatusBadge status={isCheckedIn ? 'Present' : 'Not Checked In'} />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
              <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Checked In</p>
              <p className="text-[16px] font-bold text-gray-900 font-mono mt-1">{todayRecord?.checkIn || '—'}</p>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
              <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Checked Out</p>
              <p className="text-[16px] font-bold text-gray-900 font-mono mt-1">{todayRecord?.checkOut || '—'}</p>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
              <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Working Hours</p>
              <p className={cn('text-[16px] font-bold font-mono mt-1', isCheckedIn && !isCheckedOut ? 'text-brand-600' : 'text-gray-900')}>
                {isCheckedIn && !isCheckedOut ? formatElapsed(elapsedSeconds) : todayRecord?.hours || '—'}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
              <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Location</p>
              <p className="text-[14px] font-semibold text-gray-900 mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-gray-400" /> {currentEmployee.workLocation}
              </p>
            </div>
          </div>
          <Button
            onClick={handleToggle}
            disabled={isCheckedOut}
            variant={isCheckedIn && !isCheckedOut ? 'danger' : 'primary'}
            size="lg"
            className="w-full"
            icon={isCheckedIn && !isCheckedOut ? <LogOut className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
          >
            {isCheckedOut ? 'Checked Out ✓' : isCheckedIn ? 'Check Out' : 'Check In'}
          </Button>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[16px] font-semibold text-gray-900">Upcoming Events</h3>
            <button className="text-[12px] font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-2.5">
            {empUpcomingEvents.map((ev, i) => (
              <div key={i} className="flex gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-11 h-11 rounded-lg bg-brand-50 flex flex-col items-center justify-center flex-shrink-0 border border-brand-100">
                  <span className="text-[9px] font-bold text-brand-500 uppercase leading-none">{ev.month}</span>
                  <span className="text-[16px] font-bold text-brand-700 leading-none mt-0.5">{ev.day}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-gray-800">{ev.title}</p>
                  <div className="flex flex-col gap-0.5 mt-1">
                    <span className="text-[11px] text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {ev.time}</span>
                    <span className="text-[11px] text-gray-400 flex items-center gap-1"><MapPin className="w-3 h-3" /> {ev.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Quick Actions ── */}
      <div className="mb-6">
        <h3 className="text-[16px] font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map(qa => (
            <button
              key={qa.label}
              onClick={() => navigate(qa.path)}
              className="group bg-white rounded-2xl border border-[#E5EAF3] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-4
                         flex flex-col items-center gap-2.5 text-center
                         hover:shadow-md hover:border-gray-300 transition-all duration-150"
            >
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', qa.color)}>
                <qa.icon className="w-[18px] h-[18px]" />
              </div>
              <p className="text-[12px] font-semibold text-gray-700">{qa.label}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
