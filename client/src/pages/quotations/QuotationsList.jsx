import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchQuotationsThunk,
  createQuotationThunk,
  updateQuotationStatusThunk,
  deleteQuotationThunk,
  toggleViewMode
} from '../../store/slices/quotationSlice';
import {
  Plus,
  X,
  LayoutGrid,
  Table,
  Eye,
  UserCheck,
  Package,
  Trash2
} from 'lucide-react';
import api from '../../services/api';

const KANBAN_STAGES = [
  { id: 'DRAFT', label: 'Draft', color: 'var(--steel-line)', textColor: 'var(--text)' },
  { id: 'PENDING_APPROVAL', label: 'Pending Approval', color: 'var(--gold)', textColor: 'var(--text)' },
  { id: 'APPROVED', label: 'Approved', color: 'var(--teal)', textColor: '#ffffff' },
  { id: 'NEGOTIATION', label: 'Negotiation', color: '#3B82F6', textColor: '#ffffff' },
  { id: 'CONFIRMED', label: 'Confirmed', color: 'var(--ink)', textColor: '#ffffff' },
];

const DEFAULT_CUSTOMERS = [
  { _id: 'cust-1', name: 'Acme Corp', tier: 'Silver' },
  { _id: 'cust-2', name: 'Delta LLC', tier: 'Bronze' },
  { _id: 'cust-3', name: 'Beta Industries', tier: 'Gold' },
  { _id: 'cust-4', name: 'Nova Retail', tier: 'Gold' },
  { _id: 'cust-5', name: 'Zenith Co', tier: 'Silver' },
  { _id: 'cust-6', name: 'Orion Ltd', tier: 'Gold' },
  { _id: 'cust-7', name: 'Test', tier: 'Gold' },
  { _id: 'cust-8', name: 'New Prod.', tier: 'Gold' }
];

const DEFAULT_PRODUCTS = [
  { _id: 'prod-1', name: 'Laptop Pro 14', listPrice: 1200, price: '$1,200', category: 'Hardware' },
  { _id: 'prod-2', name: 'Onsite Setup Service', listPrice: 450, price: '$450', category: 'Services' },
  { _id: 'prod-3', name: 'Docking Station', listPrice: 180, price: '$180', category: 'Hardware' },
  { _id: 'prod-4', name: 'Care Plan 3 years', listPrice: 40, price: '$40/month', category: 'Subscription' },
  { _id: 'prod-5', name: 'Enterprise Cloud Backup Subscription', listPrice: 150, price: '$150/month', category: 'Subscription' },
  { _id: 'prod-6', name: 'UltraWide 34-Inch Curved Monitor', listPrice: 750, price: '$750', category: 'Hardware' },
  { _id: 'prod-7', name: 'Network Security Gateway Firewall', listPrice: 2100, price: '$2,100', category: 'Hardware' },
  { _id: 'prod-8', name: '24/7 Managed IT Support Retainer', listPrice: 1200, price: '$1,200/month', category: 'Services' }
];

const QuotationsList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { quotationsList, viewMode, loading } = useSelector((state) => state.quotation);
  const { user } = useSelector((state) => state.auth);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);

  // Dynamic DB Data Options with Fallbacks
  const [customersList, setCustomersList] = useState(DEFAULT_CUSTOMERS);
  const [productsList, setProductsList] = useState(DEFAULT_PRODUCTS);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [isCustomCustomer, setIsCustomCustomer] = useState(false);

  // New quotation form state
  const [customerName, setCustomerName] = useState('');
  const [customerTier, setCustomerTier] = useState('Gold');
  const [lineItems, setLineItems] = useState([
    { product: 'Laptop Pro 14', qty: 2, price: 1200, discount: 10, limit: 15 },
    { product: 'Onsite Setup Service', qty: 1, price: 450, discount: 5, limit: 10 }
  ]);

  useEffect(() => {
    dispatch(fetchQuotationsThunk());
    fetchCustomersAndProducts();
  }, [dispatch]);

  const fetchCustomersAndProducts = async () => {
    try {
      const custRes = await api.get('/customers').catch(() => null);
      if (custRes?.data?.data && custRes.data.data.length > 0) {
        setCustomersList(custRes.data.data);
      }
      const prodRes = await api.get('/products').catch(() => null);
      if (prodRes?.data?.data && prodRes.data.data.length > 0) {
        setProductsList(prodRes.data.data);
      }
    } catch (err) {
      console.error('Error fetching customers/products catalog:', err);
    }
  };

  const handleToggleView = () => {
    dispatch(toggleViewMode());
  };

  // Handle Customer Selection Dropdown
  const handleSelectCustomer = (e) => {
    const value = e.target.value;
    setSelectedCustomerId(value);

    if (value === 'CUSTOM') {
      setIsCustomCustomer(true);
      setCustomerName('');
      setCustomerTier('Gold');
    } else {
      setIsCustomCustomer(false);
      const foundCust = customersList.find((c) => c._id === value || c.id === value || c.name === value);
      if (foundCust) {
        setCustomerName(foundCust.name);
        const formattedTier = foundCust.tier
          ? foundCust.tier.charAt(0).toUpperCase() + foundCust.tier.slice(1).toLowerCase()
          : 'Gold';
        setCustomerTier(formattedTier);
      }
    }
  };

  const handleAddLineItem = () => {
    setLineItems([...lineItems, { product: 'Laptop Pro 14', qty: 1, price: 1200, discount: 0, limit: 15 }]);
  };

  const handleRemoveLineItem = (index) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const handleLineItemChange = (index, field, value) => {
    const updated = [...lineItems];
    updated[index][field] = value;
    setLineItems(updated);
  };

  const handleSelectProductForItem = (index, productId) => {
    const foundProd = productsList.find((p) => p._id === productId || p.id === productId || p.name === productId);
    const updated = [...lineItems];
    if (foundProd) {
      const rawPrice = foundProd.listPrice || Number(String(foundProd.price || '0').replace(/[^0-9.]/g, '')) || 1000;
      const isService = foundProd.category?.toLowerCase() === 'services' || foundProd.name.toLowerCase().includes('service');
      updated[index] = {
        ...updated[index],
        product: foundProd.name,
        price: rawPrice,
        limit: isService ? 10 : 15
      };
    } else {
      updated[index].product = productId;
    }
    setLineItems(updated);
  };

  const handleDeleteQuotation = (e, quoteId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this quotation?')) {
      dispatch(deleteQuotationThunk(quoteId));
      if (selectedQuote && (selectedQuote._id === quoteId || selectedQuote.id === quoteId)) {
        setSelectedQuote(null);
      }
    }
  };

  // Discount calculation for new quote form
  const tierLimit = customerTier === 'Bronze' ? 5 : customerTier === 'Silver' ? 10 : 15;
  let totalRaw = 0;
  let totalDiscounted = 0;
  let maxDiscount = 0;

  lineItems.forEach((item) => {
    const price = Number(item.price) || 0;
    const qty = Number(item.qty) || 1;
    const disc = Number(item.discount) || 0;
    totalRaw += price * qty;
    totalDiscounted += price * qty * (1 - disc / 100);
    if (disc > maxDiscount) maxDiscount = disc;
  });

  const isCeilingViolated = maxDiscount > tierLimit;

  const handleSubmitQuotation = (e) => {
    e.preventDefault();
    if (!customerName.trim()) return;

    dispatch(
      createQuotationThunk({
        customerName,
        customerTier,
        lineItems,
        salesRep: user?.name || 'Surjeet Kumar'
      })
    );

    setIsModalOpen(false);
    setCustomerName('');
    setSelectedCustomerId('');
    setIsCustomCustomer(false);
    setLineItems([
      { product: 'Laptop Pro 14', qty: 2, price: 1200, discount: 10, limit: 15 },
      { product: 'Onsite Setup Service', qty: 1, price: 450, discount: 5, limit: 10 }
    ]);
  };

  const handleStatusChange = (id, newStatus) => {
    dispatch(updateQuotationStatusThunk({ id, status: newStatus }));
    if (selectedQuote && selectedQuote._id === id) {
      setSelectedQuote({ ...selectedQuote, status: newStatus });
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header matching Wireframe */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--text)] tracking-tight mb-1">
          Quotations (List)
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          Every quotation in the system, one row per quotation, click a row to open it
        </p>
      </div>

      {/* Main View: Board View (Kanban) or Table View */}
      {viewMode === 'BOARD' ? (
        /* Kanban Board View (5 Columns matching wireframe) */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
          {KANBAN_STAGES.map((stage) => {
            const columnQuotes = quotationsList.filter((q) => {
              const statusStr = (q.status || '').toUpperCase();
              if (stage.id === 'PENDING_APPROVAL') {
                return ['PENDING_APPROVAL', 'PENDING_FINANCE', 'PENDING APPROVAL'].includes(statusStr);
              }
              if (stage.id === 'APPROVED') {
                return ['APPROVED'].includes(statusStr);
              }
              if (stage.id === 'CONFIRMED') {
                return ['CONFIRMED'].includes(statusStr);
              }
              if (stage.id === 'DRAFT') {
                return ['DRAFT'].includes(statusStr);
              }
              if (stage.id === 'NEGOTIATION') {
                return ['NEGOTIATION', 'REVISION_REQUESTED'].includes(statusStr);
              }
              return statusStr === stage.id;
            });

            return (
              <div
                key={stage.id}
                className="bg-white border border-slate-200/90 rounded-xl p-4 space-y-3 min-h-[420px] shadow-xs flex flex-col"
              >
                {/* Column Title */}
                <div className="flex items-center justify-between pb-2 border-b border-[var(--paper-dim)]">
                  <h3 className="text-sm font-semibold text-[var(--text)]">{stage.label}</h3>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[var(--paper-dim)] text-[var(--text-muted)] font-mono">
                    {columnQuotes.length}
                  </span>
                </div>

                {/* Column Cards */}
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[520px] pr-0.5">
                  {columnQuotes.map((quote) => (
                    <div
                      key={quote._id}
                      onClick={() => navigate(`/quotations/${quote._id}`)}
                      className="p-4 bg-white border border-[var(--steel-line)] rounded-lg cursor-pointer hover:shadow-md hover:border-[var(--gold)] transition-all space-y-2 group relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-[var(--text)] group-hover:text-[var(--gold)] pr-6">
                          {quote.customerName}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-mono font-medium text-[var(--text)]">
                            ${quote.totalAmount?.toLocaleString()}
                          </span>
                          <button
                            onClick={(e) => handleDeleteQuotation(e, quote._id || quote.id || quote.quoteNumber)}
                            title="Delete quotation"
                            className="text-slate-400 hover:text-rose-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity ml-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="text-xs text-[var(--text-muted)] flex items-center justify-between">
                        <span>{quote.quoteNumber}</span>
                        <span className="font-mono text-[11px]">{quote.customerTier} Tier</span>
                      </div>

                      {quote.ceilingViolation && (
                        <div className="text-[11px] text-[var(--rust)] bg-[var(--rust)]/10 px-2 py-1 rounded border border-[var(--rust)]/20 line-clamp-2">
                          ⚠️ {quote.ceilingViolation}
                        </div>
                      )}
                    </div>
                  ))}

                  {columnQuotes.length === 0 && (
                    <div className="py-8 text-center text-xs text-[var(--text-muted)] italic border border-dashed border-[var(--steel-line)] rounded-lg">
                      No quotes in {stage.label}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="panel-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[var(--paper-dim)] border-b border-[var(--steel-line)] text-[var(--text-muted)] uppercase font-medium">
                <tr>
                  <th className="py-3 px-4">Quote #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Tier</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Risk Score</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--paper-dim)]">
                {quotationsList.map((quote) => (
                  <tr
                    key={quote._id}
                    onClick={() => navigate(`/quotations/${quote._id}`)}
                    className="hover:bg-[var(--paper-dim)]/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-semibold text-[var(--text)]">{quote.quoteNumber}</td>
                    <td className="py-3 px-4 text-[var(--text)] font-medium">{quote.customerName}</td>
                    <td className="py-3 px-4 text-[var(--text-muted)] font-mono">{quote.customerTier}</td>
                    <td className="py-3 px-4 font-mono font-semibold text-[var(--text)]">
                      ${quote.totalAmount?.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-1 text-xs font-medium rounded-md border inline-flex items-center gap-1 ${
                          quote.status === 'APPROVED'
                            ? 'bg-[#2F6F5E]/10 text-[var(--teal)] border-[#2F6F5E]/20'
                            : quote.status === 'PENDING_APPROVAL'
                            ? 'bg-[#B8863B]/10 text-[var(--gold)] border-[#B8863B]/20'
                            : quote.status === 'CONFIRMED'
                            ? 'bg-[var(--ink)] text-white'
                            : 'bg-slate-100 text-slate-700 border-slate-300'
                        }`}
                      >
                        {quote.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono">{quote.riskScore}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedQuote(quote);
                          }}
                          className="text-[var(--teal)] hover:underline font-medium text-xs flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> Open
                        </button>
                        <button
                          onClick={(e) => handleDeleteQuotation(e, quote._id || quote.id || quote.quoteNumber)}
                          title="Delete quotation"
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bottom Action Row matching Wireframe */}
      <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[var(--paper-dim)]">
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary-gold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> New Quotation
        </button>

        <button
          onClick={handleToggleView}
          className="btn-outline-steel flex items-center gap-2"
        >
          {viewMode === 'BOARD' ? (
            <>
              <Table className="w-4 h-4" /> Switch to Table View
            </>
          ) : (
            <>
              <LayoutGrid className="w-4 h-4" /> Switch to Board View
            </>
          )}
        </button>
      </div>

      {/* Quotation Detail Drawer / Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-xl w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--paper-dim)]">
              <div>
                <h2 className="text-lg font-semibold text-[var(--text)]">{selectedQuote.customerName}</h2>
                <div className="text-xs text-[var(--text-muted)]">{selectedQuote.quoteNumber} • {selectedQuote.customerTier} Tier</div>
              </div>
              <button
                onClick={() => setSelectedQuote(null)}
                className="text-[var(--text-muted)] hover:text-[var(--text)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quote Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white border border-[var(--steel-line)] rounded-md">
                <div className="text-xs text-[var(--text-muted)] font-medium">Total Amount</div>
                <div className="text-xl font-semibold font-mono text-[var(--text)] mt-1">
                  ${selectedQuote.totalAmount?.toLocaleString()}
                </div>
              </div>
              <div className="p-3 bg-white border border-[var(--steel-line)] rounded-md">
                <div className="text-xs text-[var(--text-muted)] font-medium">Blended Risk Score</div>
                <div className="text-xl font-semibold font-mono text-[var(--text)] mt-1">
                  {selectedQuote.riskScore} ({selectedQuote.riskLevel})
                </div>
              </div>
            </div>

            {/* Ceiling Warning if applicable */}
            {selectedQuote.ceilingViolation && (
              <div className="p-3 bg-[var(--rust)]/10 text-[var(--rust)] rounded-md border border-[var(--rust)]/20 text-xs">
                ⚠️ <strong>Governance Flag:</strong> {selectedQuote.ceilingViolation}
              </div>
            )}

            {/* Status Change Selector */}
            <div>
              <label className="block text-xs font-medium text-[var(--text)] mb-1">Update Quotation Stage</label>
              <select
                value={selectedQuote.status}
                onChange={(e) => handleStatusChange(selectedQuote._id, e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-[var(--steel-line)] rounded-md text-[var(--text)] focus:outline-none focus:border-[var(--gold)] font-medium"
              >
                <option value="DRAFT">Draft</option>
                <option value="PENDING_APPROVAL">Pending Approval</option>
                <option value="APPROVED">Approved</option>
                <option value="NEGOTIATION">Negotiation</option>
                <option value="CONFIRMED">Confirmed (Auto Creates Invoice)</option>
              </select>
            </div>

            {/* Line Items Table */}
            <div>
              <h3 className="text-xs font-medium text-[var(--text)] mb-2">Line Items Breakdown</h3>
              <div className="border border-[var(--steel-line)] rounded-md overflow-hidden bg-white text-xs">
                <div className="divide-y divide-slate-100">
                  {selectedQuote.lineItems?.map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-[var(--text)]">{item.product}</div>
                        <div className="text-[var(--text-muted)]">Qty: {item.qty} × ${item.price}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-[var(--rust)]">{item.discount}% Disc</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-[var(--paper-dim)]">
              <button
                onClick={(e) => handleDeleteQuotation(e, selectedQuote._id)}
                className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-md text-xs font-medium flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Quotation
              </button>
              <button
                onClick={() => setSelectedQuote(null)}
                className="btn-outline-steel"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Quotation Builder Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--paper-dim)]">
              <h2 className="text-lg font-semibold text-[var(--text)]">Create New Quotation</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitQuotation} className="space-y-6">
              {/* Customer Info (Automated Dropdown from DB) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--text)] mb-1 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-[var(--teal)]" /> Customer Name (Select from DB)
                  </label>
                  <select
                    value={selectedCustomerId}
                    onChange={handleSelectCustomer}
                    className="w-full px-3 py-2 text-sm bg-white border border-[var(--steel-line)] rounded-md text-[var(--text)] focus:outline-none focus:border-[var(--gold)] font-medium mb-2"
                  >
                    <option value="">-- Select Existing Customer --</option>
                    {customersList.map((c) => (
                      <option key={c._id || c.name} value={c._id || c.name}>
                        {c.name} ({c.tier || 'Gold'} Tier)
                      </option>
                    ))}
                    <option value="CUSTOM">+ Add New Custom Customer Name...</option>
                  </select>

                  {(isCustomCustomer || !selectedCustomerId) && (
                    <input
                      type="text"
                      required
                      placeholder="e.g. Acme Corp"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-[var(--steel-line)] rounded-md text-[var(--text)] focus:outline-none focus:border-[var(--gold)]"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--text)] mb-1">Customer Discount Tier</label>
                  <select
                    value={customerTier}
                    onChange={(e) => setCustomerTier(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-[var(--steel-line)] rounded-md text-[var(--text)] focus:outline-none focus:border-[var(--gold)] font-medium"
                  >
                    <option value="Bronze">Bronze Tier (Max 5% Discount)</option>
                    <option value="Silver">Silver Tier (Max 10% Discount)</option>
                    <option value="Gold">Gold Tier (Max 15% Discount)</option>
                  </select>
                </div>
              </div>

              {/* Quotation Line Items (Automated Product Selection from Catalog) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-[var(--text)] flex items-center gap-1">
                    <Package className="w-3.5 h-3.5 text-[var(--teal)]" /> Quotation Line Items
                  </label>
                  <button
                    type="button"
                    onClick={handleAddLineItem}
                    className="text-xs text-[var(--teal)] hover:underline font-medium"
                  >
                    + Add Item
                  </button>
                </div>

                <div className="space-y-3">
                  {lineItems.map((item, index) => (
                    <div key={index} className="p-3 bg-white border border-[var(--steel-line)] rounded-md text-xs space-y-2">
                      <div className="flex items-center gap-2">
                        <select
                          value={productsList.find((p) => p.name === item.product)?._id || ''}
                          onChange={(e) => handleSelectProductForItem(index, e.target.value)}
                          className="flex-1 px-2.5 py-1.5 border border-slate-200 rounded focus:outline-none bg-slate-50 font-medium text-[var(--text)]"
                        >
                          <option value="">-- Select Product from Catalog --</option>
                          {productsList.map((p) => (
                            <option key={p._id || p.name} value={p._id || p.name}>
                              {p.name} — {p.price || `$${p.listPrice}`}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          type="text"
                          placeholder="Item description"
                          value={item.product}
                          onChange={(e) => handleLineItemChange(index, 'product', e.target.value)}
                          className="flex-1 min-w-[140px] px-2 py-1.5 border border-slate-200 rounded focus:outline-none"
                        />
                        <div className="flex items-center gap-1">
                          <span className="text-[var(--text-muted)]">$</span>
                          <input
                            type="number"
                            placeholder="Price"
                            value={item.price}
                            onChange={(e) => handleLineItemChange(index, 'price', e.target.value)}
                            className="w-20 px-2 py-1.5 border border-slate-200 rounded font-mono focus:outline-none"
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[var(--text-muted)]">Qty:</span>
                          <input
                            type="number"
                            min="1"
                            value={item.qty}
                            onChange={(e) => handleLineItemChange(index, 'qty', e.target.value)}
                            className="w-14 px-2 py-1.5 border border-slate-200 rounded font-mono focus:outline-none"
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[var(--text-muted)]">Disc%:</span>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={item.discount}
                            onChange={(e) => handleLineItemChange(index, 'discount', e.target.value)}
                            className="w-14 px-2 py-1.5 border border-slate-200 rounded font-mono focus:outline-none"
                          />
                        </div>
                        {lineItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveLineItem(index)}
                            className="text-[var(--rust)] hover:opacity-80 p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Discount Governance Evaluation Box */}
              <div className="p-4 bg-[var(--paper-dim)] rounded-lg space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Subtotal (Raw):</span>
                  <span className="font-mono text-[var(--text)]">${totalRaw.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-[var(--text)]">Final Total (After Discounts):</span>
                  <span className="font-mono text-sm text-[var(--text)]">${Math.round(totalDiscounted).toLocaleString()}</span>
                </div>
                {isCeilingViolated && (
                  <div className="p-2.5 bg-[var(--rust)]/10 text-[var(--rust)] rounded border border-[var(--rust)]/20 mt-2 font-medium">
                    ⚠️ Discount {maxDiscount}% exceeds customer {customerTier} tier ceiling limit of {tierLimit}%. This quotation will trigger Manager Approval routing.
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-[var(--paper-dim)]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-outline-steel"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary-gold"
                >
                  Submit Quotation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuotationsList;
