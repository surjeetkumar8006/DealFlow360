import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, Lock, Mail, User, Building, ArrowRight } from 'lucide-react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('sales_rep');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userData = await register(name, email, password, role, companyName);
      if (userData.role === 'customer') {
        navigate('/portal');
      } else {
        navigate('/workspace');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none"></div>

      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xl px-3 py-1 rounded-xl shadow-lg shadow-blue-500/20 tracking-tight">
            DealFlow360
          </div>
          <span className="hidden sm:inline text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700 font-medium">
            Create Account
          </span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 z-10">
        <div className="w-full max-w-xl glass-card space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Create Account</h1>
            <p className="text-sm text-slate-400">Sign up for internal sales tools or customer negotiation portal</p>
          </div>

          <div className="bg-slate-950/70 p-1.5 rounded-xl border border-slate-800 flex items-center gap-1">
            <Link
              to="/login"
              className="flex-1 text-slate-400 hover:text-white font-medium py-2 rounded-lg text-sm transition-all text-center hover:bg-slate-800/50"
            >
              Log In
            </Link>
            <button
              type="button"
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-2 rounded-lg text-sm shadow-md transition-all text-center"
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="bg-rose-950/80 border border-rose-800/80 text-rose-200 rounded-xl p-4 text-sm flex items-center gap-3 shadow-lg">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                    className="input-field pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@company.com"
                    required
                    className="input-field pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="input-field pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Company / Team</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Acme Corp"
                    className="input-field pl-10"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Account Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="input-field"
              >
                <option value="sales_rep">Sales Rep</option>
                <option value="customer">Customer (Portal Access)</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary"
              >
                {loading ? 'Creating Account...' : 'Create Account & Sign In'}
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer className="text-center text-xs text-slate-500 py-4 border-t border-slate-800/80 bg-slate-950/60 backdrop-blur-md">
        DealFlow360 Self-Governing Sales Operations Engine © 2026
      </footer>
    </div>
  );
};

export default Signup;
