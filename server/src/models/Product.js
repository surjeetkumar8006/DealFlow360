const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  listPrice: { type: Number, required: true },
  costPrice: { type: Number, required: true }, // used for live margin % calculations
  unit: { type: String, default: 'pcs' },
  taxRate: { type: Number, default: 18 }, // % tax
  description: { type: String, default: '' },
  isPromoted: { type: Boolean, default: false },
  isSubscription: { type: Boolean, default: false },
  recurring: { type: String, default: 'Monthly' },
  quantityOnHand: { type: Number, default: 50 },
  status: { type: String, default: 'Active' },
  variants: { type: String, default: '-' },
  price: { type: String },
  coPurchaseItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  attributes: { type: Map, of: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);

