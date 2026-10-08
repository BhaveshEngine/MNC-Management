import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Building2, Network, Contact,
  CalendarCheck, CalendarDays, CalendarHeart,
  Wallet, Receipt, BadgeIndianRupee,
  Target, ClipboardCheck,
  Briefcase, UserSearch, Video,
  Monitor,
  FileBarChart, FileText, FileSpreadsheet, FilePieChart,
  Megaphone, CalendarRange, Bell,
  ShieldCheck, ScrollText, Settings,
  Zap, ChevronsLeft, ChevronsRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const sections = [
  {
    label: 'OVERVIEW',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    ],
  },
  {
    label: 'PEOPLE',
    items: [
      { label: 'Employees', icon: Users, path: '/employees' },
      { label: 'Departments', icon: Building2, path: '/departments' },
      { label: 'Organization', icon: Network, path: '/organization' },
      { label: 'Directory', icon: Contact, path: '/directory' },
    ],
  },
  {
    label: 'ATTENDANCE',
    items: [
      { label: 'Attendance', icon: CalendarCheck, path: '/attendance' },
      { label: 'Leave Management', icon: CalendarDays, path: '/leave' },
      { label: 'Holidays', icon: CalendarHeart, path: '/holidays' },
    ],
  },
  {
    label: 'PAYROLL',
    items: [
      { label: 'Payroll', icon: Wallet, path: '/payroll' },
      { label: 'Payslips', icon: Receipt, path: '/payslips' },
      { label: 'Salary Management', icon: BadgeIndianRupee, path: '/salary' },
    ],
  },
  {
    label: 'PERFORMANCE',
    items: [
      { label: 'Goals', icon: Target, path: '/goals' },
      { label: 'Reviews', icon: ClipboardCheck, path: '/reviews' },
    ],
  },
  {
    label: 'RECRUITMENT',
    items: [
      { label: 'Job Openings', icon: Briefcase, path: '/jobs' },
      { label: 'Candidates', icon: UserSearch, path: '/candidates' },
      { label: 'Interviews', icon: Video, path: '/interviews' },
    ],
  },
  {
    label: 'ASSETS',
    items: [
      { label: 'Asset Management', icon: Monitor, path: '/assets' },
    ],
  },
  {
    label: 'REPORTS',
    items: [
      { label: 'HR Reports', icon: FileBarChart, path: '/reports/hr' },
      { label: 'Attendance Reports', icon: FileText, path: '/reports/attendance' },
      { label: 'Payroll Reports', icon: FileSpreadsheet, path: '/reports/payroll' },
      { label: 'Performance Reports', icon: FilePieChart, path: '/reports/performance' },
    ],
  },
  {
    label: 'COMMUNICATION',
    items: [
      { label: 'Announcements', icon: Megaphone, path: '/announcements' },
      { label: 'Events', icon: CalendarRange, path: '/events' },
      { label: 'Notifications', icon: Bell, path: '/notifications' },
    ],
  },
  {
    label: 'ADMINISTRATION',
    items: [
      { label: 'Roles & Permissions', icon: ShieldCheck, path: '/roles' },
      { label: 'Audit Logs', icon: ScrollText, path: '/audit-logs' },
      { label: 'Settings', icon: Settings, path: '/settings' },
    ],
  },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 flex flex-col transition-[width] duration-200 ease-in-out',
        collapsed ? 'w-[64px]' : 'w-[220px]'
      )}
      style={{ backgroundColor: '#0B1B3A' }}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center h-[60px] flex-shrink-0 border-b border-white/[0.06]',
        collapsed ? 'justify-center px-3' : 'px-5 gap-3'
      )}>
        <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center flex-shrink-0">
          <Zap className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <span className="text-[16px] font-semibold text-white tracking-[-0.01em]">EmployeeHub</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto sidebar-scroll py-4 px-3">
        {sections.map((section, sIdx) => (
          <div key={sIdx} className={sIdx > 0 ? 'mt-6' : ''}>
            {/* Section heading */}
            {!collapsed && (
              <p className="px-3 mb-2 text-[11px] font-semibold tracking-[0.08em] text-navy-400/70 uppercase select-none">
                {section.label}
              </p>
            )}
            {collapsed && sIdx > 0 && (
              <div className="mx-auto w-6 border-t border-white/[0.06] mb-3" />
            )}

            {/* Items */}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item.path);
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      'w-full flex items-center rounded-lg transition-colors duration-150 group',
                      collapsed
                        ? 'justify-center h-10 w-10 mx-auto'
                        : 'gap-3 px-3 h-[42px] text-[13.5px]',
                      active
                        ? 'bg-brand-600 text-white'
                        : 'text-navy-300 hover:bg-white/[0.05] hover:text-white/90'
                    )}
                  >
                    <item.icon className={cn(
                      'flex-shrink-0',
                      collapsed ? 'w-[18px] h-[18px]' : 'w-[18px] h-[18px]',
                      active ? 'text-white' : 'text-navy-400 group-hover:text-navy-300'
                    )} />
                    {!collapsed && (
                      <span className="truncate font-medium">{item.label}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <div className="flex-shrink-0 border-t border-white/[0.06] p-3">
        <button
          onClick={onToggle}
          className={cn(
            'flex items-center rounded-lg text-navy-400 hover:text-white hover:bg-white/[0.05] transition-colors',
            collapsed
              ? 'justify-center h-10 w-10 mx-auto'
              : 'gap-3 px-3 h-[42px] w-full text-[13.5px]'
          )}
          aria-label="Toggle sidebar"
        >
          {collapsed
            ? <ChevronsRight className="w-[18px] h-[18px]" />
            : <>
                <ChevronsLeft className="w-[18px] h-[18px]" />
                <span className="font-medium">Collapse</span>
              </>
          }
        </button>
      </div>
    </aside>
  );
}
