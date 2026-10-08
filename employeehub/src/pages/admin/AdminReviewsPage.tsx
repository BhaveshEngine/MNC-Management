import { useState } from 'react';
import { Search, Award, Star, Plus } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAppStore, type PerformanceReview } from '@/store/AppStore';
import { Modal } from '@/components/ui/Modal';

export function AdminReviewsPage() {
  const { state, addReview, updateReview } = useAppStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  
  const reviews = state.reviews || [];

  const avgScore = reviews.length ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : 'N/A';

  const filteredReviews = reviews.filter(r => {
    const emp = state.employees.find(e => e.id === r.employeeId);
    const matchesSearch = emp?.firstName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed': return <Badge variant="success">Completed</Badge>;
      case 'Pending': return <Badge variant="warning">Pending</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState<Partial<PerformanceReview>>({ period: 'Q4 2026', rating: 4, feedback: '', status: 'Completed', employeeId: '' });

  const handleSaveReview = () => {
    if (reviewForm.employeeId) {
      addReview(reviewForm as Omit<PerformanceReview, 'id'>);
      setShowReviewModal(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto animate-slide-up space-y-6">
      <PageHeader
        title="Performance Reviews"
        subtitle="Manage and conduct employee performance reviews."
        actions={
          <Button onClick={() => { setReviewForm({ period: 'Q4 2026', rating: 4, feedback: '', status: 'Completed', employeeId: state.employees[0]?.id }); setShowReviewModal(true); }} icon={<Plus className="w-4 h-4" />}>
            New Review
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="flex flex-col">
          <div className="flex items-center gap-3 mb-2 text-gray-500">
            <div className="p-2 bg-blue-50 text-brand-600 rounded-lg"><Star className="w-5 h-5" /></div>
            <span className="text-[13px] font-medium uppercase tracking-wider">Average Score</span>
          </div>
          <p className="text-[28px] font-bold text-gray-900 mt-2">{avgScore}<span className="text-gray-400 text-lg">/5</span></p>
        </Card>
        
        <Card className="flex flex-col">
          <div className="flex items-center gap-3 mb-2 text-gray-500">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Award className="w-5 h-5" /></div>
            <span className="text-[13px] font-medium uppercase tracking-wider">Reviews Completed</span>
          </div>
          <p className="text-[28px] font-bold text-gray-900 mt-2">{reviews.length}</p>
        </Card>
      </div>

      <Card padding="none" className="p-4 flex flex-col md:flex-row gap-4 items-center border-b-0 rounded-b-none justify-between">
        <div className="relative flex-1 w-full max-w-sm">
          <Input placeholder="Search reviews or employees..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} icon={<Search className="w-4 h-4" />} />
        </div>
      </Card>

      <Card padding="none" className="overflow-hidden rounded-t-none border-t border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">Employee</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">Period</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">Rating</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50 w-[30%]">Feedback Summary</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">Status</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredReviews.map(r => {
                const emp = state.employees.find(e => e.id === r.employeeId);
                return (
                  <tr key={r.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <div className="text-[14px] font-medium text-gray-900">{emp?.firstName} {emp?.lastName}</div>
                      <div className="text-[12px] text-gray-500">{emp?.department}</div>
                    </td>
                    <td className="px-6 py-4 text-[14px] text-gray-700">{r.period}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-bold text-gray-900 ml-1">{r.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[13px] text-gray-600 truncate max-w-[200px]">{r.feedback}</td>
                    <td className="px-6 py-4">{getStatusBadge(r.status)}</td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="outline" size="sm" onClick={() => { setReviewForm({ ...r }); setShowReviewModal(true); }}>Edit</Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Review Modal */}
      <Modal isOpen={showReviewModal} onClose={() => setShowReviewModal(false)} title={reviewForm.id ? "Edit Review" : "New Review"}>
        <div className="space-y-4">
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1">Employee</label>
            <select className="w-full h-10 px-3 rounded-lg border border-gray-200 text-[13px]" value={reviewForm.employeeId} onChange={(e) => setReviewForm({ ...reviewForm, employeeId: e.target.value })}>
              {state.employees.map(e => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1">Period</label>
              <Input value={reviewForm.period} onChange={(e) => setReviewForm({ ...reviewForm, period: e.target.value })} />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1">Rating (1-5)</label>
              <Input type="number" min="1" max="5" step="0.1" value={reviewForm.rating} onChange={(e) => setReviewForm({ ...reviewForm, rating: parseFloat(e.target.value) || 0 })} />
            </div>
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1">Feedback</label>
            <textarea 
              className="w-full p-3 rounded-lg border border-gray-200 text-[13px] resize-none focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" 
              rows={4}
              value={reviewForm.feedback}
              onChange={(e) => setReviewForm({ ...reviewForm, feedback: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1">Status</label>
            <select className="w-full h-10 px-3 rounded-lg border border-gray-200 text-[13px]" value={reviewForm.status} onChange={(e) => setReviewForm({ ...reviewForm, status: e.target.value as PerformanceReview['status'] })}>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" onClick={() => setShowReviewModal(false)}>Cancel</Button>
            <Button onClick={() => { if (reviewForm.id) { updateReview(reviewForm.id, reviewForm); setShowReviewModal(false); } else { handleSaveReview(); } }}>Save Review</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
