import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Menu, X } from 'lucide-react';

const Header = () => {
  const { user, role, logout, switchDemoRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (['/login', '/signup'].includes(location.pathname)) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleRoleSwitch = async (newRole) => {
    setMobileMenuOpen(false);
    const updatedUser = await switchDemoRole(newRole);
    if (updatedUser) {
      switch (newRole) {
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
    }
  };

  const navTabs = [
    { name: 'Dashboard', path: '/workspace' },
    { name: 'Quotations', path: '/quotations' },
    { name: 'Approvals', path: '/approvals' },
    { name: 'Fulfillment', path: '/fulfillment' },
    { name: 'Subscriptions', path: '/subscriptions' },
    { name: 'Invoices', path: '/billing' },
    { name: 'Deal Health', path: '/deal-health' },
    { name: 'Reports', path: '/reports' },
    { name: 'Products', path: '/products' },
  ];

  return (
    <header className="bg-[var(--ink)] text-[var(--text-inverse)] sticky top-0 z-50 shadow-md">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex items-center justify-between h-[60px]">
        
        {/* Brand Logo & Desktop Nav Tabs */}
        <div className="flex items-center gap-6 overflow-x-auto scrollbar-none py-1">
          <div
            onClick={() => navigate('/workspace')}
            className="brand-mark text-xl text-white cursor-pointer tracking-tight shrink-0"
          >
            DealFlow360
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navTabs.map((tab) => (
              <NavLink
                key={tab.path}
                to={tab.path}
                className={({ isActive }) =>
                  `text-xs font-medium px-3 py-2 rounded transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[rgba(245,244,239,0.1)] text-white shadow-[inset_0_-2px_0_var(--gold)] font-semibold'
                      : 'text-[var(--text-inverse-dim)] hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {tab.name}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Demo Role Quick Switcher & User Profile Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden lg:flex items-center gap-1 bg-black/40 p-1 rounded-md border border-white/10 text-xs">
            <span className="text-[11px] text-[var(--text-inverse-dim)] px-1.5 font-mono">Role:</span>
            {[
              { id: 'sales_rep', label: 'Rep' },
              { id: 'sales_manager', label: 'Manager' },
              { id: 'finance', label: 'Finance' },
              { id: 'admin', label: 'Admin' },
              { id: 'customer', label: 'Customer' },
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => handleRoleSwitch(r.id)}
                className={`text-[11px] px-2 py-0.5 rounded font-medium transition-all ${
                  (role || '').toLowerCase() === r.id
                    ? 'bg-[var(--gold)] text-white font-bold'
                    : 'text-[var(--text-inverse-dim)] hover:text-white'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleLogout}
            className="hidden sm:flex text-xs text-[var(--text-inverse-dim)] hover:text-white p-1.5 rounded border border-white/10 hover:border-white/30 transition-all items-center gap-1"
            title="Log Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[var(--text-inverse-dim)] hover:text-white p-1.5 rounded border border-white/10"
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Collapsible Navigation Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[var(--ink-soft)] border-b border-white/10 px-4 py-4 space-y-4">
          <nav className="flex flex-col space-y-1">
            {navTabs.map((tab) => (
              <NavLink
                key={tab.path}
                to={tab.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `text-xs font-medium px-3 py-2.5 rounded transition-all flex items-center justify-between ${
                    isActive
                      ? 'bg-[var(--gold)] text-white font-bold'
                      : 'text-[var(--text-inverse-dim)] hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <span>{tab.name}</span>
              </NavLink>
            ))}
          </nav>

          <div className="pt-3 border-t border-white/10 space-y-2">
            <div className="text-[11px] text-[var(--text-inverse-dim)] font-mono uppercase tracking-wider">Switch Persona Role:</div>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'sales_rep', label: 'Sales Rep' },
                { id: 'sales_manager', label: 'Sales Manager' },
                { id: 'finance', label: 'Finance' },
                { id: 'admin', label: 'Admin' },
                { id: 'customer', label: 'Customer Portal' },
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => handleRoleSwitch(r.id)}
                  className={`text-xs px-2.5 py-1 rounded font-medium ${
                    (role || '').toLowerCase() === r.id
                      ? 'bg-[var(--gold)] text-white font-bold'
                      : 'bg-black/30 text-slate-300 hover:text-white'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="w-full text-xs text-rose-300 hover:text-rose-100 py-2 px-3 bg-rose-950/40 rounded border border-rose-900/40 flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Log Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
