import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchApprovalsThunk,
  processApprovalThunk,
  togglePendingOnlyFilter
} from '../../store/slices/approvalSlice';
import {
  Check,
  X,
  RotateCcw,
  ShieldAlert,
  AlertTriangle,
  Filter,
  Eye,
  History,
  User,
  ChevronRight
} from 'lucide-react';

const ApprovalsQueue = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, counts, pendingOnlyFilter, loading } = useSelector((state) => state.approvals);
  const [selectedApproval, setSelectedApproval] = useState(null);

  useEffect(() => {
    dispatch(fetchApprovalsThunk());
  }, [dispatch]);

  const handleAction = (id, action) => {
    dispatch(processApprovalThunk({ id, action, note: `Manager action: ${action}` }));
    if (selectedApproval && selectedApproval._id === id) {
      const newStatus = action === 'REJECT' ? 'REJECTED' : action === 'REVISION' ? 'REVISION_REQUESTED' : 'APPROVED';
      setSelectedApproval({
        ...selectedApproval,
        status: newStatus,
        auditTrail: [
          ...(selectedApproval.auditTrail || []),
          {
            timestamp: new Date().toISOString(),
            actor: 'M. Shah (Sales Manager)',
            action: `Action ${action} taken by Manager`
          }
        ]
      });
    }
  };

  const displayedItems = pendingOnlyFilter
    ? items.filter((item) => item.status === 'PENDING_APPROVAL')
    : items;

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header matching Wireframe */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--text)] tracking-tight mb-1">
            Approvals (List)
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            Every quotation that needed, needs, or is going through discount approval
          </p>
        </div>
        {loading && (
          <div className="text-xs text-[var(--teal)] font-medium animate-pulse">
            Syncing queue...
          </div>
        )}
      </div>

      {/* Summary Status Counter Pills matching Wireframe */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="bg-[#B8863B] text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs flex items-center gap-2">
          <span>{counts?.pending ?? items.filter((i) => i.status === 'PENDING_APPROVAL').length}</span>
          <span>Pending</span>
        </div>

        <div className="bg-[var(--rust)] text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs flex items-center gap-2">
          <span>{counts?.returned ?? items.filter((i) => i.status === 'REVISION_REQUESTED').length}</span>
          <span>Returned</span>
        </div>

        <div className="bg-[var(--teal)] text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs flex items-center gap-2">
          <span>{counts?.approved ?? items.filter((i) => i.status === 'APPROVED').length}</span>
          <span>Approved</span>
        </div>
      </div>

      {/* Approvals Chain Table matching Wireframe */}
      <div className="panel-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[var(--paper-dim)] border-b border-[var(--steel-line)] text-[var(--text-muted)] font-semibold">
              <tr>
                <th className="py-3 px-4">Quotation</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Blended Risk</th>
                <th className="py-3 px-4">Stage</th>
                <th className="py-3 px-4">Assigned To</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--paper-dim)]">
              {displayedItems.map((item) => (
                <tr
                  key={item._id}
                  onClick={() => navigate(`/approvals/${item._id}`)}
                  className="hover:bg-slate-50/70 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4 font-semibold text-[var(--text)]">{item.quoteNumber}</td>
                  <td className="py-3.5 px-4 text-[var(--text)] font-medium">{item.customerName}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 text-xs font-mono font-bold rounded ${
                        item.riskLevel === 'HIGH'
                          ? 'text-[var(--rust)] bg-[var(--rust)]/10'
                          : item.riskLevel === 'MEDIUM'
                          ? 'text-[var(--gold)] bg-[var(--gold)]/10'
                          : 'text-[var(--teal)] bg-[var(--teal)]/10'
                      }`}
                    >
                      {item.riskLevel || 'MEDIUM'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[var(--text)]">{item.stage || 'Sales Manager'}</td>
                  <td className="py-3.5 px-4 text-[var(--text-muted)] font-mono">{item.assignedTo || 'M. Shah'}</td>
                </tr>
              ))}

              {displayedItems.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-xs text-[var(--text-muted)]">
                    No approval items matching the filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Yellow Guidance Alert Bar matching Wireframe */}
      <div className="p-3.5 bg-[#FEFCE8] border border-[#FEF08A] rounded-xl text-xs text-[#854D0E] font-medium flex items-center gap-2 leading-relaxed shadow-xs">
        <AlertTriangle className="w-4 h-4 text-[#CA8A04] shrink-0" />
        <div>
          Click any row to open its full approval detail, risk breakdown, and audit trail.
        </div>
      </div>

      {/* Filter Button matching Wireframe */}
      <div className="pt-2">
        <button
          onClick={() => dispatch(togglePendingOnlyFilter())}
          className="btn-outline-steel flex items-center gap-2 py-2 px-4 text-xs font-semibold"
        >
          <Filter className="w-4 h-4" />
          Filter: {pendingOnlyFilter ? 'Pending Only (Active)' : 'Pending Only'}
        </button>
      </div>

      {/* Approval Detail & Audit Trail Modal */}
      {selectedApproval && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-xl w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--paper-dim)]">
              <div>
                <h2 className="text-lg font-semibold text-[var(--text)]">
                  Approval Request: {selectedApproval.quoteNumber}
                </h2>
                <div className="text-xs text-[var(--text-muted)]">
                  Customer: <strong>{selectedApproval.customerName}</strong> ({selectedApproval.customerTier} Tier)
                </div>
              </div>
              <button
                onClick={() => setSelectedApproval(null)}
                className="text-[var(--text-muted)] hover:text-[var(--text)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Approval Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white border border-[var(--steel-line)] rounded-md">
                <div className="text-xs text-[var(--text-muted)] font-medium">Assigned Stage</div>
                <div className="text-sm font-semibold text-[var(--text)] mt-1">{selectedApproval.stage || 'Sales Manager'}</div>
              </div>
              <div className="p-3 bg-white border border-[var(--steel-line)] rounded-md">
                <div className="text-xs text-[var(--text-muted)] font-medium">Reviewer</div>
                <div className="text-sm font-semibold text-[var(--text)] font-mono mt-1">{selectedApproval.assignedTo || 'M. Shah'}</div>
              </div>
            </div>

            {/* Ceiling Violation Note */}
            {selectedApproval.ceilingViolation && (
              <div className="p-3 bg-[var(--rust)]/10 text-[var(--rust)] rounded-md border border-[var(--rust)]/20 text-xs">
                ⚠️ <strong>Governance Warning:</strong> {selectedApproval.ceilingViolation}
              </div>
            )}

            {/* Audit Trail Timeline */}
            <div>
              <h3 className="text-xs font-semibold text-[var(--text)] mb-2 flex items-center gap-1">
                <History className="w-3.5 h-3.5 text-[var(--teal)]" /> Audit Trail Log
              </h3>
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {selectedApproval.auditTrail?.map((log, idx) => (
                  <div key={idx} className="p-2.5 bg-white border border-[var(--steel-line)] rounded text-xs space-y-0.5">
                    <div className="flex justify-between text-[var(--text-muted)] text-[11px]">
                      <span>{log.actor}</span>
                      <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="font-medium text-[var(--text)]">{log.action}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-3 border-t border-[var(--paper-dim)]">
              <button
                onClick={() => handleAction(selectedApproval._id, 'APPROVE')}
                className="btn-primary-gold flex items-center gap-1 py-1.5 px-4 text-xs"
              >
                <Check className="w-4 h-4" /> Approve
              </button>

              <button
                onClick={() => handleAction(selectedApproval._id, 'REJECT')}
                className="px-4 py-1.5 text-xs font-medium bg-[var(--rust)] hover:bg-[#8A382A] text-white rounded-md flex items-center gap-1 transition-all"
              >
                <X className="w-4 h-4" /> Reject
              </button>

              <button
                onClick={() => handleAction(selectedApproval._id, 'REVISION')}
                className="btn-outline-steel flex items-center gap-1 py-1.5 px-3 text-xs"
              >
                <RotateCcw className="w-4 h-4" /> Return for Revision
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalsQueue;
