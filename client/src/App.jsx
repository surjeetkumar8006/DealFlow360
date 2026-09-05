import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store/store';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';
import MainLayout from './components/layout/MainLayout';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorBoundary from './components/common/ErrorBoundary';

// Lazy Loaded Page Components for Code-Splitting & Optimized Performance
const Login = lazy(() => import('./pages/auth/Login'));
const Signup = lazy(() => import('./pages/auth/Signup'));
const Workspace = lazy(() => import('./pages/dashboard/Workspace'));
const ApprovalsQueue = lazy(() => import('./pages/approvals/ApprovalsQueue'));
const Subscriptions = lazy(() => import('./pages/subscriptions/Subscriptions'));
const AdminSetup = lazy(() => import('./pages/backend/AdminSetup'));
const CustomerPortal = lazy(() => import('./pages/customer-portal/CustomerPortal'));

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <AuthProvider>
          <Router>
            {/* Global Toast Notification Engine */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3500,
                style: {
                  background: 'var(--ink)',
                  color: '#ffffff',
                  border: '1px solid var(--steel-line)',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontFamily: 'Inter, sans-serif',
                },
                success: {
                  iconTheme: {
                    primary: 'var(--teal)',
                    secondary: '#ffffff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: 'var(--rust)',
                    secondary: '#ffffff',
                  },
                },
              }}
            />

            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* Public Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected Internal & Customer Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<MainLayout />}>
                    {/* Sales Rep & Manager Workspace */}
                    <Route element={<RoleRoute allowedRoles={['sales_rep', 'sales_manager', 'admin']} />}>
                      <Route path="/workspace" element={<Workspace />} />
                      <Route path="/quotations" element={<Workspace />} />
                      <Route path="/deal-health" element={<Workspace />} />
                      <Route path="/reports" element={<Workspace />} />
                    </Route>

                    {/* Manager Approvals Queue */}
                    <Route element={<RoleRoute allowedRoles={['sales_manager', 'admin']} />}>
                      <Route path="/approvals" element={<ApprovalsQueue />} />
                    </Route>

                    {/* Finance Invoices & Subscriptions */}
                    <Route element={<RoleRoute allowedRoles={['finance', 'admin']} />}>
                      <Route path="/billing" element={<Subscriptions />} />
                      <Route path="/subscriptions" element={<Subscriptions />} />
                      <Route path="/fulfillment" element={<Subscriptions />} />
                    </Route>

                    {/* Admin Backend Setup */}
                    <Route element={<RoleRoute allowedRoles={['admin']} />}>
                      <Route path="/backend" element={<AdminSetup />} />
                    </Route>

                    {/* Customer Portal */}
                    <Route element={<RoleRoute allowedRoles={['customer', 'sales_rep', 'admin']} />}>
                      <Route path="/portal" element={<CustomerPortal />} />
                    </Route>
                  </Route>
                </Route>

                {/* Fallback Catch-all Route */}
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </Suspense>
          </Router>
        </AuthProvider>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
