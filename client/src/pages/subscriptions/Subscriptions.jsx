import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowRight, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const DEFAULT_CUSTOMERS = [
  'Acme Corp',
  'Beta Industries',
  'Delta LLC',
  'Nova Retail',
  'Zenith Co',
  'Orion Ltd'
];

const DEFAULT_PLANS = [
  'Care Plan 2yr',
  'Support SLA',
  'Care Plan 1yr',
  'Cloud POS Sync',
  '24/7 Priority Support',
  'Care Plan 3 years',
  'Enterprise Cloud Backup Subscription',
  '24/7 Managed IT Support Retainer'
];

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
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Selection lists & form state
  const [customersList, setCustomersList] = useState(DEFAULT_CUSTOMERS);
  const [plansList, setPlansList] = useState(DEFAULT_PLANS);

  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [customCustomer, setCustomCustomer] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [customPlan, setCustomPlan] = useState('');
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

    const fetchCustomersAndProducts = async () => {
      try {
        const [custRes, prodRes] = await Promise.all([
          api.get('/customers').catch(() => null),
          api.get('/products').catch(() => null)
        ]);
        if (custRes && custRes.data && Array.isArray(custRes.data.data)) {
          const names = custRes.data.data.map(c => c.name).filter(Boolean);
          setCustomersList(prev => Array.from(new Set([...prev, ...names])));
        }
        if (prodRes && prodRes.data && Array.isArray(prodRes.data.data)) {
          const names = prodRes.data.data.map(p => p.name).filter(Boolean);
          setPlansList(prev => Array.from(new Set([...prev, ...names])));
        }
      } catch (err) {
        console.error('Error fetching options:', err);
      }
    };

    fetchSubs();
    fetchCustomersAndProducts();
  }, []);

  const filteredSubs = useMemo(() => {
    return subscriptions.filter((s) => {
      const matchFilter = filter === 'ALL' || (s.status || '').toLowerCase() === filter.toLowerCase();
      const matchSearch = !searchTerm || 
        (s.customer || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.plan || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.id || '').toLowerCase().includes(searchTerm.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [subscriptions, filter, searchTerm]);

  const handleRowClick = (subId) => {
    navigate(`/subscriptions/${subId}`);
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    const finalCustomer = selectedCustomer === 'CUSTOM' ? customCustomer.trim() : selectedCustomer;
    const finalPlan = selectedPlan === 'CUSTOM' ? customPlan.trim() : selectedPlan;

    if (!finalCustomer || !finalPlan) {
      toast.error('Customer name and Plan title are required');
      return;
    }

    const newSubItem = {
      id: `sub-${Date.now()}`,
      customer: finalCustomer,
      plan: finalPlan,
      cycle: newCycle,
      nextBill: 'Oct 01',
      status: 'Active'
    };

    try {
      await api.post('/subscriptions', newSubItem).catch(() => null);
      setSubscriptions([newSubItem, ...subscriptions]);
      toast.success(`Created subscription plan "${finalPlan}" for ${finalCustomer}`);
      setShowAddModal(false);
      setSelectedCustomer('');
      setCustomCustomer('');
      setSelectedPlan('');
      setCustomPlan('');
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

      {/* Filter Bar: Search Input + Status Filter Pills */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filter === 'ALL'
                ? 'bg-slate-200 text-slate-900 border border-slate-300 shadow-2xs font-extrabold'
                : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-300 font-semibold'
            }`}
          >
            All ({subscriptions.length})
          </button>
          <button
            onClick={() => setFilter(filter === 'Active' ? 'ALL' : 'Active')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filter === 'Active'
                ? 'bg-slate-200 text-slate-900 border border-slate-300 shadow-2xs font-extrabold'
                : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-300 font-semibold'
            }`}
          >
            {counts.active} Active
          </button>

          <button
            onClick={() => setFilter(filter === 'Paused' ? 'ALL' : 'Paused')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filter === 'Paused'
                ? 'bg-slate-200 text-slate-900 border border-slate-300 shadow-2xs font-extrabold'
                : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-300 font-semibold'
            }`}
          >
            {counts.paused} Paused
          </button>

          <button
            onClick={() => setFilter(filter === 'Cancelled' ? 'ALL' : 'Cancelled')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filter === 'Cancelled'
                ? 'bg-slate-200 text-slate-900 border border-slate-300 shadow-2xs font-extrabold'
                : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-300 font-semibold'
            }`}
          >
            {counts.cancelled} Cancelled
          </button>
        </div>

        <div className="relative min-w-[240px] sm:min-w-[280px]">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Customer or Plan..."
            className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-[var(--steel-line)] rounded-xl text-xs text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--teal)]/30"
          />
          <svg className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
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
                <select
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--steel-line)] rounded-lg text-xs font-medium bg-white"
                  required
                >
                  <option value="" disabled>-- Select Customer --</option>
                  {customersList.map((c, idx) => (
                    <option key={idx} value={c}>{c}</option>
                  ))}
                  <option value="CUSTOM">+ Custom Customer Name...</option>
                </select>
                {selectedCustomer === 'CUSTOM' && (
                  <input
                    type="text"
                    placeholder="Enter Custom Customer Name (e.g. Acme Corp)"
                    value={customCustomer}
                    onChange={(e) => setCustomCustomer(e.target.value)}
                    className="w-full px-3 py-2 mt-2 border border-[var(--steel-line)] rounded-lg text-xs"
                    required
                  />
                )}
              </div>

              <div>
                <label className="block font-semibold text-[var(--text)] mb-1">Plan Title</label>
                <select
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--steel-line)] rounded-lg text-xs font-medium bg-white"
                  required
                >
                  <option value="" disabled>-- Select Plan Title --</option>
                  {plansList.map((p, idx) => (
                    <option key={idx} value={p}>{p}</option>
                  ))}
                  <option value="CUSTOM">+ Custom Plan Title...</option>
                </select>
                {selectedPlan === 'CUSTOM' && (
                  <input
                    type="text"
                    placeholder="Enter Custom Plan Title (e.g. Care Plan 2yr)"
                    value={customPlan}
                    onChange={(e) => setCustomPlan(e.target.value)}
                    className="w-full px-3 py-2 mt-2 border border-[var(--steel-line)] rounded-lg text-xs"
                    required
                  />
                )}
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
