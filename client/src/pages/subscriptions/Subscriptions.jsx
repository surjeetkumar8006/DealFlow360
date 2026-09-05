import React from 'react';
import { DollarSign, FileText, Repeat, CheckCircle } from 'lucide-react';

const Subscriptions = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Finance & Hybrid Billing</h1>
        <p className="text-slate-500 text-sm mt-1">Manage invoices, payment reconciliation, and recurring subscription proration</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="card-container">
          <div className="text-xs font-bold text-slate-500 uppercase">Total Revenue (Month)</div>
          <div className="text-2xl font-black text-slate-900 mt-2">₹14,85,000</div>
        </div>

        <div className="card-container">
          <div className="text-xs font-bold text-slate-500 uppercase">Pending Invoices</div>
          <div className="text-2xl font-black text-amber-600 mt-2">3 Invoices</div>
        </div>

        <div className="card-container">
          <div className="text-xs font-bold text-slate-500 uppercase">Active Subscriptions</div>
          <div className="text-2xl font-black text-blue-600 mt-2">18 Plans</div>
        </div>
      </div>

      <div className="card-container">
        <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
          Invoices & Hybrid Billing Lines
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <div className="font-bold text-slate-900">INV-2026-0891 (Acme Corp)</div>
              <div className="text-xs text-slate-500 mt-0.5">One-time Hardware + Monthly Enterprise Subscription</div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-extrabold text-slate-900">₹99,000</span>
              <span className="badge-status bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                PAID
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;
