import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import api from '../../services/api';

const InvoicesList = () => {
  const navigate = useNavigate();

  // Status counts matching Wireframe 12
  const [counts, setCounts] = useState({
    unpaid: 4,
    paid: 21
  });

  // Table dataset matching Wireframe 12
  const [invoices, setInvoices] = useState([
    { id: 'inv-1042', invoiceNumber: 'INV-1042', customer: 'Acme Corp', amount: '$2,730', status: 'Unpaid', dueDate: 'Sep 10' },
    { id: 'inv-1043', invoiceNumber: 'INV-1043', customer: 'Acme Corp', amount: '$46', status: 'Paid', dueDate: 'Sep 15' },
    { id: 'inv-1038', invoiceNumber: 'INV-1038', customer: 'Nova Retail', amount: '$9,750', status: 'Paid', dueDate: 'Aug 30' },
    { id: 'inv-1035', invoiceNumber: 'INV-1035', customer: 'Beta Industries', amount: '$1,200', status: 'Unpaid', dueDate: 'Oct 05' }
  ]);

  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'Unpaid' | 'Paid'

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await api.get('/invoices').catch(() => null);
        if (res && res.data && res.data.data) {
          setInvoices(res.data.data);
        }
        if (res && res.data && res.data.counts) {
          setCounts(res.data.counts);
        }
      } catch (err) {
        console.error('Fetch invoices error:', err);
      }
    };
    fetchInvoices();
  }, []);

  const filteredInvoices = filter === 'ALL'
    ? invoices
    : invoices.filter(inv => inv.status.toLowerCase() === filter.toLowerCase());

  const handleRowClick = (invId) => {
    navigate(`/invoices/${invId}`);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Title & Subtitle matching Wireframe 12 */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--text)] tracking-tight mb-1">
          Invoices (List)
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          Every invoice generated from one-time and recurring orders
        </p>
      </div>

      {/* Status Badges / Filter Pills matching Wireframe 12 */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => setFilter(filter === 'Unpaid' ? 'ALL' : 'Unpaid')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-xs transition-transform active:scale-95 ${
            filter === 'Unpaid' ? 'ring-2 ring-rose-900 bg-rose-700' : 'bg-rose-600 hover:bg-rose-700'
          }`}
        >
          {counts.unpaid} Unpaid
        </button>

        <button
          onClick={() => setFilter(filter === 'Paid' ? 'ALL' : 'Paid')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-xs transition-transform active:scale-95 ${
            filter === 'Paid' ? 'ring-2 ring-emerald-900 bg-emerald-700' : 'bg-emerald-600 hover:bg-emerald-700'
          }`}
        >
          {counts.paid} Paid
        </button>

        {filter !== 'ALL' && (
          <button
            onClick={() => setFilter('ALL')}
            className="text-xs text-[var(--teal)] underline font-medium ml-2"
          >
            Show All
          </button>
        )}
      </div>

      {/* Table matching Wireframe 12 */}
      <div className="panel-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[var(--paper-dim)] border-b border-[var(--steel-line)] text-[var(--text-muted)] font-semibold">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--paper-dim)]">
              {filteredInvoices.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => handleRowClick(row.id)}
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
                  <td className="py-3.5 px-4 font-mono text-[var(--text-muted)]">{row.dueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Yellow Callout Banner matching Wireframe 12 */}
      <div className="p-3.5 bg-[#FEFCE8] border border-[#FEF08A] rounded-xl text-xs text-[#854D0E] font-medium flex items-center gap-2 leading-relaxed shadow-xs">
        <div>
          Click an invoice row to open its full payment and delivery reconciliation detail.
        </div>
      </div>
    </div>
  );
};

export default InvoicesList;
