import React, { useState } from 'react';
import { Activity, AlertOctagon, TrendingDown, Clock, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';
import { HorizontalBarChart, DonutProgressChart } from '../../components/common/Charts';

const DEAL_HEALTH_ITEMS = [
  {
    id: 'dh-1',
    quoteNumber: 'Q-1042',
    customer: 'Acme Corp',
    healthScore: 42,
    healthStatus: 'AT_RISK',
    anomaly: 'Stuck in Pending Approval for 14+ days',
    discount: '18% Service Discount (Exceeds ceiling)',
    lastActivity: '2 days ago'
  },
  {
    id: 'dh-2',
    quoteNumber: 'Q-1039',
    customer: 'Beta Industries',
    healthScore: 58,
    healthStatus: 'WARNING',
    anomaly: 'Multiple discount revision requests from portal',
    discount: '18% Overall Discount',
    lastActivity: '40 min ago'
  },
  {
    id: 'dh-3',
    quoteNumber: 'Q-1005',
    customer: 'Zenith Co',
    healthScore: 89,
    healthStatus: 'HEALTHY',
    anomaly: 'Normal negotiation flow active',
    discount: '12% Discount',
    lastActivity: '1 hr ago'
  }
];

const HEALTH_DISTRIBUTION_DATA = [
  { label: 'Q-1005 (Zenith Co)', val: 89, suffix: '89/100 (Healthy)', color: 'var(--teal)' },
  { label: 'Q-1039 (Beta Ind.)', val: 58, suffix: '58/100 (Warning)', color: 'var(--gold)' },
  { label: 'Q-1042 (Acme Corp)', val: 42, suffix: '42/100 (At-Risk)', color: 'var(--rust)' },
];

const DealHealth = () => {
  const [deals, setDeals] = useState(DEAL_HEALTH_ITEMS);

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--text)] tracking-tight mb-1">
          Deal Health & Anomaly Monitoring
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          Real-time risk scoring, stage velocity alerts, and discount threshold breach detection
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stat-card-base stat-card-rust flex items-center justify-between">
          <div>
            <div className="text-xs text-[var(--text-muted)] mb-1 font-medium">At-Risk Deals</div>
            <div className="text-3xl font-medium num text-[var(--text)]">
              {deals.filter(d => d.healthStatus === 'AT_RISK').length}
            </div>
          </div>
          <AlertOctagon className="w-7 h-7 text-[var(--rust)] opacity-80" />
        </div>

        <div className="stat-card-base stat-card-gold flex items-center justify-between">
          <div>
            <div className="text-xs text-[var(--text-muted)] mb-1 font-medium">Warning Flagged</div>
            <div className="text-3xl font-medium num text-[var(--text)]">
              {deals.filter(d => d.healthStatus === 'WARNING').length}
            </div>
          </div>
          <TrendingDown className="w-7 h-7 text-[var(--gold)] opacity-80" />
        </div>

        <div className="stat-card-base stat-card-ink flex items-center justify-between">
          <div>
            <div className="text-xs text-[var(--text-muted)] mb-1 font-medium">Healthy Deals</div>
            <div className="text-3xl font-medium num text-[var(--text)]">
              {deals.filter(d => d.healthStatus === 'HEALTHY').length}
            </div>
          </div>
          <Activity className="w-7 h-7 text-[var(--teal)] opacity-80" />
        </div>
      </div>

      {/* Health Distribution Chart */}
      <HorizontalBarChart title="Deal Health Index Comparison" data={HEALTH_DISTRIBUTION_DATA} />

      {/* Deal Health List Table */}
      <div className="panel-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[var(--paper-dim)] border-b border-[var(--steel-line)] text-[var(--text-muted)] font-semibold">
              <tr>
                <th className="py-3 px-4">Quotation</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Health Score</th>
                <th className="py-3 px-4">Detected Anomaly</th>
                <th className="py-3 px-4">Last Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--paper-dim)]">
              {deals.map((deal) => (
                <tr key={deal.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[var(--text)]">{deal.quoteNumber}</td>
                  <td className="py-3.5 px-4 text-[var(--text)] font-medium">{deal.customer}</td>
                  <td className="py-3.5 px-4 font-mono">
                    <span
                      className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                        deal.healthStatus === 'AT_RISK'
                          ? 'bg-[var(--rust)]/10 text-[var(--rust)] border border-[var(--rust)]/20'
                          : deal.healthStatus === 'WARNING'
                          ? 'bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/20'
                          : 'bg-[#2F6F5E]/10 text-[var(--teal)] border border-[#2F6F5E]/20'
                      }`}
                    >
                      {deal.healthScore} / 100 ({deal.healthStatus})
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[var(--text)]">{deal.anomaly}</td>
                  <td className="py-3.5 px-4 text-[var(--text-muted)] font-mono">{deal.lastActivity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DealHealth;
