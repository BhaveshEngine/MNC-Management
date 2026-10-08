import { useState } from 'react';
import { Plus, Search, FileText, CalendarClock, Laptop, MessagesSquare, X, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/AppStore';
import type { GeneralRequest } from '@/store/AppStore';
import { currentEmployee } from '@/data/employee-mock-data';
import { cn } from '@/lib/utils';

type UnifiedRequest = {
  id: string;
  type: 'leave' | 'attendance' | 'asset' | 'general';
  typeLabel: string;
  title: string;
  submittedOn: string;
  status: string;
  data: any;
};

export function EmployeeRequestsPage() {
  const { 
    getLeavesByEmployee, 
    getAttendanceCorrectionsByEmployee, 
    getAssetIssuesByEmployee, 
    getGeneralRequestsByEmployee,
    submitGeneralRequest,
    cancelRequest
  } = useAppStore();
  
  const empId = currentEmployee.id;

  const leaves = getLeavesByEmployee(empId);
  const attendance = getAttendanceCorrectionsByEmployee(empId);
  const assets = getAssetIssuesByEmployee(empId);
  const general = getGeneralRequestsByEmployee(empId);

  // Unify all requests
  const unifiedRequests: UnifiedRequest[] = [
    ...leaves.map(l => ({ id: l.id, type: 'leave' as const, typeLabel: 'Leave', title: `${l.type} - ${l.days} day(s)`, submittedOn: l.appliedOn, status: l.status, data: l })),
    ...attendance.map(a => ({ id: a.id, type: 'attendance' as const, typeLabel: 'Attendance', title: `Correction for ${a.date}`, submittedOn: a.appliedOn, status: a.status, data: a })),
    ...assets.map(a => ({ id: a.id, type: 'asset' as const, typeLabel: 'Asset Issue', title: `${a.issueType} on ${a.assetId}`, submittedOn: a.reportedOn, status: a.status, data: a })),
    ...general.map(g => ({ id: g.id, type: 'general' as const, typeLabel: g.category, title: g.subject, submittedOn: g.submittedOn, status: g.status, data: g })),
  ].sort((a, b) => new Date(b.submittedOn).getTime() - new Date(a.submittedOn).getTime());

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedReq, setSelectedReq] = useState<UnifiedRequest | null>(null);
  
  const [newReqForm, setNewReqForm] = useState({
    category: 'IT Support' as GeneralRequest['category'],
    subject: '',
    description: '',
    priority: 'Medium' as GeneralRequest['priority'],
  });

  const filteredReqs = unifiedRequests.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'All' || r.type === typeFilter;
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved': case 'Resolved': return <Badge variant="success">{status}</Badge>;
      case 'Pending': return <Badge variant="warning">{status}</Badge>;
      case 'Rejected': return <Badge variant="danger">{status}</Badge>;
      case 'In Progress': return <Badge variant="primary">{status}</Badge>;
      case 'Cancelled': return <Badge variant="default">{status}</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'leave': return <FileText className="w-4 h-4 text-blue-500" />;
      case 'attendance': return <CalendarClock className="w-4 h-4 text-purple-500" />;
      case 'asset': return <Laptop className="w-4 h-4 text-emerald-500" />;
      case 'general': return <MessagesSquare className="w-4 h-4 text-amber-500" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const handleNewRequest = (e: React.FormEvent) => {
    e.preventDefault();
    submitGeneralRequest({
      employeeId: empId,
      category: newReqForm.category,
      subject: newReqForm.subject,
      description: newReqForm.description,
      priority: newReqForm.priority,
    });
    setShowNewModal(false);
    setNewReqForm({ category: 'IT Support', subject: '', description: '', priority: 'Medium' });
  };

  const handleCancel = (req: UnifiedRequest) => {
    cancelRequest(req.type, req.id);
    setSelectedReq({ ...req, status: 'Cancelled' });
  };

  return (
    <div className="max-w-[1200px] mx-auto animate-slide-up space-y-6">
      <PageHeader
        title="My Requests"
        subtitle="Track and manage all your submitted requests."
        actions={
          <Button icon={<Plus className="w-4 h-4" />} onClick={() => setShowNewModal(true)}>
            New Request
          </Button>
        }
      />

      <Card padding="none" className="p-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Input 
            placeholder="Search requests..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-10 px-3 rounded-lg border border-gray-200 bg-white text-[13px] text-gray-700 w-full md:w-[160px]"
          >
            <option value="All">All Types</option>
            <option value="leave">Leave</option>
            <option value="attendance">Attendance</option>
            <option value="asset">Assets</option>
            <option value="general">General/IT</option>
          </select>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 rounded-lg border border-gray-200 bg-white text-[13px] text-gray-700 w-full md:w-[160px]"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </Card>

      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Request Type</th>
                <th>Details</th>
                <th>Submitted On</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredReqs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-[13px] text-gray-400 py-12">
                    No requests found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredReqs.map(req => (
                  <tr 
                    key={req.id} 
                    onClick={() => setSelectedReq(req)}
                    className="cursor-pointer hover:bg-gray-50/50 transition-colors"
                  >
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-50 rounded-lg">
                          {getTypeIcon(req.type)}
                        </div>
                        <span className="font-medium text-gray-900">{req.typeLabel}</span>
                      </div>
                    </td>
                    <td><span className="text-gray-900 font-medium text-[13px]">{req.title}</span></td>
                    <td><span className="text-gray-600 text-[13px]">{new Date(req.submittedOn).toLocaleDateString()}</span></td>
                    <td>{getStatusBadge(req.status)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* New Request Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade">
          <Card className="w-full max-w-[500px] mx-4 p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h3 className="text-[18px] font-bold text-gray-900">New General Request</h3>
              <button onClick={() => setShowNewModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleNewRequest} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-2">Category</label>
                  <select 
                    required
                    value={newReqForm.category}
                    onChange={e => setNewReqForm(s => ({ ...s, category: e.target.value as any }))}
                    className="w-full h-10 px-3 rounded-lg border border-gray-200 text-[14px] text-gray-700 bg-white"
                  >
                    <option>IT Support</option>
                    <option>HR Query</option>
                    <option>Facilities</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-2">Priority</label>
                  <select 
                    required
                    value={newReqForm.priority}
                    onChange={e => setNewReqForm(s => ({ ...s, priority: e.target.value as any }))}
                    className="w-full h-10 px-3 rounded-lg border border-gray-200 text-[14px] text-gray-700 bg-white"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-2">Subject</label>
                <input 
                  required
                  type="text"
                  value={newReqForm.subject}
                  onChange={e => setNewReqForm(s => ({ ...s, subject: e.target.value }))}
                  placeholder="Brief title for your request"
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 text-[14px] text-gray-700"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-2">Description</label>
                <textarea 
                  required
                  rows={4}
                  value={newReqForm.description}
                  onChange={e => setNewReqForm(s => ({ ...s, description: e.target.value }))}
                  placeholder="Provide details..."
                  className="w-full p-3 rounded-lg border border-gray-200 text-[14px] text-gray-700"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button variant="ghost" type="button" onClick={() => setShowNewModal(false)}>Cancel</Button>
                <Button type="submit">Submit Request</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Details Modal */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade">
          <Card className="w-full max-w-[500px] mx-4 p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-50 rounded-lg">
                  {getTypeIcon(selectedReq.type)}
                </div>
                <h3 className="text-[18px] font-bold text-gray-900">Request Details</h3>
              </div>
              <button onClick={() => setSelectedReq(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[12px] text-gray-500 font-medium uppercase tracking-wider mb-1">{selectedReq.typeLabel}</p>
                  <h4 className="text-[16px] font-bold text-gray-900">{selectedReq.title}</h4>
                </div>
                {getStatusBadge(selectedReq.status)}
              </div>

              <div className="p-4 bg-gray-50 rounded-xl space-y-3 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-gray-500">Submitted On</span>
                  <span className="font-medium text-gray-900">{new Date(selectedReq.submittedOn).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Request ID</span>
                  <span className="font-mono text-gray-900">{selectedReq.id}</span>
                </div>
                {selectedReq.data.description || selectedReq.data.reason ? (
                  <div className="pt-3 border-t border-gray-200">
                    <span className="text-gray-500 block mb-1">Description</span>
                    <span className="text-gray-900">{selectedReq.data.description || selectedReq.data.reason}</span>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              {selectedReq.status === 'Pending' && (
                <Button variant="danger" onClick={() => handleCancel(selectedReq)}>Cancel Request</Button>
              )}
              <Button variant="outline" onClick={() => setSelectedReq(null)}>Close</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
