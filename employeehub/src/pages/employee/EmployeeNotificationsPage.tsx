import { useState } from 'react';
import { Bell, CheckCircle2, DollarSign, Megaphone, FileText, CalendarClock, Trash2, Check } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/AppStore';
import { currentEmployee } from '@/data/employee-mock-data';
import { cn } from '@/lib/utils';

export function EmployeeNotificationsPage() {
  const { getNotificationsForUser, markNotificationRead, markAllNotificationsRead } = useAppStore();
  const notifications = getNotificationsForUser(currentEmployee.id);
  
  const [activeTab, setActiveTab] = useState<'All' | 'Unread'>('All');

  const filteredNotifs = activeTab === 'All' ? notifications : notifications.filter(n => !n.read);

  const getIcon = (type: string) => {
    switch (type) {
      case 'leave': return <FileText className="w-5 h-5 text-blue-500" />;
      case 'payroll': return <DollarSign className="w-5 h-5 text-emerald-500" />;
      case 'announcement': return <Megaphone className="w-5 h-5 text-amber-500" />;
      case 'attendance': return <CalendarClock className="w-5 h-5 text-purple-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffMins > 0) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <div className="max-w-[800px] mx-auto animate-slide-up space-y-6">
      <PageHeader
        title="Notifications"
        subtitle="Stay updated with your activities and alerts."
        actions={
          <Button 
            variant="outline" 
            icon={<Check className="w-4 h-4" />}
            onClick={() => markAllNotificationsRead(currentEmployee.id)}
          >
            Mark all as read
          </Button>
        }
      />

      <Card padding="none" className="overflow-hidden">
        <div className="border-b border-gray-200 px-2 flex">
          <button
            onClick={() => setActiveTab('All')}
            className={cn(
              'px-6 py-4 text-[14px] font-medium transition-colors border-b-2',
              activeTab === 'All' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            )}
          >
            All Notifications
          </button>
          <button
            onClick={() => setActiveTab('Unread')}
            className={cn(
              'px-6 py-4 text-[14px] font-medium transition-colors border-b-2 flex items-center gap-2',
              activeTab === 'Unread' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            )}
          >
            Unread
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-brand-100 text-brand-700 text-[10px] font-bold">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </button>
        </div>

        <div className="divide-y divide-gray-100">
          {filteredNotifs.length === 0 ? (
            <div className="py-16 text-center">
              <CheckCircle2 className="w-12 h-12 text-success-300 mx-auto mb-3" />
              <h3 className="text-[16px] font-medium text-gray-900">You're all caught up!</h3>
              <p className="text-[13px] text-gray-500 mt-1">No new notifications to show right now.</p>
            </div>
          ) : (
            filteredNotifs.map(notif => (
              <div 
                key={notif.id} 
                className={cn(
                  "p-5 flex items-start gap-4 transition-colors",
                  !notif.read ? "bg-brand-50/30" : "hover:bg-gray-50"
                )}
                onClick={() => { if (!notif.read) markNotificationRead(notif.id); }}
              >
                <div className="p-2.5 bg-white border border-gray-100 rounded-full shadow-sm shrink-0">
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <h4 className={cn("text-[14px]", !notif.read ? "font-bold text-gray-900" : "font-medium text-gray-700")}>
                      {notif.title}
                    </h4>
                    <span className="text-[12px] text-gray-400 whitespace-nowrap">
                      {getTimeAgo(notif.time)}
                    </span>
                  </div>
                  <p className="text-[13px] text-gray-600 line-clamp-2">
                    {notif.message}
                  </p>
                </div>
                {!notif.read && (
                  <div className="w-2.5 h-2.5 bg-brand-500 rounded-full shrink-0 mt-2" />
                )}
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
