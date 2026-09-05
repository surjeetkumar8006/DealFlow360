const mongoose = require('mongoose');

const invoiceItemSchema = new mongoose.Schema({
  product: { type: String, required: true },
  qty: { type: Number, required: true, default: 1 },
  price: { type: String, required: true }
});

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    customer: { type: String, required: true },
    amount: { type: String, required: true },
    numericAmount: { type: Number, required: true },
    status: { type: String, enum: ['Unpaid', 'Paid', 'Partial'], default: 'Unpaid' },
    approvalStatus: {
      type: String,
      enum: ['APPROVED', 'PENDING_APPROVAL', 'PENDING_FINANCE', 'AUTO_APPROVED', 'REJECTED'],
      default: 'APPROVED'
    },
    dueDate: { type: String, default: 'In 30 Days' },
    createdDate: { type: String, default: () => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
    orderRef: { type: String },
    deliveryStatus: { type: String, default: 'Order Confirmed - Split Allocation Pending' },
    items: [invoiceItemSchema]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Invoice', invoiceSchema);
