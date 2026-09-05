import React, { useState } from 'react';
import { MessageSquare, CheckCircle2, AlertTriangle, Send, Calendar, FileText, CreditCard, Shield, Plus, Download, RefreshCw, Layers } from 'lucide-react';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import api from '../../services/api';

const CustomerPortal = () => {
  const [activeTab, setActiveTab] = useState('QUOTATION'); // 'QUOTATION' | 'SUBSCRIPTIONS' | 'INVOICES'
  const [status, setStatus] = useState('Under Negotiation');
  const [counterDiscount, setCounterDiscount] = useState('');
  const [requestedDate, setRequestedDate] = useState('');
  const [newLine, setNewLine] = useState('Laptop Pro 14');
  const [newCommentText, setNewCommentText] = useState('');

  const [quoteItems, setQuoteItems] = useState([
    { id: 'qi-1', product: 'Laptop Pro 14', category: 'Hardware', qty: 2, price: 1200, total: 2400 },
    { id: 'qi-2', product: 'Onsite Setup Service', category: 'Services', qty: 1, price: 450, total: 450 },
    { id: 'qi-3', product: 'Care Plan 2yr', category: 'Subscription', qty: 1, price: 120, total: 120 },
  ]);

  const [comments, setComments] = useState([
    { line: 'Extended Warranty', comment: 'Can this be 15% off instead of 10%?' },
    { line: 'Onsite Setup', comment: 'Can we push this to next month?' }
  ]);

  const [customerSubscriptions, setCustomerSubscriptions] = useState([
    { id: 'cs-1', plan: 'Care Plan 2yr', cycle: 'Monthly', mrr: '$40/mo', nextBill: 'Sep 15, 2026', autoRenew: true, status: 'Active' },
    { id: 'cs-2', plan: 'Cloud Storage Node (10TB)', cycle: 'Yearly', mrr: '$120/yr', nextBill: 'Nov 01, 2026', autoRenew: true, status: 'Active' }
  ]);

  const [customerInvoices, setCustomerInvoices] = useState([
    { id: 'ci-1', invNum: 'INV-1042', date: 'Aug 20, 2026', due: 'Sep 10, 2026', amount: '$2,730', status: 'Unpaid' },
    { id: 'ci-2', invNum: 'INV-1043', date: 'Aug 15, 2026', due: 'Sep 15, 2026', amount: '$46', status: 'Paid' }
  ]);

  const [notification, setNotification] = useState(null);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    setComments([...comments, { line: newLine, comment: newCommentText }]);
    setNewCommentText('');
    toast.success('Line comment added');
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    const discountVal = parseFloat(counterDiscount);

    if (isNaN(discountVal) && comments.length === 0) {
      toast.error('Please enter a counter discount % or add line comments');
      return;
    }

    if (discountVal > 15) {
      const msg = `⚠️ Counter discount proposal of ${discountVal}% exceeds Gold tier limit (15%). Quotation Q-1042 automatically re-entered approval flow!`;
      setNotification({ type: 'WARNING', message: msg });
      setStatus('Pending Approval');
      toast.error('Proposal exceeds discount ceiling — re-sent for Manager Approval');

      await api.patch('/quotations/q-1042/status', { status: 'PENDING_APPROVAL', note: `Customer counter discount request: ${discountVal}%` }).catch(() => null);
    } else {
      const msg = `✅ Counter request submitted to your Sales Rep for review.`;
      setNotification({ type: 'SUCCESS', message: msg });
      setStatus('Under Negotiation');
      toast.success('Negotiation proposal submitted successfully!');
    }
  };

  const handleConfirmQuotation = async () => {
    setStatus('Confirmed');
    setNotification({
      type: 'SUCCESS',
      message: '🎉 Quotation confirmed! Order proceeds directly to warehouse fulfillment.'
    });
    toast.success('Quotation confirmed! Order sent to fulfillment.');
    await api.patch('/quotations/q-1042/status', { status: 'CONFIRMED', note: 'Confirmed by customer in portal' }).catch(() => null);
  };

  const handlePayInvoice = (invNum) => {
    setCustomerInvoices((prev) =>
      prev.map((inv) => (inv.invNum === invNum ? { ...inv, status: 'Paid' } : inv))
    );
    toast.success(`Payment successful for invoice ${invNum}! Status updated to Paid.`);
  };

  const handleDownloadInvoice = (invNum) => {
    try {
      const doc = new jsPDF();
      doc.setFillColor(38, 43, 51);
      doc.rect(0, 0, 210, 36, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('DEALFLOW360 CUSTOMER RECEIPT', 14, 20);
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Official Payment Receipt for Invoice ${invNum} | Customer: Acme Corp`, 14, 28);
      
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(`Receipt Reference: REC-${invNum.replace('INV-', '')}`, 14, 50);
      doc.text(`Invoice Number: ${invNum}`, 14, 58);
      doc.text(`Customer Name: Acme Corp`, 14, 66);
      doc.text(`Payment Status: Paid in Full`, 14, 74);
      doc.text(`Date Issued: ${new Date().toLocaleDateString()}`, 14, 82);
      
      doc.line(14, 90, 196, 90);
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(100, 116, 139);
      doc.text('Thank you for choosing DealFlow360.', 14, 98);
      
      doc.save(`Receipt_${invNum}.pdf`);
      toast.success(`Downloaded PDF Receipt for ${invNum}!`);
    } catch (err) {
      console.error('PDF error:', err);
      toast.success(`Downloading invoice receipt for ${invNum}...`);
    }
  };

  const handleToggleAutoRenew = (subId) => {
    setCustomerSubscriptions((prev) =>
      prev.map((s) => (s.id === subId ? { ...s, autoRenew: !s.autoRenew } : s))
    );
    toast.success('Subscription auto-renew setting updated');
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Customer Header Banner matching PRD B8 - Black Theme */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-6 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Customer Portal & Self-Service Dashboard</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1 text-white">Acme Corp Portal</h1>
          <p className="text-xs text-slate-300 mt-1">Tier: <strong className="text-white">Gold Tier Customer</strong> · Account Rep: Surjeet Kumar</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700">
          <button
            onClick={() => setActiveTab('QUOTATION')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'QUOTATION' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            My Quotation (Q-1042)
          </button>
          <button
            onClick={() => setActiveTab('SUBSCRIPTIONS')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'SUBSCRIPTIONS' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            Subscriptions ({customerSubscriptions.length})
          </button>
          <button
            onClick={() => setActiveTab('INVOICES')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'INVOICES' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            Invoices & Payments ({customerInvoices.length})
          </button>
        </div>
      </div>

      {activeTab === 'QUOTATION' && (
        <div className="space-y-6">
          {/* Page Title & Subtitle matching Wireframe 11 */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-2xl font-semibold text-[var(--text)] tracking-tight">
                Customer Portal Negotiation Screen
              </h2>
              <p className="text-sm text-[var(--text-muted)]">
                Customer reviews and negotiates the quote directly, no email needed
              </p>
            </div>

            <span className={`px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-xs ${
              status === 'Confirmed' ? 'bg-[#2F6F5E]' :
              status === 'Pending Approval' ? 'bg-[var(--rust)]' :
              'bg-[var(--gold)]'
            }`}>
              Status: {status}
            </span>
          </div>

          {/* Notification Banner if Re-approval Triggered */}
          {notification && (
            <div className={`p-4 rounded-xl text-xs font-semibold leading-relaxed border flex items-center gap-2 ${
              notification.type === 'WARNING'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}>
              {notification.type === 'WARNING' ? (
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              )}
              {notification.message}
            </div>
          )}

          {/* Quotation Summary Card */}
          <div className="panel-card space-y-3">
            <h3 className="text-sm font-semibold text-[var(--text)]">Quotation Summary (Q-1042)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-50 border border-[var(--steel-line)] rounded-lg">
                <span className="text-[var(--text-muted)] block">Total Amount</span>
                <span className="text-lg font-bold font-mono text-[var(--text)]">$2,970</span>
              </div>
              <div className="p-3 bg-slate-50 border border-[var(--steel-line)] rounded-lg">
                <span className="text-[var(--text-muted)] block">Discount Offered</span>
                <span className="text-lg font-bold font-mono text-[var(--teal)]">14% Off</span>
              </div>
              <div className="p-3 bg-slate-50 border border-[var(--steel-line)] rounded-lg">
                <span className="text-[var(--text-muted)] block">Valid Until</span>
                <span className="text-lg font-bold font-mono text-[var(--text)]">Sep 30, 2026</span>
              </div>
            </div>
          </div>

          {/* Itemized Line Items Breakdown Table */}
          <div className="panel-card overflow-hidden space-y-3">
            <h3 className="text-sm font-semibold text-[var(--text)] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[var(--teal)]" /> Quotation Line Items Breakdown
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[var(--paper-dim)] border-b border-[var(--steel-line)] text-[var(--text-muted)] font-semibold">
                  <tr>
                    <th className="py-3 px-4">Product Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Qty</th>
                    <th className="py-3 px-4">Unit Price</th>
                    <th className="py-3 px-4">Line Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--paper-dim)]">
                  {quoteItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-[var(--text)]">{item.product}</td>
                      <td className="py-3.5 px-4 text-[var(--text-muted)]">{item.category}</td>
                      <td className="py-3.5 px-4 font-mono">{item.qty}</td>
                      <td className="py-3.5 px-4 font-mono">${item.price.toLocaleString()}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[var(--text)]">${item.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Line Comments Table matching Wireframe 11 */}
          <div className="panel-card overflow-hidden space-y-3">
            <h3 className="text-sm font-semibold text-[var(--text)] flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[var(--teal)]" /> Line-Level Comments & Negotiation History
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[var(--paper-dim)] border-b border-[var(--steel-line)] text-[var(--text-muted)] font-semibold">
                  <tr>
                    <th className="py-3 px-4 w-1/3">Line</th>
                    <th className="py-3 px-4">Customer Comment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--paper-dim)]">
                  {comments.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-[var(--text)]">{row.line}</td>
                      <td className="py-3.5 px-4 text-[var(--text)] font-medium">{row.comment}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Line Comment Form */}
            <form onSubmit={handleAddComment} className="flex gap-2 pt-2 border-t border-[var(--paper-dim)] text-xs">
              <select
                value={newLine}
                onChange={(e) => setNewLine(e.target.value)}
                className="px-3 py-2 border border-[var(--steel-line)] rounded-lg text-xs bg-[var(--paper-dim)] text-[var(--text)]"
              >
                <option value="Laptop Pro 14">Laptop Pro 14</option>
                <option value="Onsite Setup">Onsite Setup</option>
                <option value="Extended Warranty">Extended Warranty</option>
              </select>
              <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Add a line-level question or change request..."
                className="flex-1 px-3 py-2 border border-[var(--steel-line)] rounded-lg text-xs bg-[var(--paper-dim)] text-[var(--text)]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-900"
              >
                Add Comment
              </button>
            </form>
          </div>

          {/* Form Input Controls matching Wireframe 11 */}
          <form onSubmit={handleSubmitRequest} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                  Counter Discount %
                </label>
                <input
                  type="number"
                  value={counterDiscount}
                  onChange={(e) => setCounterDiscount(e.target.value)}
                  placeholder="e.g. 18 (Values > 15% trigger auto re-approval)"
                  className="w-full px-3.5 py-2.5 bg-white border border-[var(--steel-line)] rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[var(--teal)]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                  Requested Delivery Date
                </label>
                <input
                  type="date"
                  value={requestedDate}
                  onChange={(e) => setRequestedDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[var(--steel-line)] rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[var(--teal)]/20"
                />
              </div>
            </div>

            {/* Action Buttons matching Wireframe 11 */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-white border border-[var(--steel-line)] text-[var(--text)] hover:bg-slate-50 text-xs font-extrabold rounded-xl shadow-xs transition-all flex items-center gap-2"
              >
                <Send className="w-4 h-4 text-[var(--teal)]" /> Submit Request
              </button>

              <button
                type="button"
                onClick={handleConfirmQuotation}
                className="px-6 py-2.5 bg-[#2F6F5E] hover:bg-[#245749] text-white text-xs font-extrabold rounded-xl shadow-xs transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Confirm Quotation
              </button>
            </div>
          </form>

          {/* Yellow Callout Banner matching Wireframe 11 */}
          <div className="p-3.5 bg-[#FEFCE8] border border-[#FEF08A] rounded-xl text-xs text-[#854D0E] font-medium flex items-center gap-2 leading-relaxed shadow-xs">
            <div>
              If final terms exceed thresholds, the quote automatically re-enters approval (Screen 6).
            </div>
          </div>
        </div>
      )}

      {activeTab === 'SUBSCRIPTIONS' && (
        <div className="panel-card space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--paper-dim)] pb-3">
            <div>
              <h2 className="text-lg font-bold text-[var(--text)]">Active Subscriptions & Recurring SaaS Plans</h2>
              <p className="text-xs text-[var(--text-muted)]">Manage your active recurring contracts, billing intervals, and auto-renew settings</p>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold font-mono">
              2 Active Plans
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[var(--paper-dim)] border-b border-[var(--steel-line)] text-[var(--text-muted)] font-semibold">
                <tr>
                  <th className="py-3 px-4">Plan Name</th>
                  <th className="py-3 px-4">Billing Cycle</th>
                  <th className="py-3 px-4">Recurring MRR</th>
                  <th className="py-3 px-4">Next Bill Date</th>
                  <th className="py-3 px-4">Auto-Renew</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--paper-dim)]">
                {customerSubscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[var(--text)]">{sub.plan}</td>
                    <td className="py-3.5 px-4 font-mono text-[var(--text-muted)]">{sub.cycle}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[var(--teal)]">{sub.mrr}</td>
                    <td className="py-3.5 px-4 font-mono text-[var(--text-muted)]">{sub.nextBill}</td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleAutoRenew(sub.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          sub.autoRenew ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {sub.autoRenew ? 'Enabled' : 'Disabled'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => toast.success(`Request sent to Sales Rep to modify plan "${sub.plan}"`)}
                        className="px-3 py-1 text-xs font-bold border border-[var(--steel-line)] hover:bg-slate-100 rounded-lg text-[var(--text)]"
                      >
                        Modify Plan
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'INVOICES' && (
        <div className="panel-card space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--paper-dim)] pb-3">
            <div>
              <h2 className="text-lg font-bold text-[var(--text)]">Customer Invoices & Payment Receipts</h2>
              <p className="text-xs text-[var(--text-muted)]">View billing history, download official PDF receipts, or settle open balances online</p>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold font-mono">
              2 Total Invoices
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[var(--paper-dim)] border-b border-[var(--steel-line)] text-[var(--text-muted)] font-semibold">
                <tr>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Invoice Date</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--paper-dim)]">
                {customerInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[var(--text)]">{inv.invNum}</td>
                    <td className="py-3.5 px-4 text-[var(--text-muted)] font-mono">{inv.date}</td>
                    <td className="py-3.5 px-4 text-[var(--text-muted)] font-mono">{inv.due}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[var(--text)]">{inv.amount}</td>
                    <td className="py-3.5 px-4 font-mono">
                      <span
                        className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                          inv.status === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {inv.status === 'Unpaid' && (
                          <button
                            onClick={() => handlePayInvoice(inv.invNum)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1"
                          >
                            <CreditCard className="w-3 h-3" /> Pay Online
                          </button>
                        )}
                        <button
                          onClick={() => handleDownloadInvoice(inv.invNum)}
                          className="px-3 py-1 border border-[var(--steel-line)] hover:bg-slate-100 text-xs font-bold rounded-lg flex items-center gap-1 text-[var(--text)]"
                        >
                          <Download className="w-3 h-3 text-[var(--teal)]" /> Receipt (PDF)
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerPortal;
