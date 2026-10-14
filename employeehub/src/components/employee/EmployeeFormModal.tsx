import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { departments } from '@/data/mock-data';
import type { StoreEmployee } from '@/store/AppStore';

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee?: StoreEmployee | null;
  onSave: (data: Partial<StoreEmployee>) => void;
}

export function EmployeeFormModal({ isOpen, onClose, employee, onSave }: EmployeeFormModalProps) {
  const [formData, setFormData] = useState<Partial<StoreEmployee>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: departments[0].name,
    designation: '',
    joiningDate: new Date().toISOString().split('T')[0],
    employmentType: 'Full-time',
    workLocation: 'HQ',
    salary: 0,
    managerName: '',
    status: 'Active',
    gender: 'Other',
    dateOfBirth: '',
    address: '',
    city: '',
    state: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (employee) {
      setFormData(employee);
    } else {
      setFormData({
        firstName: '', lastName: '', email: '', phone: '',
        department: departments[0].name, designation: '',
        joiningDate: new Date().toISOString().split('T')[0],
        employmentType: 'Full-time', workLocation: 'HQ',
        salary: 0, managerName: '', status: 'Active',
        gender: 'Other', dateOfBirth: '', address: '', city: '', state: ''
      });
    }
    setErrors({});
  }, [employee, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName?.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName?.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone?.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone format';
    }
    if (!formData.designation?.trim()) newErrors.designation = 'Designation is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} title={employee ? "Edit Employee" : "Add Employee"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1">First Name *</label>
            <Input value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} className={errors.firstName ? 'border-danger-500' : ''} />
            {errors.firstName && <p className="text-danger-500 text-[11px] mt-1">{errors.firstName}</p>}
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1">Last Name *</label>
            <Input value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} className={errors.lastName ? 'border-danger-500' : ''} />
            {errors.lastName && <p className="text-danger-500 text-[11px] mt-1">{errors.lastName}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1">Email *</label>
            <Input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className={errors.email ? 'border-danger-500' : ''} />
            {errors.email && <p className="text-danger-500 text-[11px] mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1">Phone *</label>
            <Input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className={errors.phone ? 'border-danger-500' : ''} />
            {errors.phone && <p className="text-danger-500 text-[11px] mt-1">{errors.phone}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1">Department</label>
            <select className="w-full h-10 px-3 rounded-lg border border-gray-200 text-[13px]" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })}>
              {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1">Designation *</label>
            <Input value={formData.designation} onChange={e => setFormData({ ...formData, designation: e.target.value })} className={errors.designation ? 'border-danger-500' : ''} />
            {errors.designation && <p className="text-danger-500 text-[11px] mt-1">{errors.designation}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1">Joining Date</label>
            <Input type="date" value={formData.joiningDate} onChange={e => setFormData({ ...formData, joiningDate: e.target.value })} />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1">Employment Type</label>
            <select className="w-full h-10 px-3 rounded-lg border border-gray-200 text-[13px]" value={formData.employmentType} onChange={e => setFormData({ ...formData, employmentType: e.target.value })}>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Intern</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1">Annual Salary (₹)</label>
            <Input type="number" value={formData.salary || ''} onChange={e => setFormData({ ...formData, salary: Number(e.target.value) || 0 })} />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1">Location</label>
            <Input value={formData.workLocation} onChange={e => setFormData({ ...formData, workLocation: e.target.value })} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1">Manager Name</label>
            <Input value={formData.managerName} onChange={e => setFormData({ ...formData, managerName: e.target.value })} />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1">Status</label>
            <select className="w-full h-10 px-3 rounded-lg border border-gray-200 text-[13px]" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as any })}>
              <option>Active</option>
              <option>On Leave</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit">{employee ? 'Save Changes' : 'Add Employee'}</Button>
        </div>
      </form>
    </Modal>
  );
}
