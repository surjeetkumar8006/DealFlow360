const mongoose = require('mongoose');

const quotationLineItemSchema = new mongoose.Schema({
  id: { type: String },
  product: { type: String, required: true },
  qty: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true, default: 0 },
  discount: { type: Number, default: 0 },
  limit: { type: Number, default: 15 }
});

const quotationSchema = new mongoose.Schema(
  {
    quoteNumber: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    customerTier: {
      type: String,
      default: 'Gold'
    },
    salesRep: { type: String, default: 'Surjeet Kumar' },
    priceList: { type: String, default: 'Standard Enterprise 2026' },
    totalAmount: { type: Number, required: true, default: 0 },
    discountPercentage: { type: Number, default: 0 },
    riskScore: { type: Number, default: 0 },
    riskLevel: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'LOW' },
    status: {
      type: String,
      enum: ['DRAFT', 'PENDING_APPROVAL', 'PENDING_FINANCE', 'REVISION_REQUESTED', 'APPROVED', 'NEGOTIATION', 'CONFIRMED', 'REJECTED'],
      default: 'DRAFT'
    },
    ceilingViolation: { type: String, default: null },
    managerNote: { type: String, default: '' },
    lineItems: [quotationLineItemSchema]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Quotation', quotationSchema);
