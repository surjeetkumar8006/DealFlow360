const { quotationsStore } = require('./quotationController');

let approvalsStore = [
  {
    _id: 'q-1042',
    quoteNumber: 'Q-1042',
    customerName: 'Acme Corp',
    customerTier: 'Gold',
    salesRep: 'Surjeet Kumar',
    totalAmount: 2970,
    discountPercentage: 14,
    riskScore: 18.5,
    riskLevel: 'HIGH',
    stage: 'Sales Manager',
    assignedTo: 'M. Shah',
    status: 'PENDING_APPROVAL',
    ceilingViolation: 'Worst single line (8pt over) plus overall pattern across the order sets the blended score. One bad line is enough to require approval.',
    flaggedLines: [
      { line: 'Laptop (Hardware)', discountGiven: '12%', limitAllowed: '15%', overBy: '0 pt - OK', status: 'OK' },
      { line: 'Setup Service (Services)', discountGiven: '18%', limitAllowed: '10%', overBy: '8 pt OVER', status: 'OVER' }
    ],
    stepper: [
      { step: 1, label: 'Submitted', status: 'COMPLETED', color: '#2F6F5E' },
      { step: 2, label: 'Sales Manager', status: 'ACTIVE', color: '#3B82F6' },
      { step: 3, label: 'Finance', status: 'PENDING', color: '#94A3B8' },
      { step: 4, label: 'Confirmed', status: 'PENDING', color: '#94A3B8' }
    ],
    auditTrail: [
      { user: 'J. Rao', action: 'Submitted', date: 'Aug 20', note: 'Initial 12% discount' },
      { user: 'M. Shah', action: 'Returned', date: 'Aug 21', note: 'Requested justification' },
      { user: 'J. Rao', action: 'Resubmitted', date: 'Aug 22', note: 'Added margin note' }
    ]
  },
  {
    _id: 'q-1039',
    quoteNumber: 'Q-1039',
    customerName: 'Beta Industries',
    customerTier: 'Gold',
    salesRep: 'Rahul Sharma',
    totalAmount: 28900,
    discountPercentage: 18,
    riskScore: 12.4,
    riskLevel: 'MEDIUM',
    stage: 'Finance',
    assignedTo: 'R. Iyer',
    status: 'REVISION_REQUESTED',
    ceilingViolation: 'Setup Service discount 18% returned by Finance for margin justification.',
    flaggedLines: [
      { line: 'Enterprise Server Node', discountGiven: '15%', limitAllowed: '15%', overBy: '0 pt - OK', status: 'OK' },
      { line: 'Dedicated Migration Service', discountGiven: '18%', limitAllowed: '10%', overBy: '8 pt OVER', status: 'OVER' }
    ],
    stepper: [
      { step: 1, label: 'Submitted', status: 'COMPLETED', color: '#2F6F5E' },
      { step: 2, label: 'Sales Manager', status: 'COMPLETED', color: '#2F6F5E' },
      { step: 3, label: 'Finance', status: 'ACTIVE', color: '#3B82F6' },
      { step: 4, label: 'Confirmed', status: 'PENDING', color: '#94A3B8' }
    ],
    auditTrail: [
      { user: 'Rahul Sharma', action: 'Submitted', date: 'Aug 18', note: 'Submitted quote Q-1039' },
      { user: 'R. Iyer', action: 'Returned', date: 'Aug 19', note: 'Requesting margin breakdown' }
    ]
  },
  {
    _id: 'q-1035',
    quoteNumber: 'Q-1035',
    customerName: 'Nova Retail',
    customerTier: 'Gold',
    salesRep: 'Priya Verma',
    totalAmount: 9750,
    discountPercentage: 10,
    riskScore: 5.5,
    riskLevel: 'LOW',
    stage: 'Auto-Approved',
    assignedTo: '-',
    status: 'APPROVED',
    ceilingViolation: null,
    flaggedLines: [
      { line: 'POS Hardware Terminal', discountGiven: '10%', limitAllowed: '15%', overBy: '0 pt - OK', status: 'OK' }
    ],
    stepper: [
      { step: 1, label: 'Submitted', status: 'COMPLETED', color: '#2F6F5E' },
      { step: 2, label: 'Sales Manager', status: 'COMPLETED', color: '#2F6F5E' },
      { step: 3, label: 'Finance', status: 'COMPLETED', color: '#2F6F5E' },
      { step: 4, label: 'Confirmed', status: 'COMPLETED', color: '#2F6F5E' }
    ],
    auditTrail: [
      { user: 'Priya Verma', action: 'Submitted', date: 'Aug 15', note: 'Submitted quote Q-1035' },
      { user: 'System Governance', action: 'Auto-Approved', date: 'Aug 15', note: 'All discounts within Gold tier limits' }
    ]
  }
];

// @desc Get all approval requests
// @route GET /api/approvals
// @access Private (Manager/Admin)
const getPendingApprovals = async (req, res) => {
  try {
    const pendingCount = approvalsStore.filter((a) => a.status === 'PENDING_APPROVAL').length;
    const returnedCount = approvalsStore.filter((a) => a.status === 'REVISION_REQUESTED').length;
    const approvedCount = approvalsStore.filter((a) => a.status === 'APPROVED').length;

    res.json({
      success: true,
      counts: {
        pending: pendingCount,
        returned: returnedCount,
        approved: approvedCount
      },
      data: approvalsStore
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch approval queue' });
  }
};

// @desc Get single approval request by ID
// @route GET /api/approvals/:id
// @access Private (Manager/Admin)
const getApprovalById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = approvalsStore.find((a) => a._id === id || a.quoteNumber.toLowerCase() === id.toLowerCase());

    if (!item) {
      return res.json({ success: true, data: approvalsStore[0] });
    }

    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch approval details' });
  }
};

// @desc Process an approval request (Approve, Reject, Return for Revision)
// @route POST /api/approvals/:id/action
// @access Private (Manager/Admin)
const processApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, note } = req.body; // action: 'APPROVE' | 'REJECT' | 'REVISION'

    const itemIndex = approvalsStore.findIndex((a) => a._id.toLowerCase() === id.toLowerCase() || a.quoteNumber.toLowerCase() === id.toLowerCase());
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Approval item not found' });
    }

    let newStatus = 'APPROVED';
    let newStage = 'Confirmed';
    let stepperConfig = [
      { step: 1, label: 'Submitted', status: 'COMPLETED', color: '#2F6F5E' },
      { step: 2, label: 'Sales Manager', status: 'COMPLETED', color: '#2F6F5E' },
      { step: 3, label: 'Finance', status: 'COMPLETED', color: '#2F6F5E' },
      { step: 4, label: 'Confirmed', status: 'COMPLETED', color: '#2F6F5E' }
    ];

    if (action === 'REJECT') {
      newStatus = 'REJECTED';
      newStage = 'Rejected';
      stepperConfig = [
        { step: 1, label: 'Submitted', status: 'COMPLETED', color: '#2F6F5E' },
        { step: 2, label: 'Sales Manager', status: 'REJECTED', color: '#9E2A2B' },
        { step: 3, label: 'Finance', status: 'PENDING', color: '#94A3B8' },
        { step: 4, label: 'Confirmed', status: 'PENDING', color: '#94A3B8' }
      ];
    } else if (action === 'REVISION') {
      newStatus = 'REVISION_REQUESTED';
      newStage = 'Revision Requested';
      stepperConfig = [
        { step: 1, label: 'Submitted', status: 'COMPLETED', color: '#2F6F5E' },
        { step: 2, label: 'Sales Manager', status: 'REVISION_REQUESTED', color: '#B8863B' },
        { step: 3, label: 'Finance', status: 'PENDING', color: '#94A3B8' },
        { step: 4, label: 'Confirmed', status: 'PENDING', color: '#94A3B8' }
      ];
    }

    approvalsStore[itemIndex].status = newStatus;
    approvalsStore[itemIndex].stage = newStage;
    approvalsStore[itemIndex].stepper = stepperConfig;
    approvalsStore[itemIndex].managerNote = note || `Manager action: ${action}`;

    // Add audit entry if not already added in this exact step
    if (!approvalsStore[itemIndex].auditTrail) approvalsStore[itemIndex].auditTrail = [];
    const actionLabel = action === 'REJECT' ? 'Rejected' : action === 'REVISION' ? 'Returned' : 'Approved';
    
    approvalsStore[itemIndex].auditTrail.push({
      user: 'M. Shah',
      action: actionLabel,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      note: note || `Manager action: ${action}`
    });

    // Synchronize with quotationsStore
    const { quotationsStore } = require('./quotationController');
    const quoteMatch = quotationsStore.find((q) => q._id.toLowerCase() === id.toLowerCase() || q.quoteNumber.toLowerCase() === id.toLowerCase());
    if (quoteMatch) {
      quoteMatch.status = newStatus;
      quoteMatch.managerNote = note || `Manager action: ${action}`;
    }

    const { addRecentActivity } = require('./dashboardController');
    addRecentActivity(
      `Quote ${approvalsStore[itemIndex].quoteNumber} (${approvalsStore[itemIndex].customerName}) marked as ${newStatus.toLowerCase()} by Manager`,
      'APPROVAL',
      newStatus === 'APPROVED' ? '#2F6F5E' : newStatus === 'REVISION_REQUESTED' ? '#B8863B' : '#9E2A2B'
    );

    res.json({
      success: true,
      message: `Quotation ${approvalsStore[itemIndex].quoteNumber} ${newStatus.toLowerCase()} successfully!`,
      data: approvalsStore[itemIndex]
    });
  } catch (error) {
    console.error('Process approval error:', error);
    res.status(500).json({ success: false, message: 'Failed to process approval action' });
  }
};

module.exports = {
  getPendingApprovals,
  getApprovalById,
  processApproval,
  approvalsStore
};
