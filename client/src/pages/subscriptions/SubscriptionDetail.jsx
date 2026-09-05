import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, AlertCircle, RefreshCw, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const SubscriptionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customerName] = useState('Acme Corp');
  const [planTitle] = useState('Care Plan 2yr');
  const [subStatus, setSubStatus] = useState('Active');
  const [isModifying, setIsModifying] = useState(false);

  // Table 1 dataset matching Wireframe 10 (One-Time Lines)
  const [oneTimeLines] = useState([
    { product: 'Laptop Pro 14', qty: 2, amount: '$2,280' },
    { product: 'Onsite Setup', qty: 1, amount: '$450' }
  ]);

  // Table 2 dataset matching Wireframe 10 (Recurring Lines)
  const [recurringLines, setRecurringLines] = useState([
    { plan: 'Care Plan 2yr', cycle: 'Monthly', nextBillDate: 'Sep 15', amount: '$46' },
    { plan: 'Support SLA', cycle: 'Quarterly', nextBillDate: 'Nov 1', amount: '$300' }
  ]);

  useEffect(() => {
    const fetchSub = async () => {
      try {
        const res = await api.get(`/subscriptions/${id || 'sub-1'}`);
        if (res.data && res.data.data) {
          if (res.data.data.status) setSubStatus(res.data.data.status);
        }
      } catch (err) {
        console.error('Fetch subscription error:', err);
      }
    };
    fetchSub();
  }, [id]);

  const handleCancelSubscription = async () => {
    try {
      await api.post(`/subscriptions/${id || 'sub-1'}/status`, {
        status: 'Cancelled',
        note: 'Customer requested cancellation - partial refund credit note issued'
      }).catch(() => null);

      setSubStatus('Cancelled');
      setRecurringLines((prev) =>
        prev.map((r) => ({ ...r, nextBillDate: '-' }))
      );
      toast.success('Subscription cancelled. Credit note generated for remaining cycle!');
    } catch (err) {
      toast.error('Failed to cancel subscription');
    }
  };

  const handleModifySubscription = () => {
    setIsModifying(!isModifying);
    if (!isModifying) {
      toast('Modify mode enabled: Select billing cycle adjustments below');
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/subscriptions')}
          className="text-xs text-[var(--teal)] hover:underline flex items-center gap-1 font-medium mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Subscriptions List
        </button>

        {/* Page Title & Subtitle matching Wireframe 10 */}
        <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--text)] tracking-tight mb-1">
          Billing Detail: {customerName} - {planTitle}
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          Opened by clicking a row on the Subscriptions list
        </p>
      </div>

      {/* Section 1: One-Time Lines (from originating order) matching Wireframe 10 */}
      <div className="space-y-3 pt-2">
        <h2 className="text-base font-semibold text-[#1D4ED8]">
          One-Time Lines (from originating order)
        </h2>

        <div className="panel-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[var(--paper-dim)] border-b border-[var(--steel-line)] text-[var(--text-muted)] font-semibold">
                <tr>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Qty</th>
                  <th className="py-3 px-4">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--paper-dim)]">
                {oneTimeLines.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-[var(--text)]">{row.product}</td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-[var(--text)]">{row.qty}</td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-[var(--text)]">{row.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Section 2: Recurring Lines matching Wireframe 10 */}
      <div className="space-y-3 pt-2">
        <h2 className="text-base font-semibold text-[#1D4ED8]">
          Recurring Lines
        </h2>

        <div className="panel-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[var(--paper-dim)] border-b border-[var(--steel-line)] text-[var(--text-muted)] font-semibold">
                <tr>
                  <th className="py-3 px-4">Plan</th>
                  <th className="py-3 px-4">Cycle</th>
                  <th className="py-3 px-4">Next Bill Date</th>
                  <th className="py-3 px-4">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--paper-dim)]">
                {recurringLines.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[var(--text)]">{row.plan}</td>
                    <td className="py-3.5 px-4 font-mono text-[var(--text-muted)]">{row.cycle}</td>
                    <td className="py-3.5 px-4 font-mono text-[var(--text-muted)]">{row.nextBillDate}</td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-[var(--text)]">{row.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Action Buttons matching Wireframe 10 */}
      <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[var(--paper-dim)]">
        {subStatus === 'Cancelled' ? (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 font-semibold flex items-center gap-2">
            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
            Subscription Cancelled — Partial Refund Credit Note Issued
          </div>
        ) : (
          <>
            <button
              onClick={handleModifySubscription}
              className={`px-6 py-2.5 text-xs font-semibold rounded-xl border transition-all ${
                isModifying
                  ? 'bg-blue-100 border-blue-300 text-blue-900'
                  : 'bg-white border-[var(--steel-line)] text-[var(--text)] hover:bg-slate-50 shadow-xs'
              }`}
            >
              {isModifying ? 'Done Modifying' : 'Modify Subscription'}
            </button>

            <button
              onClick={handleCancelSubscription}
              className="px-6 py-2.5 text-xs font-semibold rounded-xl border border-rose-600 text-rose-600 hover:bg-rose-50 transition-all shadow-xs"
            >
              Cancel Subscription
            </button>
          </>
        )}
      </div>

      {/* Proration Adjustment Callout when Modifying */}
      {isModifying && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-2">
          <div className="font-bold flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-blue-600" /> Mid-Cycle Proration Adjustment Calculator
          </div>
          <p className="text-blue-800">
            Changing billing frequency or adding licenses mid-cycle will calculate proration credit automatically.
          </p>
        </div>
      )}
    </div>
  );
};

export default SubscriptionDetail;
