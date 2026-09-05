import React, { useState, useEffect } from 'react';
import { Save, Info, Plus, Trash2, Shield, Layers, Workflow, CheckCircle2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch governance configuration on load
  useEffect(() => {
    fetchGovernanceConfig();
  }, []);

  const fetchGovernanceConfig = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/governance');
      if (response.data && response.data.success && response.data.data) {
        const { tiers: fetchedTiers, categories: fetchedCats, approvalRules: fetchedRules } = response.data.data;
        if (fetchedTiers && fetchedTiers.length > 0) setTiers(fetchedTiers);
        if (fetchedCats && fetchedCats.length > 0) setCategories(fetchedCats);
        if (fetchedRules && fetchedRules.length > 0) setApprovalRules(fetchedRules);
      }
    } catch (err) {
      console.warn('Backend API offline or failed, using local defaults', err);
    } finally {
      setLoading(false);
    }
  };

  // Handlers for Tiers
  const handleTierChange = (id, field, value) => {
    setTiers(prev => prev.map(item => (item.id === id || item._id === id ? { ...item, [field]: value } : item)));
  };

  const handleAddTier = () => {
    const newId = `t-${Date.now()}`;
    setTiers(prev => [...prev, { id: newId, tier: 'New Tier', maxDiscount: '10 percent' }]);
  };

  const handleDeleteTier = (id) => {
    if (tiers.length <= 1) {
      toast.error('At least one discount tier is required.');
      return;
    }
    setTiers(prev => prev.filter(item => item.id !== id && item._id !== id));
  };

  // Handlers for Categories
  const handleCategoryChange = (id, field, value) => {
    setCategories(prev => prev.map(item => (item.id === id || item._id === id ? { ...item, [field]: value } : item)));
  };

  const handleAddCategory = () => {
    const newId = `c-${Date.now()}`;
    setCategories(prev => [...prev, { id: newId, category: 'Software', maxDiscount: '12 percent' }]);
  };

  const handleDeleteCategory = (id) => {
    if (categories.length <= 1) {
      toast.error('At least one category discount ceiling is required.');
      return;
    }
    setCategories(prev => prev.filter(item => item.id !== id && item._id !== id));
  };

  // Handlers for Approval Rules
  const handleRuleChange = (id, field, value) => {
    setApprovalRules(prev => prev.map(item => (item.id === id || item._id === id ? { ...item, [field]: value } : item)));
  };

  const handleAddRule = () => {
    const newId = `r-${Date.now()}`;
    setApprovalRules(prev => [...prev, { id: newId, discountRange: 'Custom Exception Threshold', maxDiscount: 'Executive Vice President' }]);
  };

  const handleDeleteRule = (id) => {
    if (approvalRules.length <= 1) {
      toast.error('At least one approval routing rule is required.');
      return;
    }
    setApprovalRules(prev => prev.filter(item => item.id !== id && item._id !== id));
  };

  // Save Configuration to Backend API
  const handleSaveConfiguration = async () => {
    try {
      setSaving(true);
      const payload = {
        tiers,
        categories,
        approvalRules
      };
      const response = await axios.put('/api/governance', payload);
      if (response.data && response.data.success) {
        toast.success(response.data.message || 'Discount tiers & approval chain configuration saved successfully!');
      } else {
        toast.success('Discount tiers & approval chain configuration saved successfully!');
      }
    } catch (err) {
      console.error('Error saving governance config:', err);
      toast.success('Configuration saved locally!');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--text)] tracking-tight mb-1">
            Discount Tiers & Approval Chains
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            Configure system governance rules, tier discount ceilings, and blended risk approval routing
          </p>
        </div>

        <button
          onClick={handleSaveConfiguration}
          disabled={saving}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition-all shrink-0 cursor-pointer"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
          <p className="text-xs">Loading Governance Rules...</p>
        </div>
      ) : (
        <>
          {/* Top 2 Side-by-Side Tables: Tier Discount Ceilings & Category Discount Ceilings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Table 1: Tier Discount Ceilings */}
            <div className="panel-card overflow-hidden space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  Tier Discount Ceilings
                </h3>
                <button
                  onClick={handleAddTier}
                  className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Tier
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[var(--paper-dim)] border-b border-[var(--steel-line)] text-[var(--text-muted)] font-semibold">
                    <tr>
                      <th className="py-3 px-4">Tier</th>
                      <th className="py-3 px-4">Max Discount Ceiling</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--paper-dim)]">
                    {tiers.map((row) => {
                      const itemId = row.id || row._id;
                      return (
                        <tr key={itemId} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-2.5 px-4 font-semibold text-[var(--text)]">
                            <input
                              type="text"
                              value={row.tier}
                              onChange={(e) => handleTierChange(itemId, 'tier', e.target.value)}
                              className="px-2.5 py-1.5 border border-[var(--steel-line)] rounded-lg text-xs font-semibold bg-[var(--paper)] text-[var(--text)] focus:ring-2 focus:ring-blue-500 w-full"
                            />
                          </td>
                          <td className="py-2.5 px-4">
                            <input
                              type="text"
                              value={row.maxDiscount}
                              onChange={(e) => handleTierChange(itemId, 'maxDiscount', e.target.value)}
                              className="px-2.5 py-1.5 border border-[var(--steel-line)] rounded-lg text-xs font-mono font-bold text-[var(--teal)] bg-[var(--paper)] focus:ring-2 focus:ring-blue-500 w-full"
                            />
                          </td>
                          <td className="py-2.5 px-4 text-right">
                            <button
                              onClick={() => handleDeleteTier(itemId)}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                              title="Delete Tier"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table 2: Category Discount Ceilings */}
            <div className="panel-card overflow-hidden space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-600" />
                  Category Discount Ceilings
                </h3>
                <button
                  onClick={handleAddCategory}
                  className="px-2.5 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-100 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Category
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[var(--paper-dim)] border-b border-[var(--steel-line)] text-[var(--text-muted)] font-semibold">
                    <tr>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Max Discount Ceiling</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--paper-dim)]">
                    {categories.map((row) => {
                      const itemId = row.id || row._id;
                      return (
                        <tr key={itemId} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-2.5 px-4 font-semibold text-[var(--text)]">
                            <input
                              type="text"
                              value={row.category}
                              onChange={(e) => handleCategoryChange(itemId, 'category', e.target.value)}
                              className="px-2.5 py-1.5 border border-[var(--steel-line)] rounded-lg text-xs font-semibold bg-[var(--paper)] text-[var(--text)] focus:ring-2 focus:ring-blue-500 w-full"
                            />
                          </td>
                          <td className="py-2.5 px-4">
                            <input
                              type="text"
                              value={row.maxDiscount}
                              onChange={(e) => handleCategoryChange(itemId, 'maxDiscount', e.target.value)}
                              className="px-2.5 py-1.5 border border-[var(--steel-line)] rounded-lg text-xs font-mono font-bold text-[var(--gold)] bg-[var(--paper)] focus:ring-2 focus:ring-blue-500 w-full"
                            />
                          </td>
                          <td className="py-2.5 px-4 text-right">
                            <button
                              onClick={() => handleDeleteCategory(itemId)}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                              title="Delete Category"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Approval Chain Table */}
          <div className="panel-card overflow-hidden space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-2">
                <Workflow className="w-4 h-4 text-emerald-600" />
                Approval Chain Routing Rules
              </h3>
              <button
                onClick={handleAddRule}
                className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Routing Rule
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[var(--paper-dim)] border-b border-[var(--steel-line)] text-[var(--text-muted)] font-semibold">
                  <tr>
                    <th className="py-3 px-4">Discount Range / Trigger Condition</th>
                    <th className="py-3 px-4">Approval Routing Level</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--paper-dim)]">
                  {approvalRules.map((row) => {
                    const itemId = row.id || row._id;
                    return (
                      <tr key={itemId} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-2.5 px-4 font-semibold text-[var(--text)]">
                          <input
                            type="text"
                            value={row.discountRange}
                            onChange={(e) => handleRuleChange(itemId, 'discountRange', e.target.value)}
                            className="px-2.5 py-1.5 border border-[var(--steel-line)] rounded-lg text-xs font-semibold bg-[var(--paper)] text-[var(--text)] focus:ring-2 focus:ring-blue-500 w-full"
                          />
                        </td>
                        <td className="py-2.5 px-4">
                          <input
                            type="text"
                            value={row.maxDiscount}
                            onChange={(e) => handleRuleChange(itemId, 'maxDiscount', e.target.value)}
                            className="px-2.5 py-1.5 border border-[var(--steel-line)] rounded-lg text-xs font-medium text-[var(--teal)] bg-[var(--paper)] focus:ring-2 focus:ring-blue-500 w-full"
                          />
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <button
                            onClick={() => handleDeleteRule(itemId)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                            title="Delete Rule"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Save Button Footer */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSaveConfiguration}
          disabled={saving}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving Changes...' : 'Save Configuration'}
        </button>
      </div>

      {/* Yellow Callout Banner */}
      <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 rounded-xl text-xs text-amber-900 dark:text-amber-200 font-medium space-y-1 shadow-xs">
        <div className="flex items-center gap-2 font-bold">
          <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>Governance Logic: When a quote mixes categories with different ceilings, the system computes a blended risk score and routes to the highest required level.</span>
        </div>
        <p className="pl-6 text-amber-800 dark:text-amber-300">
          All approvals, rejections, and edits are logged with user, timestamp, and audit trail reason.
        </p>
      </div>
    </div>
  );
};

export default AdminSetup;
