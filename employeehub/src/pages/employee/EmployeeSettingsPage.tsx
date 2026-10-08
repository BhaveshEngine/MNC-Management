import { useState, useEffect } from 'react';
import { User, Bell, Shield, Palette, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export function EmployeeSettingsPage() {
  const [activeTab, setActiveTab] = useState('notifications');
  const [showToast, setShowToast] = useState(false);

  // Settings State
  const [notifSettings, setNotifSettings] = useState({
    email: true,
    leave: true,
    payroll: true,
    announcements: true
  });

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  const [pwd, setPwd] = useState({ current: '', new: '', confirm: '' });

  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd.new !== pwd.confirm) {
      alert("New passwords do not match.");
      return;
    }
    setPwd({ current: '', new: '', confirm: '' });
    handleSave();
  };

  const toggleTheme = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    handleSave();
  };

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  return (
    <div className="max-w-[1000px] mx-auto animate-slide-up space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Manage your account preferences and security."
      />

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 shrink-0 space-y-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium transition-colors",
                  activeTab === tab.id 
                    ? "bg-brand-50 text-brand-700" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6">
          {activeTab === 'notifications' && (
            <Card className="space-y-6">
              <div>
                <h3 className="text-[16px] font-bold text-gray-900 mb-1">Notification Preferences</h3>
                <p className="text-[13px] text-gray-500">Choose what you want to be notified about.</p>
              </div>
              <div className="space-y-4">
                <ToggleRow 
                  label="Email Notifications" 
                  description="Receive notifications via email." 
                  checked={notifSettings.email} 
                  onChange={v => setNotifSettings(s => ({ ...s, email: v }))} 
                />
                <ToggleRow 
                  label="Leave Updates" 
                  description="Get notified when your leave request is approved or rejected." 
                  checked={notifSettings.leave} 
                  onChange={v => setNotifSettings(s => ({ ...s, leave: v }))} 
                />
                <ToggleRow 
                  label="Payroll Alerts" 
                  description="Get notified when a new payslip is generated." 
                  checked={notifSettings.payroll} 
                  onChange={v => setNotifSettings(s => ({ ...s, payroll: v }))} 
                />
                <ToggleRow 
                  label="Company Announcements" 
                  description="Receive alerts for high priority announcements." 
                  checked={notifSettings.announcements} 
                  onChange={v => setNotifSettings(s => ({ ...s, announcements: v }))} 
                />
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <Button onClick={handleSave}>Save Preferences</Button>
              </div>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card className="space-y-6">
              <div>
                <h3 className="text-[16px] font-bold text-gray-900 mb-1">Change Password</h3>
                <p className="text-[13px] text-gray-500">Update your account password.</p>
              </div>
              <form onSubmit={handlePasswordSave} className="space-y-4 max-w-[400px]">
                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-1">Current Password</label>
                  <input type="password" required value={pwd.current} onChange={e => setPwd(s => ({ ...s, current: e.target.value }))} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-[14px]" />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-1">New Password</label>
                  <input type="password" required value={pwd.new} onChange={e => setPwd(s => ({ ...s, new: e.target.value }))} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-[14px]" />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <input type="password" required value={pwd.confirm} onChange={e => setPwd(s => ({ ...s, confirm: e.target.value }))} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-[14px]" />
                </div>
                <div className="pt-4 flex justify-end">
                  <Button type="submit">Update Password</Button>
                </div>
              </form>
            </Card>
          )}

          {activeTab === 'appearance' && (
            <Card className="space-y-6">
              <div>
                <h3 className="text-[16px] font-bold text-gray-900 mb-1">Theme</h3>
                <p className="text-[13px] text-gray-500">Select your preferred interface theme.</p>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => toggleTheme('light')}
                  className={cn("px-6 py-3 rounded-xl border-2 font-medium text-[14px]", theme === 'light' ? "border-brand-500 text-brand-700 bg-brand-50" : "border-gray-200 text-gray-600 hover:border-gray-300")}
                >
                  Light Mode
                </button>
                <button 
                  onClick={() => toggleTheme('dark')}
                  className={cn("px-6 py-3 rounded-xl border-2 font-medium text-[14px]", theme === 'dark' ? "border-brand-500 text-brand-700 bg-brand-50" : "border-gray-200 text-gray-600 hover:border-gray-300")}
                >
                  Dark Mode
                </button>
              </div>
              <p className="text-[12px] text-gray-400">Note: Dark mode is a preview feature and requires global CSS support.</p>
            </Card>
          )}
        </div>
      </div>

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
          <div className="bg-gray-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-success-400" />
            <span className="text-[14px] font-medium">Settings saved successfully.</span>
          </div>
        </div>
      )}
    </div>
  );
}

function ToggleRow({ label, description, checked, onChange }: { label: string, description: string, checked: boolean, onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div>
        <h4 className="text-[14px] font-semibold text-gray-900">{label}</h4>
        <p className="text-[13px] text-gray-500">{description}</p>
      </div>
      <button 
        type="button"
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
          checked ? "bg-brand-500" : "bg-gray-200"
        )}
      >
        <span className={cn(
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
          checked ? "translate-x-5" : "translate-x-0"
        )} />
      </button>
    </div>
  )
}
