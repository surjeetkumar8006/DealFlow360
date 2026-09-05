import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Info, Plus, Layers, DollarSign, Trash2, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    productName: '',
    category: 'Hardware',
    price: '1200',
    unit: 'Each',
    description: '',
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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${id}`);
        const data = res?.data?.data;
        if (data) {
          setForm({
            productName: data.name || 'Laptop Pro 14',
            category: data.category || 'Hardware',
            price: data.price ? String(data.price).replace('$', '') : String(data.listPrice || 1200),
            unit: data.unit || 'Each',
            description: data.description || 'High-performance enterprise laptop workstation with thunderbolt connectivity.',
            taxPercent: data.taxRate ? String(data.taxRate) : (data.tax ? String(data.tax).replace('%', '') : '15'),
            isSubscription: data.isSubscription !== undefined ? data.isSubscription : data.category === 'Subscription',
            recurring: data.recurring || 'Monthly',
            quantityOnHand: data.quantityOnHand !== undefined ? Number(data.quantityOnHand) : 42,
          });
        }
      } catch (err) {
        console.error('Fetch product detail error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    try {
      const parsedPriceNum = Number(form.price) || 100;
      const formattedPrice = form.price.startsWith('$') ? form.price : `$${form.price}`;

      const payload = {
        name: form.productName,
        category: form.category,
        price: formattedPrice,
        listPrice: parsedPriceNum,
        unit: form.unit,
        description: form.description,
        tax: `${form.taxPercent}%`,
        taxRate: Number(form.taxPercent) || 15,
        isSubscription: form.isSubscription,
        recurring: form.recurring,
        quantityOnHand: Number(form.quantityOnHand) || 0,
      };

      await api.put(`/products/${id}`, payload);
      toast.success(`Product "${form.productName}" configuration saved to database!`);
    } catch (err) {
      toast.error('Failed to save product changes');
    }
  };

  const handleAddVariant = () => {
    const newV = {
      id: `v-${Date.now()}`,
      attribute: 'New Attribute',
      values: 'Default Value',
      extraPrice: '0'
    };
    setVariants([...variants, newV]);
  };

  const handleUpdateVariant = (idx, field, val) => {
    const copy = [...variants];
    copy[idx][field] = val;
    setVariants(copy);
  };

  const handleDeleteVariant = (idx) => {
    setVariants(variants.filter((_, i) => i !== idx));
  };

  const handleAddPricelist = () => {
    const newP = {
      id: `pl-${Date.now()}`,
      tier: 'Silver',
      currency: 'USD',
      priceRule: 'Price minus 5 percent'
    };
    setPricelists([...pricelists, newP]);
  };

  const handleUpdatePricelist = (idx, field, val) => {
    const copy = [...pricelists];
    copy[idx][field] = val;
    setPricelists(copy);
  };

  const handleDeletePricelist = (idx) => {
    setPricelists(pricelists.filter((_, i) => i !== idx));
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back button & Title bar */}
      <div>
        <button
          onClick={() => navigate('/products')}
          className="text-xs text-[var(--teal)] hover:underline flex items-center gap-1 font-medium mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Product Catalog
        </button>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--text)] tracking-tight mb-1">
              Product detail & pricelist
            </h1>
            <p className="text-sm text-[var(--text-muted)]">
              Configure product details, variants, inventory stock, and tier/currency price rules
            </p>
          </div>

          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer"
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
                required
                value={form.productName}
                onChange={(e) => setForm({ ...form, productName: e.target.value })}
                className="w-full px-3 py-2 bg-[var(--paper-dim)] border border-[var(--steel-line)] rounded-xl text-xs text-[var(--text)] font-semibold mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--text)]">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value, isSubscription: e.target.value === 'Subscription' })}
                className="w-full px-3 py-2 bg-[var(--paper-dim)] border border-[var(--steel-line)] rounded-xl text-xs text-[var(--text)] font-semibold mt-1"
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
                required
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

      {/* Product Variants Section */}
      <div className="panel-card space-y-3">
        <div className="flex items-center justify-between border-b border-[var(--paper-dim)] pb-2">
          <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
            Product Variants
          </h3>
          <button
            type="button"
            onClick={handleAddVariant}
            className="px-3 py-1 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add Variant
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[var(--paper-dim)] border-b border-[var(--steel-line)] text-[var(--text-muted)] font-semibold">
              <tr>
                <th className="py-3 px-4">Attribute</th>
                <th className="py-3 px-4">Values</th>
                <th className="py-3 px-4">Extra price</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--paper-dim)]">
              {variants.map((v, idx) => (
                <tr key={v.id || idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-2.5 px-4 font-semibold text-[var(--text)]">
                    <input
                      type="text"
                      value={v.attribute}
                      onChange={(e) => handleUpdateVariant(idx, 'attribute', e.target.value)}
                      className="px-2 py-1 bg-[var(--paper-dim)] border border-[var(--steel-line)] rounded-lg text-xs w-full font-semibold"
                    />
                  </td>
                  <td className="py-2.5 px-4 text-[var(--text)] font-medium">
                    <input
                      type="text"
                      value={v.values}
                      onChange={(e) => handleUpdateVariant(idx, 'values', e.target.value)}
                      className="px-2 py-1 bg-[var(--paper-dim)] border border-[var(--steel-line)] rounded-lg text-xs w-full"
                    />
                  </td>
                  <td className="py-2.5 px-4 font-mono font-bold text-[var(--teal)]">
                    <input
                      type="text"
                      value={v.extraPrice}
                      onChange={(e) => handleUpdateVariant(idx, 'extraPrice', e.target.value)}
                      className="px-2 py-1 bg-[var(--paper-dim)] border border-[var(--steel-line)] rounded-lg text-xs w-full font-mono"
                    />
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleDeleteVariant(idx)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                      title="Delete Variant"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pricelists Section */}
      <div className="panel-card space-y-3">
        <div className="flex items-center justify-between border-b border-[var(--paper-dim)] pb-2">
          <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
            Pricelists
          </h3>
          <button
            type="button"
            onClick={handleAddPricelist}
            className="px-3 py-1 text-xs font-bold text-emerald-600 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add Price Rule
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[var(--paper-dim)] border-b border-[var(--steel-line)] text-[var(--text-muted)] font-semibold">
              <tr>
                <th className="py-3 px-4">Tier</th>
                <th className="py-3 px-4">Currency</th>
                <th className="py-3 px-4">Price Rule</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--paper-dim)]">
              {pricelists.map((p, idx) => (
                <tr key={p.id || idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-2.5 px-4 font-semibold text-[var(--text)]">
                    <select
                      value={p.tier}
                      onChange={(e) => handleUpdatePricelist(idx, 'tier', e.target.value)}
                      className="px-2 py-1 bg-[var(--paper-dim)] border border-[var(--steel-line)] rounded-lg text-xs font-semibold"
                    >
                      <option value="Bronze">Bronze</option>
                      <option value="Silver">Silver</option>
                      <option value="Gold">Gold</option>
                      <option value="Platinum">Platinum</option>
                    </select>
                  </td>
                  <td className="py-2.5 px-4 font-mono text-[var(--text-muted)]">
                    <input
                      type="text"
                      value={p.currency}
                      onChange={(e) => handleUpdatePricelist(idx, 'currency', e.target.value)}
                      className="px-2 py-1 bg-[var(--paper-dim)] border border-[var(--steel-line)] rounded-lg text-xs w-full font-mono"
                    />
                  </td>
                  <td className="py-2.5 px-4 text-[var(--text)] font-medium">
                    <input
                      type="text"
                      value={p.priceRule}
                      onChange={(e) => handleUpdatePricelist(idx, 'priceRule', e.target.value)}
                      className="px-2 py-1 bg-[var(--paper-dim)] border border-[var(--steel-line)] rounded-lg text-xs w-full"
                    />
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleDeletePricelist(idx)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                      title="Delete Price Rule"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
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
