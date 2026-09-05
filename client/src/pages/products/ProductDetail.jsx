import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Info, Plus, Layers, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    productName: 'Laptop Pro 14',
    category: 'Hardware',
    price: '1200',
    unit: 'Each',
    description: 'High-performance enterprise laptop workstation with thunderbolt connectivity.',
    taxPercent: '15',
    isSubscription: false,
    recurring: 'Monthly',
    quantityOnHand: 42,
  });

  const [variants, setVariants] = useState([
    { id: 'v-1', attribute: 'Color', values: 'Blue, Black', extraPrice: '0' },
    { id: 'v-2', attribute: 'RAM', values: '4GB, 8GB', extraPrice: '+$30' },
    { id: 'v-3', attribute: 'Manufacturer', values: 'Dell, HP', extraPrice: '+$10/+$30' },
  ]);

  const [pricelists, setPricelists] = useState([
    { id: 'p-1', tier: 'Bronze', currency: 'USD', priceRule: 'Price, no adjustment' },
    { id: 'p-2', tier: 'Gold', currency: 'USD/EUR', priceRule: 'Price minus 10 percent base' },
  ]);

  const handleSave = (e) => {
    e.preventDefault();
    toast.success(`Product "${form.productName}" configuration saved successfully!`);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/products')}
          className="text-xs text-[var(--teal)] hover:underline flex items-center gap-1 font-medium mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Product Catalog
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--text)] tracking-tight mb-1">
              Product and pricelist
            </h1>
            <p className="text-sm text-[var(--text-muted)]">
              Configure product details, variants, inventory stock, and tier/currency price rules
            </p>
          </div>

          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>

      {/* General Info Form Section */}
      <div className="panel-card space-y-4">
        <h3 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--paper-dim)] pb-2">
          General Info
        </h3>

        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column Inputs */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-[var(--text)]">Product name</label>
              <input
                type="text"
                value={form.productName}
                onChange={(e) => setForm({ ...form, productName: e.target.value })}
                className="w-full px-3 py-2 bg-[var(--paper-dim)] border border-[var(--steel-line)] rounded-xl text-xs text-[var(--text)] font-medium mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--text)]">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 bg-[var(--paper-dim)] border border-[var(--steel-line)] rounded-xl text-xs text-[var(--text)] font-medium mt-1"
              >
                <option value="Hardware">Hardware</option>
                <option value="Services">Services</option>
                <option value="Subscription">Subscription</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--text)]">Price ($)</label>
              <input
                type="text"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full px-3 py-2 bg-[var(--paper-dim)] border border-[var(--steel-line)] rounded-xl text-xs text-[var(--text)] font-mono font-bold mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--text)]">Unit</label>
              <input
                type="text"
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                className="w-full px-3 py-2 bg-[var(--paper-dim)] border border-[var(--steel-line)] rounded-xl text-xs text-[var(--text)] font-medium mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--text)]">Description</label>
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 bg-[var(--paper-dim)] border border-[var(--steel-line)] rounded-xl text-xs text-[var(--text)] font-medium mt-1"
              />
            </div>
          </div>

          {/* Right Column Inputs */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-[var(--text)]">Tax %</label>
              <input
                type="text"
                value={form.taxPercent}
                onChange={(e) => setForm({ ...form, taxPercent: e.target.value })}
                className="w-full px-3 py-2 bg-[var(--paper-dim)] border border-[var(--steel-line)] rounded-xl text-xs text-[var(--text)] font-mono mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--text)]">Subscription</label>
              <div className="flex items-center gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, isSubscription: !form.isSubscription })}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    form.isSubscription
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-[var(--paper-dim)] text-[var(--text-muted)] border-[var(--steel-line)]'
                  }`}
                >
                  {form.isSubscription ? 'Yes' : 'No'}
                </button>
                <span className="text-[11px] text-[var(--text-muted)] italic">
                  If subscription yes then recurring will be visible
                </span>
              </div>
            </div>

            {form.isSubscription && (
              <div>
                <label className="text-xs font-semibold text-[var(--text)]">Recurring</label>
                <select
                  value={form.recurring}
                  onChange={(e) => setForm({ ...form, recurring: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--paper-dim)] border border-[var(--steel-line)] rounded-xl text-xs text-[var(--text)] font-medium mt-1"
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                  <option value="Weekly">Weekly</option>
                </select>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-[var(--text)]">Quantity on hand (Integer field)</label>
              <input
                type="number"
                value={form.quantityOnHand}
                onChange={(e) => setForm({ ...form, quantityOnHand: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-[var(--paper-dim)] border border-[var(--steel-line)] rounded-xl text-xs text-[var(--text)] font-mono font-bold mt-1"
              />
            </div>
          </div>
        </form>
      </div>

      {/* Product Variants Table */}
      <div className="panel-card overflow-hidden space-y-3">
        <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
          Product Variants
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[var(--paper-dim)] border-b border-[var(--steel-line)] text-[var(--text-muted)] font-semibold">
              <tr>
                <th className="py-3 px-4">Attribute</th>
                <th className="py-3 px-4">Values</th>
                <th className="py-3 px-4">Extra price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--paper-dim)]">
              {variants.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[var(--text)]">{v.attribute}</td>
                  <td className="py-3.5 px-4 text-[var(--text)] font-medium">{v.values}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[var(--teal)]">{v.extraPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pricelists Table */}
      <div className="panel-card overflow-hidden space-y-3">
        <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
          Pricelists
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[var(--paper-dim)] border-b border-[var(--steel-line)] text-[var(--text-muted)] font-semibold">
              <tr>
                <th className="py-3 px-4">Tier</th>
                <th className="py-3 px-4">Currency</th>
                <th className="py-3 px-4">Price Rule</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--paper-dim)]">
              {pricelists.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[var(--text)]">{p.tier}</td>
                  <td className="py-3.5 px-4 font-mono text-[var(--text-muted)]">{p.currency}</td>
                  <td className="py-3.5 px-4 text-[var(--text)] font-medium">{p.priceRule}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Yellow Callout Banner */}
      <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 rounded-xl text-xs text-amber-900 dark:text-amber-200 font-medium space-y-1 shadow-xs">
        <div className="flex items-center gap-2 font-bold">
          <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>Product details should be filled.</span>
        </div>
        <p className="pl-6 text-amber-800 dark:text-amber-300">
          Recurring order with this product will be invoiced at the beginning of the period.
        </p>
      </div>
    </div>
  );
};

export default ProductDetail;
