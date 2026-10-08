import { useState } from 'react';
import { DollarSign, FileText, Download, Eye, Calendar, X } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/AppStore';
import { currentEmployee } from '@/data/employee-mock-data';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export function EmployeePayrollPage() {
  const { getPayslipsByEmployee, getSalaryStructure } = useAppStore();
  const payslips = getPayslipsByEmployee(currentEmployee.id);
  const salaryStructure = getSalaryStructure(currentEmployee.id) || { gross: 65000, net: 58450, components: [] };
  
  const [selectedMonth, setSelectedMonth] = useState('September 2026');
  const [showPayslipModal, setShowPayslipModal] = useState<string | null>(null);

  // Breakdown Data
  const defaultColors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#f97316', '#ec4899'];
  const breakdownData = salaryStructure.components.map((c, i) => ({
    name: c.name,
    value: c.value,
    color: defaultColors[i % defaultColors.length],
    percentage: c.percentage || '0%'
  }));

  return (
    <div className="max-w-[1200px] mx-auto animate-slide-up space-y-6">
      <PageHeader
        title="My Payroll"
        subtitle="View your salary breakdown and download payslips"
      />

      {/* 4 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="flex flex-col">
          <div className="flex items-center gap-3 mb-2 text-gray-500">
            <div className="p-2 bg-blue-50 text-brand-600 rounded-lg">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-[13px] font-medium uppercase tracking-wider">Current Salary</span>
          </div>
          <p className="text-[24px] font-bold text-gray-900 mt-2">₹{salaryStructure.gross.toLocaleString('en-IN')}</p>
          <p className="text-[12px] text-gray-400 mt-1">Gross per month</p>
        </Card>
        
        <Card className="flex flex-col">
          <div className="flex items-center gap-3 mb-2 text-gray-500">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-[13px] font-medium uppercase tracking-wider">Net Salary</span>
          </div>
          <p className="text-[24px] font-bold text-gray-900 mt-2">₹{salaryStructure.net.toLocaleString('en-IN')}</p>
          <p className="text-[12px] text-gray-400 mt-1">Take-home per month</p>
        </Card>

        <Card className="flex flex-col">
          <div className="flex items-center gap-3 mb-2 text-gray-500">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[13px] font-medium uppercase tracking-wider">Next Salary Date</span>
          </div>
          <p className="text-[24px] font-bold text-gray-900 mt-2">31 Oct 2026</p>
          <p className="text-[12px] text-gray-400 mt-1">Expected processing date</p>
        </Card>

        <Card className="flex flex-col">
          <div className="flex items-center gap-3 mb-2 text-gray-500">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[13px] font-medium uppercase tracking-wider">YTD Earnings</span>
          </div>
          <p className="text-[24px] font-bold text-gray-900 mt-2">₹5,84,500</p>
          <p className="text-[12px] text-gray-400 mt-1">Financial Year 2026-27</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Breakdown Chart */}
        <Card className="lg:col-span-1 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[16px] font-semibold text-gray-900">Salary Breakdown</h3>
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="text-[12px] border border-gray-200 rounded-md px-2 py-1 text-gray-600"
            >
              <option>September 2026</option>
              <option>August 2026</option>
              <option>July 2026</option>
            </select>
          </div>
          
          <div className="relative h-[220px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={breakdownData}
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {breakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => `₹${value.toLocaleString()}`}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[12px] text-gray-500 font-medium uppercase">Gross Salary</span>
              <span className="text-[20px] font-bold text-gray-900">₹65,000</span>
            </div>
          </div>

          <div className="mt-6 space-y-3 flex-1 overflow-y-auto pr-2">
            {breakdownData.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-700">{item.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-500 w-10 text-right">{item.percentage}</span>
                  <span className="font-medium text-gray-900 w-16 text-right">₹{item.value.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Payslips Table */}
        <Card padding="none" className="lg:col-span-2 overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-[16px] font-semibold text-gray-900">Previous Payslips</h3>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Gross Salary</th>
                  <th>Net Salary</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payslips.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-[13px] text-gray-400 py-8">
                      No payslips found.
                    </td>
                  </tr>
                ) : (
                  payslips.map(ps => (
                    <tr key={ps.id}>
                      <td className="font-medium text-gray-900">{ps.month}</td>
                      <td className="font-mono text-gray-600">₹{ps.grossSalary.toLocaleString()}</td>
                      <td className="font-mono font-medium text-gray-900">₹{ps.netSalary.toLocaleString()}</td>
                      <td>
                        <Badge variant="success">{ps.status}</Badge>
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4" />} onClick={() => setShowPayslipModal(ps.id)}>
                            View
                          </Button>
                          <Button variant="ghost" size="sm" icon={<Download className="w-4 h-4" />}>
                            Download
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between text-[12px] text-gray-500 bg-gray-50">
            <span>Showing 1-{payslips.length} of {payslips.length} records</span>
            <div className="flex gap-2">
              <button className="px-2 py-1 border border-gray-200 rounded text-gray-400 cursor-not-allowed bg-white">Prev</button>
              <button className="px-2 py-1 border border-gray-200 rounded text-gray-600 hover:bg-gray-100 bg-white">Next</button>
            </div>
          </div>
        </Card>
      </div>

      {/* View Payslip Modal */}
      {showPayslipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade">
          <Card className="w-full max-w-[700px] mx-4 max-h-[90vh] flex flex-col p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h3 className="text-[18px] font-bold text-gray-900">
                Payslip - {payslips.find(p => p.id === showPayslipModal)?.month}
              </h3>
              <button onClick={() => setShowPayslipModal(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-8 space-y-8 bg-white text-[13px]">
              <div className="flex justify-between items-start border-b pb-6">
                <div>
                  <h2 className="text-xl font-bold text-brand-600">EMPLOYEEHUB INC.</h2>
                  <p className="text-gray-500 mt-1">42 Malviya Nagar, Jaipur, Rajasthan</p>
                </div>
                <div className="text-right">
                  <h3 className="font-semibold text-gray-900 uppercase">Payslip</h3>
                  <p className="text-gray-500 mt-1">{payslips.find(p => p.id === showPayslipModal)?.month}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-gray-500 mb-1">Employee Name</p>
                  <p className="font-semibold text-gray-900">{currentEmployee.firstName} {currentEmployee.lastName}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Employee ID</p>
                  <p className="font-semibold text-gray-900">{currentEmployee.employeeId}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Designation</p>
                  <p className="font-semibold text-gray-900">{currentEmployee.designation}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Department</p>
                  <p className="font-semibold text-gray-900">{currentEmployee.department}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-gray-900 border-b pb-2 mb-3">Earnings</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between"><span className="text-gray-600">Basic</span><span>₹32,500</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">HRA</span><span>₹13,000</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Special Allowance</span><span>₹7,800</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Other Allowances</span><span>₹6,500</span></div>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 border-t mt-3 pt-2">
                    <span>Total Earnings</span><span>₹65,000</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 border-b pb-2 mb-3">Deductions</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between"><span className="text-gray-600">PF</span><span>₹1,950</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Professional Tax</span><span>₹200</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Income Tax</span><span>₹2,100</span></div>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 border-t mt-3 pt-2">
                    <span>Total Deductions</span><span>₹4,250</span>
                  </div>
                </div>
              </div>

              <div className="bg-brand-50 p-4 rounded-lg flex items-center justify-between border border-brand-100">
                <span className="font-bold text-brand-900 text-[16px]">Net Salary Payable</span>
                <span className="font-bold text-brand-900 text-[20px]">₹58,450</span>
              </div>
              <p className="text-[11px] text-gray-400 text-center italic">This is a system generated mock payslip and does not require a signature.</p>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <Button variant="outline" onClick={() => setShowPayslipModal(null)}>Close</Button>
              <Button icon={<Download className="w-4 h-4" />}>Download PDF</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
