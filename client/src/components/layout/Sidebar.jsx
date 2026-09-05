import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../../context/AuthContext';
import { toggleSidebar, setMobileMenuOpen } from '../../store/slices/uiSlice';
import {
  LayoutDashboard,
  FileText,
  CheckSquare,
  Truck,
  Repeat,
  DollarSign,
  Activity,
  BarChart3,
  Settings,
  Package,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

const Sidebar = () => {
  const dispatch = useDispatch();
  const collapsed = useSelector((state) => state.ui.sidebarCollapsed);
  const mobileMenuOpen = useSelector((state) => state.ui.mobileMenuOpen);

  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavClick = () => {
    if (mobileMenuOpen) {
      dispatch(setMobileMenuOpen(false));
    }
  };

  const getNavLinks = () => {
    const currentRole = (role || '').toLowerCase();

    if (currentRole === 'customer') {
      return [
        { name: 'My Quotation Portal', path: '/portal', icon: FileText },
      ];
    }

    if (currentRole === 'sales_manager') {
      return [
        { name: 'Dashboard', path: '/workspace', icon: LayoutDashboard },
        { name: 'Quotations', path: '/quotations', icon: FileText },
        { name: 'Approvals Queue', path: '/approvals', icon: CheckSquare },
        { name: 'Products Catalog', path: '/products', icon: Package },
        { name: 'Deal Health', path: '/deal-health', icon: Activity },
        { name: 'Reports & Analytics', path: '/reports', icon: BarChart3 },
      ];
    }

    if (currentRole === 'finance') {
      return [
        { name: 'Dashboard', path: '/workspace', icon: LayoutDashboard },
        { name: 'Invoices & Payments', path: '/billing', icon: DollarSign },
        { name: 'Subscriptions', path: '/subscriptions', icon: Repeat },
        { name: 'Fulfillment Splitting', path: '/fulfillment', icon: Truck },
        { name: 'Products Catalog', path: '/products', icon: Package },
        { name: 'Reports & Analytics', path: '/reports', icon: BarChart3 },
      ];
    }

    if (currentRole === 'admin') {
      return [
        { name: 'Dashboard', path: '/workspace', icon: LayoutDashboard },
        { name: 'Quotations', path: '/quotations', icon: FileText },
        { name: 'Approvals Queue', path: '/approvals', icon: CheckSquare },
        { name: 'Fulfillment Splitting', path: '/fulfillment', icon: Truck },
        { name: 'Subscriptions', path: '/subscriptions', icon: Repeat },
        { name: 'Invoices & Payments', path: '/billing', icon: DollarSign },
        { name: 'Products Catalog', path: '/products', icon: Package },
        { name: 'Deal Health', path: '/deal-health', icon: Activity },
        { name: 'Reports & Analytics', path: '/reports', icon: BarChart3 },
        { name: 'Backend Setup', path: '/backend', icon: Settings },
      ];
    }

    // Default: Sales Rep
    return [
      { name: 'Dashboard', path: '/workspace', icon: LayoutDashboard },
      { name: 'Quotations', path: '/quotations', icon: FileText },
      { name: 'Approvals Queue', path: '/approvals', icon: CheckSquare },
      { name: 'Fulfillment Splitting', path: '/fulfillment', icon: Truck },
      { name: 'Subscriptions', path: '/subscriptions', icon: Repeat },
      { name: 'Invoices', path: '/invoices', icon: DollarSign },
      { name: 'Products Catalog', path: '/products', icon: Package },
      { name: 'Deal Health', path: '/deal-health', icon: Activity },
      { name: 'Reports & Analytics', path: '/reports', icon: BarChart3 },
    ];
  };

  const navLinks = getNavLinks();

  const SidebarContent = () => (
    <aside
      className={`bg-[var(--ink)] text-[var(--text-inverse)] h-full flex flex-col justify-between select-none ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Top Section */}
      <div className="flex flex-col min-h-0 flex-1">
        {/* Brand Header */}
        <div className="p-3.5 flex items-center justify-between border-b border-white/10 shrink-0">
          {!collapsed && (
            <div>
              <div
                onClick={() => { navigate('/workspace'); handleNavClick(); }}
                className="brand-mark text-lg font-bold text-white cursor-pointer tracking-tight"
              >
                DealFlow360
              </div>
              <div className="text-[10px] text-[var(--text-inverse-dim)] font-mono">
                Sales Engine v1.0
              </div>
            </div>
          )}

          {collapsed && (
            <div
              onClick={() => { navigate('/workspace'); handleNavClick(); }}
              className="brand-mark text-lg text-[var(--gold)] font-bold cursor-pointer mx-auto"
            >
              DF
            </div>
          )}

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="hidden lg:block text-[var(--text-inverse-dim)] hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => dispatch(setMobileMenuOpen(false))}
            className="lg:hidden text-[var(--text-inverse-dim)] hover:text-white p-1 rounded hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Role Badge */}
        {!collapsed && (
          <div className="px-4 py-2.5 bg-white/5 border-b border-white/10 flex items-center justify-between shrink-0">
            <span className="text-[10px] text-[var(--text-inverse-dim)] uppercase tracking-wider font-semibold">User Role</span>
            <span className="bg-[var(--gold)] text-white text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
              {role ? role.replace('_', ' ') : 'Sales Rep'}
            </span>
          </div>
        )}

        {/* Vertical Navigation Menu */}
        <nav className="p-3 space-y-2.5 overflow-y-auto flex-1 scrollbar-none">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 rounded-xl text-xs font-medium transition-all ${
                    collapsed ? 'justify-center p-2.5' : 'px-3.5 py-2.5'
                  } ${
                    isActive
                      ? 'bg-white/15 text-white border-l-4 border-[var(--gold)] font-semibold shadow-inner'
                      : 'text-[var(--text-inverse-dim)] hover:text-white hover:bg-white/5'
                  }`
                }
                title={collapsed ? link.name : ''}
              >
                <Icon className="w-4.5 h-4.5 shrink-0 text-[var(--gold)]" />
                {!collapsed && <span className="truncate">{link.name}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* FIXED Bottom Section */}
      <div className="p-3 border-t border-white/10 bg-[#14171C] shrink-0 space-y-2.5 mt-auto">
        {!collapsed && (
          <div className="flex items-center gap-2.5 px-1 py-1">
            <div className="w-7 h-7 rounded-full bg-[var(--gold)] text-white flex items-center justify-center text-xs font-bold shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="truncate">
              <div className="text-xs font-bold text-white truncate">{user?.name || 'User'}</div>
              <div className="text-[10px] text-[var(--text-inverse-dim)] truncate">{user?.email || 'user@dealflow360.com'}</div>
            </div>
          </div>
        )}

        <button
          onClick={() => { handleLogout(); handleNavClick(); }}
          className={`w-full bg-rose-950/60 hover:bg-rose-900/80 text-rose-200 border border-rose-800/60 hover:border-rose-600 rounded-xl transition-all text-xs font-bold flex items-center justify-center gap-2 ${
            collapsed ? 'p-2.5' : 'py-2.5 px-3'
          }`}
          title="Logout of DealFlow360"
        >
          <LogOut className="w-4 h-4 shrink-0 text-rose-400" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-screen sticky top-0 shrink-0 z-40">
        <SidebarContent />
      </div>

      {/* Mobile Slide-Over Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            onClick={() => dispatch(setMobileMenuOpen(false))}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          ></div>
          <div className="relative z-10 w-72 h-full shadow-2xl">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
