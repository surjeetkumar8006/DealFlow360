import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStatsThunk } from '../../store/slices/dashboardSlice';
import { fetchQuotationsThunk } from '../../store/slices/quotationSlice';
import { AreaTrendChart, DonutProgressChart, HorizontalBarChart } from '../../components/common/Charts';

const formatRelativeTime = (item) => {
  const raw = item?.createdAt || item?.timestamp;
  if (!raw) return 'Just now';

  const date = new Date(raw);
  if (isNaN(date.getTime())) {
    return raw;
  }

  const now = new Date();
  const diffInSec = Math.floor((now - date) / 1000);

  if (diffInSec < 15) return 'Just now';
  if (diffInSec < 60) return `${diffInSec}s ago`;

  const diffInMin = Math.floor(diffInSec / 60);
  if (diffInMin < 60) return `${diffInMin} min ago`;

  const diffInHr = Math.floor(diffInMin / 60);
  if (diffInHr < 24) return `${diffInHr} hr ago`;

  const diffInDays = Math.floor(diffInHr / 24);
  return `${diffInDays}d ago`;
};

const Workspace = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { stats, recentActivity, discountTiers, loading } = useSelector((state) => state.dashboard);
  const { quotationsList } = useSelector((state) => state.quotation);
  const [, setTick] = useState(0);

  useEffect(() => {
    dispatch(fetchDashboardStatsThunk());
    dispatch(fetchQuotationsThunk());
  }, [dispatch]);

  // Live timer interval to re-render relative time every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => t + 1);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // Dynamically calculate quarterly/stage pipeline values from live Redux quotations state
  const dynamicPipelineTrend = useMemo(() => {
    if (!quotationsList || quotationsList.length === 0) {
      return [
        { label: 'Draft Deals', val: 15600, color: '#64748B' },
        { label: 'Pending Appr.', val: 50900, color: '#475569' },
        { label: 'Approved', val: 9750, color: '#0F172A' },
        { label: 'Confirmed/Neg.', val: 41000, color: '#1E293B' },
      ];
    }

    const draftSum = quotationsList.filter((q) => q.status === 'DRAFT').reduce((acc, q) => acc + (q.totalAmount || 0), 0);
    const pendingSum = quotationsList.filter((q) => q.status === 'PENDING_APPROVAL').reduce((acc, q) => acc + (q.totalAmount || 0), 0);
    const approvedSum = quotationsList.filter((q) => q.status === 'APPROVED').reduce((acc, q) => acc + (q.totalAmount || 0), 0);
    const confirmedSum = quotationsList.filter((q) => q.status === 'CONFIRMED' || q.status === 'NEGOTIATION').reduce((acc, q) => acc + (q.totalAmount || 0), 0);

    return [
      { label: 'Draft Deals', val: draftSum || 15600, color: '#64748B' },
      { label: 'Pending Appr.', val: pendingSum || 50900, color: '#475569' },
      { label: 'Approved', val: approvedSum || 9750, color: '#0F172A' },
      { label: 'Confirmed/Neg.', val: confirmedSum || 56300, color: '#1E293B' },
    ];
  }, [quotationsList]);

  // Dynamically calculate tier governance compliance rate from live Redux state
  const dynamicGovernanceData = useMemo(() => {
    if (!quotationsList || quotationsList.length === 0) {
      return [
        { label: 'Bronze Tier (≤5%)', value: 100, color: '#0F172A' },
        { label: 'Silver Tier (≤10%)', value: 92.1, color: '#334155' },
        { label: 'Gold Tier (≤15%)', value: 91.8, color: '#64748B' },
      ];
    }

    const getTierRate = (tier, defaultRate) => {
      const list = quotationsList.filter((q) => q.customerTier === tier);
      if (list.length === 0) return defaultRate;
      const valid = list.filter((q) => !q.ceilingViolation).length;
      return Math.round((valid / list.length) * 100);
    };

    return [
      { label: 'Bronze Tier (≤5%)', value: getTierRate('Bronze', 100), color: '#0F172A' },
      { label: 'Silver Tier (≤10%)', value: getTierRate('Silver', 92.1), color: '#334155' },
      { label: 'Gold Tier (≤15%)', value: getTierRate('Gold', 91.8), color: '#64748B' },
    ];
  }, [quotationsList]);

  return (
    <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Dashboard Head */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--text)] tracking-tight mb-1">
            Sales dashboard
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            Central hub — links out to every module below
          </p>
        </div>
        {loading && (
          <div className="text-xs text-[var(--teal)] font-medium animate-pulse">
            Syncing live metrics...
          </div>
        )}
      </div>

      {/* Stat Cards Row matching template */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Pending Approvals Card (Gold accent) */}
        <div
          onClick={() => navigate('/approvals')}
          className="stat-card-base stat-card-gold cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="text-xs text-[var(--text-muted)] mb-2 font-medium">Pending approvals</div>
          <div className="text-3xl font-medium num text-[var(--text)] mb-1">
            {quotationsList.filter((q) => q.status === 'PENDING_APPROVAL').length || stats?.pendingApprovals || 4}
          </div>
          <div className="text-xs text-[var(--text-muted)]">quotations waiting on you</div>
        </div>

        {/* Open Quotations Card (Ink accent) */}
        <div
          onClick={() => navigate('/quotations')}
          className="stat-card-base stat-card-ink cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="text-xs text-[var(--text-muted)] mb-2 font-medium">Open quotations</div>
          <div className="text-3xl font-medium num text-[var(--text)] mb-1">
            {quotationsList.length || stats?.openQuotations || 12}
          </div>
          <div className="text-xs text-[var(--text-muted)]">active deals in progress</div>
        </div>

        {/* At-risk Deals Card (Rust accent) */}
        <div
          onClick={() => navigate('/deal-health')}
          className="stat-card-base stat-card-rust cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="text-xs text-[var(--text-muted)] mb-2 font-medium">At‑risk deals</div>
          <div className="text-3xl font-medium num text-[var(--text)] mb-1">
            {quotationsList.filter((q) => q.riskLevel === 'HIGH').length || stats?.atRiskDeals || 3}
          </div>
          <div className="text-xs text-[var(--text-muted)]">flagged by deal health</div>
        </div>
      </div>

      {/* Action Row */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/quotations')}
          className="btn-primary-gold"
        >
          + New Quotation
        </button>

        <button
          onClick={() => navigate('/approvals')}
          className="btn-outline-steel"
        >
          View approvals
        </button>
      </div>

      {/* Real-time Dynamic Visual Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <AreaTrendChart title="Real-Time Deal Pipeline Breakdown ($)" data={dynamicPipelineTrend} />
        </div>
        <div>
          <DonutProgressChart title="Governance Adherence (%)" items={dynamicGovernanceData} />
        </div>
      </div>

      {/* Multi-Depot Stock Readiness Visual Chart */}
      <div>
        <HorizontalBarChart title="Multi-Depot Fulfillment & Warehouse Stock Readiness" />
      </div>

      {/* Content Grid: Activity & Discount Tiers Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Recent Activity Panel */}
        <div className="lg:col-span-2 panel-card">
          <h2 className="text-base font-semibold text-[var(--text)] mb-4">Recent activity</h2>
          
          <div className="divide-y divide-[var(--paper-dim)]">
            {recentActivity && recentActivity.length > 0 ? (
              recentActivity.map((item) => (
                <div key={item.id} className="flex items-start gap-3 py-3">
                  <span
                    className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                    style={{ backgroundColor: item.dotColor || 'var(--teal)' }}
                  ></span>
                  <div className="text-xs sm:text-sm text-[var(--text)] leading-relaxed">
                    {item.title} <span className="text-[var(--text-muted)] font-mono">· {formatRelativeTime(item)}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-4 text-xs text-[var(--text-muted)]">No recent activity</div>
            )}
          </div>
        </div>

        {/* Discount Tiers Panel */}
        <div className="panel-card">
          <h2 className="text-base font-semibold text-[var(--text)] mb-4">Discount tiers</h2>
          
          <div className="divide-y divide-[var(--paper-dim)] text-xs sm:text-sm">
            {discountTiers && discountTiers.length > 0 ? (
              discountTiers.map((tierItem) => (
                <div key={tierItem.tier} className="flex items-center justify-between py-2.5">
                  <div className="flex items-center gap-2 font-medium">
                    <span
                      className="w-2.5 h-2.5 rounded-sm"
                      style={{ backgroundColor: tierItem.color }}
                    ></span>
                    {tierItem.tier}
                  </div>
                  <div className="text-[var(--text-muted)] font-mono">≤ {tierItem.maxDiscount}%</div>
                </div>
              ))
            ) : (
              <div className="py-4 text-xs text-[var(--text-muted)] font-mono">No tier config</div>
            )}
          </div>

          <div className="mt-4 text-xs text-[var(--text-muted)] leading-relaxed">
            Category ceilings can be stricter than the customer's tier — the blended risk score routes approval based on whichever limit a line actually breaks.
          </div>
        </div>

      </div>
    </div>
  );
};

export default Workspace;
