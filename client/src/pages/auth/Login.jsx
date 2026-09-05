import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, Zap } from 'lucide-react';

const Login = () => {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register, switchDemoRole } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
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
      
      {/* Mobile/Tablet Compact Dark Header (Visible only on < 1024px screens) */}
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

      {/* Desktop Left Brand Rail (Visible on >= 1024px screens) */}
      <div className="hidden lg:flex flex-1 lg:max-w-[40%] bg-[var(--ink)] text-[var(--text-inverse)] p-8 lg:p-10 flex-col justify-between relative overflow-hidden h-full shrink-0">
        
        {/* Subtle Radial Glow */}
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

      {/* Form Side (Ultra-Responsive: Perfectly Centered on Desktop, Fluid Scrollable on Mobile) */}
      <div className="flex-1 bg-[var(--paper)] p-4 sm:p-6 lg:p-8 flex items-center justify-center lg:h-full overflow-y-auto">
        <div className="w-full max-w-[380px] sm:max-w-[420px] py-2">
          
          <div className="text-xs text-[var(--text-muted)] mb-1">
            Entry point for internal users and customers
          </div>

          {/* Mode Toggle Bar */}
          <div className="mode-toggle-bar mb-3">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`mode-toggle-btn ${mode === 'login' ? 'active' : ''}`}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`mode-toggle-btn ${mode === 'signup' ? 'active' : ''}`}
            >
              Sign up
            </button>
          </div>

          <h1 className="text-xl sm:text-2xl font-semibold text-[var(--text)] mb-3 tracking-tight">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>

          {/* Error Message */}
          {error && (
            <div className="mb-3 bg-[var(--rust-tint)] border border-[var(--rust)] text-[var(--rust)] p-2.5 rounded-md text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-2.5">
            {mode === 'signup' && (
              <div>
                <label className="field-label mb-1 text-xs">Full name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rahul Sharma"
                  required={mode === 'signup'}
                  className="field-input py-2 text-xs"
                />
              </div>
            )}

            <div>
              <label className="field-label mb-1 text-xs">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="field-input py-2 text-xs"
              />
            </div>

            <div>
              <label className="field-label mb-1 text-xs">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="field-input py-2 text-xs"
              />
            </div>

            {mode === 'signup' && (
              <div>
                <label className="field-label mb-1 text-xs">Confirm password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required={mode === 'signup'}
                  className="field-input py-2 text-xs"
                />
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary-gold text-xs py-2 px-5"
              >
                {loading ? 'Processing...' : mode === 'login' ? 'Log in' : 'Sign up'}
              </button>

              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => alert('Demo Password: password123')}
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
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
          <div className="mt-3 pt-3 border-t border-[var(--steel-line)] space-y-1.5">
            <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1 text-[var(--gold-deep)]">
                <Zap className="w-3 h-3" /> 1-Click Demo Logins
              </span>
              <span className="text-[9px] bg-[var(--paper-dim)] px-1.5 py-0.5 rounded border border-[var(--steel)]">Pre-Seeded</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('sales_rep')}
                className="p-1.5 bg-[var(--card)] hover:bg-[var(--paper-dim)] border border-[var(--steel-line)] rounded text-left transition-all flex flex-col"
              >
                <span className="text-[11px] font-semibold text-[var(--text)]">Sales Rep</span>
                <span className="text-[9px] text-[var(--text-muted)] truncate">sales@dealflow360.com</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('sales_manager')}
                className="p-1.5 bg-[var(--card)] hover:bg-[var(--paper-dim)] border border-[var(--steel-line)] rounded text-left transition-all flex flex-col"
              >
                <span className="text-[11px] font-semibold text-[var(--text)]">Manager</span>
                <span className="text-[9px] text-[var(--text-muted)] truncate">manager@dealflow360.com</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('finance')}
                className="p-1.5 bg-[var(--card)] hover:bg-[var(--paper-dim)] border border-[var(--steel-line)] rounded text-left transition-all flex flex-col"
              >
                <span className="text-[11px] font-semibold text-[var(--text)]">Finance</span>
                <span className="text-[9px] text-[var(--text-muted)] truncate">finance@dealflow360.com</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                className="p-1.5 bg-[var(--card)] hover:bg-[var(--paper-dim)] border border-[var(--steel-line)] rounded text-left transition-all flex flex-col"
              >
                <span className="text-[11px] font-semibold text-[var(--text)]">Admin</span>
                <span className="text-[9px] text-[var(--text-muted)] truncate">admin@dealflow360.com</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('customer')}
                className="p-1.5 bg-[var(--card)] hover:bg-[var(--paper-dim)] border border-[var(--steel-line)] rounded text-left transition-all flex flex-col col-span-2 sm:col-span-2"
              >
                <span className="text-[11px] font-semibold text-[var(--text)]">Customer Portal</span>
                <span className="text-[9px] text-[var(--text-muted)] truncate">customer@example.com</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
