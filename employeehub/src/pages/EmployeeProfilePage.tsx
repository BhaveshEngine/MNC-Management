import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Pencil, Mail, Phone, MapPin, Calendar, Building2,
  Briefcase, Clock, BadgeIndianRupee, FileText, Monitor, Activity,
  User, Heart, GraduationCap, CreditCard, Download, Shield,
  CheckCircle, XCircle, AlertTriangle, TrendingUp,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { employees, getDepartmentName } from '@/data/mock-data';
import { formatSalary, formatDate, cn } from '@/lib/utils';

/* ── Tabs ── */
const tabs = [
  { id: 'overview', label: 'Overview', icon: User },
  { id: 'personal', label: 'Personal', icon: Heart },
  { id: 'employment', label: 'Employment', icon: Briefcase },
  { id: 'attendance', label: 'Attendance', icon: Clock },
  { id: 'leave', label: 'Leave', icon: Calendar },
  { id: 'payroll', label: 'Payroll', icon: BadgeIndianRupee },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'assets', label: 'Assets', icon: Monitor },
];

/* ── Mock per-employee data ── */
const monthlyAttendance = [
  { month: 'May', present: 21, absent: 1, late: 0, wfh: 2 },
  { month: 'Jun', present: 20, absent: 0, late: 1, wfh: 1 },
  { month: 'Jul', present: 19, absent: 2, late: 1, wfh: 1 },
  { month: 'Aug', present: 22, absent: 0, late: 0, wfh: 0 },
  { month: 'Sep', present: 20, absent: 1, late: 1, wfh: 0 },
  { month: 'Oct', present: 5, absent: 0, late: 0, wfh: 1 },
];

const leaveBalances = [
  { type: 'Casual Leave', total: 12, used: 4, color: '#3b82f6' },
  { type: 'Sick Leave', total: 10, used: 2, color: '#ef4444' },
  { type: 'Earned Leave', total: 15, used: 6, color: '#10b981' },
  { type: 'Emergency', total: 3, used: 0, color: '#f59e0b' },
];

const leaveHistory = [
  { type: 'Casual Leave', from: '2026-09-15', to: '2026-09-16', days: 2, status: 'Approved', reason: 'Personal work' },
  { type: 'Sick Leave', from: '2026-08-20', to: '2026-08-21', days: 2, status: 'Approved', reason: 'Fever' },
  { type: 'Casual Leave', from: '2026-07-10', to: '2026-07-12', days: 3, status: 'Approved', reason: 'Family function' },
  { type: 'Earned Leave', from: '2026-06-01', to: '2026-06-06', days: 6, status: 'Approved', reason: 'Vacation' },
];

const salaryMonths = [
  { month: 'May', net: 125000, gross: 166667 },
  { month: 'Jun', net: 125000, gross: 166667 },
  { month: 'Jul', net: 125000, gross: 166667 },
  { month: 'Aug', net: 130000, gross: 170000 },
  { month: 'Sep', net: 130000, gross: 170000 },
  { month: 'Oct', net: 130000, gross: 170000 },
];

const documents = [
  { name: 'Offer Letter', type: 'PDF', date: '2020-06-10', size: '245 KB' },
  { name: 'ID Proof (Aadhaar)', type: 'PDF', date: '2020-06-10', size: '1.2 MB' },
  { name: 'PAN Card', type: 'Image', date: '2020-06-10', size: '890 KB' },
  { name: 'Experience Letter (Previous)', type: 'PDF', date: '2020-06-10', size: '320 KB' },
  { name: 'Address Proof', type: 'PDF', date: '2020-06-15', size: '560 KB' },
  { name: 'NDA Agreement', type: 'PDF', date: '2020-06-15', size: '180 KB' },
];

const assets = [
  { name: 'MacBook Pro 16"', id: 'AST-001', type: 'Laptop', status: 'Assigned', date: '2020-07-01' },
  { name: 'Dell UltraSharp 27"', id: 'AST-045', type: 'Monitor', status: 'Assigned', date: '2020-07-01' },
  { name: 'Logitech MX Keys', id: 'AST-112', type: 'Keyboard', status: 'Assigned', date: '2021-01-15' },
  { name: 'Employee ID Card', id: 'AST-200', type: 'ID Card', status: 'Assigned', date: '2020-06-15' },
];

/* ── Helpers ── */
function InfoRow({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      {icon && <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 flex-shrink-0 mt-0.5">{icon}</div>}
      <div className="min-w-0">
        <p className="text-[12px] text-gray-400 font-medium uppercase tracking-wider">{label}</p>
        <p className="text-[14px] text-gray-800 font-medium mt-0.5">{value || '—'}</p>
      </div>
    </div>
  );
}

function MiniTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null;
  return (
    <div className="bg-gray-900 text-white text-[11px] px-3 py-2 rounded-lg shadow-xl">
      <p className="font-semibold mb-0.5">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-gray-300">
          <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ background: p.color }} />
          {p.name}: <span className="text-white font-medium">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   EMPLOYEE PROFILE PAGE
   ═══════════════════════════════════════════════════════ */
export function EmployeeProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const employee = employees.find(e => e.id === id);

  if (!employee) {
    return (
      <div className="max-w-[1600px] mx-auto">
        <EmptyState
          title="Employee not found"
          description="The employee you're looking for doesn't exist or has been removed."
          action={<Button onClick={() => navigate('/employees')}>Back to Employees</Button>}
        />
      </div>
    );
  }

  const fullName = `${employee.firstName} ${employee.lastName}`;
  const monthlySalary = Math.round(employee.salary / 12);
  const basic = Math.round(monthlySalary * 0.5);
  const hra = Math.round(monthlySalary * 0.2);
  const allowances = Math.round(monthlySalary * 0.15);
  const pf = Math.round(basic * 0.12);
  const tax = Math.round(monthlySalary * 0.1);
  const netPay = monthlySalary - pf - tax;

  const tenure = () => {
    const join = new Date(employee.joiningDate);
    const now = new Date();
    const years = now.getFullYear() - join.getFullYear();
    const months = now.getMonth() - join.getMonth();
    if (years > 0) return `${years}y ${months >= 0 ? months : 12 + months}m`;
    return `${months >= 0 ? months : 12 + months}m`;
  };

  return (
    <div className="max-w-[1600px] mx-auto animate-slide-up">
      {/* ── Back ── */}
      <button
        onClick={() => navigate('/employees')}
        className="flex items-center gap-2 text-[13px] text-gray-500 hover:text-gray-700 font-medium mb-5 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Employees
      </button>

      {/* ═══════════════════════════════════════
          PROFILE HEADER — Gradient Banner
          ═══════════════════════════════════════ */}
      <Card padding="none" className="mb-6 overflow-hidden">
        {/* Banner gradient */}
        <div className="h-28 relative" style={{ background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 50%, #EC4899 100%)' }}>
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        {/* Profile content */}
        <div className="px-6 pb-6 -mt-12 relative">
          <div className="flex flex-col md:flex-row md:items-end gap-5">
            {/* Avatar with ring */}
            <div className="w-[88px] h-[88px] rounded-2xl bg-white p-1 shadow-lg flex-shrink-0">
              <Avatar name={fullName} size="xl" className="w-full h-full rounded-xl !text-[20px]" />
            </div>

            <div className="flex-1 min-w-0 pt-2">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h1 className="text-[24px] font-bold text-gray-900 tracking-tight">{fullName}</h1>
                <StatusBadge status={employee.status} />
              </div>
              <p className="text-[15px] text-gray-500">{employee.designation} · {getDepartmentName(employee.departmentId)}</p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3 text-[13px] text-gray-500">
                <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5 text-gray-400" />{employee.employeeId}</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-gray-400" />{employee.workLocation}</span>
                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-gray-400" />{employee.email}</span>
                <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-gray-400" />{employee.phone}</span>
              </div>
            </div>

            <div className="flex gap-2 flex-shrink-0 self-start md:self-end">
              <Button variant="outline" size="md" icon={<Mail className="w-4 h-4" />}>Message</Button>
              <Button size="md" icon={<Pencil className="w-4 h-4" />}>Edit</Button>
            </div>
          </div>

          {/* Quick stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
            <div>
              <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Annual CTC</p>
              <p className="text-[18px] font-bold text-gray-900 font-mono mt-0.5">{formatSalary(employee.salary)}</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Tenure</p>
              <p className="text-[18px] font-bold text-gray-900 font-mono mt-0.5">{tenure()}</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Attendance</p>
              <p className="text-[18px] font-bold text-success-600 font-mono mt-0.5">96.2%</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Leave Balance</p>
              <p className="text-[18px] font-bold text-brand-600 font-mono mt-0.5">25 days</p>
            </div>
          </div>
        </div>
      </Card>

      {/* ═══════════════════════════════════════
          TABS
          ═══════════════════════════════════════ */}
      <div className="border-b border-gray-200 mb-6 overflow-x-auto">
        <div className="flex gap-0.5 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-3 text-[13px] font-medium border-b-2 transition-colors whitespace-nowrap',
                activeTab === tab.id
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════
          TAB CONTENT
          ═══════════════════════════════════════ */}
      <div className="animate-fade">

        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <h3 className="text-[15px] font-semibold text-gray-900 mb-4">Basic Information</h3>
              <InfoRow label="Full Name" value={fullName} icon={<User className="w-4 h-4" />} />
              <InfoRow label="Employee ID" value={employee.employeeId} icon={<Briefcase className="w-4 h-4" />} />
              <InfoRow label="Email" value={employee.email} icon={<Mail className="w-4 h-4" />} />
              <InfoRow label="Phone" value={employee.phone} icon={<Phone className="w-4 h-4" />} />
              <InfoRow label="Date of Birth" value={formatDate(employee.dateOfBirth)} icon={<Calendar className="w-4 h-4" />} />
              <InfoRow label="Gender" value={employee.gender} icon={<User className="w-4 h-4" />} />
            </Card>
            <Card>
              <h3 className="text-[15px] font-semibold text-gray-900 mb-4">Employment Details</h3>
              <InfoRow label="Department" value={getDepartmentName(employee.departmentId)} icon={<Building2 className="w-4 h-4" />} />
              <InfoRow label="Designation" value={employee.designation} icon={<Briefcase className="w-4 h-4" />} />
              <InfoRow label="Employment Type" value={employee.employmentType} icon={<FileText className="w-4 h-4" />} />
              <InfoRow label="Joining Date" value={formatDate(employee.joiningDate)} icon={<Calendar className="w-4 h-4" />} />
              <InfoRow label="Work Location" value={employee.workLocation} icon={<MapPin className="w-4 h-4" />} />
              <InfoRow label="Status" value={employee.status} icon={<Activity className="w-4 h-4" />} />
            </Card>
            <Card>
              <h3 className="text-[15px] font-semibold text-gray-900 mb-4">Compensation</h3>
              <InfoRow label="Annual CTC" value={formatSalary(employee.salary)} icon={<BadgeIndianRupee className="w-4 h-4" />} />
              <InfoRow label="Monthly Gross" value={formatSalary(monthlySalary)} icon={<CreditCard className="w-4 h-4" />} />
              <InfoRow label="Basic" value={formatSalary(basic)} icon={<CreditCard className="w-4 h-4" />} />
              <InfoRow label="HRA" value={formatSalary(hra)} icon={<Building2 className="w-4 h-4" />} />
              <InfoRow label="PF Contribution" value={formatSalary(pf)} icon={<Shield className="w-4 h-4" />} />
              <InfoRow label="Net Pay (est.)" value={formatSalary(netPay)} icon={<BadgeIndianRupee className="w-4 h-4" />} />
            </Card>
          </div>
        )}

        {/* ── PERSONAL TAB ── */}
        {activeTab === 'personal' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-[15px] font-semibold text-gray-900 mb-4">Personal Information</h3>
              <InfoRow label="Date of Birth" value={formatDate(employee.dateOfBirth)} icon={<Calendar className="w-4 h-4" />} />
              <InfoRow label="Gender" value={employee.gender} icon={<User className="w-4 h-4" />} />
              <InfoRow label="Nationality" value="Indian" icon={<MapPin className="w-4 h-4" />} />
              <InfoRow label="Marital Status" value="—" icon={<Heart className="w-4 h-4" />} />
              <InfoRow label="Blood Group" value="—" icon={<Heart className="w-4 h-4" />} />
            </Card>
            <Card>
              <h3 className="text-[15px] font-semibold text-gray-900 mb-4">Contact & Address</h3>
              <InfoRow label="Email" value={employee.email} icon={<Mail className="w-4 h-4" />} />
              <InfoRow label="Phone" value={employee.phone} icon={<Phone className="w-4 h-4" />} />
              <InfoRow label="Address" value={`${employee.address}, ${employee.city}`} icon={<MapPin className="w-4 h-4" />} />
              <InfoRow label="State" value={employee.state} icon={<MapPin className="w-4 h-4" />} />
              <InfoRow label="Emergency Contact" value="—" icon={<Phone className="w-4 h-4" />} />
            </Card>
          </div>
        )}

        {/* ── EMPLOYMENT TAB ── */}
        {activeTab === 'employment' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-[15px] font-semibold text-gray-900 mb-4">Job Details</h3>
              <InfoRow label="Department" value={getDepartmentName(employee.departmentId)} icon={<Building2 className="w-4 h-4" />} />
              <InfoRow label="Designation" value={employee.designation} icon={<Briefcase className="w-4 h-4" />} />
              <InfoRow label="Employment Type" value={employee.employmentType} icon={<FileText className="w-4 h-4" />} />
              <InfoRow label="Status" value={employee.status} icon={<Activity className="w-4 h-4" />} />
              <InfoRow label="Joining Date" value={formatDate(employee.joiningDate)} icon={<Calendar className="w-4 h-4" />} />
              <InfoRow label="Work Location" value={employee.workLocation} icon={<MapPin className="w-4 h-4" />} />
            </Card>
            <Card>
              <h3 className="text-[15px] font-semibold text-gray-900 mb-4">Education</h3>
              <InfoRow label="Qualification" value="B.Tech / B.E." icon={<GraduationCap className="w-4 h-4" />} />
              <InfoRow label="University" value="—" icon={<GraduationCap className="w-4 h-4" />} />
              <InfoRow label="Year of Passing" value="—" icon={<Calendar className="w-4 h-4" />} />
              <div className="mt-5 pt-4 border-t border-gray-100">
                <p className="text-[12px] text-gray-400 font-semibold uppercase tracking-wider mb-3">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {['React', 'TypeScript', 'Node.js', 'Python', 'SQL'].map(skill => (
                    <span key={skill} className="text-[12px] font-medium text-brand-600 bg-brand-50 px-2.5 py-1 rounded-md border border-brand-100">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* ── ATTENDANCE TAB ── */}
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            {/* Summary cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Present Days', value: '107', icon: <CheckCircle className="w-4 h-4" />, color: 'text-success-600 bg-success-50' },
                { label: 'Absent Days', value: '4', icon: <XCircle className="w-4 h-4" />, color: 'text-danger-600 bg-danger-50' },
                { label: 'Late Arrivals', value: '3', icon: <AlertTriangle className="w-4 h-4" />, color: 'text-warning-600 bg-warning-50' },
                { label: 'WFH Days', value: '4', icon: <Monitor className="w-4 h-4" />, color: 'text-brand-600 bg-brand-50' },
              ].map(stat => (
                <Card key={stat.label}>
                  <div className="flex items-center gap-3">
                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', stat.color)}>{stat.icon}</div>
                    <div>
                      <p className="text-[12px] text-gray-400 font-medium">{stat.label}</p>
                      <p className="text-[22px] font-bold text-gray-900 font-mono leading-none mt-0.5">{stat.value}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Chart */}
            <Card>
              <h3 className="text-[16px] font-semibold text-gray-900 mb-5">Monthly Attendance</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={monthlyAttendance} barGap={4} barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip content={<MiniTooltip />} />
                  <Bar dataKey="present" fill="#16A34A" radius={[3, 3, 0, 0]} name="Present" />
                  <Bar dataKey="absent" fill="#EF4444" radius={[3, 3, 0, 0]} name="Absent" />
                  <Bar dataKey="late" fill="#F59E0B" radius={[3, 3, 0, 0]} name="Late" />
                  <Bar dataKey="wfh" fill="#3b82f6" radius={[3, 3, 0, 0]} name="WFH" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}

        {/* ── LEAVE TAB ── */}
        {activeTab === 'leave' && (
          <div className="space-y-6">
            {/* Balance cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {leaveBalances.map(lb => (
                <Card key={lb.type}>
                  <p className="text-[12px] text-gray-400 font-medium mb-2">{lb.type}</p>
                  <div className="flex items-end justify-between mb-3">
                    <span className="text-[26px] font-bold text-gray-900 font-mono leading-none">{lb.total - lb.used}</span>
                    <span className="text-[12px] text-gray-400">of {lb.total}</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-2 rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{ width: `${(lb.used / lb.total) * 100}%`, backgroundColor: lb.color }}
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1.5">{lb.used} used</p>
                </Card>
              ))}
            </div>

            {/* Leave history */}
            <Card padding="none" className="overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-[16px] font-semibold text-gray-900">Leave History</h3>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Days</th>
                    <th>Reason</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveHistory.map((lv, i) => (
                    <tr key={i}>
                      <td className="text-[13px] font-medium text-gray-800">{lv.type}</td>
                      <td className="text-[13px] text-gray-600">{formatDate(lv.from)}</td>
                      <td className="text-[13px] text-gray-600">{formatDate(lv.to)}</td>
                      <td className="text-[13px] font-mono font-semibold text-gray-900">{lv.days}</td>
                      <td className="text-[13px] text-gray-500">{lv.reason}</td>
                      <td><StatusBadge status={lv.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}

        {/* ── PAYROLL TAB ── */}
        {activeTab === 'payroll' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Salary breakdown donut */}
              <Card>
                <h3 className="text-[15px] font-semibold text-gray-900 mb-4">Salary Breakdown</h3>
                <div className="flex items-center gap-4">
                  <div className="w-[140px] h-[140px] flex-shrink-0 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Basic', value: basic },
                            { name: 'HRA', value: hra },
                            { name: 'Allowances', value: allowances },
                            { name: 'PF', value: pf },
                            { name: 'Tax', value: tax },
                          ]}
                          cx="50%" cy="50%" innerRadius={42} outerRadius={65}
                          paddingAngle={2} dataKey="value" strokeWidth={0}
                        >
                          {['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'].map((c, i) => (
                            <Cell key={i} fill={c} />
                          ))}
                        </Pie>
                        <Tooltip content={<MiniTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[11px] text-gray-400">Net</span>
                      <span className="text-[14px] font-bold text-gray-900 font-mono">{formatSalary(netPay)}</span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[
                      { label: 'Basic', val: basic, color: '#3b82f6' },
                      { label: 'HRA', val: hra, color: '#10b981' },
                      { label: 'Allowances', val: allowances, color: '#f59e0b' },
                      { label: 'PF Deduction', val: pf, color: '#8b5cf6' },
                      { label: 'Tax', val: tax, color: '#ef4444' },
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                          <span className="text-[12px] text-gray-600">{item.label}</span>
                        </div>
                        <span className="text-[12px] font-mono font-semibold text-gray-800">{formatSalary(item.val)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Net pay trend */}
              <Card className="lg:col-span-2">
                <h3 className="text-[15px] font-semibold text-gray-900 mb-4">Net Pay Trend</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={salaryMonths}>
                    <defs>
                      <linearGradient id="gNet" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563EB" stopOpacity={0.12} />
                        <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={50} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
                    <Tooltip content={<MiniTooltip />} />
                    <Area type="monotone" dataKey="net" stroke="#2563EB" strokeWidth={2} fill="url(#gNet)" name="Net Pay" />
                    <Area type="monotone" dataKey="gross" stroke="#10b981" strokeWidth={1.5} fill="transparent" name="Gross" />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Recent payslips */}
            <Card padding="none" className="overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-[16px] font-semibold text-gray-900">Recent Payslips</h3>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Month</th>
                    <th className="text-right">Gross</th>
                    <th className="text-right">Deductions</th>
                    <th className="text-right">Net Pay</th>
                    <th className="text-right pr-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {salaryMonths.map((s, i) => (
                    <tr key={i}>
                      <td className="text-[13px] font-medium text-gray-800">{s.month} 2026</td>
                      <td className="text-right text-[13px] font-mono text-gray-700">{formatSalary(s.gross)}</td>
                      <td className="text-right text-[13px] font-mono text-danger-600">{formatSalary(s.gross - s.net)}</td>
                      <td className="text-right text-[13px] font-mono font-semibold text-gray-900">{formatSalary(s.net)}</td>
                      <td className="text-right pr-4">
                        <button className="inline-flex items-center gap-1 text-[12px] font-medium text-brand-600 hover:text-brand-700">
                          <Download className="w-3.5 h-3.5" /> PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}

        {/* ── DOCUMENTS TAB ── */}
        {activeTab === 'documents' && (
          <Card padding="none" className="overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-[16px] font-semibold text-gray-900">Documents</h3>
              <Button variant="outline" size="sm">Upload Document</Button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Document</th>
                  <th>Type</th>
                  <th>Uploaded</th>
                  <th>Size</th>
                  <th className="text-right pr-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc, i) => (
                  <tr key={i}>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600">
                          <FileText className="w-4 h-4" />
                        </div>
                        <span className="text-[13px] font-medium text-gray-800">{doc.name}</span>
                      </div>
                    </td>
                    <td className="text-[12px] text-gray-500">{doc.type}</td>
                    <td className="text-[12px] text-gray-500">{formatDate(doc.date)}</td>
                    <td className="text-[12px] text-gray-500 font-mono">{doc.size}</td>
                    <td className="text-right pr-4">
                      <button className="inline-flex items-center gap-1 text-[12px] font-medium text-brand-600 hover:text-brand-700">
                        <Download className="w-3.5 h-3.5" /> Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}

        {/* ── ASSETS TAB ── */}
        {activeTab === 'assets' && (
          <Card padding="none" className="overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-[16px] font-semibold text-gray-900">Assigned Assets</h3>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Asset ID</th>
                  <th>Type</th>
                  <th>Assigned Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset, i) => (
                  <tr key={i}>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                          <Monitor className="w-4 h-4" />
                        </div>
                        <span className="text-[13px] font-medium text-gray-800">{asset.name}</span>
                      </div>
                    </td>
                    <td className="text-[12px] font-mono text-brand-600">{asset.id}</td>
                    <td className="text-[13px] text-gray-500">{asset.type}</td>
                    <td className="text-[13px] text-gray-500">{formatDate(asset.date)}</td>
                    <td><StatusBadge status={asset.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    </div>
  );
}
