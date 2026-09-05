import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchQuotationsThunk,
  createQuotationThunk,
  updateQuotationStatusThunk,
  toggleViewMode
} from '../../store/slices/quotationSlice';
import {
  Plus,
  X,
  ShieldAlert,
  CheckCircle2,
  Clock,
  AlertTriangle,
  LayoutGrid,
  Table,
  Eye,
  ArrowRight,
  ChevronRight
} from 'lucide-react';

const KANBAN_STAGES = [
  { id: 'DRAFT', label: 'Draft', color: 'var(--steel-line)', textColor: 'var(--text)' },
  { id: 'PENDING_APPROVAL', label: 'Pending Approval', color: 'var(--gold)', textColor: 'var(--text)' },
  { id: 'APPROVED', label: 'Approved', color: 'var(--teal)', textColor: '#ffffff' },
  { id: 'NEGOTIATION', label: 'Negotiation', color: '#3B82F6', textColor: '#ffffff' },
  { id: 'CONFIRMED', label: 'Confirmed', color: 'var(--ink)', textColor: '#ffffff' },
];

const QuotationsList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { quotationsList, viewMode, loading } = useSelector((state) => state.quotation);
  const { user } = useSelector((state) => state.auth);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);

  // New quotation form state
  const [customerName, setCustomerName] = useState('');
  const [customerTier, setCustomerTier] = useState('Gold');
  const [lineItems, setLineItems] = useState([
    { product: 'Enterprise Cloud Server', qty: 2, price: 15000, discount: 10 },
    { product: 'Implementation & Migration Service', qty: 1, price: 8000, discount: 5 }
  ]);

  useEffect(() => {
    dispatch(fetchQuotationsThunk());
  }, [dispatch]);

  const handleToggleView = () => {
    dispatch(toggleViewMode());
  };

  const handleAddLineItem = () => {
    setLineItems([...lineItems, { product: '', qty: 1, price: 1000, discount: 0 }]);
  };

  const handleRemoveLineItem = (index) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const handleLineItemChange = (index, field, value) => {
    const updated = [...lineItems];
    updated[index][field] = value;
    setLineItems(updated);
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
    setLineItems([{ product: 'Enterprise Cloud Server', qty: 2, price: 15000, discount: 10 }]);
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
            const columnQuotes = quotationsList.filter((q) => q.status === stage.id);

            return (
              <div
                key={stage.id}
                className="bg-[#FAF9F5] border border-[var(--steel-line)] rounded-xl p-4 space-y-3 min-h-[420px] shadow-sm flex flex-col"
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
                      className="p-4 bg-white border border-[var(--steel-line)] rounded-lg cursor-pointer hover:shadow-md hover:border-[var(--gold)] transition-all space-y-2 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-[var(--text)] group-hover:text-[var(--gold)]">
                          {quote.customerName}
                        </span>
                        <span className="text-xs font-mono font-medium text-[var(--text)]">
                          ${quote.totalAmount?.toLocaleString()}
                        </span>
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
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedQuote(quote);
                        }}
                        className="text-[var(--teal)] hover:underline font-medium text-xs flex items-center justify-end gap-1 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" /> Open
                      </button>
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
          <Plus className="w-4 h-4" /> + New Quotation
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
          <div className="bg-[#FAF9F5] border border-[var(--steel-line)] rounded-xl max-w-xl w-full p-6 space-y-6 shadow-2xl">
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
                <option value="CONFIRMED">Confirmed</option>
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

            {/* Footer Close */}
            <div className="flex justify-end pt-2 border-t border-[var(--paper-dim)]">
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
          <div className="bg-[#FAF9F5] border border-[var(--steel-line)] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
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
              {/* Customer Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--text)] mb-1">Customer Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Corp"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-[var(--steel-line)] rounded-md text-[var(--text)] focus:outline-none focus:border-[var(--gold)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--text)] mb-1">Customer Discount Tier</label>
                  <select
                    value={customerTier}
                    onChange={(e) => setCustomerTier(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-[var(--steel-line)] rounded-md text-[var(--text)] focus:outline-none focus:border-[var(--gold)]"
                  >
                    <option value="Bronze">Bronze Tier (Max 5% Discount)</option>
                    <option value="Silver">Silver Tier (Max 10% Discount)</option>
                    <option value="Gold">Gold Tier (Max 15% Discount)</option>
                  </select>
                </div>
              </div>

              {/* Line Items Builder */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-[var(--text)]">Quotation Line Items</label>
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
                    <div key={index} className="flex flex-wrap items-center gap-2 p-3 bg-white border border-[var(--steel-line)] rounded-md text-xs">
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
