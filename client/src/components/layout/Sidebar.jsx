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
        { name: 'Approvals Queue', path: '/approvals', icon: CheckSquare },
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
      className={`bg-white text-slate-900 border-r border-slate-200 h-full flex flex-col justify-between select-none ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Top Section */}
      <div className="flex flex-col min-h-0 flex-1">
        {/* Brand Header */}
        <div className="p-3.5 flex items-center justify-between border-b border-slate-200 shrink-0">
          {!collapsed && (
            <div>
              <div
                onClick={() => { navigate('/workspace'); handleNavClick(); }}
                className="brand-mark text-lg font-extrabold text-slate-900 cursor-pointer tracking-tight"
              >
                DealFlow360
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                Sales Engine v1.0
              </div>
            </div>
          )}

          {collapsed && (
            <div
              onClick={() => { navigate('/workspace'); handleNavClick(); }}
              className="brand-mark text-lg text-slate-900 font-extrabold cursor-pointer mx-auto"
            >
              DF
            </div>
          )}

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="hidden lg:block text-slate-400 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => dispatch(setMobileMenuOpen(false))}
            className="lg:hidden text-slate-400 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Role Badge */}
        {!collapsed && (
          <div className="px-4 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">User Role</span>
            <span className="bg-white text-slate-900 border border-slate-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded uppercase tracking-wider shadow-2xs">
              {role ? role.replace('_', ' ') : 'Sales Rep'}
            </span>
          </div>
        )}

        {/* Vertical Navigation Menu */}
        <nav className="p-3 space-y-1.5 overflow-y-auto flex-1 scrollbar-none">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 rounded-xl text-xs font-semibold transition-all group ${
                    collapsed ? 'justify-center p-2.5' : 'px-3.5 py-2.5'
                  } ${
                    isActive
                      ? 'bg-white text-slate-900 font-extrabold border border-slate-300 shadow-xs border-l-4 border-slate-800'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
                title={collapsed ? link.name : ''}
              >
                {({ isActive }) => (
                  <>
                    {collapsed ? (
                      <Icon className={`w-4.5 h-4.5 shrink-0 transition-colors ${
                        isActive ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-900'
                      }`} />
                    ) : (
                      <span className="truncate">{link.name}</span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* FIXED Bottom Section */}
      <div className="p-3 border-t border-slate-200 bg-white shrink-0 space-y-2.5 mt-auto">
        {!collapsed && (
          <div className="flex items-center gap-2.5 px-1 py-1">
            <div className="w-7.5 h-7.5 rounded-full bg-white text-slate-900 border border-slate-300 flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="truncate">
              <div className="text-xs font-bold text-slate-900 truncate">{user?.name || 'User'}</div>
              <div className="text-[10px] text-slate-500 truncate">{user?.email || 'user@dealflow360.com'}</div>
            </div>
          </div>
        )}

        <button
          onClick={() => { handleLogout(); handleNavClick(); }}
          className={`w-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 hover:border-rose-300 rounded-xl transition-all text-xs font-bold flex items-center justify-center gap-2 ${
            collapsed ? 'p-2.5' : 'py-2.5 px-3'
          }`}
          title="Logout of DealFlow360"
        >
          {collapsed ? <LogOut className="w-4 h-4 shrink-0 text-rose-600" /> : <span>Logout</span>}
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
