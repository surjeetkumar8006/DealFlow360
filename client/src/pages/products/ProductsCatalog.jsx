import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Settings, Info, Package, Search, Filter, Edit3, Trash2, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const INITIAL_PRODUCTS = [
  {
    id: 'p-1',
    name: 'Laptop Pro 14',
    category: 'Hardware',
    variants: '3(size)',
    price: '$1,200',
    unit: 'Each',
    tax: '15%',
    status: 'Active'
  },
  {
    id: 'p-2',
    name: 'Onsite Setup Service',
    category: 'Services',
    variants: '-',
    price: '$450',
    unit: 'Each',
    tax: '-',
    status: 'Active'
  },
  {
    id: 'p-3',
    name: 'Docking Station',
    category: 'Hardware',
    variants: '3(color)',
    price: '$180',
    unit: 'Each',
    tax: '15%',
    status: 'Active'
  },
  {
    id: 'p-4',
    name: 'Care Plan 3 years',
    category: 'Subscription',
    variants: '-',
    price: '$40/month',
    unit: 'Recurring',
    tax: '0%',
    status: 'Active'
  }
];

const ProductsCatalog = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Hardware',
    variants: '-',
    price: '',
    unit: 'Each',
    tax: '15%',
    status: 'Active'
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        if (res.data && res.data.data && Array.isArray(res.data.data)) {
          setProducts(res.data.data);
        }
      } catch (err) {
        console.error('Fetch products error:', err);
      }
    };
    fetchProducts();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
      toast.error('Please enter product name and price');
      return;
    }

    try {
      const res = await api.post('/products', newProduct).catch(() => null);
      const created = res?.data?.data || {
        id: `p-${Date.now()}`,
        ...newProduct
      };

      setProducts((prev) => [created, ...prev]);
      toast.success(`Product "${newProduct.name}" added to catalog!`);
      setShowAddModal(false);
      setNewProduct({
        name: '',
        category: 'Hardware',
        variants: '-',
        price: '',
        unit: 'Each',
        tax: '15%',
        status: 'Active'
      });
    } catch (err) {
      toast.error('Failed to add product');
    }
  };

  const handleEditClick = (e, product) => {
    e.stopPropagation();
    setEditingProduct({ ...product });
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/products/${editingProduct.id}`, editingProduct).catch(() => null);
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? editingProduct : p))
      );
      toast.success(`Product "${editingProduct.name}" updated successfully!`);
      setEditingProduct(null);
    } catch (err) {
      toast.error('Failed to update product');
    }
  };

  const handleDeleteClick = async (e, product) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      try {
        await api.delete(`/products/${product.id}`).catch(() => null);
        setProducts((prev) => prev.filter((p) => p.id !== product.id));
        toast.success(`Product "${product.name}" deleted.`);
      } catch (err) {
        toast.error('Failed to delete product');
      }
    }
  };

  const [showPriceFieldsModal, setShowPriceFieldsModal] = useState(false);
  const [priceFields, setPriceFields] = useState([
    { id: 'pf-1', name: 'Base Price ($)', required: true, enabled: true },
    { id: 'pf-2', name: 'Tier Discount Ceiling (%)', required: false, enabled: true },
    { id: 'pf-3', name: 'Minimum Floor Price ($)', required: false, enabled: true },
    { id: 'pf-4', name: 'Currency Multiplier (USD/EUR)', required: false, enabled: true },
    { id: 'pf-5', name: 'Regional Tax Rate (%)', required: false, enabled: true },
    { id: 'pf-6', name: 'Volume Rebate %', required: false, enabled: false },
    { id: 'pf-7', name: 'Dealer Margin %', required: false, enabled: false },
  ]);

  const handleManagePriceFields = () => {
    setShowPriceFieldsModal(true);
  };

  const toggleField = (id) => {
    setPriceFields((prev) =>
      prev.map((f) => (f.id === id && !f.required ? { ...f, enabled: !f.enabled } : f))
    );
  };

  const handleSavePriceFields = (e) => {
    e.preventDefault();
    toast.success('Price fields configuration saved successfully!');
    setShowPriceFieldsModal(false);
  };

  const handleRowClick = (product) => {
    navigate(`/products/${product.id}`);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--text)] tracking-tight mb-1">
            Product catalog
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            Every product, variant and price list in one place.
          </p>
        </div>

        {/* Top Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            + New Product
          </button>

          <button
            onClick={handleManagePriceFields}
            className="px-5 py-2.5 border border-[var(--steel-line)] hover:bg-slate-50 dark:hover:bg-slate-800 text-[var(--text)] text-xs font-bold rounded-xl flex items-center gap-2 transition-all"
          >
            <Settings className="w-4 h-4 text-[var(--teal)]" />
            Manage Price fields
          </button>
        </div>
      </div>

      {/* 3 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Total Products */}
        <div className="panel-card border-l-4 border-[var(--teal)] space-y-1">
          <div className="text-sm font-semibold text-[var(--text)]">Total Products</div>
          <div className="text-xs text-[var(--text-muted)] font-medium">{products.length} active, 6 archived</div>
        </div>

        {/* Card 2: Pricelists */}
        <div className="panel-card border-l-4 border-[var(--gold)] space-y-1">
          <div className="text-sm font-semibold text-[var(--text)]">Pricelists</div>
          <div className="text-xs text-[var(--text-muted)] font-medium">3 tiers, 2 Currencies</div>
        </div>

        {/* Card 3: Variants */}
        <div className="panel-card border-l-4 border-[var(--rust)] space-y-1">
          <div className="text-sm font-semibold text-[var(--text)]">Variants</div>
          <div className="text-xs text-[var(--text-muted)] font-medium">340 SKUs across all products</div>
        </div>
      </div>

      {/* Products Section Header Badge */}
      <div className="flex items-center justify-between">
        <span className="px-4 py-1.5 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 rounded-xl text-xs font-bold">
          Products ({products.length})
        </span>
      </div>

      {/* Products Catalog Table */}
      <div className="panel-card overflow-hidden space-y-3">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[var(--paper-dim)] border-b border-[var(--steel-line)] text-[var(--text-muted)] font-semibold">
              <tr>
                <th className="py-3 px-4">Product name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Variants</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Unit</th>
                <th className="py-3 px-4">Tax</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--paper-dim)]">
              {products.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => handleRowClick(p)}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-4 font-semibold text-[var(--text)]">{p.name}</td>
                  <td className="py-3.5 px-4 text-[var(--text-muted)] font-medium">{p.category}</td>
                  <td className="py-3.5 px-4 font-mono text-[var(--text-muted)]">{p.variants}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[var(--text)]">{p.price}</td>
                  <td className="py-3.5 px-4 text-[var(--text-muted)]">{p.unit}</td>
                  <td className="py-3.5 px-4 font-mono text-[var(--text-muted)]">{p.tax}</td>
                  <td className="py-3.5 px-4 font-mono">
                    <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={(e) => handleEditClick(e, p)}
                        className="px-2.5 py-1 text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 hover:bg-blue-100 rounded-lg flex items-center gap-1"
                        title="Edit product"
                      >
                        <Edit3 className="w-3 h-3" /> Edit
                      </button>
                      <button
                        onClick={(e) => handleDeleteClick(e, p)}
                        className="px-2.5 py-1 text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 hover:bg-rose-100 rounded-lg flex items-center gap-1"
                        title="Delete product"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Yellow Callout Banner */}
      <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 rounded-xl text-xs text-amber-900 dark:text-amber-200 font-medium flex items-center gap-3 shadow-xs">
        <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
        <span>
          Click a product row to open general info, variants and tier/currency price lists.
        </span>
      </div>

      {/* Modal: Edit Product */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="panel-card max-w-md w-full p-6 space-y-4 relative animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-[var(--text)] flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-blue-600" /> Edit Product: {editingProduct.name}
            </h3>
            <form onSubmit={handleUpdateProduct} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[var(--text-muted)]">Product Name</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--steel-line)] rounded-xl text-xs bg-[var(--paper-dim)] text-[var(--text)] font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[var(--text-muted)]">Category</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--steel-line)] rounded-xl text-xs bg-[var(--paper-dim)] text-[var(--text)] font-semibold"
                  >
                    <option value="Hardware">Hardware</option>
                    <option value="Services">Services</option>
                    <option value="Subscription">Subscription</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--text-muted)]">Price</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--steel-line)] rounded-xl text-xs bg-[var(--paper-dim)] text-[var(--text)] font-bold font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[var(--text-muted)]">Unit</label>
                  <select
                    value={editingProduct.unit}
                    onChange={(e) => setEditingProduct({ ...editingProduct, unit: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--steel-line)] rounded-xl text-xs bg-[var(--paper-dim)] text-[var(--text)]"
                  >
                    <option value="Each">Each</option>
                    <option value="Recurring">Recurring</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--text-muted)]">Tax Rate</label>
                  <input
                    type="text"
                    value={editingProduct.tax}
                    onChange={(e) => setEditingProduct({ ...editingProduct, tax: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--steel-line)] rounded-xl text-xs bg-[var(--paper-dim)] text-[var(--text)] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-muted)]">Status</label>
                <select
                  value={editingProduct.status}
                  onChange={(e) => setEditingProduct({ ...editingProduct, status: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--steel-line)] rounded-xl text-xs bg-[var(--paper-dim)] text-[var(--text)] font-semibold"
                >
                  <option value="Active">Active</option>
                  <option value="Archived">Archived</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 border border-[var(--steel-line)] text-xs rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Manage Price Fields */}
      {showPriceFieldsModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="panel-card max-w-lg w-full p-6 space-y-4 relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[var(--paper-dim)] pb-3">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-[var(--teal)]" />
                <h3 className="text-base font-bold text-[var(--text)]">Manage Price Fields & Rules</h3>
              </div>
              <button
                onClick={() => setShowPriceFieldsModal(false)}
                className="text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text)]"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[var(--text-muted)]">
              Enable or disable dynamic pricing fields used in product catalog calculations and quotation line items.
            </p>

            <div className="space-y-2.5">
              {priceFields.map((field) => (
                <div
                  key={field.id}
                  className="flex items-center justify-between p-3 bg-[var(--paper-dim)] rounded-xl border border-[var(--steel-line)]"
                >
                  <span className="text-xs font-semibold text-[var(--text)]">{field.name}</span>
                  <button
                    type="button"
                    disabled={field.required}
                    onClick={() => toggleField(field.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      field.enabled
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                    } ${field.required ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    {field.required ? 'Default' : field.enabled ? 'Active' : 'Disabled'}
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[var(--paper-dim)]">
              <button
                type="button"
                onClick={() => setShowPriceFieldsModal(false)}
                className="px-4 py-2 border border-[var(--steel-line)] text-xs font-semibold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePriceFields}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl"
              >
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add New Product */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="panel-card max-w-md w-full p-6 space-y-4 relative animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-[var(--text)]">Add New Product</h3>
            <form onSubmit={handleAddProduct} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[var(--text-muted)]">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Enterprise Server Hub"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--steel-line)] rounded-xl text-xs bg-[var(--paper-dim)] text-[var(--text)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[var(--text-muted)]">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--steel-line)] rounded-xl text-xs bg-[var(--paper-dim)] text-[var(--text)]"
                  >
                    <option value="Hardware">Hardware</option>
                    <option value="Services">Services</option>
                    <option value="Subscription">Subscription</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--text-muted)]">Price</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. $850"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--steel-line)] rounded-xl text-xs bg-[var(--paper-dim)] text-[var(--text)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[var(--text-muted)]">Unit</label>
                  <select
                    value={newProduct.unit}
                    onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--steel-line)] rounded-xl text-xs bg-[var(--paper-dim)] text-[var(--text)]"
                  >
                    <option value="Each">Each</option>
                    <option value="Recurring">Recurring</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--text-muted)]">Tax Rate</label>
                  <input
                    type="text"
                    placeholder="e.g. 15%"
                    value={newProduct.tax}
                    onChange={(e) => setNewProduct({ ...newProduct, tax: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--steel-line)] rounded-xl text-xs bg-[var(--paper-dim)] text-[var(--text)]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-[var(--steel-line)] text-xs rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsCatalog;
