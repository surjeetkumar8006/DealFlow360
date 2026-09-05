const mongoose = require('mongoose');

const governanceRuleSchema = new mongoose.Schema(
  {
    tiers: [
      {
        id: { type: String },
        tier: { type: String, required: true },
        maxDiscount: { type: String, required: true }
      }
    ],
    categories: [
      {
        id: { type: String },
        category: { type: String, required: true },
        maxDiscount: { type: String, required: true }
      }
    ],
    approvalRules: [
      {
        id: { type: String },
        discountRange: { type: String, required: true },
        maxDiscount: { type: String, required: true }
      }
    ],
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('GovernanceRule', governanceRuleSchema);
