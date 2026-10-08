import { useState } from 'react';
import { Search, Calendar, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/AppStore';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

export function AdminLeavePage() {
  const { state, approveLeave, rejectLeave } = useAppStore();
  const { user } = useAuth();
  const adminName = user?.name || 'Administrator';
  
  const [activeTab, setActiveTab] = useState<'Pending' | 'Approved' | 'Rejected' | 'All'>('Pending');
  const [searchQuery, setSearchQuery] = useState('');

  const leaves = state.leaveRequests || [];
  
  const filteredLeaves = leaves.filter(l => {
    const matchesSearch = (l.employeeName || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = activeTab === 'All' || l.status === activeTab;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => new Date(b.appliedOn).getTime() - new Date(a.appliedOn).getTime());

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved': return <Badge variant="success">Approved</Badge>;
      case 'Pending': return <Badge variant="warning">Pending</Badge>;
      case 'Rejected': return <Badge variant="danger">Rejected</Badge>;
      case 'Cancelled': return <Badge variant="default">Cancelled</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const tabs = ['Pending', 'Approved', 'Rejected', 'All'] as const;

  return (
    <div className="max-w-[1400px] mx-auto animate-slide-up space-y-6">
      <PageHeader
        title="Leave Management"
        subtitle="Review and process employee leave requests."
        actions={
          <Button variant="outline" icon={<Calendar className="w-4 h-4" />}>
            Leave Calendar
          </Button>
        }
      />

      <Card padding="none" className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between border-b-0 rounded-b-none border-b border-gray-100">
        <div className="flex gap-1 bg-gray-100/50 p-1 rounded-lg">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-1.5 text-[13px] font-medium rounded-md transition-colors",
                activeTab === tab ? "bg-white text-gray-900 shadow-sm border border-gray-200/50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="relative w-full max-w-sm">
          <Input 
            placeholder="Search by employee name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
      </Card>

      <Card padding="none" className="overflow-hidden rounded-t-none border-t-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">Employee</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">Leave Type</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">Duration</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">Reason</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">Status</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLeaves.map(req => (
                <tr key={req.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div className="text-[14px] font-medium text-gray-900">{req.employeeName}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">Applied: {new Date(req.appliedOn).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[13px] font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded-md">{req.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-[13px] font-medium text-gray-900">{req.days} Day(s)</div>
                    <div className="text-[12px] text-gray-500 mt-0.5">
                      {new Date(req.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} — {new Date(req.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-[13px] text-gray-600 max-w-[200px] truncate" title={req.reason}>{req.reason}</p>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(req.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {req.status === 'Pending' ? (
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" size="sm" onClick={() => rejectLeave(req.id, adminName)}>Reject</Button>
                        <Button size="sm" onClick={() => approveLeave(req.id, adminName)}>Approve</Button>
                      </div>
                    ) : (
                      <span className="text-[12px] text-gray-400 italic">
                        {req.status} by {req.reviewedBy || 'System'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredLeaves.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <CheckCircle2 className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                    <p className="text-[14px] font-medium text-gray-900">No {activeTab.toLowerCase()} leave requests.</p>
                    <p className="text-[13px] text-gray-500 mt-1">Check back later or adjust your filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
