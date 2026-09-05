const { quotationsStore } = require('./quotationController');

let activityStore = [
  {
    id: 'act-1',
    title: 'Acme Corp quotation approved by Finance',
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    type: 'APPROVAL',
    dotColor: '#2F6F5E', // Teal
  },
  {
    id: 'act-2',
    title: 'Beta Industries requested a discount change from the customer portal',
    createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    type: 'NEGOTIATION',
    dotColor: '#B8863B', // Gold
  },
  {
    id: 'act-3',
    title: 'East Depot stock updated for Order #2291',
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    type: 'INVENTORY',
    dotColor: '#262B33', // Ink Soft
  },
];

const addRecentActivity = (title, type = 'GENERAL', dotColor = '#2F6F5E') => {
  activityStore.unshift({
    id: `act-${Date.now()}`,
    title,
    createdAt: new Date().toISOString(),
    type,
    dotColor,
  });
};

// @desc Get Sales Dashboard KPIs, Recent Activity, and Discount Tiers
// @route GET /api/dashboard/stats
// @access Private
const getDashboardStats = async (req, res) => {
  try {
    const pendingApprovals = quotationsStore.filter((q) => q.status === 'PENDING_APPROVAL').length;
    const openQuotations = quotationsStore.length;
    const atRiskDeals = quotationsStore.filter((q) => q.riskLevel === 'HIGH').length;

    const dashboardData = {
      stats: {
        pendingApprovals,
        openQuotations,
        atRiskDeals,
      },
      recentActivity: activityStore,
      discountTiers: [
        { tier: 'Bronze', maxDiscount: 5, color: '#B08D57' },
        { tier: 'Silver', maxDiscount: 10, color: '#B7BAC2' },
        { tier: 'Gold', maxDiscount: 15, color: '#B8863B' },
      ],
      note: 'Category ceilings can be stricter than the customer\'s tier — the blended risk score routes approval based on whichever limit a line actually breaks.'
    };

    res.json({ success: true, data: dashboardData });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, message: 'Failed to load dashboard statistics' });
  }
};

module.exports = {
  getDashboardStats,
  addRecentActivity,
  activityStore,
};
