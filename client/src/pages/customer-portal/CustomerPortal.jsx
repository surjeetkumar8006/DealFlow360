import React, { useState } from 'react';
import { FileText, MessageSquare, ShieldAlert, CheckCircle, ArrowRight } from 'lucide-react';

const CustomerPortal = () => {
  const [counterDiscount, setCounterDiscount] = useState('');
  const [comment, setComment] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleCounterDiscountSubmit = (e) => {
    e.preventDefault();
    const parsed = parseFloat(counterDiscount);
    if (isNaN(parsed)) return;

    if (parsed > 15) {
      setStatusMessage(
        `⚠️ Counter discount proposal of ${parsed}% exceeds Gold Customer ceiling (15%). Quotation automatically re-routed to Sales Manager for approval!`
      );
    } else {
      setStatusMessage(`✅ Counter proposal of ${parsed}% submitted to your Sales Rep!`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Customer Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-2xl p-6 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-200">Customer Portal</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">My Quotation #1021</h1>
            <p className="text-xs text-blue-100 mt-1">Acme Corp • Gold Customer Tier</p>
          </div>
          <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/30">
            Status: Under Negotiation
          </span>
        </div>
      </div>

      {/* Quote Details Card matching Customer Portal Wireframe in Prompt */}
      <div className="card-container space-y-4">
        <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
          Quotation Line Items
        </h2>

        <div className="divide-y divide-slate-100 text-sm">
          <div className="py-3 flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-900">High-Performance Laptop</div>
              <div className="text-xs text-slate-500">Hardware • SKU: HW-LAPTOP-01</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-slate-900">2 × ₹50,000</div>
              <div className="text-xs text-slate-500">₹1,00,000</div>
            </div>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-900">Enterprise Setup Service</div>
              <div className="text-xs text-slate-500">Service • SKU: SV-SETUP-01</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-slate-900">1 × ₹10,000</div>
              <div className="text-xs text-slate-500">₹10,000</div>
            </div>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="bg-slate-50 rounded-xl p-4 space-y-2 border border-slate-200 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal Gross</span>
            <span>₹1,10,000</span>
          </div>
          <div className="flex justify-between text-emerald-700 font-semibold">
            <span>Current Discount Applied (10%)</span>
            <span>- ₹11,000</span>
          </div>
          <div className="flex justify-between text-slate-900 font-extrabold text-base pt-2 border-t border-slate-200">
            <span>Final Total</span>
            <span className="text-blue-700">₹99,000</span>
          </div>
        </div>
      </div>

      {/* Customer Negotiation Tool Box */}
      <div className="card-container space-y-4">
        <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-blue-600" />
          <span>Interactive Negotiation & Counter Proposal</span>
        </h2>

        {statusMessage && (
          <div className="p-4 rounded-xl text-sm font-medium bg-amber-50 border border-amber-200 text-amber-900">
            {statusMessage}
          </div>
        )}

        <form onSubmit={handleCounterDiscountSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Counter Discount Proposal (%)
            </label>
            <input
              type="number"
              value={counterDiscount}
              onChange={(e) => setCounterDiscount(e.target.value)}
              placeholder="e.g. 20 (Try entering > 15 to test auto re-approval trigger)"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Line Level Comment / Note for Sales Rep
            </label>
            <textarea
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Ask a question or request quantity changes..."
              className="input-field"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button type="submit" className="btn-primary">
              Submit Counter Request
            </button>

            <button
              type="button"
              onClick={() => alert('Quotation Confirmed! Proceeding to Fulfillment.')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-5 py-2 rounded-lg text-sm transition-all shadow-sm"
            >
              Confirm Quotation (1-Click)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerPortal;
