import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleRoute = ({ allowedRoles = [] }) => {
  const { user, role, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = (role || '').toLowerCase();
  const normalizedAllowed = allowedRoles.map((r) => r.toLowerCase());

  if (!normalizedAllowed.includes(userRole)) {
    // Redirect user to their role's dedicated portal/dashboard
    switch (userRole) {
      case 'customer':
        return <Navigate to="/portal" replace />;
      case 'sales_manager':
        return <Navigate to="/approvals" replace />;
      case 'finance':
        return <Navigate to="/billing" replace />;
      case 'admin':
        return <Navigate to="/backend" replace />;
      case 'sales_rep':
      default:
        return <Navigate to="/workspace" replace />;
    }
  }

  return <Outlet />;
};

export default RoleRoute;
