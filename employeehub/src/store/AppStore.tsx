import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

/* ═══════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════ */
export interface StoreEmployee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  department: string;
  designation: string;
  managerId?: string;
  managerName: string;
  joiningDate: string;
  employmentType: string;
  workLocation: string;
  salary: number;
  status: string;
  skills?: string[];
  education?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedOn: string;
  reviewedBy?: string;
  reviewedOn?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  hours: string;
  status: string;
}

export interface AttendanceCorrection {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedOn: string;
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  date: string;
  createdBy: string;
}

export interface AppNotification {
  id: string;
  targetUserId: string; // 'all' | specific employee id
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'leave' | 'attendance' | 'announcement' | 'payroll' | 'general';
}

export interface LeaveBalance {
  employeeId: string;
  annual: { total: number; used: number };
  sick: { total: number; used: number };
  casual: { total: number; used: number };
}

export interface Payslip {
  id: string;
  employeeId: string;
  month: string;
  grossSalary: number;
  netSalary: number;
  status: 'Paid' | 'Pending';
}

export interface Goal {
  id: string;
  employeeId: string;
  title: string;
  progress: number;
  deadline: string;
  status: 'On Track' | 'Completed' | 'At Risk';
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  period: string;
  rating: string;
  status: 'Completed' | 'Pending';
}

export interface Asset {
  id: string;
  employeeId: string;
  name: string;
  type: string;
  assetId: string;
  condition: string;
  status: 'Assigned';
}

export interface AssetIssue {
  id: string;
  assetId: string;
  employeeId: string;
  issueType: string;
  description: string;
  status: 'Pending' | 'Resolved';
  reportedOn: string;
}

export interface EmployeeDocument {
  id: string;
  employeeId: string;
  name: string;
  category: 'Employment' | 'Payroll' | 'Tax' | 'Company' | 'Personal';
  uploadedOn: string;
  size: string;
  status: 'Verified' | 'Pending verification';
}

export interface GeneralRequest {
  id: string;
  employeeId: string;
  category: 'IT Support' | 'HR Query' | 'Facilities' | 'Other';
  subject: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Resolved' | 'Rejected' | 'Cancelled';
  submittedOn: string;
}

export interface AppState {
  employees: StoreEmployee[];
  leaveRequests: LeaveRequest[];
  attendance: AttendanceRecord[];
  attendanceCorrections: AttendanceCorrection[];
  announcements: Announcement[];
  notifications: AppNotification[];
  leaveBalances: LeaveBalance[];
  payslips: Payslip[];
  goals: Goal[];
  reviews: PerformanceReview[];
  assets: Asset[];
  assetIssues: AssetIssue[];
  documents: EmployeeDocument[];
  generalRequests: GeneralRequest[];
}

/* ═══════════════════════════════════════════════════════
   INITIAL DATA
   ═══════════════════════════════════════════════════════ */
const INITIAL_STATE: AppState = {
  employees: [
    {
      id: 'emp-1024',
      employeeId: 'EMP-1024',
      firstName: 'Rahul',
      lastName: 'Sharma',
      email: 'rahul.sharma@employeehub.in',
      phone: '9876543210',
      dateOfBirth: '1995-03-15',
      gender: 'Male',
      address: '42 Malviya Nagar',
      city: 'Jaipur',
      state: 'Rajasthan',
      department: 'Engineering',
      designation: 'Senior Developer',
      managerName: 'Ankit Verma',
      joiningDate: '2024-07-12',
      employmentType: 'Full-time',
      workLocation: 'Jaipur Office',
      salary: 780000,
      status: 'Active',
      skills: ['React', 'TypeScript', 'Node.js'],
      education: 'B.Tech in Computer Science, MNIT Jaipur (2013-2017)'
    },
    { id: 'emp-3', employeeId: 'EMP-1026', firstName: 'Aditi', lastName: 'Chauhan', email: 'aditi.chauhan@mnc.com', phone: '+91 98765 22222', designation: 'Brand Manager', department: 'Marketing', dateOfBirth: '1990-11-10', gender: 'Female', joiningDate: '2021-06-15', workLocation: 'Delhi Office', managerName: 'CMO', employmentType: 'Full-time', address: '78 Market Street', city: 'New Delhi', state: 'Delhi', salary: 950000, status: 'Active' },
    { id: 'emp-2', employeeId: 'EMP-1025', firstName: 'Ankit', lastName: 'Verma', email: 'ankit.verma@mnc.com', phone: '+91 98765 11111', designation: 'Engineering Manager', department: 'Engineering', dateOfBirth: '1988-08-20', gender: 'Male', joiningDate: '2020-03-01', workLocation: 'Jaipur Office', managerName: 'CTO', employmentType: 'Full-time', address: '45 IT City', city: 'Jaipur', state: 'Rajasthan', salary: 1200000, status: 'Active' },
    { id: 'emp-4', employeeId: 'EMP-1027', firstName: 'Neha', lastName: 'Singh', email: 'neha.singh@mnc.com', phone: '+91 98765 33333', designation: 'Product Manager', department: 'Product', dateOfBirth: '1991-02-25', gender: 'Female', joiningDate: '2022-01-10', workLocation: 'Bengaluru HQ', managerName: 'CPO', employmentType: 'Full-time', address: '12 Product Park', city: 'Bengaluru', state: 'Karnataka', salary: 1100000, status: 'Active' },
    { id: 'emp-5', employeeId: 'EMP-1028', firstName: 'Amit', lastName: 'Kumar', email: 'amit.kumar@mnc.com', phone: '+91 98765 44444', designation: 'HR Manager', department: 'Human Resources', dateOfBirth: '1987-09-05', gender: 'Male', joiningDate: '2019-11-20', workLocation: 'Noida Office', managerName: 'CHRO', employmentType: 'Full-time', address: '55 HR Avenue', city: 'Noida', state: 'UP', salary: 900000, status: 'Active' },
    { id: 'emp-6', employeeId: 'EMP-1029', firstName: 'Priya', lastName: 'Mehta', email: 'priya.mehta@mnc.com', phone: '+91 98765 55555', designation: 'Finance Manager', department: 'Finance', dateOfBirth: '1989-12-12', gender: 'Female', joiningDate: '2021-04-01', workLocation: 'Mumbai Office', managerName: 'CFO', employmentType: 'Full-time', address: '99 Finance Hub', city: 'Mumbai', state: 'Maharashtra', salary: 1050000, status: 'Active' },
    { id: 'emp-7', employeeId: 'EMP-1030', firstName: 'Sneha', lastName: 'Patel', email: 'sneha.patel@mnc.com', phone: '+91 98765 66666', designation: 'Operations Manager', department: 'Operations', dateOfBirth: '1993-07-22', gender: 'Female', joiningDate: '2023-02-15', workLocation: 'Pune Office', managerName: 'COO', employmentType: 'Full-time', address: '33 Ops Center', city: 'Pune', state: 'Maharashtra', salary: 850000, status: 'Active' },
    { id: 'emp-8', employeeId: 'EMP-1031', firstName: 'Karthik', lastName: 'Nair', email: 'karthik.nair@mnc.com', phone: '+91 98765 77777', designation: 'Sales Manager', department: 'Sales', dateOfBirth: '1986-04-30', gender: 'Male', joiningDate: '2018-10-10', workLocation: 'Hyderabad Office', managerName: 'CSO', employmentType: 'Full-time', address: '22 Sales Tower', city: 'Hyderabad', state: 'Telangana', salary: 1000000, status: 'Active' },
  ],
  leaveRequests: [
    { id: 'lv-1', employeeId: 'emp-1024', employeeName: 'Rahul Sharma', type: 'Annual Leave', startDate: '2026-09-20', endDate: '2026-09-20', days: 1, reason: 'Personal work', status: 'Approved', appliedOn: '2026-09-15', reviewedBy: 'Admin', reviewedOn: '2026-09-16' },
    { id: 'lv-2', employeeId: 'emp-1024', employeeName: 'Rahul Sharma', type: 'Sick Leave', startDate: '2026-08-10', endDate: '2026-08-11', days: 2, reason: 'Fever', status: 'Approved', appliedOn: '2026-08-10', reviewedBy: 'Admin', reviewedOn: '2026-08-10' },
    { id: 'lv-3', employeeId: 'emp-1024', employeeName: 'Rahul Sharma', type: 'Annual Leave', startDate: '2026-10-25', endDate: '2026-10-28', days: 4, reason: 'Diwali vacation', status: 'Pending', appliedOn: '2026-10-05' },
    { id: 'lv-4', employeeId: 'emp-1024', employeeName: 'Rahul Sharma', type: 'Casual Leave', startDate: '2026-11-05', endDate: '2026-11-05', days: 1, reason: 'Family event', status: 'Pending', appliedOn: '2026-10-07' },
    { id: 'lv-5', employeeId: 'emp-2', employeeName: 'Priya Sharma', type: 'Annual Leave', startDate: '2026-10-20', endDate: '2026-10-22', days: 3, reason: 'Wedding', status: 'Pending', appliedOn: '2026-10-06' },
  ],
  attendance: [
    { id: 'att-1', employeeId: 'emp-1024', date: '2026-10-08', checkIn: '09:02 AM', checkOut: null, hours: '—', status: 'Present' },
    { id: 'att-2', employeeId: 'emp-1024', date: '2026-10-07', checkIn: '09:15 AM', checkOut: '06:30 PM', hours: '9h 15m', status: 'Present' },
    { id: 'att-3', employeeId: 'emp-1024', date: '2026-10-04', checkIn: '09:05 AM', checkOut: '06:10 PM', hours: '9h 05m', status: 'Present' },
    { id: 'att-4', employeeId: 'emp-1024', date: '2026-10-03', checkIn: '09:45 AM', checkOut: '06:30 PM', hours: '8h 45m', status: 'Late' },
    { id: 'att-5', employeeId: 'emp-1024', date: '2026-10-02', checkIn: null, checkOut: null, hours: '—', status: 'Absent' },
    { id: 'att-6', employeeId: 'emp-1024', date: '2026-10-01', checkIn: '08:55 AM', checkOut: '06:15 PM', hours: '9h 20m', status: 'Present' },
  ],
  attendanceCorrections: [],
  announcements: [
    { id: 'ann-1', title: 'Diwali Office Closure', description: 'Office closed Oct 31–Nov 3 for Diwali.', priority: 'High', date: '2026-10-01', createdBy: 'Admin' },
    { id: 'ann-2', title: 'Annual Performance Review', description: 'Q3 review cycle starts Nov 15. Managers submit by Nov 30.', priority: 'High', date: '2026-10-05', createdBy: 'Admin' },
    { id: 'ann-3', title: 'New Health Insurance', description: 'Upgraded health insurance coverage. Review on HR portal.', priority: 'Medium', date: '2026-09-25', createdBy: 'Admin' },
    { id: 'ann-4', title: 'Engineering Hackathon', description: 'Teams of 3-5. Prize pool ₹5L. Theme: AI for Good.', priority: 'Low', date: '2026-10-07', createdBy: 'Admin' },
  ],
  notifications: [
    { id: 'notif-1', targetUserId: 'emp-1024', title: 'Leave Approved', message: 'Your annual leave on Sep 20 was approved.', time: '2026-10-08T09:00:00', read: false, type: 'leave' },
    { id: 'notif-2', targetUserId: 'emp-1024', title: 'Payslip Available', message: 'September 2026 payslip is ready.', time: '2026-10-07T10:00:00', read: false, type: 'payroll' },
    { id: 'notif-3', targetUserId: 'all', title: 'Diwali Office Closure', message: 'Office closed Oct 31–Nov 3.', time: '2026-10-01T08:00:00', read: true, type: 'announcement' },
    { id: 'notif-4', targetUserId: 'emp-1024', title: 'Attendance Corrected', message: 'Your attendance correction for Oct 5 was approved.', time: '2026-10-08T11:30:00', read: false, type: 'attendance' },
  ],
  leaveBalances: [
    { employeeId: 'emp-1024', annual: { total: 14, used: 3 }, sick: { total: 8, used: 2 }, casual: { total: 5, used: 1 } },
    { employeeId: 'emp-2', annual: { total: 14, used: 5 }, sick: { total: 8, used: 1 }, casual: { total: 5, used: 2 } },
  ],
  payslips: [
    { id: 'ps-1', employeeId: 'emp-1024', month: 'September 2026', grossSalary: 65000, netSalary: 58450, status: 'Paid' },
    { id: 'ps-2', employeeId: 'emp-1024', month: 'August 2026', grossSalary: 65000, netSalary: 58450, status: 'Paid' },
    { id: 'ps-3', employeeId: 'emp-1024', month: 'July 2026', grossSalary: 65000, netSalary: 58450, status: 'Paid' },
  ],
  goals: [
    { id: 'g-1', employeeId: 'emp-1024', title: 'Launch Employee Portal MVP', progress: 100, deadline: '2026-10-01', status: 'Completed' },
    { id: 'g-2', employeeId: 'emp-1024', title: 'Optimize Database Queries', progress: 85, deadline: '2026-10-15', status: 'On Track' },
    { id: 'g-3', employeeId: 'emp-1024', title: 'Write API Documentation', progress: 40, deadline: '2026-10-30', status: 'At Risk' },
    { id: 'g-4', employeeId: 'emp-1024', title: 'Mentorship Program setup', progress: 100, deadline: '2026-09-15', status: 'Completed' },
    { id: 'g-5', employeeId: 'emp-1024', title: 'Migrate to React 19', progress: 100, deadline: '2026-08-30', status: 'Completed' },
  ],
  reviews: [
    { id: 'rev-1', employeeId: 'emp-1024', period: 'Q3 2026', rating: 'Excellent', status: 'Completed' },
    { id: 'rev-2', employeeId: 'emp-1024', period: 'Q2 2026', rating: 'Good', status: 'Completed' },
  ],
  assets: [
    { id: 'ast-1', employeeId: 'emp-1024', name: 'Dell XPS 15 Laptop', type: 'Laptop', assetId: 'LPT-2024-001', condition: 'Good', status: 'Assigned' },
    { id: 'ast-2', employeeId: 'emp-1024', name: 'Dell 24" Monitor', type: 'Monitor', assetId: 'MON-2024-042', condition: 'Good', status: 'Assigned' },
    { id: 'ast-3', employeeId: 'emp-1024', name: 'iPhone 15', type: 'Mobile', assetId: 'MOB-2024-015', condition: 'Excellent', status: 'Assigned' },
    { id: 'ast-4', employeeId: 'emp-1024', name: 'Logitech Keyboard', type: 'Accessory', assetId: 'ACC-2024-101', condition: 'Good', status: 'Assigned' },
    { id: 'ast-5', employeeId: 'emp-1024', name: 'Logitech Mouse', type: 'Accessory', assetId: 'ACC-2024-102', condition: 'Fair', status: 'Assigned' },
    { id: 'ast-6', employeeId: 'emp-1024', name: 'ID Card', type: 'Identification', assetId: 'IDC-1024', condition: 'Good', status: 'Assigned' },
  ],
  assetIssues: [],
  documents: [
    { id: 'doc-1', employeeId: 'emp-1024', name: 'Offer Letter', category: 'Employment', uploadedOn: '2024-07-01', size: '245 KB', status: 'Verified' },
    { id: 'doc-2', employeeId: 'emp-1024', name: 'Employment Contract', category: 'Employment', uploadedOn: '2024-07-12', size: '1.2 MB', status: 'Verified' },
    { id: 'doc-3', employeeId: 'emp-1024', name: 'PAN Card', category: 'Personal', uploadedOn: '2024-07-12', size: '450 KB', status: 'Verified' },
    { id: 'doc-4', employeeId: 'emp-1024', name: 'Aadhaar Card', category: 'Personal', uploadedOn: '2024-07-12', size: '800 KB', status: 'Verified' },
    { id: 'doc-5', employeeId: 'emp-1024', name: 'Salary Slip Oct 2026', category: 'Payroll', uploadedOn: '2026-10-31', size: '150 KB', status: 'Verified' },
    { id: 'doc-6', employeeId: 'emp-1024', name: 'Form 16 2025', category: 'Tax', uploadedOn: '2026-05-15', size: '2.1 MB', status: 'Verified' },
    { id: 'doc-7', employeeId: 'emp-1024', name: 'Company Policy', category: 'Company', uploadedOn: '2025-01-01', size: '3.4 MB', status: 'Verified' },
    { id: 'doc-8', employeeId: 'emp-1024', name: 'Experience Certificate', category: 'Employment', uploadedOn: '2024-07-10', size: '500 KB', status: 'Verified' },
  ],
  generalRequests: [
    { id: 'req-1', employeeId: 'emp-1024', category: 'IT Support', subject: 'VPN Access Issue', description: 'Cannot connect to company VPN from home network.', priority: 'Medium', status: 'Resolved', submittedOn: '2026-09-01' },
    { id: 'req-2', employeeId: 'emp-1024', category: 'HR Query', subject: 'Tax Declaration Form', description: 'Need clarification on section 80C limits.', priority: 'Low', status: 'Pending', submittedOn: '2026-10-06' }
  ]
};

/* ═══════════════════════════════════════════════════════
   CONTEXT
   ═══════════════════════════════════════════════════════ */
interface AppStoreContextType {
  state: AppState;
  // Leave actions
  submitLeave: (req: Omit<LeaveRequest, 'id' | 'status' | 'appliedOn'>) => void;
  approveLeave: (id: string, reviewerName: string) => void;
  rejectLeave: (id: string, reviewerName: string) => void;
  // Employee actions
  updateEmployee: (id: string, updates: Partial<StoreEmployee>) => void;
  // Attendance actions
  checkIn: (employeeId: string) => void;
  checkOut: (employeeId: string) => void;
  requestAttendanceCorrection: (req: Omit<AttendanceCorrection, 'id' | 'status' | 'appliedOn'>) => void;
  // Assets & Documents
  reportAssetIssue: (req: Omit<AssetIssue, 'id' | 'status' | 'reportedOn'>) => void;
  uploadDocument: (doc: Omit<EmployeeDocument, 'id' | 'uploadedOn' | 'status'>) => void;
  // General Requests
  submitGeneralRequest: (req: Omit<GeneralRequest, 'id' | 'status' | 'submittedOn'>) => void;
  cancelRequest: (type: 'leave' | 'attendance' | 'asset' | 'general', id: string) => void;
  // Announcement actions
  addAnnouncement: (ann: Omit<Announcement, 'id'>) => void;
  // Notification actions
  addNotification: (notif: Omit<AppNotification, 'id'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (userId: string) => void;
  // Getters
  getEmployee: (id: string) => StoreEmployee | undefined;
  getLeavesByEmployee: (employeeId: string) => LeaveRequest[];
  getPendingLeaves: () => LeaveRequest[];
  getAttendanceByEmployee: (employeeId: string) => AttendanceRecord[];
  getPayslipsByEmployee: (employeeId: string) => Payslip[];
  getGoalsByEmployee: (employeeId: string) => Goal[];
  getReviewsByEmployee: (employeeId: string) => PerformanceReview[];
  getAssetsByEmployee: (employeeId: string) => Asset[];
  getDocumentsByEmployee: (employeeId: string) => EmployeeDocument[];
  getGeneralRequestsByEmployee: (employeeId: string) => GeneralRequest[];
  getAssetIssuesByEmployee: (employeeId: string) => AssetIssue[];
  getAttendanceCorrectionsByEmployee: (employeeId: string) => AttendanceCorrection[];
  getNotificationsForUser: (userId: string) => AppNotification[];
  getUnreadCount: (userId: string) => number;
  getLeaveBalance: (employeeId: string) => LeaveBalance | undefined;
}

const AppStoreContext = createContext<AppStoreContextType | null>(null);

const STORAGE_KEY = 'ehub_store_v2';

function loadState(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...INITIAL_STATE, ...parsed };
    }
  } catch { /* ignore */ }
  return INITIAL_STATE;
}

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadState);

  // Persist on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const now = () => new Date().toISOString();

  // ── Employee ──
  const updateEmployee = useCallback((id: string, updates: Partial<StoreEmployee>) => {
    setState(s => ({
      ...s,
      employees: s.employees.map(e => e.id === id ? { ...e, ...updates } : e)
    }));
  }, []);

  // ── Leave ──
  const submitLeave = useCallback((req: Omit<LeaveRequest, 'id' | 'status' | 'appliedOn'>) => {
    const newReq: LeaveRequest = { ...req, id: `lv-${genId()}`, status: 'Pending', appliedOn: new Date().toISOString().split('T')[0] };
    const newNotif: AppNotification = {
      id: `notif-${genId()}`, targetUserId: 'admin', title: 'New Leave Request',
      message: `${req.employeeName} applied for ${req.type} (${req.days} day${req.days > 1 ? 's' : ''})`,
      time: now(), read: false, type: 'leave',
    };
    setState(s => ({ ...s, leaveRequests: [newReq, ...s.leaveRequests], notifications: [newNotif, ...s.notifications] }));
  }, []);

  const approveLeave = useCallback((id: string, reviewerName: string) => {
    setState(s => {
      const req = s.leaveRequests.find(l => l.id === id);
      if (!req) return s;
      const updated = s.leaveRequests.map(l => l.id === id ? { ...l, status: 'Approved' as const, reviewedBy: reviewerName, reviewedOn: new Date().toISOString().split('T')[0] } : l);
      // Update leave balance
      const typeKey = req.type.toLowerCase().includes('annual') ? 'annual' : req.type.toLowerCase().includes('sick') ? 'sick' : 'casual';
      const balances = s.leaveBalances.map(b => {
        if (b.employeeId !== req.employeeId) return b;
        return { ...b, [typeKey]: { ...b[typeKey], used: b[typeKey].used + req.days } };
      });
      const notif: AppNotification = {
        id: `notif-${genId()}`, targetUserId: req.employeeId, title: 'Leave Approved',
        message: `Your ${req.type} from ${req.startDate} to ${req.endDate} has been approved by ${reviewerName}.`,
        time: now(), read: false, type: 'leave',
      };
      return { ...s, leaveRequests: updated, leaveBalances: balances, notifications: [notif, ...s.notifications] };
    });
  }, []);

  const rejectLeave = useCallback((id: string, reviewerName: string) => {
    setState(s => {
      const req = s.leaveRequests.find(l => l.id === id);
      if (!req) return s;
      const updated = s.leaveRequests.map(l => l.id === id ? { ...l, status: 'Rejected' as const, reviewedBy: reviewerName, reviewedOn: new Date().toISOString().split('T')[0] } : l);
      const notif: AppNotification = {
        id: `notif-${genId()}`, targetUserId: req.employeeId, title: 'Leave Rejected',
        message: `Your ${req.type} from ${req.startDate} to ${req.endDate} has been rejected by ${reviewerName}.`,
        time: now(), read: false, type: 'leave',
      };
      return { ...s, leaveRequests: updated, notifications: [notif, ...s.notifications] };
    });
  }, []);

  // ── Attendance ──
  const checkIn = useCallback((employeeId: string) => {
    const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    const date = new Date().toISOString().split('T')[0];
    const rec: AttendanceRecord = { id: `att-${genId()}`, employeeId, date, checkIn: time, checkOut: null, hours: '—', status: 'Present' };
    setState(s => ({ ...s, attendance: [rec, ...s.attendance.filter(a => !(a.employeeId === employeeId && a.date === date))] }));
  }, []);

  const checkOut = useCallback((employeeId: string) => {
    const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    const date = new Date().toISOString().split('T')[0];
    setState(s => ({
      ...s,
      attendance: s.attendance.map(a => {
        if (a.employeeId === employeeId && a.date === date && a.checkIn && !a.checkOut) {
          return { ...a, checkOut: time, hours: calcHours(a.checkIn, time) };
        }
        return a;
      })
    }));
  }, []);

  const requestAttendanceCorrection = useCallback((req: Omit<AttendanceCorrection, 'id' | 'status' | 'appliedOn'>) => {
    const newReq: AttendanceCorrection = { ...req, id: `corr-${genId()}`, status: 'Pending', appliedOn: new Date().toISOString().split('T')[0] };
    const newNotif: AppNotification = {
      id: `notif-${genId()}`, targetUserId: 'admin', title: 'New Attendance Correction',
      message: `${req.employeeName} requested correction for ${req.date}`,
      time: now(), read: false, type: 'attendance',
    };
    setState(s => ({ ...s, attendanceCorrections: [newReq, ...s.attendanceCorrections], notifications: [newNotif, ...s.notifications] }));
  }, []);

  // ── Assets & Documents ──
  const reportAssetIssue = useCallback((req: Omit<AssetIssue, 'id' | 'status' | 'reportedOn'>) => {
    const newReq: AssetIssue = { ...req, id: `iss-${genId()}`, status: 'Pending', reportedOn: new Date().toISOString().split('T')[0] };
    const newNotif: AppNotification = {
      id: `notif-${genId()}`, targetUserId: 'admin', title: 'New Asset Issue Reported',
      message: `Employee ${req.employeeId} reported an issue with asset ${req.assetId}`,
      time: now(), read: false, type: 'attendance', // reusing attendance icon/type for now
    };
    setState(s => ({ ...s, assetIssues: [newReq, ...s.assetIssues], notifications: [newNotif, ...s.notifications] }));
  }, []);

  const uploadDocument = useCallback((doc: Omit<EmployeeDocument, 'id' | 'uploadedOn' | 'status'>) => {
    const newDoc: EmployeeDocument = { ...doc, id: `doc-${genId()}`, uploadedOn: new Date().toISOString().split('T')[0], status: 'Pending verification' };
    const newNotif: AppNotification = {
      id: `notif-${genId()}`, targetUserId: 'admin', title: 'New Document Uploaded',
      message: `Employee ${doc.employeeId} uploaded a new document for verification`,
      time: now(), read: false, type: 'leave', // reusing leave icon/type for now
    };
    setState(s => ({ ...s, documents: [newDoc, ...s.documents], notifications: [newNotif, ...s.notifications] }));
  }, []);

  // ── General Requests & Cancellation ──
  const submitGeneralRequest = useCallback((req: Omit<GeneralRequest, 'id' | 'status' | 'submittedOn'>) => {
    const newReq: GeneralRequest = { ...req, id: `req-${genId()}`, status: 'Pending', submittedOn: new Date().toISOString().split('T')[0] };
    const newNotif: AppNotification = {
      id: `notif-${genId()}`, targetUserId: 'admin', title: 'New Request Submitted',
      message: `Employee ${req.employeeId} submitted a new ${req.category} request`,
      time: now(), read: false, type: 'announcement',
    };
    setState(s => ({ ...s, generalRequests: [newReq, ...(s.generalRequests || [])], notifications: [newNotif, ...s.notifications] }));
  }, []);

  const cancelRequest = useCallback((type: 'leave' | 'attendance' | 'asset' | 'general', id: string) => {
    setState(s => {
      if (type === 'leave') return { ...s, leaveRequests: s.leaveRequests.map(r => r.id === id ? { ...r, status: 'Cancelled' as any } : r) };
      if (type === 'attendance') return { ...s, attendanceCorrections: s.attendanceCorrections.map(r => r.id === id ? { ...r, status: 'Cancelled' as any } : r) };
      if (type === 'asset') return { ...s, assetIssues: s.assetIssues.map(r => r.id === id ? { ...r, status: 'Cancelled' as any } : r) };
      if (type === 'general') return { ...s, generalRequests: s.generalRequests.map(r => r.id === id ? { ...r, status: 'Cancelled' as any } : r) };
      return s;
    });
  }, []);

  // ── Announcements ──
  const addAnnouncement = useCallback((ann: Omit<Announcement, 'id'>) => {
    const newAnn: Announcement = { ...ann, id: `ann-${genId()}` };
    const notif: AppNotification = {
      id: `notif-${genId()}`, targetUserId: 'all', title: ann.title,
      message: ann.description, time: now(), read: false, type: 'announcement',
    };
    setState(s => ({ ...s, announcements: [newAnn, ...s.announcements], notifications: [notif, ...s.notifications] }));
  }, []);

  // ── Notifications ──
  const addNotification = useCallback((notif: Omit<AppNotification, 'id'>) => {
    setState(s => ({ ...s, notifications: [{ ...notif, id: `notif-${genId()}` }, ...s.notifications] }));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setState(s => ({ ...s, notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n) }));
  }, []);

  const markAllNotificationsRead = useCallback((userId: string) => {
    setState(s => ({
      ...s,
      notifications: s.notifications.map(n => 
        (n.targetUserId === userId || n.targetUserId === 'all') ? { ...n, read: true } : n
      )
    }));
  }, []);

  // ── Getters ──
  const getEmployee = useCallback((id: string) => (state.employees || []).find(e => e.id === id), [state.employees]);
  const getLeavesByEmployee = useCallback((employeeId: string) => (state.leaveRequests || []).filter(l => l.employeeId === employeeId), [state.leaveRequests]);
  const getPendingLeaves = useCallback(() => (state.leaveRequests || []).filter(l => l.status === 'Pending'), [state.leaveRequests]);
  const getAttendanceByEmployee = useCallback((employeeId: string) => (state.attendance || []).filter(a => a.employeeId === employeeId), [state.attendance]);
  const getPayslipsByEmployee = useCallback((employeeId: string) => (state.payslips || []).filter(p => p.employeeId === employeeId), [state.payslips]);
  const getGoalsByEmployee = useCallback((employeeId: string) => (state.goals || []).filter(g => g.employeeId === employeeId), [state.goals]);
  const getReviewsByEmployee = useCallback((employeeId: string) => (state.reviews || []).filter(r => r.employeeId === employeeId), [state.reviews]);
  const getAssetsByEmployee = useCallback((employeeId: string) => (state.assets || []).filter(a => a.employeeId === employeeId), [state.assets]);
  const getDocumentsByEmployee = useCallback((employeeId: string) => (state.documents || []).filter(d => d.employeeId === employeeId), [state.documents]);
  const getGeneralRequestsByEmployee = useCallback((employeeId: string) => (state.generalRequests || []).filter(r => r.employeeId === employeeId), [state.generalRequests]);
  const getAssetIssuesByEmployee = useCallback((employeeId: string) => (state.assetIssues || []).filter(i => i.employeeId === employeeId), [state.assetIssues]);
  const getAttendanceCorrectionsByEmployee = useCallback((employeeId: string) => (state.attendanceCorrections || []).filter(c => c.employeeId === employeeId), [state.attendanceCorrections]);
  const getNotificationsForUser = useCallback((userId: string) => (state.notifications || []).filter(n => n.targetUserId === userId || n.targetUserId === 'all' || (userId !== 'employee' && n.targetUserId === 'admin')), [state.notifications]);
  const getUnreadCount = useCallback((userId: string) => {
    return (state.notifications || []).filter(n => !n.read && (n.targetUserId === userId || n.targetUserId === 'all' || (userId !== 'employee' && n.targetUserId === 'admin'))).length;
  }, [state.notifications]);
  const getLeaveBalance = useCallback((employeeId: string) => (state.leaveBalances || []).find(b => b.employeeId === employeeId), [state.leaveBalances]);

  return (
    <AppStoreContext.Provider value={{
      state, updateEmployee, submitLeave, approveLeave, rejectLeave,
      checkIn, checkOut, requestAttendanceCorrection, reportAssetIssue, uploadDocument,
      submitGeneralRequest, cancelRequest,
      addAnnouncement, addNotification, markNotificationRead, markAllNotificationsRead,
      getEmployee, getLeavesByEmployee, getPendingLeaves, getAttendanceByEmployee,
      getPayslipsByEmployee, getGoalsByEmployee, getReviewsByEmployee,
      getAssetsByEmployee, getDocumentsByEmployee,
      getGeneralRequestsByEmployee, getAssetIssuesByEmployee, getAttendanceCorrectionsByEmployee,
      getNotificationsForUser, getUnreadCount, getLeaveBalance,
    }}>
      {children}
    </AppStoreContext.Provider>
  );
}

export function useAppStore() {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error('useAppStore must be used within AppStoreProvider');
  return ctx;
}

// Helper
function calcHours(checkIn: string, checkOut: string): string {
  try {
    const parse = (t: string) => {
      const [time, period] = t.split(' ');
      let [h, m] = time.split(':').map(Number);
      if (period?.toUpperCase() === 'PM' && h < 12) h += 12;
      if (period?.toUpperCase() === 'AM' && h === 12) h = 0;
      return h * 60 + m;
    };
    const diff = parse(checkOut) - parse(checkIn);
    if (diff <= 0) return '—';
    return `${Math.floor(diff / 60)}h ${(diff % 60).toString().padStart(2, '0')}m`;
  } catch { return '—'; }
}
