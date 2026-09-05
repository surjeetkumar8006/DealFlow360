import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchQuotationByIdThunk,
  updateActiveLineDiscount,
  addUpsellToActiveQuotation,
  updateQuotationStatusThunk
} from '../../store/slices/quotationSlice';
import { ArrowLeft, Check, AlertTriangle, Plus, Save, UserCheck, Tag } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const UPSELL_ITEMS = [
  { id: 'up-1', title: '+ Wireless Mouse', badge: 'Margin +$18', price: 45, discount: 0, limit: 15 },
  { id: 'up-2', title: '+ Docking Station', badge: 'Promo: 12% off', price: 180, discount: 12, limit: 15 },
  { id: 'up-3', title: '+ Care Plan 2yr', badge: 'Margin +$46', price: 120, discount: 5, limit: 10 },
];

const PRICE_LIST_OPTIONS = [
  'Standard Enterprise 2026',
  'Standard Retail 2026',
  'Enterprise Partner 2026',
  'Government & Public 2026',
  'Custom Price List'
];

const QuotationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { activeQuotation, loading } = useSelector((state) => state.quotation);

  const [customersList, setCustomersList] = useState([]);
  const [customer, setCustomer] = useState('Acme Corp');
  const [priceList, setPriceList] = useState('Standard Enterprise 2026');

  useEffect(() => {
    dispatch(fetchQuotationByIdThunk(id || 'q-1042'));
    fetchCustomers();
  }, [dispatch, id]);

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/customers').catch(() => null);
      if (res?.data?.data) {
        setCustomersList(res.data.data);
      }
    } catch (err) {
      console.error('Fetch customers error:', err);
    }
  };

  useEffect(() => {
    if (activeQuotation) {
      setCustomer(activeQuotation.customerName || 'Acme Corp');
      setPriceList(activeQuotation.priceList || 'Standard Enterprise 2026');
    }
  }, [activeQuotation]);

  const lineItems = activeQuotation?.lineItems || [
    { id: 'l-1', product: 'Laptop Pro 14', qty: 2, price: 1200, discount: 12, limit: 15 },
    { id: 'l-2', product: 'Onsite Setup Service', qty: 1, price: 450, discount: 18, limit: 10 },
    { id: 'l-3', product: 'Extended Warranty', qty: 1, price: 180, discount: 10, limit: 15 }
  ];

  const handleDiscountChange = (lineId, discountVal) => {
    dispatch(updateActiveLineDiscount({ lineId, discount: discountVal }));
  };

  const handleAddUpsell = (upsell) => {
    dispatch(
      addUpsellToActiveQuotation({
        product: upsell.title.replace('+ ', ''),
        price: upsell.price,
        discount: upsell.discount,
        limit: upsell.limit
      })
    );
  };

  const handleSaveDraft = () => {
    dispatch(
      updateQuotationStatusThunk({
        id: activeQuotation?._id || id || 'q-1042',
        status: 'DRAFT',
        customerName: customer,
        priceList,
        lineItems
      })
    );
  };

  const handleSubmitForApproval = () => {
    const hasViolation = lineItems.some((l) => Number(l.discount) > Number(l.limit));
    const nextStatus = hasViolation ? 'PENDING_APPROVAL' : 'APPROVED';

    dispatch(
      updateQuotationStatusThunk({
        id: activeQuotation?._id || id || 'q-1042',
        status: nextStatus,
        customerName: customer,
        priceList,
        lineItems
      })
    );
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back button & Page Title matching wireframe */}
      <div>
        <button
          onClick={() => navigate('/quotations')}
          className="text-xs text-[var(--teal)] hover:underline flex items-center gap-1 font-medium mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Quotations List
        </button>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--text)] tracking-tight mb-1">
          Quotation Detail: {activeQuotation?.quoteNumber || 'Q-1042'} ({customer})
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          Opened by clicking a row on the Quotations list. Add products, apply discounts, review upsells.
        </p>
      </div>

      {/* Customer & Price List Automatic Select Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-[var(--text-muted)] mb-1 uppercase tracking-wider flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-[var(--teal)]" /> Customer (Select from DB)
          </label>
          <select
            value={customersList.find((c) => c.name.toLowerCase() === customer.toLowerCase())?._id || customer}
            onChange={(e) => {
              const val = e.target.value;
              const foundCust = customersList.find((c) => c._id === val || c.name === val);
              if (foundCust) {
                setCustomer(foundCust.name);
              } else {
                setCustomer(val);
              }
            }}
            className="w-full px-3 py-2 text-sm bg-white border border-[var(--steel-line)] rounded-lg text-[var(--text)] focus:outline-none focus:border-[var(--gold)] font-medium shadow-xs"
          >
            {customersList.map((c) => (
              <option key={c._id || c.name} value={c._id || c.name}>
                {c.name} ({c.tier || 'Gold'} Tier)
              </option>
            ))}
            {!customersList.some((c) => c.name.toLowerCase() === customer.toLowerCase()) && (
              <option value={customer}>{customer}</option>
            )}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--text-muted)] mb-1 uppercase tracking-wider flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-[var(--teal)]" /> Price List (Select Option)
          </label>
          <select
            value={priceList}
            onChange={(e) => setPriceList(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-[var(--steel-line)] rounded-lg text-[var(--text)] focus:outline-none focus:border-[var(--gold)] font-medium shadow-xs"
          >
            {PRICE_LIST_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Interactive Line Items Table matching Wireframe */}
      <div className="panel-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[var(--paper-dim)] border-b border-[var(--steel-line)] text-[var(--text-muted)] font-semibold">
              <tr>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Qty</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Discount</th>
                <th className="py-3 px-4">Limit</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--paper-dim)]">
              {lineItems.map((item) => {
                const disc = Number(item.discount) || 0;
                const lim = Number(item.limit) || 15;
                const isOver = disc > lim;
                const overPoints = disc - lim;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-medium text-[var(--text)]">{item.product}</td>
                    <td className="py-3 px-4 text-[var(--text)] font-mono">{item.qty}</td>
                    <td className="py-3 px-4 text-[var(--text)] font-mono">${item.price?.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={item.discount}
                          onChange={(e) => handleDiscountChange(item.id, e.target.value)}
                          className="w-16 px-2 py-1 border border-[var(--steel-line)] rounded font-mono text-xs focus:outline-none focus:border-[var(--gold)] text-slate-800"
                        />
                        <span className="text-[var(--text-muted)] font-mono">%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[var(--text-muted)]">{lim}%</td>
                    <td className="py-3 px-4">
                      {isOver ? (
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-[var(--rust)]/10 text-[var(--rust)] border border-[var(--rust)]/20 inline-flex items-center gap-1 font-mono">
                          <AlertTriangle className="w-3.5 h-3.5" /> OVER (+{overPoints}pt)
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-[#2F6F5E]/10 text-[var(--teal)] border border-[#2F6F5E]/20 inline-flex items-center gap-1 font-mono">
                          <Check className="w-3.5 h-3.5" /> OK
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Governance Yellow Alert Banner matching Wireframe */}
      <div className="p-3.5 bg-[#FEFCE8] border border-[#FEF08A] rounded-xl text-xs text-[#854D0E] font-medium flex items-center gap-2 leading-relaxed shadow-xs">
        <AlertTriangle className="w-4 h-4 text-[#CA8A04] shrink-0" />
        <div>
          Discount is checked against each line's own limit live, as soon as it is entered, not only at submit time.
        </div>
      </div>

      {/* 🤖 AI Deal Copilot & Win Predictor Widget */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 border border-blue-200/80 rounded-xl space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600 text-white rounded-lg font-bold text-xs">
              AI Copilot
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Predicted Deal Win Rate: <strong>88% (High Closure Probability)</strong></span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                Recommended Action: Cap Service lines at ceiling (10%) to bypass Finance approval delay and accelerate deal signoff.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              lineItems.forEach((l) => {
                if (l.discount > l.limit) {
                  handleDiscountChange(l.id, l.limit);
                }
              });
              toast.success('AI Margin Optimizer: All line discounts capped to allowed ceiling!');
            }}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
          >
            ⚡ Auto-Optimize Margin & Auto-Pass Approval
          </button>
        </div>
      </div>

      {/* Upsell and Cross-Sell Suggestions Section matching Wireframe */}
      <div className="space-y-3 pt-2">
        <h2 className="text-base font-semibold text-[var(--teal)] flex items-center gap-2">
          Upsell and Cross-Sell Suggestions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {UPSELL_ITEMS.map((upsell) => (
            <div
              key={upsell.id}
              onClick={() => handleAddUpsell(upsell)}
              className="p-4 bg-white border border-slate-200 rounded-xl cursor-pointer hover:shadow-md hover:border-[var(--gold)] transition-all space-y-2 group"
            >
              <div className="font-semibold text-sm text-[var(--text)] group-hover:text-[var(--gold)] flex items-center justify-between">
                <span>{upsell.title}</span>
                <Plus className="w-4 h-4 text-[var(--teal)]" />
              </div>
              <div className="text-xs text-[var(--text-muted)] font-mono">
                {upsell.badge} • ${upsell.price}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Action Row matching Wireframe */}
      <div className="flex items-center gap-3 pt-4 border-t border-[var(--paper-dim)]">
        <button
          onClick={handleSaveDraft}
          className="btn-outline-steel flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> Save Draft
        </button>

        <button
          onClick={handleSubmitForApproval}
          className="btn-primary-gold flex items-center gap-2"
        >
          Submit for Approval
        </button>
      </div>
    </div>
  );
};

export default QuotationDetail;
