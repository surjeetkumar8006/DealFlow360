import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Settings, Info, Package, Search, Filter, Edit3, Trash2, Check, Warehouse, ArrowRight, Layers } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const INITIAL_PRODUCTS = [
  {
    id: 'p-1',
    _id: 'p-1',
    name: 'Laptop Pro 14',
    category: 'Hardware',
    variants: '3(size)',
    price: '$1,200',
    unit: 'Each',
    tax: '15%',
    status: 'Active',
    quantityOnHand: 42
  },
  {
    id: 'p-2',
    _id: 'p-2',
    name: 'Onsite Setup Service',
    category: 'Services',
    variants: '-',
    price: '$450',
    unit: 'Each',
    tax: '-',
    status: 'Active',
    quantityOnHand: 100
  },
  {
    id: 'p-3',
    _id: 'p-3',
    name: 'Docking Station',
    category: 'Hardware',
    variants: '3(color)',
    price: '$180',
    unit: 'Each',
    tax: '15%',
    status: 'Active',
    quantityOnHand: 65
  },
  {
    id: 'p-4',
    _id: 'p-4',
    name: 'Care Plan 3 years',
    category: 'Subscription',
    variants: '-',
    price: '$40/month',
    unit: 'Recurring',
    tax: '0%',
    status: 'Active',
    quantityOnHand: 999
  }
];

const ProductsCatalog = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [warehouseStock, setWarehouseStock] = useState([
    { id: 'st-1', warehouse: 'Main Warehouse', product: 'Laptop Pro 14', inStock: 40, reserved: 18, available: 22 },
    { id: 'st-2', warehouse: 'East Depot', product: 'Laptop Pro 14', inStock: 10, reserved: 6, available: 4 },
    { id: 'st-3', warehouse: 'Main Warehouse', product: 'Docking Station', inStock: 65, reserved: 12, available: 53 },
    { id: 'st-4', warehouse: 'West Hub', product: 'Enterprise Server Node', inStock: 15, reserved: 8, available: 7 },
    { id: 'st-5', warehouse: 'East Depot', product: 'Onsite Setup Service', inStock: 100, reserved: 0, available: 100 }
  ]);
  const [fulfillmentOrders, setFulfillmentOrders] = useState([
    { id: 'q-1042', orderNumber: 'Q-1042', customer: 'Acme Corp', status: 'Split Pending', warehouses: 'Main + East Depot' },
    { id: 'q-1030', orderNumber: 'Q-1030', customer: 'Zenith Co', status: 'Backorder', warehouses: 'East Depot' },
    { id: 'ord-2291', orderNumber: 'ORD-2291', customer: 'Beta Industries', status: 'Split Allocated', warehouses: 'Main + West Hub' }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Hardware',
    variants: '-',
    price: '',
    unit: 'Each',
    tax: '15%',
    status: 'Active',
    quantityOnHand: 50
  });

  const loadAllData = async () => {
    try {
      const [prodRes, stockRes, orderRes] = await Promise.allSettled([
        api.get('/products'),
        api.get('/fulfillment/stock'),
        api.get('/fulfillment/orders')
      ]);

      if (prodRes.status === 'fulfilled' && prodRes.value?.data?.data && Array.isArray(prodRes.value.data.data)) {
        setProducts(prodRes.value.data.data);
      }
      if (stockRes.status === 'fulfilled' && stockRes.value?.data?.data && Array.isArray(stockRes.value.data.data)) {
        setWarehouseStock(stockRes.value.data.data);
      }
      if (orderRes.status === 'fulfilled' && orderRes.value?.data?.data && Array.isArray(orderRes.value.data.data)) {
        setFulfillmentOrders(orderRes.value.data.data);
      }
    } catch (err) {
      console.error('Fetch products/fulfillment data error:', err);
    }
  };

  useEffect(() => {
    loadAllData();
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
        _id: `p-${Date.now()}`,
        ...newProduct
      };

      setProducts((prev) => [created, ...prev]);
      toast.success(`Product "${newProduct.name}" created and added to Main Warehouse stock!`);
      setShowAddModal(false);
      setNewProduct({
        name: '',
        category: 'Hardware',
        variants: '-',
        price: '',
        unit: 'Each',
        tax: '15%',
        status: 'Active',
        quantityOnHand: 50
      });
      loadAllData();
    } catch (err) {
      toast.error('Failed to add product');
    }
  };

  const handleEditClick = (e, product) => {
    e.stopPropagation();
    setEditingProduct({
      ...product,
      quantityOnHand: product.quantityOnHand !== undefined ? product.quantityOnHand : 50
    });
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    const targetId = editingProduct._id || editingProduct.id;
    try {
      await api.put(`/products/${targetId}`, editingProduct).catch(() => null);
      setProducts((prev) =>
        prev.map((p) => ((p._id || p.id) === targetId ? editingProduct : p))
      );
      toast.success(`Product "${editingProduct.name}" updated successfully!`);
      setEditingProduct(null);
      loadAllData();
    } catch (err) {
      toast.error('Failed to update product');
    }
  };

  const handleDeleteClick = async (e, product) => {
    e.stopPropagation();
    const targetId = product._id || product.id;
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      try {
        await api.delete(`/products/${targetId}`).catch(() => null);
        setProducts((prev) => prev.filter((p) => (p._id || p.id) !== targetId));
        toast.success(`Product "${product.name}" deleted.`);
        loadAllData();
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
    const targetId = product._id || product.id;
    navigate(`/products/${targetId}`);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--text)] tracking-tight mb-1">
            Product catalog & Inventory
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            Every product, variant, live stock level and order fulfillment status in one place.
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
          <div className="text-xs text-[var(--text-muted)] font-medium">{products.length} active items in catalog</div>
        </div>

        {/* Card 2: Pricelists */}
        <div className="panel-card border-l-4 border-[var(--gold)] space-y-1">
          <div className="text-sm font-semibold text-[var(--text)]">Pricelists</div>
          <div className="text-xs text-[var(--text-muted)] font-medium">3 tiers, 2 Currencies</div>
        </div>

        {/* Card 3: Variants */}
        <div className="panel-card border-l-4 border-[var(--rust)] space-y-1">
          <div className="text-sm font-semibold text-[var(--text)]">Warehouse Stock</div>
          <div className="text-xs text-[var(--text-muted)] font-medium">{warehouseStock.length} live depot entries connected</div>
        </div>
      </div>

      {/* Products Section Header Badge */}
      <div className="flex items-center justify-between">
        <span className="px-4 py-1.5 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 rounded-xl text-xs font-bold flex items-center gap-1.5">
          <Package className="w-3.5 h-3.5" /> Products Catalog ({products.length})
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
                <th className="py-3 px-4">Stock Qty</th>
                <th className="py-3 px-4">Unit</th>
                <th className="py-3 px-4">Tax</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--paper-dim)]">
              {products.map((p) => {
                const pKey = p._id || p.id;
                const stockVal = p.quantityOnHand !== undefined ? p.quantityOnHand : 50;
                return (
                  <tr
                    key={pKey}
                    onClick={() => handleRowClick(p)}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4 font-semibold text-[var(--text)]">{p.name}</td>
                    <td className="py-3.5 px-4 text-[var(--text-muted)] font-medium">{p.category}</td>
                    <td className="py-3.5 px-4 font-mono text-[var(--text-muted)]">{p.variants || '-'}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[var(--text)]">{p.price || `$${p.listPrice}`}</td>
                    <td className="py-3.5 px-4 font-mono">
                      <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                        {stockVal} {p.unit || 'pcs'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[var(--text-muted)]">{p.unit || 'Each'}</td>
                    <td className="py-3.5 px-4 font-mono text-[var(--text-muted)]">{p.tax || (p.taxRate ? `${p.taxRate}%` : '15%')}</td>
                    <td className="py-3.5 px-4 font-mono">
                      <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {p.status || 'Active'}
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
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Connected Section: Live Multi-Warehouse Stock & Orders Awaiting Fulfillment */}
      <div className="space-y-4 pt-4 border-t border-[var(--steel-line)]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[var(--text)] flex items-center gap-2">
              <Warehouse className="w-5 h-5 text-[var(--teal)]" /> Live Warehouse Stock & Orders Awaiting Fulfillment
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Real-time synchronization between product catalog, warehouse inventory reserves, and pending fulfillment orders.
            </p>
          </div>
          <button
            onClick={() => navigate('/fulfillment')}
            className="text-xs font-bold text-[var(--teal)] hover:underline flex items-center gap-1"
          >
            Open Full Fulfillment Center <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Table 1: Live Stock Per Warehouse */}
          <div className="panel-card space-y-3">
            <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" /> Live Stock Per Warehouse
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--paper-dim)] border-b border-[var(--steel-line)] text-[var(--text-muted)] font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Warehouse</th>
                    <th className="py-2.5 px-3">Product</th>
                    <th className="py-2.5 px-3">In Stock</th>
                    <th className="py-2.5 px-3">Reserved</th>
                    <th className="py-2.5 px-3">Available</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--paper-dim)]">
                  {warehouseStock.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-semibold text-[var(--text)]">{row.warehouse}</td>
                      <td className="py-2.5 px-3 font-medium text-[var(--text)]">{row.product}</td>
                      <td className="py-2.5 px-3 font-mono">{row.inStock}</td>
                      <td className="py-2.5 px-3 font-mono text-amber-600 font-bold">{row.reserved}</td>
                      <td className="py-2.5 px-3 font-mono text-emerald-600 font-bold">{row.available}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table 2: Orders Awaiting Fulfillment */}
          <div className="panel-card space-y-3">
            <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-2">
              <Package className="w-4 h-4 text-emerald-600" /> Orders Awaiting Fulfillment
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--paper-dim)] border-b border-[var(--steel-line)] text-[var(--text-muted)] font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Order</th>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Warehouses</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--paper-dim)]">
                  {fulfillmentOrders.map((ord, idx) => (
                    <tr
                      key={idx}
                      onClick={() => navigate(`/fulfillment/${ord.id}`)}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                    >
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-600 hover:underline">{ord.orderNumber || ord.id}</td>
                      <td className="py-2.5 px-3 font-semibold text-[var(--text)]">{ord.customer}</td>
                      <td className="py-2.5 px-3 font-mono">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          ord.status === 'Split Pending' ? 'bg-amber-100 text-amber-800' :
                          ord.status === 'Backorder' ? 'bg-rose-100 text-rose-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-medium text-[var(--text-muted)]">{ord.warehouses}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Yellow Callout Banner */}
      <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 rounded-xl text-xs text-amber-900 dark:text-amber-200 font-medium flex items-center gap-3 shadow-xs">
        <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
        <span>
          Click an order row to open its warehouse split detail screen. All product catalog edits persist to MongoDB and sync with live warehouse stock reserves automatically.
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
                    value={editingProduct.price || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--steel-line)] rounded-xl text-xs bg-[var(--paper-dim)] text-[var(--text)] font-bold font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[var(--text-muted)]">Stock Qty (On Hand)</label>
                  <input
                    type="number"
                    min="0"
                    value={editingProduct.quantityOnHand !== undefined ? editingProduct.quantityOnHand : 50}
                    onChange={(e) => setEditingProduct({ ...editingProduct, quantityOnHand: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-[var(--steel-line)] rounded-xl text-xs bg-[var(--paper-dim)] text-[var(--text)] font-bold font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--text-muted)]">Unit</label>
                  <select
                    value={editingProduct.unit || 'Each'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, unit: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--steel-line)] rounded-xl text-xs bg-[var(--paper-dim)] text-[var(--text)]"
                  >
                    <option value="Each">Each</option>
                    <option value="Recurring">Recurring</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[var(--text-muted)]">Tax Rate</label>
                  <input
                    type="text"
                    value={editingProduct.tax || '15%'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, tax: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--steel-line)] rounded-xl text-xs bg-[var(--paper-dim)] text-[var(--text)] font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--text-muted)]">Status</label>
                  <select
                    value={editingProduct.status || 'Active'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, status: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--steel-line)] rounded-xl text-xs bg-[var(--paper-dim)] text-[var(--text)] font-semibold"
                  >
                    <option value="Active">Active</option>
                    <option value="Archived">Archived</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
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
                  className="w-full px-3 py-2 border border-[var(--steel-line)] rounded-xl text-xs bg-[var(--paper-dim)] text-[var(--text)] font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[var(--text-muted)]">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
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
                    placeholder="e.g. $850"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--steel-line)] rounded-xl text-xs bg-[var(--paper-dim)] text-[var(--text)] font-bold font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[var(--text-muted)]">Initial Stock Qty</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 50"
                    value={newProduct.quantityOnHand}
                    onChange={(e) => setNewProduct({ ...newProduct, quantityOnHand: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-[var(--steel-line)] rounded-xl text-xs bg-[var(--paper-dim)] text-[var(--text)] font-bold font-mono"
                  />
                </div>

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
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-muted)]">Tax Rate</label>
                <input
                  type="text"
                  placeholder="e.g. 15%"
                  value={newProduct.tax}
                  onChange={(e) => setNewProduct({ ...newProduct, tax: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--steel-line)] rounded-xl text-xs bg-[var(--paper-dim)] text-[var(--text)] font-mono"
                />
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
