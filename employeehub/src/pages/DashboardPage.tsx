import { useState } from 'react';
import {
  Users, UserCheck, Building2, CalendarCheck, DollarSign, UserPlus,
  Plus, ClipboardList, CheckCircle, Megaphone, FileBarChart, Wallet,
  ArrowRight, Clock, MapPin,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Area, AreaChart, Legend,
} from 'recharts';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { useAppStore } from '@/store/AppStore';
import { employees, departments } from '@/data/mock-data';
import { cn, formatCurrency, getGreeting, getCurrentDate, getCurrentTime } from '@/lib/utils';

/* ── Chart Data ── */
const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#06b6d4', '#ec4899', '#64748b'];

const attendanceTrend = [
  { day: 'Mon', present: 94, absent: 4, late: 2 },
  { day: 'Tue', present: 96, absent: 2, late: 2 },
  { day: 'Wed', present: 91, absent: 6, late: 3 },
  { day: 'Thu', present: 95, absent: 3, late: 2 },
  { day: 'Fri', present: 89, absent: 8, late: 3 },
  { day: 'Sat', present: 93, absent: 5, late: 2 },
  { day: 'Sun', present: 97, absent: 2, late: 1 },
];

const payrollMonthly = [
  { month: 'May', amount: 58.2 }, { month: 'Jun', amount: 60.1 },
  { month: 'Jul', amount: 59.8 }, { month: 'Aug', amount: 62.3 },
  { month: 'Sep', amount: 63.5 }, { month: 'Oct', amount: 65.5 },
];

const joiningExit = [
  { month: 'May', joined: 8, exited: 2 }, { month: 'Jun', joined: 12, exited: 3 },
  { month: 'Jul', joined: 5, exited: 1 }, { month: 'Aug', joined: 9, exited: 4 },
  { month: 'Sep', joined: 14, exited: 2 }, { month: 'Oct', joined: 6, exited: 1 },
];

const upcomingEvents = [
  { month: 'OCT', day: '08', title: 'Team Meeting', time: '10:00 AM – 11:00 AM', location: 'Conference Room A' },
  { month: 'OCT', day: '10', title: 'Performance Review', time: '02:00 PM – 04:00 PM', location: 'HR Office' },
  { month: 'OCT', day: '15', title: 'Company Townhall', time: '11:00 AM – 12:00 PM', location: 'Main Auditorium' },
  { month: 'OCT', day: '18', title: 'Diwali Celebration', time: '04:00 PM – 07:00 PM', location: 'Cafeteria' },
];

const pendingApprovals = [
  { type: 'Leave Request', name: 'Rohan Sharma', detail: 'Applied on 5 Oct 2026', primary: 'Approve', primaryColor: 'bg-success-600 hover:bg-success-700 text-white' },
  { type: 'Salary Revision', name: 'Priya Mehta', detail: 'Requested on 4 Oct 2026', primary: 'Review', primaryColor: 'bg-brand-600 hover:bg-brand-700 text-white' },
  { type: 'Asset Request', name: 'Amit Verma', detail: 'Requested on 4 Oct 2026', primary: 'Approve', primaryColor: 'bg-success-600 hover:bg-success-700 text-white' },
];

const recentActivities = [
  { user: 'Rahul Sharma', action: 'Approved leave request for Priya Verma', module: 'Leave Management', time: 'Today, 09:42 AM' },
  { user: 'Neha Singh', action: 'Updated salary details for EMP-023', module: 'Payroll', time: 'Today, 09:15 AM' },
  { user: 'Amit Kumar', action: 'Created new department — Data Science', module: 'Departments', time: 'Today, 08:50 AM' },
  { user: 'Kavitha Sundaram', action: 'Generated September payroll for all departments', module: 'Payroll', time: 'Yesterday, 04:30 PM' },
  { user: 'Deepak Mohan', action: 'Updated onboarding checklist for new hires', module: 'HR', time: 'Yesterday, 02:15 PM' },
];

const quickActions = [
  { icon: Plus, label: 'Add Employee', desc: 'Create a new employee record', color: 'text-brand-600 bg-brand-50' },
  { icon: CalendarCheck, label: 'Mark Attendance', desc: 'Record daily attendance', color: 'text-emerald-600 bg-emerald-50' },
  { icon: CheckCircle, label: 'Approve Leave', desc: 'Review pending requests', color: 'text-amber-600 bg-amber-50' },
  { icon: Wallet, label: 'Generate Payroll', desc: 'Run monthly payroll', color: 'text-violet-600 bg-violet-50' },
  { icon: Megaphone, label: 'Create Announcement', desc: 'Post company update', color: 'text-rose-600 bg-rose-50' },
  { icon: FileBarChart, label: 'Generate Report', desc: 'Export HR reports', color: 'text-cyan-600 bg-cyan-50' },
];

/* ── Chart Tooltip ── */
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null;
  return (
    <div className="bg-gray-900 text-white text-[12px] px-3.5 py-2.5 rounded-lg shadow-xl border border-gray-800">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-gray-300 flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: p.color }} />
          {p.name}: <span className="text-white font-medium">{p.value}{typeof p.value === 'number' && p.value <= 100 && p.name !== 'Payroll (₹L)' ? '%' : ''}</span>
        </p>
      ))}
    </div>
  );
}

/* ── Pending Approvals (from shared store) ── */
function PendingApprovalsCard() {
  const { getPendingLeaves, approveLeave, rejectLeave } = useAppStore();
  const pending = getPendingLeaves();

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <h3 className="text-[16px] font-semibold text-gray-900">Pending Approvals</h3>
          <span className="text-[11px] font-bold bg-warning-100 text-warning-700 px-2 py-0.5 rounded-full">
            {pending.length}
          </span>
        </div>
        <button className="text-[12px] font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1">
          View All <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="space-y-3">
        {pending.length === 0 ? (
          <p className="text-[13px] text-gray-400 py-6 text-center">No pending approvals 🎉</p>
        ) : (
          pending.map(lv => (
            <div key={lv.id} className="p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
              <p className="text-[13px] font-semibold text-gray-800">{lv.type} — {lv.employeeName}</p>
              <p className="text-[11px] text-gray-400 mt-1 mb-2.5">
                {lv.startDate} → {lv.endDate} · {lv.days} day{lv.days > 1 ? 's' : ''} · {lv.reason}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => approveLeave(lv.id, 'Admin')}
                  className="h-7 px-3 rounded-lg text-[11px] font-semibold transition-colors bg-success-50 text-success-700 hover:bg-success-100"
                >
                  Approve
                </button>
                <button
                  onClick={() => rejectLeave(lv.id, 'Admin')}
                  className="h-7 px-3 rounded-lg text-[11px] font-semibold text-danger-600 border border-danger-200 bg-white hover:bg-danger-50 transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

/* ── Dashboard ── */
export function DashboardPage() {
  const [attendanceRange, setAttendanceRange] = useState('7D');

  const activeEmps = employees.filter(e => e.status === 'Active').length;
  const onLeave = employees.filter(e => e.status === 'On Leave').length;
  const totalPayroll = employees.reduce((s, e) => s + e.salary, 0) / 12;
  const newHires = employees.filter(e => {
    const joined = new Date(e.joiningDate);
    const now = new Date();
    return (now.getTime() - joined.getTime()) < 90 * 24 * 60 * 60 * 1000;
  }).length;

  const deptData = departments.map(d => ({
    name: d.name,
    value: employees.filter(e => e.departmentId === d.id).length,
  })).sort((a, b) => b.value - a.value);

  const totalEmpCount = employees.length;

  // Sparkline data for each stat card
  const sparkTotal = [42, 44, 45, 46, 48, 50, 52];
  const sparkActive = [38, 39, 41, 42, 43, 44, 45];
  const sparkAttendance = [91, 93, 94, 92, 96, 94, 94];
  const sparkPayroll = [58, 60, 59, 62, 63, 64, 65];
  const sparkOnLeave = [3, 2, 4, 3, 2, 3, 2];
  const sparkNewHires = [5, 8, 6, 12, 9, 14, 6];

  return (
    <div className="max-w-[1600px] mx-auto animate-slide-up">

      {/* ═══════════════════════════════════════
          SECTION 1: Page Header
          ═══════════════════════════════════════ */}
      <PageHeader
        title={`${getGreeting()}, Administrator 👋`}
        subtitle="Here's what's happening with your organization today."
        actions={
          <>
            <div className="text-right hidden sm:block">
              <p className="text-[14px] font-medium text-gray-700">{getCurrentDate()}</p>
              <p className="text-[13px] text-gray-400 mt-0.5">{getCurrentTime()}</p>
            </div>
            <Button icon={<Plus className="w-4 h-4" />} size="lg">
              Add Employee
            </Button>
          </>
        }
      />

      {/* ═══════════════════════════════════════
          SECTION 2: 6 Stat Cards in One Row
          ═══════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-7">
        <StatCard
          label="Total Employees"
          value={totalEmpCount}
          icon={<Users className="w-[18px] h-[18px]" />}
          trend={{ value: '12%', positive: true }}
          subtitle="vs last month"
          sparkData={sparkTotal}
          sparkColor="#3b82f6"
        />
        <StatCard
          label="Active Employees"
          value={activeEmps}
          icon={<UserCheck className="w-[18px] h-[18px]" />}
          trend={{ value: '3%', positive: true }}
          subtitle="vs last month"
          sparkData={sparkActive}
          sparkColor="#16A34A"
        />
        <StatCard
          label="Departments"
          value={departments.length}
          icon={<Building2 className="w-[18px] h-[18px]" />}
          subtitle="Functional units"
          sparkData={[8, 8, 8, 8, 8, 8, 8]}
          sparkColor="#7C3AED"
        />
        <StatCard
          label="Attendance Today"
          value="94%"
          icon={<CalendarCheck className="w-[18px] h-[18px]" />}
          trend={{ value: '2%', positive: true }}
          subtitle="vs yesterday"
          sparkData={sparkAttendance}
          sparkColor="#F59E0B"
        />
        <StatCard
          label="On Leave"
          value={onLeave}
          icon={<DollarSign className="w-[18px] h-[18px]" />}
          trend={{ value: '1', positive: false }}
          subtitle="today"
          sparkData={sparkOnLeave}
          sparkColor="#EF4444"
        />
        <StatCard
          label="New Hires (90d)"
          value={newHires}
          icon={<UserPlus className="w-[18px] h-[18px]" />}
          trend={{ value: '5', positive: true }}
          subtitle="this quarter"
          sparkData={sparkNewHires}
          sparkColor="#06b6d4"
        />
      </div>

      {/* ═══════════════════════════════════════
          SECTION 3: Distribution + Attendance + Events (3-col)
          ═══════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        {/* Employee Distribution */}
        <Card>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-[16px] font-semibold text-gray-900">Employee Distribution</h3>
              <p className="text-[13px] text-gray-400 mt-0.5">By Department</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            {/* Donut */}
            <div className="w-[160px] h-[160px] flex-shrink-0 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={deptData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={2} dataKey="value" strokeWidth={0}>
                    {deptData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[22px] font-bold text-gray-900 leading-none font-mono">{totalEmpCount}</span>
                <span className="text-[11px] text-gray-400 mt-1">Total</span>
              </div>
            </div>
            {/* Legend */}
            <div className="flex-1 space-y-2 min-w-0">
              {deptData.map((d, i) => (
                <div key={d.name} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-[12px] text-gray-600 truncate">{d.name}</span>
                  </div>
                  <span className="text-[12px] font-semibold text-gray-900 tabular-nums flex-shrink-0">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Attendance Trend */}
        <Card>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-[16px] font-semibold text-gray-900">Attendance Trend</h3>
              <p className="text-[13px] text-gray-400 mt-0.5">Weekly overview</p>
            </div>
            <div className="flex rounded-lg border border-gray-200 overflow-hidden">
              {['7D', '30D', 'Custom'].map(r => (
                <button
                  key={r}
                  onClick={() => setAttendanceRange(r)}
                  className={cn(
                    'px-3 py-1.5 text-[11px] font-medium transition-colors',
                    attendanceRange === r
                      ? 'bg-brand-600 text-white'
                      : 'bg-white text-gray-500 hover:bg-gray-50'
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={attendanceTrend}>
              <defs>
                <linearGradient id="gPresent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} dy={8} />
              <YAxis domain={[80, 100]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={32} tickFormatter={v => `${v}%`} />
              <Tooltip content={<ChartTooltip />} />
              <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Area type="monotone" dataKey="present" stroke="#3b82f6" strokeWidth={2} fill="url(#gPresent)" name="Present" />
              <Area type="monotone" dataKey="absent" stroke="#ef4444" strokeWidth={1.5} fill="transparent" name="Absent" />
              <Area type="monotone" dataKey="late" stroke="#f59e0b" strokeWidth={1.5} fill="transparent" name="Late" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[16px] font-semibold text-gray-900">Upcoming Events</h3>
            <button className="text-[12px] font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-2.5">
            {upcomingEvents.map((ev, i) => (
              <div key={i} className="flex gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-11 h-11 rounded-lg bg-brand-50 flex flex-col items-center justify-center flex-shrink-0 border border-brand-100">
                  <span className="text-[9px] font-bold text-brand-500 uppercase leading-none">{ev.month}</span>
                  <span className="text-[16px] font-bold text-brand-700 leading-none mt-0.5">{ev.day}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-gray-800">{ev.title}</p>
                  <div className="flex flex-col gap-0.5 mt-1">
                    <span className="text-[11px] text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {ev.time}
                    </span>
                    <span className="text-[11px] text-gray-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {ev.location}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ═══════════════════════════════════════
          SECTION 4: Payroll + Joining/Exit + Pending Approvals (3-col)
          ═══════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-7">
        {/* Monthly Payroll */}
        <Card>
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-[16px] font-semibold text-gray-900">Monthly Payroll</h3>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-[20px] font-bold text-gray-900 font-mono">{formatCurrency(totalPayroll)}</span>
                <span className="text-[11px] font-semibold text-success-600 bg-success-50 px-1.5 py-0.5 rounded-md">↑ 3%</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={payrollMonthly} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} dy={8} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={36} tickFormatter={v => `₹${v}L`} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Payroll (₹L)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Joining & Exit */}
        <Card>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-[16px] font-semibold text-gray-900">Joining & Exit Trend</h3>
              <p className="text-[13px] text-gray-400 mt-0.5">Employees joined vs exited</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={joiningExit} barGap={4} barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} dy={8} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={24} />
              <Tooltip content={<ChartTooltip />} />
              <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Bar dataKey="joined" fill="#10b981" radius={[4, 4, 0, 0]} name="Joined" />
              <Bar dataKey="exited" fill="#ef4444" radius={[4, 4, 0, 0]} name="Exited" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Pending Approvals — from shared store */}
        <PendingApprovalsCard />
      </div>

      {/* ═══════════════════════════════════════
          SECTION 5: Quick Actions + Recent Activities (2-col)
          ═══════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-7">
        {/* Quick Actions */}
        <Card>
          <h3 className="text-[16px] font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((qa) => (
              <button
                key={qa.label}
                className="group rounded-xl border border-gray-100 px-4 py-3 flex items-center gap-3
                           text-left hover:shadow-sm hover:border-gray-200 transition-all duration-150"
              >
                <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0', qa.color)}>
                  <qa.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-gray-800">{qa.label}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5 truncate">{qa.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Recent Activities */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[16px] font-semibold text-gray-900">Recent Activities</h3>
            <button className="text-[12px] font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-3">
            {recentActivities.map((act, i) => (
              <div key={i} className="flex gap-3 items-start">
                <Avatar name={act.user} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-gray-700">
                    <span className="font-semibold text-gray-900">{act.user}</span>{' '}
                    {act.action}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-semibold text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded">{act.module}</span>
                    <span className="text-[11px] text-gray-400">{act.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

    </div>
  );
}
