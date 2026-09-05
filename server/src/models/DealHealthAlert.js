const mongoose = require('mongoose');

const dealHealthAlertSchema = new mongoose.Schema({
  deal: { type: String, required: true },
  quoteNumber: { type: String },
  issue: { type: String, required: true },
  issueType: { type: String, enum: ['STALLED', 'DISCOUNT_ANOMALY', 'DELIVERY_SLIPPAGE'], default: 'STALLED' },
  flaggedDate: { type: String, default: 'Aug 24' },
  action: { type: String, default: 'Pending Review' },
  status: { type: String, enum: ['WARNING', 'AT_RISK', 'RESOLVED'], default: 'WARNING' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DealHealthAlert', dealHealthAlertSchema);
