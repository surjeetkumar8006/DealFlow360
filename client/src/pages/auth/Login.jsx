import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, CheckCircle2, Zap } from 'lucide-react';

const Login = () => {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');

  // Touched state to trigger validation feedback only after user interacts
  const [touched, setTouched] = useState({ email: false, password: false, confirmPassword: false, name: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register, switchDemoRole } = useAuth();
  const navigate = useNavigate();

  // Industry-Standard Email Regex Validation
  const isValidEmail = (emailStr) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  const isEmailValid = isValidEmail(email);
  const isPasswordValid = password.length >= 6;
  const isConfirmMatch = mode === 'signup' ? password === confirmPassword && confirmPassword.length > 0 : true;
  const isNameValid = mode === 'signup' ? name.trim().length >= 2 : true;

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Mark all fields as touched on submit attempt
    setTouched({ email: true, password: true, confirmPassword: true, name: true });

    if (!isEmailValid) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!isPasswordValid) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (mode === 'signup' && !isConfirmMatch) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'signup') {
        const userData = await register(name || email.split('@')[0], email, password, 'sales_rep', '');
        redirectByRole(userData.role);
      } else {
        const userData = await login(email, password);
        redirectByRole(userData.role);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (roleKey) => {
    setError('');
    setLoading(true);
    try {
      const userData = await switchDemoRole(roleKey);
      if (userData) {
        redirectByRole(userData.role);
      }
    } catch (err) {
      setError('Demo authentication failed. Make sure server is running.');
    } finally {
      setLoading(false);
    }
  };

  const redirectByRole = (userRole) => {
    const roleStr = (userRole || '').toLowerCase();
    switch (roleStr) {
      case 'customer':
        navigate('/portal');
        break;
      case 'sales_manager':
        navigate('/approvals');
        break;
      case 'finance':
        navigate('/billing');
        break;
      case 'admin':
        navigate('/backend');
        break;
      case 'sales_rep':
      default:
        navigate('/workspace');
        break;
    }
  };

  return (
    <div className="min-h-screen w-full lg:h-screen lg:overflow-hidden flex flex-col lg:flex-row bg-[var(--paper-dim)] text-[var(--text)]">
      
      {/* Mobile/Tablet Compact Dark Header */}
      <div className="lg:hidden bg-[var(--ink)] text-[var(--text-inverse)] px-5 py-4 border-b border-white/10 flex items-center justify-between shadow-md shrink-0">
        <div>
          <span className="brand-mark text-xl font-bold text-white">DealFlow360</span>
          <p className="text-[11px] text-[var(--text-inverse-dim)]">Self-governing sales operations platform</p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] bg-white/10 px-2 py-1 rounded-full border border-white/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)]"></span>
          <span>CPQ Engine</span>
        </div>
      </div>

      {/* Desktop Left Brand Rail */}
      <div className="hidden lg:flex flex-1 lg:max-w-[40%] bg-[var(--ink)] text-[var(--text-inverse)] p-8 lg:p-10 flex-col justify-between relative overflow-hidden h-full shrink-0">
        <div className="absolute inset-0 bg-[radial-gradient(600px_300px_at_85%_90%,rgba(184,134,59,0.14),transparent_70%)] pointer-events-none"></div>

        <div className="relative z-10">
          <div className="brand-mark text-2xl lg:text-3xl font-bold text-[var(--text-inverse)]">
            DealFlow360
          </div>
          <div className="mt-2 text-xs lg:text-sm text-[var(--text-inverse-dim)] max-w-[320px] leading-relaxed">
            A self‑governing deal engine — quotation to cash, with pricing discipline built in.
          </div>
        </div>

        {/* Chain Diagram */}
        <div className="my-auto py-4 relative z-10">
          <div className="flex items-center gap-0 overflow-x-auto pb-1 scrollbar-none">
            <div className="flex items-center gap-2 px-2.5 py-1.5 bg-[rgba(245,244,239,0.06)] border border-[rgba(245,244,239,0.14)] rounded-full text-xs text-[var(--text-inverse)] whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full flex-none bg-[var(--gold)]"></span>
              Quotation
            </div>
            <div className="flex-1 h-[1px] min-w-[12px] mx-1.5 bg-[repeating-linear-gradient(90deg,rgba(245,244,239,0.3)_0_4px,transparent_4px_8px)]"></div>

            <div className="flex items-center gap-2 px-2.5 py-1.5 bg-[rgba(245,244,239,0.06)] border border-[rgba(245,244,239,0.14)] rounded-full text-xs text-[var(--text-inverse)] whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full flex-none bg-[var(--rust)]"></span>
              Approval
            </div>
            <div className="flex-1 h-[1px] min-w-[12px] mx-1.5 bg-[repeating-linear-gradient(90deg,rgba(245,244,239,0.3)_0_4px,transparent_4px_8px)]"></div>

            <div className="flex items-center gap-2 px-2.5 py-1.5 bg-[rgba(245,244,239,0.06)] border border-[rgba(245,244,239,0.14)] rounded-full text-xs text-[var(--text-inverse)] whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full flex-none bg-[var(--teal)]"></span>
              Fulfillment
            </div>
            <div className="flex-1 h-[1px] min-w-[12px] mx-1.5 bg-[repeating-linear-gradient(90deg,rgba(245,244,239,0.3)_0_4px,transparent_4px_8px)]"></div>

            <div className="flex items-center gap-2 px-2.5 py-1.5 bg-[rgba(245,244,239,0.06)] border border-[rgba(245,244,239,0.14)] rounded-full text-xs text-[var(--text-inverse)] whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full flex-none bg-white"></span>
              Billing
            </div>
          </div>

          <div className="mt-3 text-xs text-[var(--text-inverse-dim)] leading-relaxed max-w-[340px]">
            Every quotation is scored against its blended discount risk before it reaches this chain — thin‑margin lines can't hide behind a healthy overall discount.
          </div>
        </div>

        {/* Tier Legend */}
        <div className="relative z-10 pt-4 border-t border-[rgba(245,244,239,0.12)] flex gap-6">
          <div className="text-[11px] text-[var(--text-inverse-dim)]">
            <div className="flex items-center gap-1.5 text-[var(--text-inverse)] font-medium mb-0.5">
              <span className="w-2 h-2 rounded-sm bg-[#B08D57]"></span>Bronze
            </div>
            up to 5%
          </div>

          <div className="text-[11px] text-[var(--text-inverse-dim)]">
            <div className="flex items-center gap-1.5 text-[var(--text-inverse)] font-medium mb-0.5">
              <span className="w-2 h-2 rounded-sm bg-[#B7BAC2]"></span>Silver
            </div>
            up to 10%
          </div>

          <div className="text-[11px] text-[var(--text-inverse-dim)]">
            <div className="flex items-center gap-1.5 text-[var(--text-inverse)] font-medium mb-0.5">
              <span className="w-2 h-2 rounded-sm bg-[var(--gold)]"></span>Gold
            </div>
            up to 15%
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 bg-[var(--paper)] p-4 sm:p-6 lg:p-8 flex items-center justify-center lg:h-full overflow-y-auto">
        <div className="w-full max-w-[380px] sm:max-w-[420px] py-2">
          
          <div className="text-xs text-[var(--text-muted)] mb-1">
            Entry point for internal users and customers
          </div>

          {/* Mode Toggle Bar */}
          <div className="mode-toggle-bar mb-3">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); setTouched({}); }}
              className={`mode-toggle-btn ${mode === 'login' ? 'active' : ''}`}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(''); setTouched({}); }}
              className={`mode-toggle-btn ${mode === 'signup' ? 'active' : ''}`}
            >
              Sign up
            </button>
          </div>

          <h1 className="text-xl sm:text-2xl font-semibold text-[var(--text)] mb-3 tracking-tight">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>

          {/* Form Level Error Message */}
          {error && (
            <div className="mb-3 bg-[var(--rust-tint)] border border-[var(--rust)] text-[var(--rust)] p-2.5 rounded-md text-xs font-medium flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-[var(--rust)]" />
              <span>{error}</span>
            </div>
          )}

          {/* Form with noValidate to suppress ugly native browser popups */}
          <form onSubmit={handleSubmit} noValidate className="space-y-3">
            
            {/* Name Field (on Signup) */}
            {mode === 'signup' && (
              <div>
                <label className="field-label mb-1 text-xs flex justify-between items-center">
                  <span>Full name</span>
                  {touched.name && isNameValid && (
                    <span className="text-[11px] text-[var(--teal)] font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[var(--teal)]" /> Looks good!
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => handleBlur('name')}
                  placeholder="Rahul Sharma"
                  className={`field-input py-2 text-xs transition-colors ${
                    touched.name
                      ? isNameValid
                        ? 'border-[var(--teal)] focus:border-[var(--teal)] focus:ring-[var(--teal-tint)]'
                        : 'border-[var(--rust)] focus:border-[var(--rust)] focus:ring-[var(--rust-tint)] bg-rose-50/40'
                      : ''
                  }`}
                />
                {touched.name && !isNameValid && (
                  <p className="mt-1 text-[11px] text-[var(--rust)] font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" /> Please enter your name (min 2 characters).
                  </p>
                )}
              </div>
            )}

            {/* Email Field with Real-Time Industry Validation */}
            <div>
              <label className="field-label mb-1 text-xs flex justify-between items-center">
                <span>Email address</span>
                {touched.email && isEmailValid && (
                  <span className="text-[11px] text-[var(--teal)] font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[var(--teal)]" /> Looks good!
                  </span>
                )}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => handleBlur('email')}
                placeholder="you@company.com"
                className={`field-input py-2 text-xs transition-colors ${
                  touched.email
                    ? isEmailValid
                      ? 'border-[var(--teal)] focus:border-[var(--teal)] focus:ring-[var(--teal-tint)]'
                      : 'border-[var(--rust)] focus:border-[var(--rust)] focus:ring-[var(--rust-tint)] bg-rose-50/40'
                    : ''
                }`}
              />
              {touched.email && !isEmailValid && (
                <p className="mt-1 text-[11px] text-[var(--rust)] font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" /> Please enter a valid email address (e.g. name@company.com).
                </p>
              )}
            </div>

            {/* Password Field with Real-Time Validation */}
            <div>
              <label className="field-label mb-1 text-xs flex justify-between items-center">
                <span>Password</span>
                {touched.password && isPasswordValid && (
                  <span className="text-[11px] text-[var(--teal)] font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[var(--teal)]" /> Password strong & valid
                  </span>
                )}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => handleBlur('password')}
                placeholder="••••••••"
                className={`field-input py-2 text-xs transition-colors ${
                  touched.password
                    ? isPasswordValid
                      ? 'border-[var(--teal)] focus:border-[var(--teal)] focus:ring-[var(--teal-tint)]'
                      : 'border-[var(--rust)] focus:border-[var(--rust)] focus:ring-[var(--rust-tint)] bg-rose-50/40'
                    : ''
                }`}
              />
              {touched.password && !isPasswordValid && (
                <p className="mt-1 text-[11px] text-[var(--rust)] font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" /> Password must be at least 6 characters.
                </p>
              )}
            </div>

            {/* Confirm Password Field (on Signup) */}
            {mode === 'signup' && (
              <div>
                <label className="field-label mb-1 text-xs flex justify-between items-center">
                  <span>Confirm password</span>
                  {touched.confirmPassword && isConfirmMatch && confirmPassword.length > 0 && (
                    <span className="text-[11px] text-[var(--teal)] font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[var(--teal)]" /> Passwords match!
                    </span>
                  )}
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => handleBlur('confirmPassword')}
                  placeholder="••••••••"
                  className={`field-input py-2 text-xs transition-colors ${
                    touched.confirmPassword && confirmPassword.length > 0
                      ? isConfirmMatch
                        ? 'border-[var(--teal)] focus:border-[var(--teal)] focus:ring-[var(--teal-tint)]'
                        : 'border-[var(--rust)] focus:border-[var(--rust)] focus:ring-[var(--rust-tint)] bg-rose-50/40'
                      : ''
                  }`}
                />
                {touched.confirmPassword && !isConfirmMatch && confirmPassword.length > 0 && (
                  <p className="mt-1 text-[11px] text-[var(--rust)] font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" /> Passwords do not match.
                  </p>
                )}
              </div>
            )}

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? 'Processing...' : mode === 'login' ? 'Log in' : 'Sign up'}
              </button>

              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => alert('Demo Password: password123')}
                  className="text-xs text-[var(--text-muted)] hover:text-slate-900 transition-colors text-center"
                >
                  Forgot password?
                </button>
              )}
            </div>
          </form>

          {/* Helper Note Box */}
          <div className="helper-note-box my-3 py-2 px-3 text-[11px] sm:text-xs leading-relaxed">
            After login, internal users land on the sales dashboard. Customers land on their quotation portal.
          </div>

          <ul className="list-disc pl-4 space-y-1 text-[11px] text-[var(--text-muted)]">
            <li>Company / team selector shown for multi‑team setups</li>
            <li>Basic validation on email and password fields</li>
            <li>Sign up creates a new internal or customer account</li>
          </ul>

          {/* Hackathon 1-Click Demo Login Bar */}
          <div className="mt-4 pt-4 border-t border-slate-200 space-y-2">
            <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1 text-slate-800">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> 1-Click Demo Logins
              </span>
              <span className="text-[9px] bg-slate-100 px-2 py-0.5 rounded-full border border-slate-300 text-slate-700 font-mono">Pre-Seeded</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('sales_rep')}
                className="p-2 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-xl text-left transition-all flex flex-col shadow-2xs cursor-pointer group"
              >
                <span className="text-[11px] font-bold text-slate-900 group-hover:text-slate-950">Sales Rep</span>
                <span className="text-[9.5px] text-slate-500 font-mono truncate">sales@...</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('sales_manager')}
                className="p-2 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-xl text-left transition-all flex flex-col shadow-2xs cursor-pointer group"
              >
                <span className="text-[11px] font-bold text-slate-900 group-hover:text-slate-950">Manager</span>
                <span className="text-[9.5px] text-slate-500 font-mono truncate">manager@...</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('finance')}
                className="p-2 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-xl text-left transition-all flex flex-col shadow-2xs cursor-pointer group"
              >
                <span className="text-[11px] font-bold text-slate-900 group-hover:text-slate-950">Finance</span>
                <span className="text-[9.5px] text-slate-500 font-mono truncate">finance@...</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                className="p-2 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-xl text-left transition-all flex flex-col shadow-2xs cursor-pointer group"
              >
                <span className="text-[11px] font-bold text-slate-900 group-hover:text-slate-950">Admin</span>
                <span className="text-[9.5px] text-slate-500 font-mono truncate">admin@...</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('customer')}
                className="p-2 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-xl text-left transition-all flex flex-col col-span-2 shadow-2xs cursor-pointer group"
              >
                <span className="text-[11px] font-bold text-slate-900 group-hover:text-slate-950">Customer Portal</span>
                <span className="text-[9.5px] text-slate-500 font-mono truncate">customer@example.com</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
