import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { AppStoreProvider } from '@/store/AppStore';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { EmployeeSidebar } from '@/components/employee/EmployeeSidebar';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { EmployeesPage } from '@/pages/EmployeesPage';
import { EmployeeProfilePage } from '@/pages/EmployeeProfilePage';
import { DepartmentsPage } from '@/pages/DepartmentsPage';
import { AdminAttendancePage } from '@/pages/admin/AdminAttendancePage';
import { AdminLeavePage } from '@/pages/admin/AdminLeavePage';
import { AdminPayrollPage } from '@/pages/admin/AdminPayrollPage';
import { AdminPayslipsPage } from '@/pages/admin/AdminPayslipsPage';
import { AdminSalaryPage } from '@/pages/admin/AdminSalaryPage';
import { AdminGoalsPage } from '@/pages/admin/AdminGoalsPage';
import { AdminReviewsPage } from '@/pages/admin/AdminReviewsPage';
import { EmployeeDashboard } from '@/pages/employee/EmployeeDashboard';
import { EmployeeLeavePage } from '@/pages/employee/EmployeeLeavePage';
import { EmployeeProfilePage as MyProfilePage } from '@/pages/employee/EmployeeProfilePage';
import { EmployeeAttendancePage } from '@/pages/employee/EmployeeAttendancePage';
import { EmployeePayrollPage } from '@/pages/employee/EmployeePayrollPage';
import { EmployeePerformancePage } from '@/pages/employee/EmployeePerformancePage';
import { EmployeeAssetsPage } from '@/pages/employee/EmployeeAssetsPage';
import { EmployeeDocumentsPage } from '@/pages/employee/EmployeeDocumentsPage';
import { EmployeeDirectoryPage } from '@/pages/employee/EmployeeDirectoryPage';
import { EmployeeAnnouncementsPage } from '@/pages/employee/EmployeeAnnouncementsPage';
import { EmployeeNotificationsPage } from '@/pages/employee/EmployeeNotificationsPage';
import { EmployeeRequestsPage } from '@/pages/employee/EmployeeRequestsPage';
import { EmployeeHelpPage } from '@/pages/employee/EmployeeHelpPage';
import { EmployeeSettingsPage } from '@/pages/employee/EmployeeSettingsPage';
import { Construction } from 'lucide-react';
import { ErrorBoundary } from '@/components/ErrorBoundary';

function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 animate-fade">
      <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
        <Construction className="w-6 h-6 text-gray-400" />
      </div>
      <h2 className="text-[18px] font-semibold text-gray-800">{title}</h2>
      <p className="text-[14px] text-gray-400 mt-1.5">This module is under development.</p>
    </div>
  );
}

/* ═══════════════════════════════════════
   ADMIN LAYOUT
   ═══════════════════════════════════════ */
function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const sidebarWidth = collapsed ? 64 : 220;

  return (
    <div className="min-h-screen" style={{ background: '#F5F8FF' }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div
        className="flex flex-col min-h-screen transition-[margin-left] duration-200 ease-in-out"
        style={{ marginLeft: sidebarWidth }}
      >
        <Header />
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/employees" element={<EmployeesPage />} />
            <Route path="/employees/:id" element={<EmployeeProfilePage />} />
            <Route path="/departments" element={<DepartmentsPage />} />
            <Route path="/organization" element={<Placeholder title="Organization Chart" />} />
            <Route path="/directory" element={<Placeholder title="Employee Directory" />} />
            <Route path="/attendance" element={<AdminAttendancePage />} />
            <Route path="/leave" element={<AdminLeavePage />} />
            <Route path="/holidays" element={<Placeholder title="Holidays" />} />
            <Route path="/payroll" element={<AdminPayrollPage />} />
            <Route path="/payslips" element={<AdminPayslipsPage />} />
            <Route path="/salary" element={<AdminSalaryPage />} />
            <Route path="/goals" element={<AdminGoalsPage />} />
            <Route path="/reviews" element={<AdminReviewsPage />} />
            <Route path="/jobs" element={<Placeholder title="Job Openings" />} />
            <Route path="/candidates" element={<Placeholder title="Candidates" />} />
            <Route path="/interviews" element={<Placeholder title="Interviews" />} />
            <Route path="/assets" element={<Placeholder title="Asset Management" />} />
            <Route path="/reports/*" element={<Placeholder title="Reports" />} />
            <Route path="/announcements" element={<Placeholder title="Announcements" />} />
            <Route path="/events" element={<Placeholder title="Events" />} />
            <Route path="/notifications" element={<Placeholder title="Notifications" />} />
            <Route path="/roles" element={<Placeholder title="Roles & Permissions" />} />
            <Route path="/audit-logs" element={<Placeholder title="Audit Logs" />} />
            <Route path="/settings" element={<Placeholder title="Settings" />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   EMPLOYEE LAYOUT
   ═══════════════════════════════════════ */
function EmployeeLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const sidebarWidth = collapsed ? 64 : 220;

  return (
    <div className="min-h-screen" style={{ background: '#F5F8FF' }}>
      <EmployeeSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div
        className="flex flex-col min-h-screen transition-[margin-left] duration-200 ease-in-out"
        style={{ marginLeft: sidebarWidth }}
      >
        <Header />
        <main className="flex-1 p-6">
          <ErrorBoundary>
            <Routes>
              <Route path="dashboard" element={<EmployeeDashboard />} />
              <Route path="profile" element={<MyProfilePage />} />
              <Route path="attendance" element={<EmployeeAttendancePage />} />
              <Route path="leave" element={<EmployeeLeavePage />} />
              <Route path="payroll" element={<EmployeePayrollPage />} />
              <Route path="performance" element={<EmployeePerformancePage />} />
              <Route path="assets" element={<EmployeeAssetsPage />} />
              <Route path="documents" element={<EmployeeDocumentsPage />} />
              <Route path="directory" element={<EmployeeDirectoryPage />} />
              <Route path="announcements" element={<EmployeeAnnouncementsPage />} />
              <Route path="notifications" element={<EmployeeNotificationsPage />} />
              <Route path="requests" element={<EmployeeRequestsPage />} />
              <Route path="help" element={<EmployeeHelpPage />} />
              <Route path="settings" element={<EmployeeSettingsPage />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Routes>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   APP ROUTES — Role-based routing
   ═══════════════════════════════════════ */
function AppRoutes() {
  const { isAuthenticated, isAdmin, isEmployee } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Employee role → /employee/*
  if (isEmployee) {
    return (
      <Routes>
        <Route path="/login" element={<Navigate to="/employee/dashboard" replace />} />
        <Route path="/employee/*" element={<EmployeeLayout />} />
        <Route path="*" element={<Navigate to="/employee/dashboard" replace />} />
      </Routes>
    );
  }

  // Admin/HR roles → /*
  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/employee/*" element={<Navigate to="/" replace />} />
      <Route path="/*" element={<AdminLayout />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppStoreProvider>
          <AppRoutes />
        </AppStoreProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
