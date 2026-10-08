import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { UserRole } from '@/types';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isEmployee: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

/* ── Demo Credentials ── */
const DEMO_ACCOUNTS: Record<string, { password: string; user: AuthUser }> = {
  'admin@employeehub.in': {
    password: 'admin123',
    user: { id: 'admin-1', name: 'Super Admin', email: 'admin@employeehub.in', role: 'super_admin' },
  },
  'hr@employeehub.in': {
    password: 'hr123',
    user: { id: 'emp-15', name: 'Kavitha Sundaram', email: 'hr@employeehub.in', role: 'hr_admin' },
  },
  'rahul.sharma@employeehub.in': {
    password: 'emp123',
    user: { id: 'emp-1024', name: 'Rahul Sharma', email: 'rahul.sharma@employeehub.in', role: 'employee' },
  },
  'priya.sharma@employeehub.in': {
    password: 'emp123',
    user: { id: 'emp-2', name: 'Priya Sharma', email: 'priya.sharma@employeehub.in', role: 'employee' },
  },
};

const ADMIN_ROLES: UserRole[] = ['super_admin', 'hr_admin', 'hr_manager', 'dept_manager', 'finance'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('ehub_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback(async (email: string, password: string) => {
    await new Promise(r => setTimeout(r, 800));
    const account = DEMO_ACCOUNTS[email.toLowerCase()];
    if (!account) return { success: false, error: 'No account found with this email' };
    if (account.password !== password) return { success: false, error: 'Invalid password' };
    setUser(account.user);
    localStorage.setItem('ehub_user', JSON.stringify(account.user));
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('ehub_user');
  }, []);

  const isAdmin = !!user && ADMIN_ROLES.includes(user.role);
  const isEmployee = !!user && user.role === 'employee';

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isAdmin, isEmployee, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export { DEMO_ACCOUNTS };
