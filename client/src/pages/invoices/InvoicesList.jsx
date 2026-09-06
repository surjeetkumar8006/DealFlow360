import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, ArrowRight, CheckCircle2, Clock, ShieldAlert, Check, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const DEFAULT_INVOICES = [
  { id: 'inv-1003', invoiceNumber: 'INV-1003', customer: 'Beta Industries', amount: '$24,148', status: 'Unpaid', approvalStatus: 'APPROVED', dueDate: 'Sep 25' },
  { id: 'inv-9635', invoiceNumber: 'INV-9635', customer: 'Test', amount: '$30,448', status: 'Unpaid', approvalStatus: 'APPROVED', dueDate: 'Sep 25' },
  { id: 'inv-1042', invoiceNumber: 'INV-1042', customer: 'Acme Corp', amount: '$2,730', status: 'Unpaid', approvalStatus: 'APPROVED', dueDate: 'Sep 10' },
  { id: 'inv-6685', invoiceNumber: 'INV-6685', customer: 'New Prod.', amount: '$34,600', status: 'Unpaid', approvalStatus: 'APPROVED', dueDate: 'Sep 25' },
  { id: 'inv-1038', invoiceNumber: 'INV-1038', customer: 'Nova Retail', amount: '$9,750', status: 'Paid', approvalStatus: 'APPROVED', dueDate: 'Aug 30' },
  { id: 'inv-1006', invoiceNumber: 'INV-1006', customer: 'Orion Ltd', amount: '$41,000', status: 'Unpaid', approvalStatus: 'APPROVED', dueDate: 'Sep 25' },
  { id: 'inv-1043', invoiceNumber: 'INV-1043', customer: 'Acme Corp', amount: '$46', status: 'Paid', approvalStatus: 'AUTO_APPROVED', dueDate: 'Sep 15' },
  { id: 'inv-1035', invoiceNumber: 'INV-1035', customer: 'Beta Industries', amount: '$1,200', status: 'Unpaid', approvalStatus: 'APPROVED', dueDate: 'Oct 05' }
];

const InvoicesList = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const currentRole = (role || 'sales_rep').toLowerCase();

  // Table dataset initialized cleanly
  const [invoices, setInvoices] = useState(DEFAULT_INVOICES);
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'Unpaid' | 'Paid' | 'PendingApproval'

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await api.get('/invoices').catch(() => null);
        if (res && res.data && res.data.data && res.data.data.length > 0) {
          setInvoices(res.data.data);
        }
      } catch (err) {
        console.error('Fetch invoices error:', err);
      }
    };
    fetchInvoices();
  }, []);

  // Dynamically calculate status counts
  const counts = useMemo(() => {
    const unpaid = invoices.filter((i) => (i.status || '').toLowerCase() === 'unpaid').length;
    const paid = invoices.filter((i) => (i.status || '').toLowerCase() === 'paid').length;
    const pendingApproval = invoices.filter((i) =>
      ['PENDING_FINANCE', 'PENDING_APPROVAL'].includes(i.approvalStatus)
    ).length;
    return { unpaid, paid, pendingApproval };
  }, [invoices]);

  const filteredInvoices = useMemo(() => {
    if (filter === 'ALL') return invoices;
    if (filter === 'Unpaid') return invoices.filter((inv) => (inv.status || '').toLowerCase() === 'unpaid');
    if (filter === 'Paid') return invoices.filter((inv) => (inv.status || '').toLowerCase() === 'paid');
    if (filter === 'PendingApproval') {
      return invoices.filter((inv) => ['PENDING_FINANCE', 'PENDING_APPROVAL'].includes(inv.approvalStatus));
    }
    return invoices;
  }, [invoices, filter]);

  const handleRowClick = (invId) => {
    navigate(`/invoices/${invId}`);
  };

  const handleApproveInvoice = async (e, invId) => {
    e.stopPropagation();
    try {
      await api.post(`/invoices/${invId}/approve`).catch(() => null);
      setInvoices((prev) =>
        prev.map((i) => (i._id === invId || i.id === invId || i.invoiceNumber === invId ? { ...i, approvalStatus: 'APPROVED' } : i))
      );
      toast.success(`Invoice ${invId} approved for payment release!`);
    } catch (err) {
      toast.error('Failed to approve invoice');
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Title & Subtitle */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--text)] tracking-tight mb-1">
            Invoices (List)
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            Every invoice generated from one-time and recurring orders with governance & approval routing
          </p>
        </div>

        {/* Persona Active Role Indicator */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[var(--paper-dim)] border border-[var(--steel-line)] text-xs font-semibold text-[var(--text)]">
          <UserCheck className="w-4 h-4 text-[var(--teal)]" />
          <span>Role: <strong className="uppercase text-[var(--teal)]">{currentRole.replace('_', ' ')}</strong></span>
        </div>
      </div>

      {/* Status Badges / Filter Pills */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => setFilter(filter === 'Unpaid' ? 'ALL' : 'Unpaid')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-xs transition-transform active:scale-95 cursor-pointer ${
            filter === 'Unpaid' ? 'ring-2 ring-rose-900 bg-rose-700' : 'bg-rose-600 hover:bg-rose-700'
          }`}
        >
          {counts.unpaid} Unpaid
        </button>

        <button
          onClick={() => setFilter(filter === 'Paid' ? 'ALL' : 'Paid')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-xs transition-transform active:scale-95 cursor-pointer ${
            filter === 'Paid' ? 'ring-2 ring-emerald-900 bg-emerald-700' : 'bg-emerald-600 hover:bg-emerald-700'
          }`}
        >
          {counts.paid} Paid
        </button>

        <button
          onClick={() => setFilter(filter === 'PendingApproval' ? 'ALL' : 'PendingApproval')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-xs transition-transform active:scale-95 cursor-pointer ${
            filter === 'PendingApproval' ? 'ring-2 ring-blue-900 bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 inline-block mr-1" />
          {counts.pendingApproval} Pending Approval
        </button>

        {filter !== 'ALL' && (
          <button
            onClick={() => setFilter('ALL')}
            className="text-xs text-[var(--teal)] underline font-medium ml-2 cursor-pointer"
          >
            Show All
          </button>
        )}
      </div>

      {/* Table */}
      <div className="panel-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[var(--paper-dim)] border-b border-[var(--steel-line)] text-[var(--text-muted)] font-semibold">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment Status</th>
                <th className="py-3 px-4">Approval / Governance</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-right">Approval Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--paper-dim)]">
              {filteredInvoices.map((row) => {
                const invId = row._id || row.id || row.invoiceNumber;
                const isPending = ['PENDING_FINANCE', 'PENDING_APPROVAL'].includes(row.approvalStatus);

                return (
                  <tr
                    key={invId}
                    onClick={() => handleRowClick(invId)}
                    className="hover:bg-amber-50/50 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4 font-bold text-[var(--teal)] group-hover:underline flex items-center justify-between">
                      <span>{row.invoiceNumber}</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--teal)] ml-2" />
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[var(--text)]">{row.customer}</td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-[var(--text)]">{row.amount}</td>
                    <td className="py-3.5 px-4 font-mono font-medium">
                      {row.status === 'Paid' ? (
                        <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-[#2F6F5E]/10 text-[var(--teal)] border border-[#2F6F5E]/20">
                          {row.status}
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-[var(--rust)]/10 text-[var(--rust)] border border-[var(--rust)]/20">
                          {row.status}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      {row.approvalStatus === 'APPROVED' ? (
                        <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-600" /> Approved
                        </span>
                      ) : row.approvalStatus === 'PENDING_FINANCE' ? (
                        <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 inline-flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3 text-blue-600" /> Pending Finance
                        </span>
                      ) : row.approvalStatus === 'PENDING_APPROVAL' ? (
                        <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 inline-flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-600" /> Pending Manager
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
                          Auto-Approved
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[var(--text-muted)]">{row.dueDate || 'Sep 25'}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isPending ? (
                          <button
                            onClick={(e) => handleApproveInvoice(e, invId)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold shadow-xs flex items-center gap-1 transition-all"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/approvals/${row.orderRef || 'q-1042'}`);
                            }}
                            className="text-xs text-[var(--teal)] hover:underline font-medium"
                          >
                            View Audit
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Yellow Callout Banner */}
      <div className="p-3.5 bg-[#FEFCE8] border border-[#FEF08A] rounded-xl text-xs text-[#854D0E] font-medium flex items-center gap-2 leading-relaxed shadow-xs justify-between">
        <div>
          Click an invoice row to open its full payment, delivery reconciliation, and approval detail.
        </div>
        {counts.pendingApproval > 0 && (
          <button
            onClick={() => setFilter('PendingApproval')}
            className="px-3 py-1 bg-[#CA8A04] hover:bg-[#A16207] text-white font-bold rounded-lg text-xs shrink-0 transition-colors"
          >
            Review {counts.pendingApproval} Pending Approval(s)
          </button>
        )}
      </div>
    </div>
  );
};

export default InvoicesList;
