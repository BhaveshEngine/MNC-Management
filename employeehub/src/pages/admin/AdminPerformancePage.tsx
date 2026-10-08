import { useState } from 'react';
import { Search, Target, Award, Star, TrendingUp, Plus } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAppStore, Goal, PerformanceReview } from '@/store/AppStore';
import { cn } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';

export function AdminPerformancePage() {
  const { state, addGoal, updateGoal, addReview, updateReview } = useAppStore();
  
  const [activeTab, setActiveTab] = useState<'Goals' | 'Reviews'>('Goals');
  const [searchQuery, setSearchQuery] = useState('');
  
  const goals = state.goals || [];
  const reviews = state.reviews || [];

  const completedGoals = goals.filter(g => g.status === 'Completed').length;
  const onTrackGoals = goals.filter(g => g.status === 'On Track').length;
  const atRiskGoals = goals.filter(g => g.status === 'At Risk').length;
  const avgScore = reviews.length ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : 'N/A';

  const filteredGoals = goals.filter(g => {
    const emp = state.employees.find(e => e.id === g.employeeId);
    const matchesSearch = emp?.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || g.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const filteredReviews = reviews.filter(r => {
    const emp = state.employees.find(e => e.id === r.employeeId);
    const matchesSearch = emp?.firstName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed': return <Badge variant="success">Completed</Badge>;
      case 'On Track': return <Badge variant="primary">On Track</Badge>;
      case 'At Risk': return <Badge variant="warning">At Risk</Badge>;
      case 'Pending': return <Badge variant="warning">Pending</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalForm, setGoalForm] = useState<Partial<Goal>>({ title: '', progress: 0, status: 'On Track', employeeId: '' });

  const handleSaveGoal = () => {
    if (goalForm.title && goalForm.employeeId) {
      addGoal(goalForm as Omit<Goal, 'id'>);
      setShowGoalModal(false);
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
        title="Performance & Goals"
        subtitle="Track employee performance, reviews, and company objectives."
        actions={
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => { setGoalForm({ title: '', progress: 0, status: 'On Track', employeeId: state.employees[0]?.id }); setShowGoalModal(true); }} icon={<Plus className="w-4 h-4" />}>
              Add Goal
            </Button>
            <Button onClick={() => { setReviewForm({ period: 'Q4 2026', rating: 4, feedback: '', status: 'Completed', employeeId: state.employees[0]?.id }); setShowReviewModal(true); }} icon={<Plus className="w-4 h-4" />}>
              New Review
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

        <Card className="flex flex-col">
          <div className="flex items-center gap-3 mb-2 text-gray-500">
            <div className="p-2 bg-primary-50 text-primary-600 rounded-lg"><TrendingUp className="w-5 h-5" /></div>
            <span className="text-[13px] font-medium uppercase tracking-wider">Goals On Track</span>
          </div>
          <p className="text-[28px] font-bold text-gray-900 mt-2">{onTrackGoals}</p>
        </Card>

        <Card className="flex flex-col">
          <div className="flex items-center gap-3 mb-2 text-gray-500">
            <div className="p-2 bg-warning-50 text-warning-600 rounded-lg"><Target className="w-5 h-5" /></div>
            <span className="text-[13px] font-medium uppercase tracking-wider">Goals At Risk</span>
          </div>
          <p className="text-[28px] font-bold text-gray-900 mt-2">{atRiskGoals}</p>
        </Card>
      </div>

      <div className="flex gap-4 border-b border-gray-200">
        <button onClick={() => setActiveTab('Goals')} className={cn("pb-3 px-2 text-[14px] font-medium border-b-2 transition-colors", activeTab === 'Goals' ? "border-brand-600 text-brand-600" : "border-transparent text-gray-500 hover:text-gray-700")}>
          Goals
        </button>
        <button onClick={() => setActiveTab('Reviews')} className={cn("pb-3 px-2 text-[14px] font-medium border-b-2 transition-colors", activeTab === 'Reviews' ? "border-brand-600 text-brand-600" : "border-transparent text-gray-500 hover:text-gray-700")}>
          Reviews
        </button>
      </div>

      <Card padding="none" className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between border-b-0 rounded-b-none border-b border-gray-100">
        <div className="relative flex-1 w-full max-w-sm">
          <Input placeholder="Search employee or title..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} icon={<Search className="w-4 h-4" />} />
        </div>
      </Card>

      <Card padding="none" className="overflow-hidden rounded-t-none border-t-0">
        <div className="overflow-x-auto">
          {activeTab === 'Goals' ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">Employee</th>
                  <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">Goal Title</th>
                  <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50 w-48">Progress</th>
                  <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">Deadline</th>
                  <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredGoals.map(g => {
                  const emp = state.employees.find(e => e.id === g.employeeId);
                  return (
                    <tr key={g.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 text-[14px] font-medium text-gray-900">{emp?.firstName} {emp?.lastName}</td>
                      <td className="px-6 py-4 text-[14px] text-gray-700">{g.title}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div className={cn("h-full rounded-full transition-all", g.progress === 100 ? "bg-success-500" : "bg-brand-500")} style={{ width: `${g.progress}%` }} />
                          </div>
                          <span className="text-[12px] font-medium text-gray-600 w-8">{g.progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[13px] text-gray-600">{new Date(g.deadline).toLocaleDateString()}</td>
                      <td className="px-6 py-4">{getStatusBadge(g.status)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">Employee</th>
                  <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">Period</th>
                  <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">Rating</th>
                  <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">Feedback</th>
                  <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredReviews.map(r => {
                  const emp = state.employees.find(e => e.id === r.employeeId);
                  return (
                    <tr key={r.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 text-[14px] font-medium text-gray-900">{emp?.firstName} {emp?.lastName}</td>
                      <td className="px-6 py-4 text-[13px] text-gray-700">{r.period}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-warning-500 fill-warning-500" />
                          <span className="text-[14px] font-bold text-gray-900">{r.rating}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[13px] text-gray-600 max-w-xs truncate" title={r.feedback}>{r.feedback}</td>
                      <td className="px-6 py-4">{getStatusBadge(r.status)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      <Modal isOpen={showGoalModal} onClose={() => setShowGoalModal(false)} title="Assign New Goal">
        <div className="space-y-4">
          <div>
            <label className="text-[13px] font-medium text-gray-700 mb-1 block">Employee</label>
            <select className="w-full h-10 px-3 rounded-lg border border-gray-200 text-[13px]" value={goalForm.employeeId} onChange={e => setGoalForm({...goalForm, employeeId: e.target.value})}>
              {state.employees.map(e => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}
            </select>
          </div>
          <Input label="Goal Title" value={goalForm.title} onChange={e => setGoalForm({...goalForm, title: e.target.value})} />
          <Input label="Deadline" type="date" value={goalForm.deadline || ''} onChange={e => setGoalForm({...goalForm, deadline: e.target.value})} />
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" onClick={() => setShowGoalModal(false)}>Cancel</Button>
            <Button onClick={handleSaveGoal}>Assign Goal</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showReviewModal} onClose={() => setShowReviewModal(false)} title="Submit Performance Review">
        <div className="space-y-4">
          <div>
            <label className="text-[13px] font-medium text-gray-700 mb-1 block">Employee</label>
            <select className="w-full h-10 px-3 rounded-lg border border-gray-200 text-[13px]" value={reviewForm.employeeId} onChange={e => setReviewForm({...reviewForm, employeeId: e.target.value})}>
              {state.employees.map(e => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Period" value={reviewForm.period} onChange={e => setReviewForm({...reviewForm, period: e.target.value})} />
            <Input label="Rating (1-5)" type="number" min={1} max={5} step={0.1} value={reviewForm.rating} onChange={e => setReviewForm({...reviewForm, rating: parseFloat(e.target.value) || 0})} />
          </div>
          <div>
            <label className="text-[13px] font-medium text-gray-700 mb-1 block">Feedback</label>
            <textarea className="w-full rounded-lg border border-gray-200 p-3 text-[13px]" rows={3} value={reviewForm.feedback} onChange={e => setReviewForm({...reviewForm, feedback: e.target.value})} />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" onClick={() => setShowReviewModal(false)}>Cancel</Button>
            <Button onClick={handleSaveReview}>Submit Review</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
