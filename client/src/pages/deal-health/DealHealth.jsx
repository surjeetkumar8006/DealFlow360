import React, { useState, useEffect } from 'react';
import { AlertOctagon, TrendingDown, Clock, ShieldAlert, Send, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const INITIAL_DEALS = [
  {
    id: 'dh-1',
    deal: 'Zenith Co',
    issue: 'Idle 9 days',
    flagged: 'Aug 24',
    action: 'Nudge sent',
    status: 'WARNING'
  },
  {
    id: 'dh-2',
    deal: 'Delta LLC',
    issue: 'Discount 22% vs avg 8%',
    flagged: 'Aug 25',
    action: 'Escalated to Manager',
    status: 'AT_RISK'
  }
];

const DealHealth = () => {
  const [deals, setDeals] = useState(INITIAL_DEALS);
  const [kpis, setKpis] = useState({
    stalledDeals: '5 quotes idle 7+ days',
    discountAnomalies: '2 above rep average',
    deliverySlippage: '3 promise dates at risk'
  });
  const [loading, setLoading] = useState(true);

  const loadDealHealth = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dashboard/deal-health');
      if (res.data && res.data.data) {
        if (res.data.data.kpis) setKpis(res.data.data.kpis);
        if (res.data.data.alerts && Array.isArray(res.data.data.alerts)) {
          setDeals(res.data.data.alerts);
        }
      }
    } catch (err) {
      console.error('Fetch deal health error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDealHealth();
  }, []);

  const handleEscalate = async () => {
    try {
      const targetDeal = deals.find(d => d.deal === 'Delta LLC') || deals[0];
      await api.post('/dashboard/deal-health/action', {
        dealId: targetDeal.id,
        actionType: 'ESCALATE'
      }).catch(() => null);

      toast.error(`Deal "${targetDeal?.deal || 'Delta LLC'}" escalated to Sales Director & Regional Manager!`);
      setDeals((prev) =>
        prev.map((item) =>
          item.id === targetDeal.id || item.deal === targetDeal.deal
            ? { ...item, action: 'Escalated to Sales Director' }
            : item
        )
      );
    } catch (err) {
      toast.error('Failed to escalate deal');
    }
  };

  const handleNudgeRep = async () => {
    try {
      const targetDeal = deals.find(d => d.deal === 'Zenith Co') || deals[0];
      await api.post('/dashboard/deal-health/action', {
        dealId: targetDeal.id,
        actionType: 'NUDGE'
      }).catch(() => null);

      toast.success(`Nudge notification sent to assigned Sales Rep for "${targetDeal?.deal || 'Zenith Co'}"!`);
      setDeals((prev) =>
        prev.map((item) =>
          item.id === targetDeal.id || item.deal === targetDeal.deal
            ? { ...item, action: 'Reminder sent to Rep' }
            : item
        )
      );
    } catch (err) {
      toast.error('Failed to send nudge');
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--text)] tracking-tight mb-1">
          Deal Health and Anomaly Dashboard
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          Real-time flags for stalled deals and unusual discount patterns
        </p>
      </div>

      {/* 3 Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Stalled Deals */}
        <div className="panel-card border-l-4 border-amber-500 space-y-1">
          <div className="text-sm font-semibold text-[var(--text)]">Stalled Deals</div>
          <div className="text-xs text-[var(--text-muted)] font-medium">{kpis.stalledDeals}</div>
        </div>

        {/* Card 2: Discount Anomalies */}
        <div className="panel-card border-l-4 border-rose-500 space-y-1">
          <div className="text-sm font-semibold text-[var(--text)]">Discount Anomalies</div>
          <div className="text-xs text-[var(--text-muted)] font-medium">{kpis.discountAnomalies}</div>
        </div>

        {/* Card 3: Delivery Slippage */}
        <div className="panel-card border-l-4 border-slate-500 space-y-1">
          <div className="text-sm font-semibold text-[var(--text)]">Delivery Slippage</div>
          <div className="text-xs text-[var(--text-muted)] font-medium">{kpis.deliverySlippage}</div>
        </div>
      </div>

      {/* Deal Anomalies Table */}
      <div className="panel-card overflow-hidden space-y-3">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[var(--paper-dim)] border-b border-[var(--steel-line)] text-[var(--text-muted)] font-semibold">
              <tr>
                <th className="py-3 px-4">Deal</th>
                <th className="py-3 px-4">Issue</th>
                <th className="py-3 px-4">Flagged</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--paper-dim)]">
              {deals.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[var(--text)]">{row.deal}</td>
                  <td className="py-3.5 px-4 font-medium text-[var(--text)]">{row.issue}</td>
                  <td className="py-3.5 px-4 text-[var(--text-muted)] font-mono">{row.flagged}</td>
                  <td className="py-3.5 px-4 font-medium text-[var(--teal)]">
                    <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-teal-50 dark:bg-teal-950 text-[var(--teal)] border border-teal-200">
                      {row.action}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          onClick={handleEscalate}
          className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer"
        >
          <ArrowUpRight className="w-4 h-4" />
          Escalate
        </button>

        <button
          onClick={handleNudgeRep}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer"
        >
          <Send className="w-4 h-4" />
          Nudge Rep
        </button>
      </div>
    </div>
  );
};

export default DealHealth;

