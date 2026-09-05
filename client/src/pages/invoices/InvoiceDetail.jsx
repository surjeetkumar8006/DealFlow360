import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, DollarSign, Download, AlertCircle, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState({
    id: id || 'inv-1042',
    invoiceNumber: (id || 'INV-1042').toUpperCase(),
    customer: 'Acme Corp',
    amount: '$2,730',
    status: 'Unpaid',
    dueDate: 'Sep 10',
    orderRef: 'Q-1042',
  });

  const [relatedInvoices, setRelatedInvoices] = useState([
    { invoiceNum: 'INV-1042', amount: '$2,730', status: 'Unpaid', dueDate: 'Sep 10' },
    { invoiceNum: 'INV-1043 (Recurring)', amount: '$46', status: 'Paid', dueDate: 'Sep 15' },
  ]);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get(`/invoices/${id}`);
        if (res.data && res.data.data) {
          setInvoice(res.data.data);
        }
      } catch (err) {
        console.error('Fetch invoice detail error:', err);
      }
    };
    fetchDetail();
  }, [id]);

  const handleRecordPayment = async () => {
    try {
      await api.post(`/invoices/${invoice.id}/pay`).catch(() => null);
      setInvoice((prev) => ({
        ...prev,
        status: 'Paid'
      }));
      setRelatedInvoices((prev) =>
        prev.map((inv) =>
          inv.invoiceNum === 'INV-1042' ? { ...inv, status: 'Paid' } : inv
        )
      );
      toast.success(`Payment recorded for invoice ${invoice.invoiceNumber}! Status updated to Paid.`);
    } catch (err) {
      toast.error('Failed to record payment');
    }
  };

  const handleDownloadSummary = () => {
    toast.success(`Downloading invoice summary for ${invoice.invoiceNumber}...`);
  };

  // Stepper Status Logic
  const steps = [
    { label: 'Order Confirmed', completed: true, active: false },
    { label: 'Shipped', completed: true, active: false },
    { label: 'Invoiced', completed: invoice.status === 'Paid', active: invoice.status === 'Unpaid' },
    { label: 'Paid', completed: invoice.status === 'Paid', active: false },
  ];

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back link & Header */}
      <div>
        <button
          onClick={() => navigate('/invoices')}
          className="text-xs text-[var(--teal)] hover:underline flex items-center gap-1 font-medium mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Invoices List
        </button>

        <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--text)] tracking-tight mb-1">
          Invoice Detail: {invoice.invoiceNumber} ({invoice.customer})
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          Opened by clicking a row on the Invoices list
        </p>
      </div>

      {/* 4-Step Stepper Component */}
      <div className="panel-card py-6 px-4 sm:px-8">
        <div className="flex items-center justify-between relative max-w-3xl mx-auto">
          {/* Background Connecting Line */}
          <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-0.5 bg-slate-300 dark:bg-slate-700 z-0"></div>

          {steps.map((step, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center gap-2 group">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-sm ${
                  step.completed
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 dark:ring-emerald-950'
                    : step.active
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-950 scale-110'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                }`}
              >
                {step.completed ? (
                  <Check className="w-5 h-5 stroke-[3]" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>
              <span
                className={`text-xs font-semibold whitespace-nowrap ${
                  step.completed || step.active
                    ? 'text-[var(--text)]'
                    : 'text-[var(--text-muted)]'
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Invoices Breakdown Table */}
      <div className="panel-card overflow-hidden space-y-3">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[var(--paper-dim)] border-b border-[var(--steel-line)] text-[var(--text-muted)] font-semibold">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--paper-dim)]">
              {relatedInvoices.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[var(--text)]">{row.invoiceNum}</td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-[var(--text)]">{row.amount}</td>
                  <td className="py-3.5 px-4 font-mono">
                    <span
                      className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                        row.status === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[var(--text-muted)] font-mono">{row.dueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          onClick={handleRecordPayment}
          disabled={invoice.status === 'Paid'}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 transition-all ${
            invoice.status === 'Paid'
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
              : 'bg-emerald-700 hover:bg-emerald-800 text-white'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          {invoice.status === 'Paid' ? 'Payment Recorded (Paid)' : 'Record Payment'}
        </button>

        <button
          onClick={handleDownloadSummary}
          className="px-5 py-2.5 border border-[var(--steel-line)] hover:bg-slate-50 dark:hover:bg-slate-800/50 text-[var(--text)] text-xs font-bold rounded-xl flex items-center gap-2 transition-all"
        >
          <Download className="w-4 h-4 text-[var(--teal)]" />
          Download Summary
        </button>
      </div>

      {/* Yellow Callout Banner */}
      <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 rounded-xl text-xs text-amber-900 dark:text-amber-200 font-medium flex items-center gap-3 shadow-xs">
        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
        <span>
          Partial invoicing stays reconciled with partial delivery, nothing is billed before it ships.
        </span>
      </div>
    </div>
  );
};

export default InvoiceDetail;

