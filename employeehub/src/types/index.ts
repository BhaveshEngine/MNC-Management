// ── User Roles ──
export type UserRole = 'super_admin' | 'hr_admin' | 'hr_manager' | 'dept_manager' | 'finance' | 'employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  departmentId?: string;
}

// ── Employee ──
export type EmployeeStatus = 'Active' | 'On Leave' | 'Probation' | 'Resigned' | 'Terminated';

export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  address: string;
  city: string;
  state: string;
  departmentId: string;
  designation: string;
  managerId?: string;
  joiningDate: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Intern';
  workLocation: string;
  salary: number;
  status: EmployeeStatus;
  avatar?: string;
}

// ── Department ──
export interface Department {
  id: string;
  name: string;
  headId?: string;
  description: string;
  budget: number;
  employeeCount: number;
}

// ── Attendance ──
export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Half Day' | 'On Leave' | 'WFH';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  status: AttendanceStatus;
  checkIn?: string;
  checkOut?: string;
  workingHours?: number;
  overtime?: number;
  notes?: string;
}

// ── Leave ──
export type LeaveType = 'Casual Leave' | 'Sick Leave' | 'Earned Leave' | 'Emergency Leave' | 'Maternity' | 'Paternity' | 'WFH';
export type LeaveStatus = 'Approved' | 'Pending' | 'Rejected';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  approvedBy?: string;
  appliedOn: string;
}

export interface LeaveBalance {
  employeeId: string;
  casual: number;
  sick: number;
  earned: number;
  emergency: number;
}

// ── Payroll ──
export interface PayrollRecord {
  id: string;
  employeeId: string;
  month: string;
  year: number;
  basicSalary: number;
  hra: number;
  allowances: number;
  bonus: number;
  overtime: number;
  grossSalary: number;
  pf: number;
  tax: number;
  otherDeductions: number;
  totalDeductions: number;
  netSalary: number;
  status: 'Processed' | 'Pending' | 'On Hold';
  paidOn?: string;
}

// ── Performance ──
export interface PerformanceReview {
  id: string;
  employeeId: string;
  reviewerId: string;
  period: string;
  overallRating: number;
  goals: { title: string; status: 'Completed' | 'In Progress' | 'Not Started'; weight: number }[];
  strengths: string;
  improvements: string;
  comments: string;
  reviewDate: string;
}

// ── Asset ──
export type AssetStatus = 'Available' | 'Assigned' | 'Maintenance' | 'Returned' | 'Lost';

export interface Asset {
  id: string;
  assetId: string;
  type: 'Laptop' | 'Monitor' | 'Keyboard' | 'Mouse' | 'Phone' | 'ID Card' | 'Software License';
  brand: string;
  model: string;
  serialNumber: string;
  assignedTo?: string;
  assignedDate?: string;
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  warranty: string;
  status: AssetStatus;
}

// ── Announcement ──
export interface Announcement {
  id: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  audience: 'All' | 'Department' | 'Individual';
  publishDate: string;
  expiryDate?: string;
  createdBy: string;
}

// ── Audit Log ──
export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  module: string;
  details: string;
  oldValue?: string;
  newValue?: string;
  timestamp: string;
  ipAddress: string;
}

// ── Navigation ──
export interface NavItem {
  label: string;
  icon: string;
  path: string;
  badge?: string | number;
  children?: NavItem[];
  roles?: UserRole[];
}

export interface NavSection {
  title: string;
  items: NavItem[];
}
