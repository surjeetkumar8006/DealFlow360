import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowRight, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const Subscriptions = () => {
  const navigate = useNavigate();

  // Table dataset matching Wireframe 9
  const [subscriptions, setSubscriptions] = useState([
    { id: 'sub-1', customer: 'Acme Corp', plan: 'Care Plan 2yr', cycle: 'Monthly', nextBill: 'Sep 15', status: 'Active' },
    { id: 'sub-2', customer: 'Beta Industries', plan: 'Support SLA', cycle: 'Quarterly', nextBill: 'Nov 1', status: 'Active' },
    { id: 'sub-3', customer: 'Delta LLC', plan: 'Care Plan 1yr', cycle: 'Monthly', nextBill: '-', status: 'Paused' },
    { id: 'sub-4', customer: 'Nova Retail', plan: 'Cloud POS Sync', cycle: 'Yearly', nextBill: 'Dec 10', status: 'Active' },
    { id: 'sub-5', customer: 'Zenith Co', plan: '24/7 Priority Support', cycle: 'Monthly', nextBill: '-', status: 'Cancelled' }
  ]);

  // Dynamically calculate status counts without flickering
  const counts = useMemo(() => {
    const active = subscriptions.filter((s) => (s.status || '').toLowerCase() === 'active').length;
    const paused = subscriptions.filter((s) => (s.status || '').toLowerCase() === 'paused').length;
    const cancelled = subscriptions.filter((s) => (s.status || '').toLowerCase() === 'cancelled').length;
    return { active, paused, cancelled };
  }, [subscriptions]);

  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'Active' | 'Paused' | 'Cancelled'
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState('');
  const [newPlan, setNewPlan] = useState('');
  const [newCycle, setNewCycle] = useState('Monthly');

  useEffect(() => {
    const fetchSubs = async () => {
      try {
        const res = await api.get('/subscriptions').catch(() => null);
        if (res && res.data && res.data.data) {
          setSubscriptions(res.data.data);
        }
      } catch (err) {
        console.error('Fetch subscriptions error:', err);
      }
    };
    fetchSubs();
  }, []);

  const filteredSubs = filter === 'ALL'
    ? subscriptions
    : subscriptions.filter(s => s.status.toLowerCase() === filter.toLowerCase());

  const handleRowClick = (subId) => {
    navigate(`/subscriptions/${subId}`);
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    if (!newCustomer || !newPlan) {
      toast.error('Customer name and Plan title are required');
      return;
    }

    const newSubItem = {
      id: `sub-${Date.now()}`,
      customer: newCustomer,
      plan: newPlan,
      cycle: newCycle,
      nextBill: 'Oct 01',
      status: 'Active'
    };

    try {
      await api.post('/subscriptions', newSubItem).catch(() => null);
      setSubscriptions([newSubItem, ...subscriptions]);
      setCounts(prev => ({ ...prev, active: prev.active + 1 }));
      toast.success(`Created subscription plan ${newPlan} for ${newCustomer}`);
      setShowAddModal(false);
      setNewCustomer('');
      setNewPlan('');
    } catch (err) {
      toast.error('Failed to create subscription');
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Title & Subtitle matching Wireframe 9 */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--text)] tracking-tight mb-1">
          Subscriptions (List)
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          Every recurring plan across every customer, regardless of which order it came from
        </p>
      </div>

      {/* Status Badges / Filter Pills matching Wireframe 9 */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => setFilter(filter === 'Active' ? 'ALL' : 'Active')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-xs transition-transform active:scale-95 ${
            filter === 'Active' ? 'ring-2 ring-emerald-900 bg-emerald-700' : 'bg-emerald-600 hover:bg-emerald-700'
          }`}
        >
          {counts.active} Active
        </button>

        <button
          onClick={() => setFilter(filter === 'Paused' ? 'ALL' : 'Paused')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-xs transition-transform active:scale-95 ${
            filter === 'Paused' ? 'ring-2 ring-amber-900 bg-amber-700' : 'bg-amber-600 hover:bg-amber-700'
          }`}
        >
          {counts.paused} Paused
        </button>

        <button
          onClick={() => setFilter(filter === 'Cancelled' ? 'ALL' : 'Cancelled')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-xs transition-transform active:scale-95 ${
            filter === 'Cancelled' ? 'ring-2 ring-rose-900 bg-rose-700' : 'bg-rose-600 hover:bg-rose-700'
          }`}
        >
          {counts.cancelled} Cancelled
        </button>

        {filter !== 'ALL' && (
          <button
            onClick={() => setFilter('ALL')}
            className="text-xs text-[var(--teal)] underline font-medium ml-2"
          >
            Show All
          </button>
        )}
      </div>

      {/* Table matching Wireframe 9 */}
      <div className="panel-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[var(--paper-dim)] border-b border-[var(--steel-line)] text-[var(--text-muted)] font-semibold">
              <tr>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Plan</th>
                <th className="py-3 px-4">Cycle</th>
                <th className="py-3 px-4">Next Bill</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--paper-dim)]">
              {filteredSubs.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => handleRowClick(row.id)}
                  className="hover:bg-amber-50/50 cursor-pointer transition-colors group"
                >
                  <td className="py-3.5 px-4 font-semibold text-[var(--text)] group-hover:text-[var(--teal)] flex items-center justify-between">
                    <span>{row.customer}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--teal)] ml-2" />
                  </td>
                  <td className="py-3.5 px-4 font-medium text-[var(--text)]">{row.plan}</td>
                  <td className="py-3.5 px-4 font-mono text-[var(--text-muted)]">{row.cycle}</td>
                  <td className="py-3.5 px-4 font-mono text-[var(--text-muted)]">{row.nextBill}</td>
                  <td className="py-3.5 px-4 font-mono font-medium">
                    {row.status === 'Active' ? (
                      <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-[#2F6F5E]/10 text-[var(--teal)] border border-[#2F6F5E]/20">
                        {row.status}
                      </span>
                    ) : row.status === 'Paused' ? (
                      <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-[#B8863B]/10 text-[var(--gold)] border border-[#B8863B]/20">
                        {row.status}
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-[var(--rust)]/10 text-[var(--rust)] border border-[var(--rust)]/20">
                        {row.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Yellow Callout Banner matching Wireframe 9 */}
      <div className="p-3.5 bg-[#FEFCE8] border border-[#FEF08A] rounded-xl text-xs text-[#854D0E] font-medium flex items-center gap-2 leading-relaxed shadow-xs">
        <div>
          Click a subscription row to open its billing detail and proration history.
        </div>
      </div>

      {/* Admin New Plan Button matching Wireframe 9 */}
      <div className="pt-2">
        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 bg-white border border-[var(--steel-line)] text-[var(--text)] hover:bg-slate-50 font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4 text-[var(--teal)]" /> + New Plan (Admin)
        </button>
      </div>

      {/* Modal for + New Plan (Admin) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-[var(--steel-line)] space-y-4">
            <h3 className="text-base font-bold text-[var(--text)]">Create Recurring Subscription Plan</h3>
            
            <form onSubmit={handleCreatePlan} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[var(--text)] mb-1">Customer Name</label>
                <input
                  type="text"
                  placeholder="e.g. Acme Corp"
                  value={newCustomer}
                  onChange={(e) => setNewCustomer(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--steel-line)] rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[var(--text)] mb-1">Plan Title</label>
                <input
                  type="text"
                  placeholder="e.g. Care Plan 2yr"
                  value={newPlan}
                  onChange={(e) => setNewPlan(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--steel-line)] rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[var(--text)] mb-1">Billing Cycle</label>
                <select
                  value={newCycle}
                  onChange={(e) => setNewCycle(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--steel-line)] rounded-lg text-xs"
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold border border-[var(--steel-line)] rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-[#2F6F5E] text-white rounded-lg hover:bg-[#245749]"
                >
                  Create Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscriptions;
