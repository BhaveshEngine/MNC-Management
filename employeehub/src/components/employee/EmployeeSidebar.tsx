import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, User, Clock, CalendarDays, Wallet, TrendingUp,
  Monitor, FileText, Users, Megaphone, GitPullRequest,
  Bell, HelpCircle, Settings, Sparkles, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { currentEmployee } from '@/data/employee-mock-data';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  badge?: number;
}

const mainNav: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/employee/dashboard' },
  { label: 'My Profile', icon: User, path: '/employee/profile' },
  { label: 'Attendance', icon: Clock, path: '/employee/attendance' },
  { label: 'Leave', icon: CalendarDays, path: '/employee/leave' },
  { label: 'Payroll', icon: Wallet, path: '/employee/payroll' },
  { label: 'Performance', icon: TrendingUp, path: '/employee/performance' },
];

const workNav: NavItem[] = [
  { label: 'My Assets', icon: Monitor, path: '/employee/assets' },
  { label: 'Documents', icon: FileText, path: '/employee/documents' },
  { label: 'Employee Directory', icon: Users, path: '/employee/directory' },
  { label: 'Announcements', icon: Megaphone, path: '/employee/announcements' },
  { label: 'Requests', icon: GitPullRequest, path: '/employee/requests' },
];

const generalNav: NavItem[] = [
  { label: 'Notifications', icon: Bell, path: '/employee/notifications', badge: 2 },
  { label: 'Help & Support', icon: HelpCircle, path: '/employee/help' },
  { label: 'Settings', icon: Settings, path: '/employee/settings' },
];

interface Props {
  collapsed: boolean;
  onToggle: () => void;
}

export function EmployeeSidebar({ collapsed, onToggle }: Props) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const renderItem = (item: NavItem) => (
    <button
      key={item.path}
      onClick={() => navigate(item.path)}
      className={cn(
        'w-full flex items-center gap-3 rounded-lg text-[13px] font-medium transition-all duration-150',
        collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5',
        isActive(item.path)
          ? 'bg-[#2563EB] text-white shadow-sm'
          : 'text-blue-200/70 hover:bg-white/8 hover:text-white'
      )}
      title={collapsed ? item.label : undefined}
    >
      <item.icon className={cn('flex-shrink-0', collapsed ? 'w-5 h-5' : 'w-[18px] h-[18px]')} />
      {!collapsed && <span className="truncate">{item.label}</span>}
      {!collapsed && item.badge && (
        <span className="ml-auto text-[10px] font-bold bg-danger-500 text-white px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
          {item.badge}
        </span>
      )}
    </button>
  );

  const renderSection = (title: string, items: NavItem[]) => (
    <div className="mb-1">
      {!collapsed && (
        <p className="text-[10px] font-bold text-blue-300/40 uppercase tracking-[0.12em] px-3 mb-2">{title}</p>
      )}
      <div className="space-y-0.5">
        {items.map(renderItem)}
      </div>
    </div>
  );

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
        'flex items-center h-[60px] border-b border-white/8 flex-shrink-0',
        collapsed ? 'justify-center px-2' : 'gap-2.5 px-4'
      )}>
        <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        {!collapsed && <span className="text-[16px] font-bold text-white tracking-tight">EmployeeHub</span>}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-5 scrollbar-thin">
        <div className="space-y-0.5">{mainNav.map(renderItem)}</div>
        {renderSection('Work', workNav)}
        {renderSection('General', generalNav)}
      </nav>

      {/* User card at bottom */}
      <div className={cn(
        'border-t border-white/8 flex-shrink-0',
        collapsed ? 'p-2' : 'p-3'
      )}>
        {collapsed ? (
          <div className="flex justify-center">
            <Avatar name={`${currentEmployee.firstName} ${currentEmployee.lastName}`} size="sm" />
          </div>
        ) : (
          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white/5">
            <Avatar name={`${currentEmployee.firstName} ${currentEmployee.lastName}`} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold text-white leading-none truncate">
                {currentEmployee.firstName} {currentEmployee.lastName}
              </p>
              <p className="text-[10px] text-blue-300/60 mt-1 leading-none">{currentEmployee.employeeId} · Employee</p>
            </div>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-[72px] w-6 h-6 rounded-full bg-white border border-gray-200 shadow-sm
                   flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors z-50"
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>
    </aside>
  );
}
