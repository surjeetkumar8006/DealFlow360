// Subscription Controller for DealFlow360
// Manages recurring plans across customers, billing schedules, and proration rules

let subscriptionsStore = [
  {
    id: 'sub-1',
    customer: 'Acme Corp',
    plan: 'Care Plan 2yr',
    cycle: 'Monthly',
    nextBill: 'Sep 15',
    status: 'Active',
    amount: 450,
    startDate: 'Jan 15, 2026',
    billingHistory: [
      { date: 'Aug 15, 2026', invoice: 'INV-8821', amount: '$450', status: 'Paid' },
      { date: 'Jul 15, 2026', invoice: 'INV-7902', amount: '$450', status: 'Paid' }
    ],
    prorationHistory: [
      { date: 'Jun 01', note: 'Upgraded from 1yr to 2yr Care Plan', adjustment: '+$50 proration credit applied' }
    ]
  },
  {
    id: 'sub-2',
    customer: 'Beta Industries',
    plan: 'Support SLA',
    cycle: 'Quarterly',
    nextBill: 'Nov 1',
    status: 'Active',
    amount: 1200,
    startDate: 'May 01, 2026',
    billingHistory: [
      { date: 'Aug 01, 2026', invoice: 'INV-8410', amount: '$1,200', status: 'Paid' }
    ],
    prorationHistory: []
  },
  {
    id: 'sub-3',
    customer: 'Delta LLC',
    plan: 'Care Plan 1yr',
    cycle: 'Monthly',
    nextBill: '-',
    status: 'Paused',
    amount: 280,
    startDate: 'Mar 10, 2026',
    billingHistory: [
      { date: 'Jul 10, 2026', invoice: 'INV-7811', amount: '$280', status: 'Paid' }
    ],
    prorationHistory: [
      { date: 'Aug 05', note: 'Customer requested seasonal pause', adjustment: 'Paused billing cycle' }
    ]
  },
  {
    id: 'sub-4',
    customer: 'Nova Retail',
    plan: 'Cloud POS Sync',
    cycle: 'Yearly',
    nextBill: 'Dec 10',
    status: 'Active',
    amount: 2400,
    startDate: 'Dec 10, 2025',
    billingHistory: [
      { date: 'Dec 10, 2025', invoice: 'INV-4011', amount: '$2,400', status: 'Paid' }
    ],
    prorationHistory: []
  },
  {
    id: 'sub-5',
    customer: 'Zenith Co',
    plan: '24/7 Priority Support',
    cycle: 'Monthly',
    nextBill: '-',
    status: 'Cancelled',
    amount: 350,
    startDate: 'Feb 01, 2026',
    billingHistory: [],
    prorationHistory: [
      { date: 'Aug 12', note: 'Cancelled plan - partial refund issued', adjustment: '-$120 credit note' }
    ]
  }
];

// @desc Get all subscriptions
// @route GET /api/subscriptions
// @access Private
const getSubscriptions = async (req, res) => {
  try {
    const counts = {
      active: 18,
      paused: 2,
      cancelled: 3
    };

    res.json({
      success: true,
      counts,
      data: subscriptionsStore
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch subscriptions' });
  }
};

// @desc Get subscription by ID
// @route GET /api/subscriptions/:id
// @access Private
const getSubscriptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = subscriptionsStore.find((s) => s.id.toLowerCase() === id.toLowerCase() || s.customer.toLowerCase().includes(id.toLowerCase()));

    if (!item) {
      return res.json({ success: true, data: subscriptionsStore[0] });
    }

    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch subscription detail' });
  }
};

// @desc Create new subscription plan (Admin)
// @route POST /api/subscriptions
// @access Private (Admin)
const createSubscriptionPlan = async (req, res) => {
  try {
    const { customer, plan, cycle = 'Monthly', amount = 300 } = req.body;

    if (!customer || !plan) {
      return res.status(400).json({ success: false, message: 'Customer name and plan title are required' });
    }

    const newSub = {
      id: `sub-${Date.now()}`,
      customer,
      plan,
      cycle,
      nextBill: 'Oct 01',
      status: 'Active',
      amount: Number(amount) || 300,
      startDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      billingHistory: [],
      prorationHistory: [{ date: 'Today', note: 'New plan activated', adjustment: 'Initial setup' }]
    };

    subscriptionsStore.unshift(newSub);

    const { addRecentActivity } = require('./dashboardController');
    addRecentActivity(`Subscription ${plan} created for ${customer}`, 'SUBSCRIPTION', '#2F6F5E');

    res.status(201).json({
      success: true,
      message: `Subscription plan ${plan} created successfully!`,
      data: newSub
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create subscription plan' });
  }
};

// @desc Update subscription status or proration
// @route POST /api/subscriptions/:id/status
// @access Private
const updateSubscriptionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const idx = subscriptionsStore.findIndex((s) => s.id.toLowerCase() === id.toLowerCase());
    if (idx !== -1) {
      if (status) subscriptionsStore[idx].status = status;
      if (note) {
        if (!subscriptionsStore[idx].prorationHistory) subscriptionsStore[idx].prorationHistory = [];
        subscriptionsStore[idx].prorationHistory.push({
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          note: note || `Status updated to ${status}`,
          adjustment: status === 'Cancelled' ? 'Partial refund credit note issued' : 'Status modified'
        });
      }
    }

    const { addRecentActivity } = require('./dashboardController');
    addRecentActivity(`Subscription ${subscriptionsStore[idx]?.plan || id} status updated to ${status}`, 'SUBSCRIPTION', '#B8863B');

    res.json({
      success: true,
      message: `Subscription updated to ${status}`,
      data: subscriptionsStore[idx] || subscriptionsStore[0]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update subscription status' });
  }
};

module.exports = {
  getSubscriptions,
  getSubscriptionById,
  createSubscriptionPlan,
  updateSubscriptionStatus,
  subscriptionsStore
};
