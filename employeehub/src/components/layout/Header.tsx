import { useState, useEffect, useRef } from 'react';
import { Search, Bell, Moon, LogOut, ChevronDown, Settings, User } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useAppStore } from '@/store/AppStore';
import { getCurrentTime, cn } from '@/lib/utils';
import { Link, useNavigate } from 'react-router-dom';

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { getNotificationsForUser, getUnreadCount, markNotificationRead } = useAppStore();
  const [time, setTime] = useState(getCurrentTime());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const userId = user?.role === 'employee' ? 'emp-1024' : 'admin';
  const notifications = getNotificationsForUser(userId).slice(0, 5);
  const unreadCount = getUnreadCount(userId);

  useEffect(() => {
    const interval = setInterval(() => setTime(getCurrentTime()), 30000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const displayName = user?.name || 'Administrator';
  const displayRole = user?.role === 'super_admin' ? 'Super Admin'
    : user?.role === 'hr_admin' ? 'HR Admin'
    : user?.role === 'hr_manager' ? 'HR Manager'
    : user?.role === 'employee' ? 'Employee'
    : 'User';

  return (
    <header className="sticky top-0 z-20 h-[60px] bg-white border-b border-gray-200/80 flex items-center justify-between px-6">
      {/* Left: Search */}
      <div className="relative flex-1 max-w-[420px]">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          placeholder="Search employees, departments..."
          className="w-full pl-10 pr-4 h-[38px] rounded-lg border border-gray-200 bg-gray-50 text-[13px] text-gray-700
                     placeholder-gray-400 focus:bg-white focus:border-brand-400 focus:ring-2 focus:ring-brand-100
                     transition-all duration-150"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center px-1.5 py-0.5
                        rounded text-[10px] font-medium text-gray-400 bg-gray-100 border border-gray-200">
          ⌘K
        </kbd>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Toggle theme"
        >
          <Moon className="w-[18px] h-[18px]" />
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-[18px] h-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-[8px] h-[8px] bg-danger-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-[calc(100%+4px)] w-[320px] bg-white rounded-xl border border-gray-200 shadow-xl py-2 animate-fade z-50">
              <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                <p className="text-[14px] font-bold text-gray-900">Notifications</p>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 text-[11px] font-bold">
                    {unreadCount} New
                  </span>
                )}
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-6 text-center text-gray-500 text-[13px]">No notifications.</div>
                ) : (
                  notifications.map(notif => (
                    <div 
                      key={notif.id} 
                      className={cn("px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0", !notif.read && "bg-brand-50/30")}
                      onClick={() => {
                        if (!notif.read) markNotificationRead(notif.id);
                      }}
                    >
                      <p className={cn("text-[13px] line-clamp-2", !notif.read ? "font-bold text-gray-900" : "text-gray-700")}>
                        {notif.title}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-1">
                        {new Date(notif.time).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
              <div className="px-4 pt-2 border-t border-gray-100 text-center">
                <button 
                  onClick={() => {
                    setNotifOpen(false);
                    navigate(user?.role === 'employee' ? '/employee/notifications' : '/dashboard');
                  }}
                  className="text-[12px] font-semibold text-brand-600 hover:text-brand-700 w-full py-1"
                >
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-7 bg-gray-200 mx-2" />

        {/* Profile dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Avatar name={displayName} size="sm" />
            <div className="hidden lg:block text-left">
              <p className="text-[13px] font-semibold text-gray-900 leading-none">{displayName}</p>
              <p className="text-[11px] text-gray-500 leading-none mt-1">{displayRole}</p>
            </div>
            <ChevronDown className={cn(
              'w-4 h-4 text-gray-400 hidden lg:block transition-transform duration-200',
              dropdownOpen && 'rotate-180'
            )} />
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute right-0 top-[calc(100%+4px)] w-56 bg-white rounded-xl border border-gray-200 shadow-xl py-1.5 animate-fade z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-[13px] font-semibold text-gray-900">{displayName}</p>
                <p className="text-[12px] text-gray-500 mt-0.5">{user?.email}</p>
              </div>

              <div className="py-1">
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-gray-700 hover:bg-gray-50 transition-colors">
                  <User className="w-4 h-4 text-gray-400" /> My Profile
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-gray-700 hover:bg-gray-50 transition-colors">
                  <Settings className="w-4 h-4 text-gray-400" /> Settings
                </button>
              </div>

              <div className="border-t border-gray-100 pt-1">
                <button
                  onClick={() => { setDropdownOpen(false); logout(); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-danger-600 hover:bg-danger-50 transition-colors font-medium"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
