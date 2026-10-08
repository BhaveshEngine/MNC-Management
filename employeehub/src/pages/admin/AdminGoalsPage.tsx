import { useState } from 'react';
import { Search, Target, Plus, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAppStore, type Goal } from '@/store/AppStore';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/utils';

export function AdminGoalsPage() {
  const { state, addGoal, updateGoal } = useAppStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  
  const goals = state.goals || [];

  const completedGoals = goals.filter(g => g.status === 'Completed').length;
  const onTrackGoals = goals.filter(g => g.status === 'On Track').length;
  const atRiskGoals = goals.filter(g => g.status === 'At Risk').length;

  const filteredGoals = goals.filter(g => {
    const emp = state.employees.find(e => e.id === g.employeeId);
    const matchesSearch = emp?.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || g.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed': return <Badge variant="success">Completed</Badge>;
      case 'On Track': return <Badge variant="primary">On Track</Badge>;
      case 'At Risk': return <Badge variant="warning">At Risk</Badge>;
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

  return (
    <div className="max-w-[1400px] mx-auto animate-slide-up space-y-6">
      <PageHeader
        title="Goals Management"
        subtitle="Track and manage employee objectives and key results."
        actions={
          <Button onClick={() => { setGoalForm({ title: '', progress: 0, status: 'On Track', employeeId: state.employees[0]?.id }); setShowGoalModal(true); }} icon={<Plus className="w-4 h-4" />}>
            Add Goal
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="flex flex-col">
          <div className="flex items-center gap-3 mb-2 text-gray-500">
            <div className="p-2 bg-brand-50 text-brand-600 rounded-lg"><Target className="w-5 h-5" /></div>
            <span className="text-[13px] font-medium uppercase tracking-wider">Total Goals</span>
          </div>
          <p className="text-[28px] font-bold text-gray-900 mt-2">{goals.length}</p>
        </Card>

        <Card className="flex flex-col">
          <div className="flex items-center gap-3 mb-2 text-gray-500">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><TrendingUp className="w-5 h-5" /></div>
            <span className="text-[13px] font-medium uppercase tracking-wider">Completed</span>
          </div>
          <p className="text-[28px] font-bold text-gray-900 mt-2">{completedGoals}</p>
        </Card>
        
        <Card className="flex flex-col">
          <div className="flex items-center gap-3 mb-2 text-gray-500">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Target className="w-5 h-5" /></div>
            <span className="text-[13px] font-medium uppercase tracking-wider">On Track</span>
          </div>
          <p className="text-[28px] font-bold text-gray-900 mt-2">{onTrackGoals}</p>
        </Card>
        
        <Card className="flex flex-col">
          <div className="flex items-center gap-3 mb-2 text-gray-500">
            <div className="p-2 bg-warning-50 text-warning-600 rounded-lg"><Target className="w-5 h-5" /></div>
            <span className="text-[13px] font-medium uppercase tracking-wider">At Risk</span>
          </div>
          <p className="text-[28px] font-bold text-gray-900 mt-2">{atRiskGoals}</p>
        </Card>
      </div>

      <Card padding="none" className="p-4 flex flex-col md:flex-row gap-4 items-center border-b-0 rounded-b-none justify-between">
        <div className="relative flex-1 w-full max-w-sm">
          <Input placeholder="Search goals or employees..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} icon={<Search className="w-4 h-4" />} />
        </div>
      </Card>

      <Card padding="none" className="overflow-hidden rounded-t-none border-t border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">Employee</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50 w-[40%]">Goal</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">Deadline</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">Progress</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">Status</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredGoals.map(g => {
                const emp = state.employees.find(e => e.id === g.employeeId);
                return (
                  <tr key={g.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <div className="text-[14px] font-medium text-gray-900">{emp?.firstName} {emp?.lastName}</div>
                      <div className="text-[12px] text-gray-500">{emp?.department}</div>
                    </td>
                    <td className="px-6 py-4 text-[14px] text-gray-700 font-medium">{g.title}</td>
                    <td className="px-6 py-4 text-[14px] text-gray-500">{new Date(g.deadline).toLocaleDateString('en-GB')}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden w-24">
                          <div className={cn("h-full rounded-full transition-all duration-500", g.progress === 100 ? "bg-emerald-500" : g.progress > 60 ? "bg-brand-500" : "bg-warning-500")} style={{ width: `${g.progress}%` }} />
                        </div>
                        <span className="text-[13px] font-medium text-gray-700">{g.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(g.status)}</td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="outline" size="sm" onClick={() => { setGoalForm({ ...g }); setShowGoalModal(true); }}>Edit</Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Goal Modal */}
      <Modal isOpen={showGoalModal} onClose={() => setShowGoalModal(false)} title={goalForm.id ? "Edit Goal" : "Add New Goal"}>
        <div className="space-y-4">
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1">Employee</label>
            <select className="w-full h-10 px-3 rounded-lg border border-gray-200 text-[13px]" value={goalForm.employeeId} onChange={(e) => setGoalForm({ ...goalForm, employeeId: e.target.value })}>
              {state.employees.map(e => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1">Title</label>
            <Input value={goalForm.title} onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1">Deadline</label>
              <Input type="date" value={goalForm.deadline} onChange={(e) => setGoalForm({ ...goalForm, deadline: e.target.value })} />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1">Progress (%)</label>
              <Input type="number" min="0" max="100" value={goalForm.progress} onChange={(e) => setGoalForm({ ...goalForm, progress: parseInt(e.target.value) || 0 })} />
            </div>
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1">Status</label>
            <select className="w-full h-10 px-3 rounded-lg border border-gray-200 text-[13px]" value={goalForm.status} onChange={(e) => setGoalForm({ ...goalForm, status: e.target.value as Goal['status'] })}>
              <option value="On Track">On Track</option>
              <option value="At Risk">At Risk</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" onClick={() => setShowGoalModal(false)}>Cancel</Button>
            <Button onClick={() => { if (goalForm.id) { updateGoal(goalForm.id, goalForm); setShowGoalModal(false); } else { handleSaveGoal(); } }}>Save Goal</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
