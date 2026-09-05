import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchApprovalByIdThunk, processApprovalThunk } from '../../store/slices/approvalSlice';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Check, X, RotateCcw, ShieldAlert, AlertTriangle, CheckCircle2, Lock, UserCheck } from 'lucide-react';

const ApprovalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { role } = useAuth();

  const { activeApproval, loading } = useSelector((state) => state.approvals);

  useEffect(() => {
    dispatch(fetchApprovalByIdThunk(id || 'q-1042'));
  }, [dispatch, id]);

  const approval = activeApproval || {
    _id: 'q-1042',
    quoteNumber: 'Q-1042',
    customerName: 'Acme Corp',
    customerTier: 'Gold',
    riskLevel: 'HIGH',
    stage: 'Sales Manager',
    ceilingViolation: 'Worst single line (8pt over) plus overall pattern across the order sets the blended score. One bad line is enough to require approval.',
    flaggedLines: [
      { line: 'Laptop (Hardware)', discountGiven: '12%', limitAllowed: '15%', overBy: '0 pt - OK', status: 'OK' },
      { line: 'Setup Service (Services)', discountGiven: '18%', limitAllowed: '10%', overBy: '8 pt OVER', status: 'OVER' }
    ],
    stepper: [
      { step: 1, label: 'Submitted', status: 'COMPLETED' },
      { step: 2, label: 'Sales Manager', status: 'ACTIVE' },
      { step: 3, label: 'Finance', status: 'PENDING' },
      { step: 4, label: 'Confirmed', status: 'PENDING' }
    ],
    auditTrail: [
      { user: 'J. Rao', action: 'Submitted', date: 'Aug 20', note: 'Initial 12% discount' },
      { user: 'M. Shah', action: 'Returned', date: 'Aug 21', note: 'Requested justification' },
      { user: 'J. Rao', action: 'Resubmitted', date: 'Aug 22', note: 'Added margin note' }
    ]
  };

  const currentRole = (role || 'sales_rep').toLowerCase();
  const currentStage = approval.stage || (approval.stepper?.find(s => s.status === 'ACTIVE')?.label || 'Sales Manager');

  // Permission evaluation rules
  const canPerformAction =
    currentRole === 'admin' ||
    (currentRole === 'sales_manager' && (currentStage === 'Sales Manager' || approval.status === 'PENDING_APPROVAL')) ||
    (currentRole === 'finance' && (currentStage === 'Finance' || approval.status === 'PENDING_FINANCE'));

  const handleAction = (action) => {
    if (!canPerformAction) return;
    dispatch(processApprovalThunk({ id: approval._id, action, note: `${currentRole === 'finance' ? 'Finance' : 'Manager'} action: ${action}` }));
  };

  const flaggedLines = approval.flaggedLines || [
    { line: 'Laptop (Hardware)', discountGiven: '12%', limitAllowed: '15%', overBy: '0 pt - OK', status: 'OK' },
    { line: 'Setup Service (Services)', discountGiven: '18%', limitAllowed: '10%', overBy: '8 pt OVER', status: 'OVER' }
  ];

  const auditLogs = approval.auditTrail || [
    { user: 'J. Rao', action: 'Submitted', date: 'Aug 20', note: 'Initial 12% discount' },
    { user: 'M. Shah', action: 'Returned', date: 'Aug 21', note: 'Requested justification' },
    { user: 'J. Rao', action: 'Resubmitted', date: 'Aug 22', note: 'Added margin note' }
  ];

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back to Approvals List */}
      <div>
        <button
          onClick={() => navigate('/approvals')}
          className="text-xs text-[var(--teal)] hover:underline flex items-center gap-1 font-medium mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Approvals List
        </button>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--text)] tracking-tight mb-1">
              Approval Detail: {approval.quoteNumber} ({approval.customerName})
            </h1>
            <p className="text-sm text-[var(--text-muted)]">
              Multi-tier approval workflow & governing discount limits
            </p>
          </div>

          {/* Persona Active Indicator Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--paper-dim)] border border-[var(--steel-line)] text-xs font-semibold text-[var(--text)]">
            <UserCheck className="w-4 h-4 text-[var(--teal)]" />
            <span>Active Role: <strong className="uppercase text-[var(--teal)]">{currentRole.replace('_', ' ')}</strong></span>
          </div>
        </div>
      </div>

      {/* Metadata Badges matching Wireframe */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-[var(--rust)] text-white shadow-xs">
          Blended Risk: {approval.riskLevel || 'HIGH'}
        </span>

        <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#1D4ED8] text-white shadow-xs">
          Customer Tier: {approval.customerTier || 'Gold'}
        </span>

        <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#4338CA] text-white shadow-xs">
          Current Stage: {currentStage}
        </span>

        <span className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-xs text-white ${
          approval.status === 'APPROVED' ? 'bg-[#2F6F5E]' :
          approval.status === 'PENDING_FINANCE' ? 'bg-[#3B82F6]' :
          approval.status === 'REJECTED' ? 'bg-[var(--rust)]' :
          approval.status === 'REVISION_REQUESTED' ? 'bg-[var(--gold)]' :
          'bg-amber-600'
        }`}>
          Status: {(approval.status || 'PENDING_APPROVAL').replace('_', ' ')}
        </span>
      </div>

      {/* Section: Why This Quote Was Flagged matching Wireframe */}
      <div className="space-y-3 pt-2">
        <h2 className="text-base font-semibold text-[var(--teal)]">
          Why This Quote Was Flagged
        </h2>

        <div className="panel-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[var(--paper-dim)] border-b border-[var(--steel-line)] text-[var(--text-muted)] font-semibold">
                <tr>
                  <th className="py-3 px-4">Line</th>
                  <th className="py-3 px-4">Discount Given</th>
                  <th className="py-3 px-4">Limit Allowed</th>
                  <th className="py-3 px-4">Over By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--paper-dim)]">
                {flaggedLines.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-[var(--text)]">{row.line}</td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-[var(--text)]">{row.discountGiven}</td>
                    <td className="py-3.5 px-4 font-mono text-[var(--text-muted)]">{row.limitAllowed}</td>
                    <td className="py-3.5 px-4 font-mono">
                      {row.status === 'OVER' || row.overBy.includes('OVER') ? (
                        <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-[var(--rust)]/10 text-[var(--rust)] border border-[var(--rust)]/20">
                          {row.overBy}
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-[#2F6F5E]/10 text-[var(--teal)] border border-[#2F6F5E]/20">
                          {row.overBy}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Governance Callout Banner matching Wireframe */}
      <div className="p-3.5 bg-[#FEFCE8] border border-[#FEF08A] rounded-xl text-xs text-[#854D0E] font-medium flex items-center gap-2 leading-relaxed shadow-xs">
        <AlertTriangle className="w-4 h-4 text-[#CA8A04] shrink-0" />
        <div>
          Worst single line (8pt over) plus overall pattern across the order sets the blended score. One bad line is enough to require approval.
        </div>
      </div>

      {/* 4-Step Approval Chain Visual Stepper matching Wireframe - Dynamic */}
      <div className="panel-card py-6 px-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto relative">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-8 right-8 h-1 bg-[var(--paper-dim)] -translate-y-1/2 -z-0"></div>

          {(approval.stepper || [
            { step: 1, label: 'Submitted', status: 'COMPLETED' },
            { step: 2, label: 'Sales Manager', status: 'ACTIVE' },
            { step: 3, label: 'Finance', status: 'PENDING' },
            { step: 4, label: 'Confirmed', status: 'PENDING' }
          ]).map((st) => {
            let icon = st.step;
            let circleBg = 'bg-slate-300 text-slate-600';
            let labelStyle = 'text-[var(--text-muted)] font-medium';

            if (st.status === 'COMPLETED') {
              circleBg = 'bg-emerald-600 text-white shadow-md';
              icon = <Check className="w-5 h-5" />;
              labelStyle = 'text-emerald-700 font-bold';
            } else if (st.status === 'ACTIVE') {
              circleBg = 'bg-blue-600 text-white shadow-md ring-4 ring-blue-100';
              icon = <ShieldAlert className="w-5 h-5" />;
              labelStyle = 'text-blue-700 font-bold';
            } else if (st.status === 'REVISION_REQUESTED') {
              circleBg = 'bg-amber-600 text-white shadow-md ring-4 ring-amber-100';
              icon = <RotateCcw className="w-5 h-5" />;
              labelStyle = 'text-amber-700 font-bold';
            } else if (st.status === 'REJECTED') {
              circleBg = 'bg-rose-600 text-white shadow-md ring-4 ring-rose-100';
              icon = <X className="w-5 h-5" />;
              labelStyle = 'text-rose-700 font-bold';
            }

            return (
              <div key={st.step} className="relative z-10 flex flex-col items-center gap-2 bg-[#FAF9F5] px-2">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${circleBg}`}>
                  {icon}
                </div>
                <span className={`text-xs ${labelStyle}`}>{st.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Audit Log History Table matching Wireframe */}
      <div className="panel-card overflow-hidden space-y-3">
        <h3 className="text-sm font-semibold text-[var(--text)]">Approval Audit Trail</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[var(--paper-dim)] border-b border-[var(--steel-line)] text-[var(--text-muted)] font-semibold">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--paper-dim)]">
              {auditLogs.map((log, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[var(--text)]">{log.user}</td>
                  <td className="py-3.5 px-4 font-medium text-[var(--text)]">{log.action}</td>
                  <td className="py-3.5 px-4 text-[var(--text-muted)] font-mono">{log.date}</td>
                  <td className="py-3.5 px-4 text-[var(--text)]">{log.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons & Stage-Specific RBAC Governance Callouts */}
      <div className="pt-4 border-t border-[var(--paper-dim)]">
        {approval.status === 'APPROVED' ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-emerald-900">Quotation Approved & Workflow Confirmed</h4>
                <p className="text-xs text-emerald-700">Both Sales Manager & Finance approvals have been completed. Stepper & Invoice reconciled.</p>
              </div>
            </div>
            {canPerformAction && (
              <button
                onClick={() => handleAction('REVISION')}
                className="px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors"
              >
                Change to Revision
              </button>
            )}
          </div>
        ) : approval.status === 'REVISION_REQUESTED' ? (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <RotateCcw className="w-6 h-6 text-amber-600 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-amber-900">Revision Requested</h4>
                <p className="text-xs text-amber-700">Quote returned to Sales Rep for discount justification.</p>
              </div>
            </div>
            {canPerformAction && (
              <button
                onClick={() => handleAction('APPROVE')}
                className="px-4 py-2 text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
              >
                Approve Now
              </button>
            )}
          </div>
        ) : approval.status === 'REJECTED' ? (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <X className="w-6 h-6 text-rose-600 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-rose-900">Quotation Rejected</h4>
                <p className="text-xs text-rose-700">Requested discount ceiling exception was declined.</p>
              </div>
            </div>
            {canPerformAction && (
              <button
                onClick={() => handleAction('APPROVE')}
                className="px-4 py-2 text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
              >
                Override & Approve
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Role Governance Callout Banners */}
            {currentRole === 'sales_rep' ? (
              <div className="p-4 bg-slate-100 border border-slate-300 rounded-xl flex items-center gap-3 text-xs text-slate-800 font-medium">
                <Lock className="w-5 h-5 text-slate-500 shrink-0" />
                <div>
                  <strong className="font-bold text-slate-900">🔒 View Only Mode (Sales Rep):</strong> Sales Reps can build and submit quotes, but cannot approve discount ceiling exceptions. Use the top <strong>Persona Switcher</strong> to switch to <strong>Manager</strong> or <strong>Finance</strong> to approve this quote.
                </div>
              </div>
            ) : currentRole === 'sales_manager' && currentStage === 'Finance' ? (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-3 text-xs text-blue-900 font-medium">
                <Lock className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <strong className="font-bold">🔒 Pending Finance Approval (Step 3):</strong> Sales Manager approval is completed. This quote is now awaiting 2nd-level approval from the <strong>Finance</strong> persona. Switch to <strong>Finance</strong> persona in the TopBar to execute Step 3 approval.
                </div>
              </div>
            ) : currentRole === 'finance' && currentStage === 'Sales Manager' ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 text-xs text-amber-900 font-medium">
                <Lock className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <strong className="font-bold">🔒 Awaiting Manager Review (Step 2):</strong> This quote must be reviewed and approved by a <strong>Sales Manager</strong> first before Finance can perform second-level review. Switch to <strong>Manager</strong> persona to approve Step 2.
                </div>
              </div>
            ) : null}

            {/* Action Buttons for Authorized Roles */}
            {canPerformAction && (
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => handleAction('APPROVE')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all"
                >
                  <Check className="w-4 h-4" /> {currentStage === 'Sales Manager' ? 'Approve (Send to Finance)' : 'Final Approve & Confirm'}
                </button>

                <button
                  onClick={() => handleAction('REVISION')}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all"
                >
                  <RotateCcw className="w-4 h-4" /> Return for Revision
                </button>

                <button
                  onClick={() => handleAction('REJECT')}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all"
                >
                  <X className="w-4 h-4" /> Reject
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApprovalDetail;
