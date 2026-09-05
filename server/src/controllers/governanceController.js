const GovernanceRule = require('../models/GovernanceRule');

const DEFAULT_GOVERNANCE = {
  tiers: [
    { id: 't-1', tier: 'Bronze', maxDiscount: '5 percent' },
    { id: 't-2', tier: 'Silver', maxDiscount: '10 percent' },
    { id: 't-3', tier: 'Gold', maxDiscount: '15 Percent' }
  ],
  categories: [
    { id: 'c-1', category: 'Hardware', maxDiscount: '15 percent' },
    { id: 'c-2', category: 'Services', maxDiscount: '10 percent' }
  ],
  approvalRules: [
    { id: 'r-1', discountRange: 'Within tier/Category limit', maxDiscount: 'No approval needed' },
    { id: 'r-2', discountRange: 'Over Limit,blended risk medium', maxDiscount: 'Sales manager' },
    { id: 'r-3', discountRange: 'Over limit,blended high risk', maxDiscount: 'Sales manager then finance' }
  ]
};

// @desc Get governance rules configuration
// @route GET /api/governance
// @access Public / Private
const getGovernanceRules = async (req, res) => {
  try {
    let ruleDoc = await GovernanceRule.findOne();
    if (!ruleDoc) {
      ruleDoc = await GovernanceRule.create(DEFAULT_GOVERNANCE);
    }
    return res.json({
      success: true,
      data: {
        tiers: ruleDoc.tiers,
        categories: ruleDoc.categories,
        approvalRules: ruleDoc.approvalRules
      }
    });
  } catch (error) {
    console.error('Error fetching governance rules:', error);
    return res.json({
      success: true,
      data: DEFAULT_GOVERNANCE
    });
  }
};

// @desc Update governance rules configuration
// @route PUT /api/governance
// @access Private (Admin)
const updateGovernanceRules = async (req, res) => {
  try {
    const { tiers, categories, approvalRules } = req.body;
    let ruleDoc = await GovernanceRule.findOne();

    if (!ruleDoc) {
      ruleDoc = new GovernanceRule({
        tiers: tiers || DEFAULT_GOVERNANCE.tiers,
        categories: categories || DEFAULT_GOVERNANCE.categories,
        approvalRules: approvalRules || DEFAULT_GOVERNANCE.approvalRules
      });
    } else {
      if (tiers) ruleDoc.tiers = tiers;
      if (categories) ruleDoc.categories = categories;
      if (approvalRules) ruleDoc.approvalRules = approvalRules;
      ruleDoc.updatedAt = new Date();
    }

    await ruleDoc.save();

    return res.json({
      success: true,
      message: 'Discount tiers and approval chain configuration saved successfully!',
      data: {
        tiers: ruleDoc.tiers,
        categories: ruleDoc.categories,
        approvalRules: ruleDoc.approvalRules
      }
    });
  } catch (error) {
    console.error('Error updating governance rules:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update governance configuration'
    });
  }
};

module.exports = {
  getGovernanceRules,
  updateGovernanceRules
};
