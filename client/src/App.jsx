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
const QuotationsList = lazy(() => import('./pages/quotations/QuotationsList'));
const QuotationDetail = lazy(() => import('./pages/quotations/QuotationDetail'));
const ApprovalsQueue = lazy(() => import('./pages/approvals/ApprovalsQueue'));
const ApprovalDetail = lazy(() => import('./pages/approvals/ApprovalDetail'));
const FulfillmentSplitting = lazy(() => import('./pages/fulfillment/FulfillmentSplitting'));
const FulfillmentDetail = lazy(() => import('./pages/fulfillment/FulfillmentDetail'));
const Subscriptions = lazy(() => import('./pages/subscriptions/Subscriptions'));
const SubscriptionDetail = lazy(() => import('./pages/subscriptions/SubscriptionDetail'));
const InvoicesList = lazy(() => import('./pages/invoices/InvoicesList'));
const InvoiceDetail = lazy(() => import('./pages/invoices/InvoiceDetail'));
const DealHealth = lazy(() => import('./pages/deal-health/DealHealth'));
const ReportsAnalytics = lazy(() => import('./pages/reports/ReportsAnalytics'));
const AdminSetup = lazy(() => import('./pages/backend/AdminSetup'));
const CustomerPortal = lazy(() => import('./pages/customer-portal/CustomerPortal'));

function App() {
  const ALL_INTERNAL_ROLES = ['sales_rep', 'sales_manager', 'finance', 'admin'];

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
                    {/* Internal User Workspace Routes (All Internal Roles Allowed) */}
                    <Route element={<RoleRoute allowedRoles={ALL_INTERNAL_ROLES} />}>
                      <Route path="/workspace" element={<Workspace />} />
                      <Route path="/quotations" element={<QuotationsList />} />
                      <Route path="/quotations/:id" element={<QuotationDetail />} />
                      <Route path="/approvals" element={<ApprovalsQueue />} />
                      <Route path="/approvals/:id" element={<ApprovalDetail />} />
                      <Route path="/fulfillment" element={<FulfillmentSplitting />} />
                      <Route path="/fulfillment/:id" element={<FulfillmentDetail />} />
                      <Route path="/subscriptions" element={<Subscriptions />} />
                      <Route path="/subscriptions/:id" element={<SubscriptionDetail />} />
                      <Route path="/invoices" element={<InvoicesList />} />
                      <Route path="/invoices/:id" element={<InvoiceDetail />} />
                      <Route path="/billing" element={<InvoicesList />} />
                      <Route path="/deal-health" element={<DealHealth />} />
                      <Route path="/reports" element={<ReportsAnalytics />} />
                    </Route>

                    {/* Admin Backend Setup */}
                    <Route element={<RoleRoute allowedRoles={['admin']} />}>
                      <Route path="/backend" element={<AdminSetup />} />
                    </Route>

                    {/* Customer Portal */}
                    <Route element={<RoleRoute allowedRoles={['customer', ...ALL_INTERNAL_ROLES]} />}>
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
