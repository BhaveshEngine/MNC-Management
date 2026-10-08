// ── Employee Self-Service Portal Mock Data ──

export const currentEmployee = {
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
  departmentId: 'dept-1',
  department: 'Engineering',
  designation: 'Software Engineer',
  managerId: 'emp-mgr-1',
  managerName: 'Ankit Verma',
  joiningDate: '2024-07-12',
  employmentType: 'Full-time' as const,
  workLocation: 'Jaipur Office',
  salary: 780000,
  monthlySalary: 65000,
  status: 'Active' as const,
  avatar: '',
};

// ── Attendance ──
export const empAttendanceSummary = {
  present: 22,
  absent: 1,
  late: 2,
  wfh: 0,
  workingHours: '164h 30m',
  month: 'October 2026',
};

export const empTodayAttendance = {
  status: 'Present' as const,
  checkIn: '09:02 AM',
  checkOut: null as string | null,
  workingHours: '7h 22m',
  location: 'Jaipur Office',
};

export const empAttendanceHistory = [
  { date: '2026-10-08', day: 'Tue', checkIn: '09:02 AM', checkOut: '—', hours: '7h 22m', status: 'Present' },
  { date: '2026-10-07', day: 'Mon', checkIn: '09:15 AM', checkOut: '06:30 PM', hours: '9h 15m', status: 'Present' },
  { date: '2026-10-06', day: 'Sun', checkIn: '—', checkOut: '—', hours: '—', status: 'Weekend' },
  { date: '2026-10-05', day: 'Sat', checkIn: '—', checkOut: '—', hours: '—', status: 'Weekend' },
  { date: '2026-10-04', day: 'Fri', checkIn: '09:05 AM', checkOut: '06:10 PM', hours: '9h 05m', status: 'Present' },
  { date: '2026-10-03', day: 'Thu', checkIn: '09:45 AM', checkOut: '06:30 PM', hours: '8h 45m', status: 'Late' },
  { date: '2026-10-02', day: 'Wed', checkIn: '—', checkOut: '—', hours: '—', status: 'Absent' },
  { date: '2026-10-01', day: 'Tue', checkIn: '08:55 AM', checkOut: '06:15 PM', hours: '9h 20m', status: 'Present' },
  { date: '2026-09-30', day: 'Mon', checkIn: '09:10 AM', checkOut: '06:20 PM', hours: '9h 10m', status: 'Present' },
  { date: '2026-09-29', day: 'Sun', checkIn: '—', checkOut: '—', hours: '—', status: 'Weekend' },
  { date: '2026-09-28', day: 'Sat', checkIn: '—', checkOut: '—', hours: '—', status: 'Weekend' },
  { date: '2026-09-27', day: 'Fri', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: '9h 00m', status: 'Present' },
  { date: '2026-09-26', day: 'Thu', checkIn: '09:30 AM', checkOut: '06:45 PM', hours: '9h 15m', status: 'Late' },
  { date: '2026-09-25', day: 'Wed', checkIn: '08:50 AM', checkOut: '06:10 PM', hours: '9h 20m', status: 'Present' },
  { date: '2026-09-24', day: 'Tue', checkIn: '09:05 AM', checkOut: '06:30 PM', hours: '9h 25m', status: 'Present' },
  { date: '2026-09-23', day: 'Mon', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: '9h 00m', status: 'Present' },
  { date: '2026-09-22', day: 'Sun', checkIn: '—', checkOut: '—', hours: '—', status: 'Weekend' },
  { date: '2026-09-21', day: 'Sat', checkIn: '—', checkOut: '—', hours: '—', status: 'Weekend' },
  { date: '2026-09-20', day: 'Fri', checkIn: '—', checkOut: '—', hours: '—', status: 'Leave' },
  { date: '2026-09-19', day: 'Thu', checkIn: '09:00 AM', checkOut: '06:15 PM', hours: '9h 15m', status: 'Present' },
  { date: '2026-09-18', day: 'Wed', checkIn: '09:10 AM', checkOut: '06:20 PM', hours: '9h 10m', status: 'Present' },
  { date: '2026-09-17', day: 'Tue', checkIn: '08:55 AM', checkOut: '06:05 PM', hours: '9h 10m', status: 'Present' },
];

// ── Leave ──
export const empLeaveBalances = [
  { type: 'Annual Leave', total: 14, used: 2, remaining: 12, color: '#2563EB' },
  { type: 'Sick Leave', total: 8, used: 2, remaining: 6, color: '#EF4444' },
  { type: 'Casual Leave', total: 5, used: 1, remaining: 4, color: '#F59E0B' },
];

export const empLeaveRequests = [
  { id: 'lv-1', type: 'Annual Leave', startDate: '2026-09-20', endDate: '2026-09-20', days: 1, reason: 'Personal work', status: 'Approved' as const, appliedOn: '2026-09-15' },
  { id: 'lv-2', type: 'Sick Leave', startDate: '2026-08-10', endDate: '2026-08-11', days: 2, reason: 'Fever', status: 'Approved' as const, appliedOn: '2026-08-10' },
  { id: 'lv-3', type: 'Annual Leave', startDate: '2026-10-25', endDate: '2026-10-28', days: 4, reason: 'Diwali vacation', status: 'Pending' as const, appliedOn: '2026-10-05' },
  { id: 'lv-4', type: 'Casual Leave', startDate: '2026-11-05', endDate: '2026-11-05', days: 1, reason: 'Family event', status: 'Pending' as const, appliedOn: '2026-10-07' },
];

// ── Payroll ──
export const empSalaryBreakdown = {
  gross: 65000,
  basic: 32500,
  hra: 13000,
  specialAllowance: 7800,
  otherAllowances: 6500,
  pfEmployee: 1950,
  professionalTax: 200,
  incomeTax: 2100,
  totalDeductions: 4250,
  net: 58450,  // updated to match: 65000 - (1950 + 200 + 2100) = 60750... but user says 58450
};

export const empPayslips = [
  { month: 'October 2026', gross: 65000, deductions: 6550, net: 58450, status: 'Upcoming' },
  { month: 'September 2026', gross: 65000, deductions: 6550, net: 58450, status: 'Paid' },
  { month: 'August 2026', gross: 65000, deductions: 6550, net: 58450, status: 'Paid' },
  { month: 'July 2026', gross: 65000, deductions: 6550, net: 58450, status: 'Paid' },
  { month: 'June 2026', gross: 65000, deductions: 6550, net: 58450, status: 'Paid' },
  { month: 'May 2026', gross: 65000, deductions: 6550, net: 58450, status: 'Paid' },
];

// ── Performance ──
export const empPerformance = {
  score: 92,
  rating: 'Excellent',
  goalsCompleted: 4,
  goalsTotal: 5,
  managerRating: 4.6,
  cycle: '2026',
};

export const empGoals = [
  { id: 'g1', title: 'Complete React Migration', progress: 100, deadline: '2026-09-30', status: 'Completed' },
  { id: 'g2', title: 'Improve API Response Time', progress: 85, deadline: '2026-10-31', status: 'On Track' },
  { id: 'g3', title: 'Implement CI/CD Pipeline', progress: 100, deadline: '2026-08-31', status: 'Completed' },
  { id: 'g4', title: 'Write Unit Tests (80% Coverage)', progress: 60, deadline: '2026-11-30', status: 'At Risk' },
  { id: 'g5', title: 'Mentor Junior Developers', progress: 100, deadline: '2026-12-31', status: 'Completed' },
];

export const empReviews = [
  { period: 'H1 2026 (Jan–Jun)', rating: '4.5/5', reviewer: 'Ankit Verma', status: 'Completed', date: '2026-07-15' },
  { period: 'H2 2025 (Jul–Dec)', rating: '4.3/5', reviewer: 'Ankit Verma', status: 'Completed', date: '2026-01-10' },
];

// ── Assets ──
export const empAssets = [
  { id: 'AST-101', name: 'Dell XPS 15', type: 'Laptop', condition: 'Excellent', assignedDate: '2024-07-15', status: 'Assigned' },
  { id: 'AST-205', name: 'Dell 24" Monitor', type: 'Monitor', condition: 'Good', assignedDate: '2024-07-15', status: 'Assigned' },
  { id: 'AST-310', name: 'iPhone 15', type: 'Phone', condition: 'Excellent', assignedDate: '2024-08-01', status: 'Assigned' },
  { id: 'AST-415', name: 'Logitech Keyboard', type: 'Keyboard', condition: 'Good', assignedDate: '2024-07-15', status: 'Assigned' },
  { id: 'AST-420', name: 'Logitech Mouse', type: 'Mouse', condition: 'Good', assignedDate: '2024-07-15', status: 'Assigned' },
  { id: 'AST-500', name: 'Employee ID Card', type: 'ID Card', condition: 'Good', assignedDate: '2024-07-12', status: 'Assigned' },
];

// ── Documents ──
export const empDocuments = [
  { id: 'd1', name: 'Offer Letter', type: 'Employment', uploadedOn: '2024-07-10', size: '245 KB' },
  { id: 'd2', name: 'Employment Contract', type: 'Employment', uploadedOn: '2024-07-12', size: '520 KB' },
  { id: 'd3', name: 'PAN Card', type: 'Tax', uploadedOn: '2024-07-10', size: '890 KB' },
  { id: 'd4', name: 'Aadhaar Card', type: 'Personal', uploadedOn: '2024-07-10', size: '1.2 MB' },
  { id: 'd5', name: 'Salary Slip – Oct 2026', type: 'Payroll', uploadedOn: '2026-10-01', size: '180 KB' },
  { id: 'd6', name: 'Form 16 – 2025', type: 'Tax', uploadedOn: '2026-06-15', size: '320 KB' },
  { id: 'd7', name: 'Company Policy', type: 'Company', uploadedOn: '2024-07-12', size: '1.5 MB' },
  { id: 'd8', name: 'Experience Certificate', type: 'Employment', uploadedOn: '2024-07-10', size: '210 KB' },
];

// ── Directory ──
export const empDirectory = [
  { id: 'dir-1', name: 'Aditi Chauhan', designation: 'Brand Manager', department: 'Marketing', location: 'Delhi Office', email: 'aditi.c@employeehub.in' },
  { id: 'dir-2', name: 'Ankit Verma', designation: 'Engineering Manager', department: 'Engineering', location: 'Jaipur Office', email: 'ankit.v@employeehub.in' },
  { id: 'dir-3', name: 'Neha Singh', designation: 'HR Manager', department: 'Human Resources', location: 'Jaipur Office', email: 'neha.s@employeehub.in' },
  { id: 'dir-4', name: 'Amit Kumar', designation: 'Product Manager', department: 'Product', location: 'Bengaluru HQ', email: 'amit.k@employeehub.in' },
  { id: 'dir-5', name: 'Priya Mehta', designation: 'Senior Developer', department: 'Engineering', location: 'Remote', email: 'priya.m@employeehub.in' },
  { id: 'dir-6', name: 'Rohan Sharma', designation: 'Finance Analyst', department: 'Finance', location: 'Mumbai HQ', email: 'rohan.s@employeehub.in' },
  { id: 'dir-7', name: 'Sneha Patel', designation: 'QA Engineer', department: 'Engineering', location: 'Jaipur Office', email: 'sneha.p@employeehub.in' },
  { id: 'dir-8', name: 'Karthik Nair', designation: 'DevOps Engineer', department: 'Engineering', location: 'Bengaluru HQ', email: 'karthik.n@employeehub.in' },
];

// ── Upcoming Events ──
export const empUpcomingEvents = [
  { month: 'OCT', day: '08', title: 'Sprint Planning', time: '10:00 AM – 11:00 AM', location: 'Conference Room B' },
  { month: 'OCT', day: '10', title: 'Performance Review', time: '02:00 PM – 03:00 PM', location: 'Manager Cabin' },
  { month: 'OCT', day: '15', title: 'Company Townhall', time: '11:00 AM – 12:00 PM', location: 'Main Auditorium' },
  { month: 'OCT', day: '18', title: 'Diwali Celebration', time: '04:00 PM – 07:00 PM', location: 'Cafeteria' },
];

// ── Announcements ──
export const empAnnouncements = [
  { id: 'a1', title: 'Diwali Office Closure', description: 'Office closed Oct 31–Nov 3.', priority: 'High' as const, date: '2026-10-01' },
  { id: 'a2', title: 'Annual Performance Review', description: 'Q3 review cycle starts Nov 15.', priority: 'High' as const, date: '2026-10-05' },
  { id: 'a3', title: 'New Health Insurance', description: 'Upgraded coverage. Review on HR portal.', priority: 'Medium' as const, date: '2026-09-25' },
  { id: 'a4', title: 'Engineering Hackathon', description: 'Teams of 3-5. Prize pool ₹5L.', priority: 'Low' as const, date: '2026-10-07' },
];

// ── Notifications ──
export const empNotifications = [
  { id: 'n1', title: 'Leave Approved', message: 'Your annual leave on Sep 20 was approved.', time: '2 hours ago', read: false },
  { id: 'n2', title: 'Payslip Available', message: 'September 2026 payslip is ready.', time: '1 day ago', read: false },
  { id: 'n3', title: 'Performance Review Due', message: 'Complete your self-assessment by Oct 15.', time: '3 days ago', read: true },
  { id: 'n4', title: 'New Announcement', message: 'Diwali office closure notice posted.', time: '1 week ago', read: true },
];
