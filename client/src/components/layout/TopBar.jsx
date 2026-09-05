import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../../context/AuthContext';
import { toggleMobileMenu } from '../../store/slices/uiSlice';
import { useNavigate } from 'react-router-dom';
import { LogOut, Menu, X, Network } from 'lucide-react';
import ArchitectureModal from '../common/ArchitectureModal';

const TopBar = () => {
  const dispatch = useDispatch();
  const mobileMenuOpen = useSelector((state) => state.ui.mobileMenuOpen);
  const { role, logout, switchDemoRole } = useAuth();
  const navigate = useNavigate();

  const [isArchModalOpen, setIsArchModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleRoleSwitch = async (newRole) => {
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

  return (
    <>
      <header className="bg-[#14171C] text-white border-b border-white/10 px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-md sticky top-0 z-30 shrink-0 select-none">
        
        {/* Mobile Hamburger & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => dispatch(toggleMobileMenu())}
            className="lg:hidden p-1.5 text-white hover:bg-white/10 rounded-lg transition-colors border border-white/20"
            title="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <span className="lg:hidden brand-mark text-lg font-bold text-white tracking-tight">
            DealFlow360
          </span>

          {/* Desktop Breadcrumb & Architecture Button */}
          <div className="hidden lg:flex items-center gap-3">
            <span className="text-xs font-semibold text-[var(--text-inverse-dim)] uppercase tracking-wider">
              DealFlow360 Platform
            </span>
            <span className="text-white/30">/</span>
            <span className="text-xs font-bold text-white uppercase tracking-wider bg-white/10 px-2.5 py-0.5 rounded border border-white/20">
              {role ? role.replace('_', ' ') : 'Sales Rep'} Workspace
            </span>

            <button
              onClick={() => setIsArchModalOpen(true)}
              className="ml-2 text-xs font-bold text-amber-300 hover:text-white bg-amber-950/80 hover:bg-amber-900 border border-amber-700/80 px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="View System Architecture & Data Flow Diagram"
            >
              <Network className="w-3.5 h-3.5 text-amber-400" />
              <span>Architecture & Roadmap</span>
            </button>
          </div>
        </div>

        {/* Top Right Controls: Demo Role Quick Switcher & Logout */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Interactive Demo Persona Switcher */}
          <div className="flex items-center gap-1 bg-black/60 p-1 rounded-lg border border-white/15 text-xs shadow-inner">
            <span className="text-[11px] text-[var(--text-inverse-dim)] px-1.5 font-mono hidden md:inline">Persona:</span>
            {[
              { id: 'sales_rep', label: 'Rep' },
              { id: 'sales_manager', label: 'Manager' },
              { id: 'finance', label: 'Finance' },
              { id: 'admin', label: 'Admin' },
              { id: 'customer', label: 'Customer' },
            ].map((r) => {
              const isActive = (role || '').toLowerCase() === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => handleRoleSwitch(r.id)}
                  className={`text-[11px] px-2 py-0.5 rounded-md font-semibold transition-all ${
                    isActive
                      ? 'bg-[var(--gold)] text-white shadow-xs font-bold'
                      : 'text-[var(--text-inverse-dim)] hover:text-white hover:bg-white/10'
                  }`}
                  title={`Switch active persona to ${r.label}`}
                >
                  {r.label}
                </button>
              );
            })}
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-300 bg-emerald-950/80 border border-emerald-800 px-2.5 py-1 rounded-md font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Engine Active</span>
          </div>

          <button
            onClick={handleLogout}
            className="text-xs font-bold text-rose-200 hover:text-white bg-rose-950/80 hover:bg-rose-900 border border-rose-800/80 hover:border-rose-600 px-2.5 sm:px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
            title="Log Out"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden xs:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Interactive System Architecture Diagram Modal */}
      <ArchitectureModal
        isOpen={isArchModalOpen}
        onClose={() => setIsArchModalOpen(false)}
      />
    </>
  );
};

export default TopBar;
