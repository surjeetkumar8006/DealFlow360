const mongoose = require('mongoose');

const recentActivitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: {
    type: String,
    enum: ['APPROVAL', 'NEGOTIATION', 'INVENTORY', 'QUOTATION', 'INVOICE', 'ANOMALY', 'GENERAL'],
    default: 'GENERAL'
  },
  dotColor: { type: String, default: '#2F6F5E' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RecentActivity', recentActivitySchema);
