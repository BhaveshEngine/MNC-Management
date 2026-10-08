import { useState } from 'react';
import { Eye, EyeOff, LogIn, Shield, User, Sparkles } from 'lucide-react';
import { useAuth, DEMO_ACCOUNTS } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

export function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'admin' | 'employee' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) { setError('Please enter your email'); return; }
    if (!password.trim()) { setError('Please enter your password'); return; }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Login failed');
    }
  };

  const fillDemo = (type: 'admin' | 'hr' | 'employee') => {
    const map = { admin: 'admin@employeehub.in', hr: 'hr@employeehub.in', employee: 'rajesh.k@employeehub.in' };
    const acc = DEMO_ACCOUNTS[map[type]];
    setEmail(map[type]);
    setPassword(acc.password);
    setSelectedRole(type === 'employee' ? 'employee' : 'admin');
    setError('');
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#F5F8FF' }}>

      {/* ═══════════════════════════════════════
          LEFT PANEL — Brand / Hero
          ═══════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0B1B3A 0%, #1E3A5F 40%, #2563EB 100%)' }}>

        {/* Decorative elements */}
        <div className="absolute inset-0">
          {/* Floating orbs */}
          <div className="absolute top-[15%] left-[10%] w-72 h-72 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #60a5fa, transparent 70%)' }} />
          <div className="absolute bottom-[20%] right-[5%] w-96 h-96 rounded-full opacity-8"
            style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)' }} />
          <div className="absolute top-[50%] left-[40%] w-64 h-64 rounded-full opacity-6"
            style={{ background: 'radial-gradient(circle, #ec4899, transparent 70%)' }} />

          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-[20px] font-bold text-white tracking-tight">EmployeeHub</span>
          </div>

          {/* Hero text */}
          <div className="max-w-md">
            <h1 className="text-[42px] font-bold text-white leading-[1.15] tracking-tight mb-5">
              Manage your<br />
              <span className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(90deg, #60a5fa, #c084fc, #f472b6)' }}>
                workforce
              </span><br />
              effortlessly.
            </h1>
            <p className="text-[16px] text-blue-200/80 leading-relaxed">
              A complete HR management platform for attendance, payroll, leave,
              performance tracking, and more — all in one place.
            </p>

            {/* Feature badges */}
            <div className="flex flex-wrap gap-2.5 mt-8">
              {['52 Employees', '8 Departments', 'Payroll', 'Attendance', 'Leave Management'].map(f => (
                <span key={f} className="text-[12px] font-medium text-blue-200/90 bg-white/10 backdrop-blur-sm
                                         px-3 py-1.5 rounded-full border border-white/10">
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p className="text-[13px] text-blue-300/50">
            © 2026 EmployeeHub. Enterprise HR Solution.
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          RIGHT PANEL — Login Form
          ═══════════════════════════════════════ */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[420px]">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-[20px] font-bold text-gray-900 tracking-tight">EmployeeHub</span>
          </div>

          {/* Heading */}
          <h2 className="text-[28px] font-bold text-gray-900 tracking-tight">Welcome back</h2>
          <p className="text-[15px] text-gray-500 mt-1.5 mb-8">Sign in to your account to continue</p>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-7">
            <button
              onClick={() => { setSelectedRole('admin'); fillDemo('admin'); }}
              className={cn(
                'flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all duration-200',
                selectedRole === 'admin'
                  ? 'border-brand-500 bg-brand-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
              )}
            >
              <div className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center transition-colors',
                selectedRole === 'admin' ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-500'
              )}>
                <Shield className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className={cn('text-[14px] font-semibold', selectedRole === 'admin' ? 'text-brand-700' : 'text-gray-800')}>Admin</p>
                <p className="text-[11px] text-gray-400">Full access</p>
              </div>
            </button>

            <button
              onClick={() => { setSelectedRole('employee'); fillDemo('employee'); }}
              className={cn(
                'flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all duration-200',
                selectedRole === 'employee'
                  ? 'border-violet-500 bg-violet-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
              )}
            >
              <div className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center transition-colors',
                selectedRole === 'employee' ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-500'
              )}>
                <User className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className={cn('text-[14px] font-semibold', selectedRole === 'employee' ? 'text-violet-700' : 'text-gray-800')}>Employee</p>
                <p className="text-[11px] text-gray-400">Self-service</p>
              </div>
            </button>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-[13px] font-semibold text-gray-700 mb-1.5 block">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="you@employeehub.in"
                className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-[14px] text-gray-800
                           placeholder-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100
                           transition-all duration-200"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[13px] font-semibold text-gray-700">Password</label>
                <button type="button" className="text-[12px] font-medium text-brand-600 hover:text-brand-700 transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Enter your password"
                  className="w-full h-11 px-4 pr-11 rounded-xl border border-gray-200 bg-white text-[14px] text-gray-800
                             placeholder-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100
                             transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-danger-50 border border-danger-100 animate-fade">
                <div className="w-5 h-5 rounded-full bg-danger-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-[12px] text-danger-600 font-bold">!</span>
                </div>
                <p className="text-[13px] text-danger-700 font-medium">{error}</p>
              </div>
            )}

            {/* Remember + Submit */}
            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" defaultChecked
                className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
              <label htmlFor="remember" className="text-[13px] text-gray-600">Remember me</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={cn(
                'w-full h-12 rounded-xl text-[15px] font-semibold text-white flex items-center justify-center gap-2',
                'transition-all duration-200 shadow-lg',
                loading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90 hover:shadow-xl active:scale-[0.98]',
              )}
              style={{ background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)' }}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-8 p-4 rounded-xl bg-gray-50 border border-gray-200">
            <p className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-3">Demo Credentials</p>
            <div className="space-y-2.5">
              {[
                { label: 'Super Admin', email: 'admin@employeehub.in', pass: 'admin123', badge: 'bg-brand-50 text-brand-700 border-brand-100' },
                { label: 'HR Admin', email: 'hr@employeehub.in', pass: 'hr123', badge: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
                { label: 'Employee', email: 'rahul.sharma@employeehub.in', pass: 'emp123', badge: 'bg-violet-50 text-violet-700 border-violet-100' },
              ].map(cred => (
                <button
                  key={cred.email}
                  type="button"
                  onClick={() => { setEmail(cred.email); setPassword(cred.pass); setError(''); }}
                  className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-white hover:shadow-sm border border-transparent
                             hover:border-gray-200 transition-all duration-150 text-left group"
                >
                  <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded border', cred.badge)}>
                    {cred.label}
                  </span>
                  <span className="text-[12px] text-gray-600 font-mono flex-1 truncate">{cred.email}</span>
                  <span className="text-[11px] text-gray-400 font-mono">{cred.pass}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
