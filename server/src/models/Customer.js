const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  companyName: { type: String, required: true },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  tier: {
    type: String,
    enum: ['Bronze', 'Silver', 'Gold', 'Platinum', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM'],
    default: 'Gold'
  },
  creditLimit: { type: Number, default: 50000 },
  portalToken: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Customer', customerSchema);
