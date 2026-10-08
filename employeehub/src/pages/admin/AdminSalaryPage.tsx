import { useState } from 'react';
import { Search, BadgeIndianRupee } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAppStore, type SalaryComponent } from '@/store/AppStore';
import { Modal } from '@/components/ui/Modal';

export function AdminSalaryPage() {
  const { state, updateSalaryStructure } = useAppStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  
  const [editingSalaryEmpId, setEditingSalaryEmpId] = useState<string | null>(null);
  const [editingComponents, setEditingComponents] = useState<SalaryComponent[]>([]);

  const departments = ['All', ...Array.from(new Set((state.employees || []).map(e => e.department)))];

  const salaryRows = (state.employees || []).filter(emp => emp.status === 'Active').map(emp => {
    const st = (state.salaryStructures || []).find(s => s.employeeId === emp.id) || { gross: 0, net: 0, components: [] };
    return {
      employeeId: emp.id,
      name: `${emp.firstName} ${emp.lastName}`,
      department: emp.department,
      salaryStructure: st,
    };
  }).filter(row => {
    const matchesSearch = row.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === 'All' || row.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  const handleEditSalary = (empId: string, components: SalaryComponent[]) => {
    setEditingSalaryEmpId(empId);
    setEditingComponents(JSON.parse(JSON.stringify(components))); // deep copy
  };

  const handleSaveSalary = () => {
    if (editingSalaryEmpId) {
      updateSalaryStructure(editingSalaryEmpId, editingComponents);
      setEditingSalaryEmpId(null);
    }
  };

  const updateComponentValue = (index: number, value: number) => {
    const newComps = [...editingComponents];
    newComps[index].value = value;
    setEditingComponents(newComps);
  };

  const editingEmpName = editingSalaryEmpId ? (state.employees || []).find(e => e.id === editingSalaryEmpId)?.firstName + ' ' + (state.employees || []).find(e => e.id === editingSalaryEmpId)?.lastName : '';

  return (
    <div className="max-w-[1400px] mx-auto animate-slide-up space-y-6">
      <PageHeader
        title="Salary Management"
        subtitle="Configure salary components for employees."
      />

      <Card padding="none" className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between border-b-0 rounded-b-none">
        <div className="relative flex-1 w-full max-w-sm">
          <Input placeholder="Search employees..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} icon={<Search className="w-4 h-4" />} />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="h-10 px-3 rounded-lg border border-gray-200 bg-white text-[13px] text-gray-700 w-full md:w-[160px]">
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </Card>

      <Card padding="none" className="overflow-hidden rounded-t-none border-t border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">Employee</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">Gross Salary</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">Net Salary</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {salaryRows.map(row => (
                <tr key={row.employeeId} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div className="text-[14px] font-medium text-gray-900">{row.name}</div>
                    <div className="text-[12px] text-gray-500">{row.department}</div>
                  </td>
                  <td className="px-6 py-4 text-[14px] font-medium text-gray-900">₹{row.salaryStructure.gross.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-[14px] font-medium text-emerald-600">₹{row.salaryStructure.net.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="outline" size="sm" onClick={() => handleEditSalary(row.employeeId, row.salaryStructure.components.length ? row.salaryStructure.components : [
                      { name: 'Basic', value: 0, percentage: '50%', type: 'earning' },
                      { name: 'HRA', value: 0, percentage: '20%', type: 'earning' },
                      { name: 'Special Allowance', value: 0, percentage: '12%', type: 'earning' },
                      { name: 'Other Allowances', value: 0, percentage: '10%', type: 'earning' },
                      { name: 'PF', value: 0, percentage: '3%', type: 'deduction' },
                      { name: 'Professional Tax', value: 0, type: 'deduction' },
                      { name: 'Income Tax', value: 0, percentage: '3%', type: 'deduction' },
                    ])}>Edit Structure</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit Salary Modal */}
      <Modal isOpen={!!editingSalaryEmpId} onClose={() => setEditingSalaryEmpId(null)} title={`Edit Salary Structure - ${editingEmpName}`}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {editingComponents.map((comp, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <label className="text-[13px] font-medium text-gray-700 flex justify-between">
                  <span>{comp.name}</span>
                  <span className="text-gray-400">{comp.type}</span>
                </label>
                <Input 
                  type="number"
                  value={comp.value}
                  onChange={(e) => updateComponentValue(idx, parseFloat(e.target.value) || 0)}
                  className="w-full"
                />
              </div>
            ))}
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center mt-4 border border-gray-200">
            <div>
              <div className="text-[13px] text-gray-500 uppercase tracking-wider font-medium">New Gross</div>
              <div className="text-[20px] font-bold text-gray-900">₹{editingComponents.filter(c => c.type === 'earning').reduce((a,c) => a+c.value,0).toLocaleString('en-IN')}</div>
            </div>
            <div className="text-right">
              <div className="text-[13px] text-gray-500 uppercase tracking-wider font-medium">New Net</div>
              <div className="text-[20px] font-bold text-emerald-600">₹{(
                editingComponents.filter(c => c.type === 'earning').reduce((a,c) => a+c.value,0) - 
                editingComponents.filter(c => c.type === 'deduction').reduce((a,c) => a+c.value,0)
              ).toLocaleString('en-IN')}</div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
            <Button variant="ghost" onClick={() => setEditingSalaryEmpId(null)}>Cancel</Button>
            <Button onClick={handleSaveSalary}>Save Structure</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
