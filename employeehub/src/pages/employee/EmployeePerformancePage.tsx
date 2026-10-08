import { useState } from 'react';
import { Target, TrendingUp, Star, Award, Eye, X } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/AppStore';
import { currentEmployee } from '@/data/employee-mock-data';
import { cn } from '@/lib/utils';

export function EmployeePerformancePage() {
  const { getGoalsByEmployee, getReviewsByEmployee } = useAppStore();
  const goals = getGoalsByEmployee(currentEmployee.id);
  const reviews = getReviewsByEmployee(currentEmployee.id);
  
  const completedGoals = goals.filter(g => g.status === 'Completed').length;
  const onTrackGoals = goals.filter(g => g.status === 'On Track').length;
  
  // Calculate dynamic metrics
  const avgRating = reviews.length ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : 'N/A';
  const performanceScore = reviews.length ? Math.round((parseFloat(avgRating) / 5) * 100) : 0;
  let ratingText = 'N/A';
  if (parseFloat(avgRating) >= 4.5) ratingText = 'Excellent';
  else if (parseFloat(avgRating) >= 3.5) ratingText = 'Good';
  else if (parseFloat(avgRating) >= 2.5) ratingText = 'Average';
  else if (reviews.length > 0) ratingText = 'Needs Improvement';

  const [showReviewModal, setShowReviewModal] = useState<string | null>(null);

  const completedGoals = goals.filter(g => g.status === 'Completed').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed': return <Badge variant="success">Completed</Badge>;
      case 'On Track': return <Badge variant="primary">On Track</Badge>;
      case 'At Risk': return <Badge variant="warning">At Risk</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto animate-slide-up space-y-6">
      <PageHeader
        title="My Performance"
        subtitle="Track your goals and view manager reviews"
        actions={
          <select className="h-10 px-3 rounded-lg border border-gray-200 bg-white text-[13px] text-gray-700 font-medium">
            <option>Current Cycle 2026</option>
            <option>Cycle 2025</option>
          </select>
        }
      />

      {/* 4 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="flex flex-col">
          <div className="flex items-center gap-3 mb-2 text-gray-500">
            <div className="p-2 bg-blue-50 text-brand-600 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-[13px] font-medium uppercase tracking-wider">Performance Score</span>
          </div>
          <p className="text-[28px] font-bold text-gray-900 mt-2">{performanceScore}%</p>
        </Card>
        
        <Card className="flex flex-col">
          <div className="flex items-center gap-3 mb-2 text-gray-500">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-[13px] font-medium uppercase tracking-wider">Rating</span>
          </div>
          <p className="text-[28px] font-bold text-gray-900 mt-2">{ratingText}</p>
        </Card>

        <Card className="flex flex-col">
          <div className="flex items-center gap-3 mb-2 text-gray-500">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Target className="w-5 h-5" />
            </div>
            <span className="text-[13px] font-medium uppercase tracking-wider">Goals Completed</span>
          </div>
          <p className="text-[28px] font-bold text-gray-900 mt-2">{completedGoals}/{goals.length}</p>
        </Card>

        <Card className="flex flex-col">
          <div className="flex items-center gap-3 mb-2 text-gray-500">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Star className="w-5 h-5" />
            </div>
            <span className="text-[13px] font-medium uppercase tracking-wider">Manager Rating</span>
          </div>
          <p className="text-[28px] font-bold text-gray-900 mt-2">{avgRating}<span className="text-gray-400 text-lg">/5</span></p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Goals Table */}
        <Card padding="none" className="overflow-hidden flex flex-col h-[400px]">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-[16px] font-semibold text-gray-900">Goals & Objectives</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            <table>
              <thead>
                <tr>
                  <th>Goal</th>
                  <th className="w-32">Progress</th>
                  <th>Deadline</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {goals.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center text-[13px] text-gray-400 py-8">
                      No goals assigned.
                    </td>
                  </tr>
                ) : (
                  goals.map(g => (
                    <tr key={g.id}>
                      <td className="font-medium text-gray-900 max-w-[200px] truncate" title={g.title}>{g.title}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className={cn("h-full rounded-full transition-all", g.progress === 100 ? "bg-success-500" : "bg-brand-500")} 
                              style={{ width: `${g.progress}%` }} 
                            />
                          </div>
                          <span className="text-[11px] font-medium text-gray-500 w-6 text-right">{g.progress}%</span>
                        </div>
                      </td>
                      <td className="text-gray-600">{new Date(g.deadline).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</td>
                      <td>{getStatusBadge(g.status)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Reviews Table */}
        <Card padding="none" className="overflow-hidden flex flex-col h-[400px]">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-[16px] font-semibold text-gray-900">Performance Reviews</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            <table>
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center text-[13px] text-gray-400 py-8">
                      No reviews found.
                    </td>
                  </tr>
                ) : (
                  reviews.map(r => (
                    <tr key={r.id}>
                      <td className="font-medium text-gray-900">{r.period}</td>
                      <td className="font-medium text-brand-600">{r.rating}</td>
                      <td>
                        <Badge variant={r.status === 'Completed' ? 'success' : 'warning'}>{r.status}</Badge>
                      </td>
                      <td className="text-right">
                        <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4" />} onClick={() => setShowReviewModal(r.id)}>
                          View Review
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade">
          <Card className="w-full max-w-[500px] mx-4 p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h3 className="text-[18px] font-bold text-gray-900">Manager Review</h3>
              <button onClick={() => setShowReviewModal(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <p className="text-[12px] text-gray-400 font-medium uppercase tracking-wider mb-1">Period</p>
                <p className="text-[15px] font-semibold text-gray-900">{reviews.find(r => r.id === showReviewModal)?.period}</p>
              </div>
              <div>
                <p className="text-[12px] text-gray-400 font-medium uppercase tracking-wider mb-1">Overall Rating</p>
                <Badge variant="success" className="text-[13px] px-3 py-1 mt-1">
                  {reviews.find(r => r.id === showReviewModal)?.rating}
                </Badge>
              </div>
              <div>
                <p className="text-[12px] text-gray-400 font-medium uppercase tracking-wider mb-2">Manager Feedback</p>
                <div className="bg-gray-50 border border-gray-100 p-4 rounded-lg text-[14px] text-gray-700 italic">
                  "Rahul has shown excellent progress this quarter. Consistently meets deadlines and writes clean, maintainable code. Keep up the good work!"
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <Button onClick={() => setShowReviewModal(null)}>Close</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
