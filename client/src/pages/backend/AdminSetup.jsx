import React, { useState } from 'react';
import { Save, Info, Shield, Layers, Workflow, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const INITIAL_TIERS = [
  { id: 't-1', tier: 'Bronze', maxDiscount: '5 percent' },
  { id: 't-2', tier: 'Silver', maxDiscount: '10 percent' },
  { id: 't-3', tier: 'Gold', maxDiscount: '15 Percent' },
];

const INITIAL_CATEGORIES = [
  { id: 'c-1', category: 'Hardware', maxDiscount: '15 percent' },
  { id: 'c-2', category: 'Services', maxDiscount: '10 percent' },
];

const INITIAL_APPROVAL_RULES = [
  { id: 'r-1', discountRange: 'Within tier/Category limit', maxDiscount: 'No approval needed' },
  { id: 'r-2', discountRange: 'Over Limit,blended risk medium', maxDiscount: 'Sales manager' },
  { id: 'r-3', discountRange: 'Over limit,blended high risk', maxDiscount: 'Sales manager then finance' },
];

const AdminSetup = () => {
  const [tiers, setTiers] = useState(INITIAL_TIERS);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [approvalRules, setApprovalRules] = useState(INITIAL_APPROVAL_RULES);

  const handleSaveConfiguration = () => {
    toast.success('Discount tiers & approval chain configuration saved successfully!');
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--text)] tracking-tight mb-1">
          Discount tiers and approval chains
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          System governance rules, tier discount ceilings, and blended risk approval routing
        </p>
      </div>

      {/* Top 2 Side-by-Side Tables: Tier Discount Ceilings & Category Discount Ceilings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Table 1: Tier Discount Ceilings */}
        <div className="panel-card overflow-hidden space-y-3">
          <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
            Tier Discount Ceilings
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[var(--paper-dim)] border-b border-[var(--steel-line)] text-[var(--text-muted)] font-semibold">
                <tr>
                  <th className="py-3 px-4">Tier</th>
                  <th className="py-3 px-4">Max Discount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--paper-dim)]">
                {tiers.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[var(--text)]">{row.tier}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[var(--teal)]">{row.maxDiscount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 2: Category Discount Ceilings */}
        <div className="panel-card overflow-hidden space-y-3">
          <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
            Category Discount ceilings
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[var(--paper-dim)] border-b border-[var(--steel-line)] text-[var(--text-muted)] font-semibold">
                <tr>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Max Discount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--paper-dim)]">
                {categories.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[var(--text)]">{row.category}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[var(--gold)]">{row.maxDiscount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Approval Chain Table */}
      <div className="panel-card overflow-hidden space-y-3">
        <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
          Approval Chain Routing Rules
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[var(--paper-dim)] border-b border-[var(--steel-line)] text-[var(--text-muted)] font-semibold">
              <tr>
                <th className="py-3 px-4">Discount range</th>
                <th className="py-3 px-4">Approval Routing Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--paper-dim)]">
              {approvalRules.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[var(--text)]">{row.discountRange}</td>
                  <td className="py-3.5 px-4 font-medium text-[var(--teal)]">{row.maxDiscount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Button */}
      <div>
        <button
          onClick={handleSaveConfiguration}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition-all"
        >
          <Save className="w-4 h-4" />
          Save configuration
        </button>
      </div>

      {/* Yellow Callout Banner */}
      <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 rounded-xl text-xs text-amber-900 dark:text-amber-200 font-medium space-y-1 shadow-xs">
        <div className="flex items-center gap-2 font-bold">
          <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>When a quote mixes categories with different ceilings, the system must compute a blended risk score and route to the highest required level.</span>
        </div>
        <p className="pl-6 text-amber-800 dark:text-amber-300">
          All approvals, rejections, and edits must be logged with user, timestamp, and reason.
        </p>
      </div>
    </div>
  );
};

export default AdminSetup;

