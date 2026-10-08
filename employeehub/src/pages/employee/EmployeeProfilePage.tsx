import { useState } from 'react';
import { MapPin, Briefcase, Calendar, Hash, User, Edit2, Check, X, ShieldAlert } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { useAppStore } from '@/store/AppStore';
import { currentEmployee } from '@/data/employee-mock-data';
import type { StoreEmployee } from '@/store/AppStore';
import { cn, formatDate } from '@/lib/utils';

export function EmployeeProfilePage() {
  const { getEmployee, updateEmployee } = useAppStore();
  const emp = (getEmployee(currentEmployee.id) || currentEmployee) as StoreEmployee;
  
  const [activeTab, setActiveTab] = useState('Overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    email: emp.email,
    phone: emp.phone,
    address: emp.address,
    city: emp.city,
    state: emp.state,
    skills: emp.skills?.join(', ') || '',
    education: emp.education || ''
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateEmployee(emp.id, {
      email: editForm.email,
      phone: editForm.phone,
      address: editForm.address,
      city: editForm.city,
      state: editForm.state,
      skills: editForm.skills.split(',').map(s => s.trim()).filter(Boolean),
      education: editForm.education
    });
    setIsEditing(false);
  };

  const tabs = ['Overview', 'Personal', 'Employment', 'Contact', 'Skills', 'Education', 'Documents'];

  return (
    <div className="max-w-[1200px] mx-auto animate-slide-up space-y-6">
      
      {/* Header Card */}
      <Card className="relative overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-brand-600 to-brand-800 absolute top-0 left-0 right-0" />
        <div className="relative pt-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-5">
            <div className="rounded-2xl border-4 border-white bg-white shadow-sm overflow-hidden z-10">
              <Avatar name={`${emp.firstName} ${emp.lastName}`} size="2xl" />
            </div>
            <div className="text-center md:text-left mb-2">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                <h2 className="text-[24px] font-bold text-gray-900 leading-tight">
                  {emp.firstName} {emp.lastName}
                </h2>
                <Badge variant="success" className="h-6 px-2">{emp.status}</Badge>
              </div>
              <p className="text-[14px] text-gray-600 font-medium">{emp.designation} at {emp.department}</p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4 text-[13px] text-gray-500">
                <span className="flex items-center gap-1.5"><Hash className="w-4 h-4 text-gray-400" /> {emp.employeeId}</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gray-400" /> {emp.workLocation}</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-gray-400" /> Joined {formatDate(emp.joiningDate)}</span>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-auto mb-2">
            <Button className="w-full md:w-auto" icon={<Edit2 className="w-4 h-4" />} onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-6 overflow-x-auto scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'py-3 text-[14px] font-medium whitespace-nowrap transition-colors border-b-2',
                activeTab === tab 
                  ? 'border-brand-600 text-brand-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeTab === 'Overview' && (
          <>
            <Card>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[16px] font-semibold text-gray-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-brand-500" /> Personal Information
                </h3>
                <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-brand-600 transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[12px] text-gray-400 font-medium uppercase tracking-wider mb-1">Email</p>
                    <p className="text-[14px] font-medium text-gray-900 break-all">{emp.email}</p>
                  </div>
                  <div>
                    <p className="text-[12px] text-gray-400 font-medium uppercase tracking-wider mb-1">Phone</p>
                    <p className="text-[14px] font-medium text-gray-900">{emp.phone}</p>
                  </div>
                  <div>
                    <p className="text-[12px] text-gray-400 font-medium uppercase tracking-wider mb-1">Date of Birth</p>
                    <p className="text-[14px] font-medium text-gray-900">{formatDate(emp.dateOfBirth)}</p>
                  </div>
                  <div>
                    <p className="text-[12px] text-gray-400 font-medium uppercase tracking-wider mb-1">Gender</p>
                    <p className="text-[14px] font-medium text-gray-900">{emp.gender}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[12px] text-gray-400 font-medium uppercase tracking-wider mb-1">Address</p>
                    <p className="text-[14px] font-medium text-gray-900">{emp.address}, {emp.city}, {emp.state}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[16px] font-semibold text-gray-900 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-brand-500" /> Employment Information
                </h3>
                {/* Admin owned, no edit icon for employee */}
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[12px] text-gray-400 font-medium uppercase tracking-wider mb-1">Employee ID</p>
                    <p className="text-[14px] font-medium text-gray-900">{emp.employeeId}</p>
                  </div>
                  <div>
                    <p className="text-[12px] text-gray-400 font-medium uppercase tracking-wider mb-1">Joining Date</p>
                    <p className="text-[14px] font-medium text-gray-900">{formatDate(emp.joiningDate)}</p>
                  </div>
                  <div>
                    <p className="text-[12px] text-gray-400 font-medium uppercase tracking-wider mb-1">Department</p>
                    <p className="text-[14px] font-medium text-gray-900">{emp.department}</p>
                  </div>
                  <div>
                    <p className="text-[12px] text-gray-400 font-medium uppercase tracking-wider mb-1">Designation</p>
                    <p className="text-[14px] font-medium text-gray-900">{emp.designation}</p>
                  </div>
                  <div>
                    <p className="text-[12px] text-gray-400 font-medium uppercase tracking-wider mb-1">Reporting Manager</p>
                    <p className="text-[14px] font-medium text-gray-900">{emp.managerName}</p>
                  </div>
                  <div>
                    <p className="text-[12px] text-gray-400 font-medium uppercase tracking-wider mb-1">Employment Type</p>
                    <p className="text-[14px] font-medium text-gray-900">{emp.employmentType}</p>
                  </div>
                </div>
              </div>
            </Card>
          </>
        )}

        {activeTab !== 'Overview' && (
          <div className="col-span-1 md:col-span-2">
            <Card>
              <div className="p-8 text-center text-gray-500">
                <h3 className="text-[18px] font-medium text-gray-800 mb-2">{activeTab} Details</h3>
                <p className="text-[14px]">Specific {activeTab.toLowerCase()} data goes here (mocked for this tab).</p>
                {['Skills', 'Education', 'Contact'].includes(activeTab) && (
                  <Button variant="outline" className="mt-4" onClick={() => setIsEditing(true)}>Edit {activeTab}</Button>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade">
          <Card className="w-full max-w-[600px] mx-4 max-h-[90vh] flex flex-col p-0">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-[18px] font-bold text-gray-900">Edit Profile</h3>
              <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 space-y-6">
              <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg flex gap-3 text-blue-700 text-[13px]">
                <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                <p><strong>Note:</strong> Fields like Employee ID, Designation, and Department are managed by Admin and cannot be edited here.</p>
              </div>

              <form id="editProfileForm" onSubmit={handleSave} className="space-y-5">
                <div className="space-y-4">
                  <h4 className="text-[14px] font-bold text-gray-900 border-b pb-2">Contact Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] font-semibold text-gray-700 mb-1">Email</label>
                      <input type="email" required value={editForm.email} onChange={e => setEditForm(s => ({ ...s, email: e.target.value }))} className="w-full" />
                    </div>
                    <div>
                      <label className="block text-[12px] font-semibold text-gray-700 mb-1">Phone</label>
                      <input type="text" required value={editForm.phone} onChange={e => setEditForm(s => ({ ...s, phone: e.target.value }))} className="w-full" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[12px] font-semibold text-gray-700 mb-1">Address</label>
                      <input type="text" required value={editForm.address} onChange={e => setEditForm(s => ({ ...s, address: e.target.value }))} className="w-full" />
                    </div>
                    <div>
                      <label className="block text-[12px] font-semibold text-gray-700 mb-1">City</label>
                      <input type="text" required value={editForm.city} onChange={e => setEditForm(s => ({ ...s, city: e.target.value }))} className="w-full" />
                    </div>
                    <div>
                      <label className="block text-[12px] font-semibold text-gray-700 mb-1">State</label>
                      <input type="text" required value={editForm.state} onChange={e => setEditForm(s => ({ ...s, state: e.target.value }))} className="w-full" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[14px] font-bold text-gray-900 border-b pb-2">Professional</h4>
                  <div>
                    <label className="block text-[12px] font-semibold text-gray-700 mb-1">Skills (comma separated)</label>
                    <input type="text" value={editForm.skills} onChange={e => setEditForm(s => ({ ...s, skills: e.target.value }))} className="w-full" placeholder="e.g. React, Node.js, Design" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-gray-700 mb-1">Education</label>
                    <input type="text" value={editForm.education} onChange={e => setEditForm(s => ({ ...s, education: e.target.value }))} className="w-full" placeholder="Highest degree" />
                  </div>
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
              <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button form="editProfileForm" type="submit" icon={<Check className="w-4 h-4" />}>Save Changes</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
