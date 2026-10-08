import { useState } from 'react';
import { Search, Mail, Building2, MapPin, X } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { useAppStore } from '@/store/AppStore';
import type { StoreEmployee } from '@/store/AppStore';

export function EmployeeDirectoryPage() {
  const { state } = useAppStore();
  const allEmployees = state.employees || [];

  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All Departments');
  const [locationFilter, setLocationFilter] = useState('All Locations');
  const [selectedEmployee, setSelectedEmployee] = useState<StoreEmployee | null>(null);

  const departments = ['All Departments', ...Array.from(new Set(allEmployees.map(e => e.department)))];
  const locations = ['All Locations', ...Array.from(new Set(allEmployees.map(e => e.workLocation)))];

  const filteredEmployees = allEmployees.filter(emp => {
    const matchesSearch = (emp.firstName + ' ' + emp.lastName).toLowerCase().includes(searchQuery.toLowerCase()) || 
                          emp.designation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = departmentFilter === 'All Departments' || emp.department === departmentFilter;
    const matchesLoc = locationFilter === 'All Locations' || emp.workLocation === locationFilter;
    return matchesSearch && matchesDept && matchesLoc;
  });

  return (
    <div className="max-w-[1200px] mx-auto animate-slide-up space-y-6">
      <PageHeader
        title="Employee Directory"
        subtitle="Find and connect, department, or delegation."
      />

      <Card padding="none" className="p-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Input 
            placeholder="Search by name or designation..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <select 
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="h-10 px-3 rounded-lg border border-gray-200 bg-white text-[13px] text-gray-700 w-full md:w-[200px]"
          >
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select 
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="h-10 px-3 rounded-lg border border-gray-200 bg-white text-[13px] text-gray-700 w-full md:w-[200px]"
          >
            {locations.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </Card>

      {filteredEmployees.length === 0 ? (
        <Card className="py-20 text-center">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No employees found</h3>
          <p className="text-gray-500">We couldn't find anyone matching your search criteria.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEmployees.map(emp => (
            <Card 
              key={emp.id} 
              className="flex flex-col items-center text-center cursor-pointer hover:border-brand-300 hover:shadow-md transition-all group"
              onClick={() => setSelectedEmployee(emp)}
            >
              <div className="mb-4">
                <Avatar name={`${emp.firstName} ${emp.lastName}`} size="xl" className="group-hover:scale-105 transition-transform" />
              </div>
              <h3 className="font-bold text-gray-900 text-[16px]">{emp.firstName} {emp.lastName}</h3>
              <p className="text-[13px] text-brand-600 font-medium mb-4">{emp.designation}</p>
              
              <div className="w-full space-y-2 text-left pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-[12px] text-gray-600">
                  <Building2 className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="truncate">{emp.department}</span>
                </div>
                <div className="flex items-center gap-2 text-[12px] text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="truncate">{emp.workLocation}</span>
                </div>
                <div className="flex items-center gap-2 text-[12px] text-gray-600">
                  <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="truncate">{emp.email}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Profile Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade">
          <Card className="w-full max-w-[500px] mx-4 p-0 overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-brand-600 to-brand-800 relative">
              <button 
                onClick={() => setSelectedEmployee(null)} 
                className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="px-6 pb-6 relative">
              <div className="absolute -top-12 border-4 border-white rounded-2xl overflow-hidden bg-white shadow-sm">
                <Avatar name={`${selectedEmployee.firstName} ${selectedEmployee.lastName}`} size="2xl" />
              </div>
              
              <div className="pt-16">
                <h2 className="text-[22px] font-bold text-gray-900">
                  {selectedEmployee.firstName} {selectedEmployee.lastName}
                </h2>
                <p className="text-[14px] text-brand-600 font-medium mb-6">
                  {selectedEmployee.designation}
                </p>
                
                <div className="space-y-4 text-[14px]">
                  <div className="grid grid-cols-[30px_1fr] items-center text-gray-600">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span><strong className="text-gray-900 font-medium">Department:</strong> {selectedEmployee.department}</span>
                  </div>
                  <div className="grid grid-cols-[30px_1fr] items-center text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span><strong className="text-gray-900 font-medium">Office:</strong> {selectedEmployee.workLocation}</span>
                  </div>
                  <div className="grid grid-cols-[30px_1fr] items-center text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <a href={`mailto:${selectedEmployee.email}`} className="text-brand-600 hover:underline">
                      {selectedEmployee.email}
                    </a>
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <a href={`mailto:${selectedEmployee.email}`} className="flex-1">
                    <Button className="w-full" icon={<Mail className="w-4 h-4" />}>
                      Send Email
                    </Button>
                  </a>
                  <Button variant="outline" className="flex-1" onClick={() => setSelectedEmployee(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
