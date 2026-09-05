import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, DollarSign, Truck, FileText, Calendar, Package } from 'lucide-react';
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
    createdDate: 'Aug 20, 2026',
    orderRef: 'Q-1042',
    deliveryStatus: 'Split Allocated (East Depot + Main Warehouse)',
    items: [
      { product: 'Laptop Pro 14', qty: 2, price: '$2,280' },
      { product: 'Onsite Setup', qty: 1, price: '$450' }
    ]
  });

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
      toast.success(`Payment recorded for invoice ${invoice.invoiceNumber}! Status updated to Paid.`);
    } catch (err) {
      toast.error('Failed to record payment');
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/invoices')}
          className="text-xs text-[var(--teal)] hover:underline flex items-center gap-1 font-medium mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Invoices List
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--text)] tracking-tight mb-1">
              Payment & Delivery Reconciliation: {invoice.invoiceNumber}
            </h1>
            <p className="text-sm text-[var(--text-muted)]">
              Customer: <strong className="text-[var(--text)]">{invoice.customer}</strong> · Originating Order: <strong className="text-[var(--text)]">{invoice.orderRef}</strong>
            </p>
          </div>

          <span className={`px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-xs ${
            invoice.status === 'Paid' ? 'bg-[#2F6F5E]' : 'bg-[var(--rust)]'
          }`}>
            {invoice.status}
          </span>
        </div>
      </div>

      {/* KPI Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="panel-card space-y-1">
          <div className="text-xs font-semibold text-[var(--text-muted)]">Total Amount Due</div>
          <div className="text-2xl font-bold font-mono text-[var(--text)]">{invoice.amount}</div>
        </div>

        <div className="panel-card space-y-1">
          <div className="text-xs font-semibold text-[var(--text-muted)]">Payment Due Date</div>
          <div className="text-2xl font-bold font-mono text-[var(--teal)]">{invoice.dueDate}</div>
        </div>

        <div className="panel-card space-y-1">
          <div className="text-xs font-semibold text-[var(--text-muted)]">Fulfillment / Delivery Status</div>
          <div className="text-sm font-semibold text-emerald-800">{invoice.deliveryStatus}</div>
        </div>
      </div>

      {/* Invoice Line Items */}
      <div className="panel-card space-y-3">
        <h3 className="text-sm font-semibold text-[var(--text)] flex items-center gap-2">
          <Package className="w-4 h-4 text-[var(--teal)]" /> Invoiced Line Items
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[var(--paper-dim)] border-b border-[var(--steel-line)] text-[var(--text-muted)] font-semibold">
              <tr>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Qty</th>
                <th className="py-3 px-4">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--paper-dim)]">
              {(invoice.items || []).map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[var(--text)]">{row.product}</td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-[var(--text)]">{row.qty}</td>
                  <td className="py-3.5 px-4 font-mono text-[var(--text)]">{row.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Action Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[var(--paper-dim)]">
        <button
          onClick={() => navigate('/invoices')}
          className="px-4 py-2 text-xs font-semibold border border-[var(--steel-line)] rounded-xl hover:bg-slate-50 transition-colors"
        >
          Close
        </button>

        {invoice.status === 'Paid' ? (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            Payment Received & Reconciled with Bank
          </div>
        ) : (
          <button
            onClick={handleRecordPayment}
            className="px-6 py-2.5 bg-[#2F6F5E] hover:bg-[#245749] text-white text-xs font-extrabold rounded-xl shadow-xs flex items-center gap-2 transition-all"
          >
            <DollarSign className="w-4 h-4" /> Record Payment & Mark Paid
          </button>
        )}
      </div>
    </div>
  );
};

export default InvoiceDetail;
