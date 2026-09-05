import React from 'react';
import { Check, X, RotateCcw, AlertOctagon, ShieldAlert, CheckSquare } from 'lucide-react';

const ApprovalsQueue = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Sales Manager Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Multi-tier discount governance & risk approval chain</p>
      </div>

      {/* Summary KPI Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-amber-800 uppercase">Pending Approvals</div>
            <div className="text-2xl font-black text-amber-900 mt-1">4</div>
          </div>
          <CheckSquare className="w-8 h-8 text-amber-600 opacity-80" />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-blue-800 uppercase">Open Quotations</div>
            <div className="text-2xl font-black text-blue-900 mt-1">12</div>
          </div>
          <ShieldAlert className="w-8 h-8 text-blue-600 opacity-80" />
        </div>

        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-rose-800 uppercase">At-Risk Deals</div>
            <div className="text-2xl font-black text-rose-900 mt-1">3</div>
          </div>
          <AlertOctagon className="w-8 h-8 text-rose-600 opacity-80" />
        </div>
      </div>

      {/* Approval Requests List */}
      <div className="card-container">
        <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
          Approval Requests Queue
        </h2>

        <div className="space-y-4">
          <div className="bg-white border border-rose-200 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="font-extrabold text-base text-slate-900">Quote #1021</span>
                <span className="ml-2 text-xs font-semibold text-rose-700 bg-rose-100 border border-rose-300 px-2.5 py-0.5 rounded-full">
                  18% Discount Applied
                </span>
                <div className="text-xs text-slate-500 mt-1">Rep: Rahul Sharma • Customer: Beta Industries (Gold Tier)</div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-lg inline-flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" /> Risk Score: HIGH (18.5)
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-600 bg-rose-50/60 p-3 rounded-lg border border-rose-100">
              ⚠️ <strong>Ceiling Violation:</strong> Setup Service discount given is 18% (Allowed service ceiling is 10%). Exceeds threshold by 8 points.
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => alert('Approved Quote #1021!')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-1.5 rounded-lg text-xs flex items-center gap-1 transition-all"
              >
                <Check className="w-4 h-4" /> Approve
              </button>

              <button
                onClick={() => alert('Rejected Quote #1021!')}
                className="bg-rose-600 hover:bg-rose-700 text-white font-medium px-4 py-1.5 rounded-lg text-xs flex items-center gap-1 transition-all"
              >
                <X className="w-4 h-4" /> Reject
              </button>

              <button
                onClick={() => alert('Returned Quote #1021 for revision!')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-4 py-1.5 border border-slate-300 rounded-lg text-xs flex items-center gap-1 transition-all"
              >
                <RotateCcw className="w-4 h-4" /> Return for Revision
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalsQueue;
