import React from 'react';
import { X, Network, Database, ShieldCheck, Cpu, Zap, Layers, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

const ArchitectureModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FAF9F5] border border-[var(--steel-line)] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--paper-dim)]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[var(--ink)] text-white rounded-xl shadow-xs">
              <Network className="w-6 h-6 text-[var(--gold)]" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--text)] tracking-tight">
                DealFlow360 System Architecture & Data Model
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                End-to-End Self-Governing Deal Engine Architecture (Hackathon Deliverable)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-slate-200/50 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Architecture Layer 1: Component Diagram */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[var(--text)] uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            1. Platform Architecture Diagram
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Frontend Card */}
            <div className="p-4 bg-white border border-[var(--steel-line)] rounded-xl space-y-2 shadow-xs">
              <div className="flex items-center gap-2 font-bold text-xs text-blue-600 uppercase tracking-wider">
                <Cpu className="w-4 h-4" /> Frontend (React 18 + Redux)
              </div>
              <ul className="text-xs text-[var(--text-muted)] space-y-1.5 font-medium">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Rep Workspace & Kanban Pipeline</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Quotation Builder + Live Margin Indicator</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Multi-Stage Approval Queue</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Customer Negotiation Portal</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Deal Health & Anomaly Dashboard</li>
              </ul>
            </div>

            {/* Backend Logic Card */}
            <div className="p-4 bg-white border border-[var(--steel-line)] rounded-xl space-y-2 shadow-xs">
              <div className="flex items-center gap-2 font-bold text-xs text-amber-600 uppercase tracking-wider">
                <Zap className="w-4 h-4" /> Application Logic & Engine
              </div>
              <ul className="text-xs text-[var(--text-muted)] space-y-1.5 font-medium">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Blended Risk Scoring Engine</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Tier & Category Ceiling Governance</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Auto-Warehouse Inventory Splitting</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Hybrid Prorated Subscription Billing</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Portal Re-Triggering Workflows</li>
              </ul>
            </div>

            {/* Persistence Card */}
            <div className="p-4 bg-white border border-[var(--steel-line)] rounded-xl space-y-2 shadow-xs">
              <div className="flex items-center gap-2 font-bold text-xs text-emerald-600 uppercase tracking-wider">
                <Database className="w-4 h-4" /> Persistence (MongoDB)
              </div>
              <ul className="text-xs text-[var(--text-muted)] space-y-1.5 font-medium">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> <span className="font-mono font-bold">Quotations</span> (Lines, Risk, Audit Log)</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> <span className="font-mono font-bold">Products</span> (Variants, Stock Qty)</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> <span className="font-mono font-bold">Customers</span> (Discount Tiers, Tokens)</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> <span className="font-mono font-bold">Invoices</span> (One-time vs Recurring)</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> <span className="font-mono font-bold">GovernanceRules</span> (Ceiling Config)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Data Model Connection Flow */}
        <div className="p-4 bg-white border border-[var(--steel-line)] rounded-xl space-y-3 shadow-xs">
          <h3 className="text-xs font-bold text-[var(--text)] uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            2. End-to-End Quotation-to-Cash Data Flow
          </h3>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono font-semibold text-[var(--text)] p-3 bg-[var(--paper-dim)] rounded-lg">
            <span className="px-2.5 py-1 bg-white rounded border border-[var(--steel-line)]">Quotation Draft</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <span className="px-2.5 py-1 bg-amber-50 text-amber-800 rounded border border-amber-300">Blended Risk Check</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <span className="px-2.5 py-1 bg-blue-50 text-blue-800 rounded border border-blue-300">Manager & Finance Approval</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <span className="px-2.5 py-1 bg-purple-50 text-purple-800 rounded border border-purple-300">Warehouse Stock Split</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded border border-emerald-300">Auto Invoice & Billing</span>
          </div>
        </div>

        {/* What We Would Build Next (Hackathon Deliverable Note) */}
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 rounded-xl space-y-2 shadow-xs">
          <h3 className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            3. Hackathon Roadmap — What We Would Build Next
          </h3>
          <ul className="text-xs text-amber-900 dark:text-amber-300 space-y-1.5 pl-5 list-disc font-medium">
            <li><strong>AI Deal Negotiation Copilot:</strong> LLM-based agent that suggests counter-offers live during customer portal negotiations based on historic close rates.</li>
            <li><strong>Multi-Tenant Enterprise Architecture:</strong> Dynamic organization switching with isolated Mongo databases per enterprise subsidiary.</li>
            <li><strong>Stripe & ERP Integration:</strong> Direct webhook sync to ERP (SAP / NetSuite) and Stripe Subscription billing engine.</li>
          </ul>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[var(--ink)] text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
          >
            Close Architecture View
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureModal;
