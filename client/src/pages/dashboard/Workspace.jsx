import React from 'react';
import { useNavigate } from 'react-router-dom';

const Workspace = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Dashboard Head */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--text)] tracking-tight mb-1">
          Sales dashboard
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          Central hub — links out to every module below
        </p>
      </div>

      {/* Stat Cards Row matching template */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Pending Approvals Card (Gold accent) */}
        <div
          onClick={() => navigate('/approvals')}
          className="stat-card-base stat-card-gold cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="text-xs text-[var(--text-muted)] mb-2 font-medium">Pending approvals</div>
          <div className="text-3xl font-medium num text-[var(--text)] mb-1">4</div>
          <div className="text-xs text-[var(--text-muted)]">quotations waiting on you</div>
        </div>

        {/* Open Quotations Card (Ink accent) */}
        <div
          onClick={() => navigate('/quotations')}
          className="stat-card-base stat-card-ink cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="text-xs text-[var(--text-muted)] mb-2 font-medium">Open quotations</div>
          <div className="text-3xl font-medium num text-[var(--text)] mb-1">12</div>
          <div className="text-xs text-[var(--text-muted)]">active deals in progress</div>
        </div>

        {/* At-risk Deals Card (Rust accent) */}
        <div
          onClick={() => navigate('/deal-health')}
          className="stat-card-base stat-card-rust cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="text-xs text-[var(--text-muted)] mb-2 font-medium">At‑risk deals</div>
          <div className="text-3xl font-medium num text-[var(--text)] mb-1">3</div>
          <div className="text-xs text-[var(--text-muted)]">flagged by deal health</div>
        </div>
      </div>

      {/* Action Row */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/quotations')}
          className="btn-primary-gold"
        >
          + New quotation
        </button>

        <button
          onClick={() => navigate('/approvals')}
          className="btn-outline-steel"
        >
          View approvals
        </button>
      </div>

      {/* Content Grid: Activity & Discount Tiers Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Recent Activity Panel */}
        <div className="lg:col-span-2 panel-card">
          <h2 className="text-base font-semibold text-[var(--text)] mb-4">Recent activity</h2>
          
          <div className="divide-y divide-[var(--paper-dim)]">
            <div className="flex items-start gap-3 py-3">
              <span className="w-2 h-2 rounded-full bg-[var(--teal)] mt-1.5 shrink-0"></span>
              <div className="text-xs sm:text-sm text-[var(--text)] leading-relaxed">
                Acme Corp quotation <strong>approved</strong> by Finance <span className="text-[var(--text-muted)]">· 12 min ago</span>
              </div>
            </div>

            <div className="flex items-start gap-3 py-3">
              <span className="w-2 h-2 rounded-full bg-[var(--gold)] mt-1.5 shrink-0"></span>
              <div className="text-xs sm:text-sm text-[var(--text)] leading-relaxed">
                Beta Industries requested a <strong>discount change</strong> from the customer portal <span className="text-[var(--text-muted)]">· 40 min ago</span>
              </div>
            </div>

            <div className="flex items-start gap-3 py-3">
              <span className="w-2 h-2 rounded-full bg-[var(--ink-soft)] mt-1.5 shrink-0"></span>
              <div className="text-xs sm:text-sm text-[var(--text)] leading-relaxed">
                East Depot <strong>stock updated</strong> for Order #2291 <span className="text-[var(--text-muted)]">· 1 hr ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Discount Tiers Panel */}
        <div className="panel-card">
          <h2 className="text-base font-semibold text-[var(--text)] mb-4">Discount tiers</h2>
          
          <div className="divide-y divide-[var(--paper-dim)] text-xs sm:text-sm">
            <div className="flex items-center justify-between py-2.5">
              <div className="flex items-center gap-2 font-medium">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#B08D57]"></span>Bronze
              </div>
              <div className="text-[var(--text-muted)] font-mono">≤ 5%</div>
            </div>

            <div className="flex items-center justify-between py-2.5">
              <div className="flex items-center gap-2 font-medium">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#B7BAC2]"></span>Silver
              </div>
              <div className="text-[var(--text-muted)] font-mono">≤ 10%</div>
            </div>

            <div className="flex items-center justify-between py-2.5">
              <div className="flex items-center gap-2 font-medium">
                <span className="w-2.5 h-2.5 rounded-sm bg-[var(--gold)]"></span>Gold
              </div>
              <div className="text-[var(--text-muted)] font-mono">≤ 15%</div>
            </div>
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
