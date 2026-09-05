const Quotation = require('../models/Quotation');

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
    _id: 'q-1003',
    quoteNumber: 'Q-1003',
    customerName: 'Beta Industries',
    customerTier: 'Gold',
    salesRep: 'Rahul Sharma',
    totalAmount: 28900,
    discountPercentage: 18,
    riskScore: 18.5,
    riskLevel: 'HIGH',
    stage: 'Finance',
    assignedTo: 'R. Iyer',
    status: 'PENDING_APPROVAL',
    ceilingViolation: 'Setup Service discount given is 18% (Allowed Gold tier ceiling is 15%). Exceeds threshold by 3 points.',
    flaggedLines: [
      { line: 'Enterprise Server Node', discountGiven: '15%', limitAllowed: '15%', overBy: '0 pt - OK', status: 'OK' },
      { line: 'Onsite Setup Service', discountGiven: '18%', limitAllowed: '15%', overBy: '3 pt OVER', status: 'OVER' }
    ],
    stepper: [
      { step: 1, label: 'Submitted', status: 'COMPLETED', color: '#2F6F5E' },
      { step: 2, label: 'Sales Manager', status: 'COMPLETED', color: '#2F6F5E' },
      { step: 3, label: 'Finance', status: 'ACTIVE', color: '#3B82F6' },
      { step: 4, label: 'Confirmed', status: 'PENDING', color: '#94A3B8' }
    ],
    auditTrail: [
      { user: 'Rahul Sharma', action: 'Submitted', date: 'Aug 18', note: 'Submitted quote Q-1003' }
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
// @access Private (Manager/Finance/Admin)
const processApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, note } = req.body;
    const userRole = (req.user?.role || 'admin').toLowerCase();
    const userName = req.user?.name || (userRole === 'finance' ? 'R. Iyer (Finance)' : 'M. Shah (Manager)');

    // 1. Strict RBAC Enforcement: Sales Reps cannot perform approval actions
    if (userRole === 'sales_rep' || userRole === 'customer') {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: Sales Reps and Customers are not authorized to perform approval actions.'
      });
    }

    const itemIndex = approvalsStore.findIndex(
      (a) => a._id.toLowerCase() === id.toLowerCase() || a.quoteNumber.toLowerCase() === id.toLowerCase()
    );

    const item = itemIndex !== -1 ? approvalsStore[itemIndex] : null;
    const currentStage = item ? item.stage : 'Sales Manager';
    const isHighRisk = item ? (item.riskLevel === 'HIGH' || item.riskScore >= 15) : true;

    // 2. Stage-based Access Checks
    if (currentStage === 'Sales Manager' && !['sales_manager', 'admin'].includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: This quotation is pending Sales Manager approval. Only Sales Managers or Admins can act at this stage.'
      });
    }

    if (currentStage === 'Finance' && !['finance', 'admin'].includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: This quotation has passed Manager review and is pending Finance approval. Only Finance or Admins can act at this stage.'
      });
    }

    let newStatus = 'APPROVED';
    let newStage = 'Confirmed';
    let stepperConfig = [];
    let auditAction = 'Approved';
    let defaultNote = '';

    const currentDateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    if (action === 'REJECT') {
      newStatus = 'REJECTED';
      newStage = 'Rejected';
      auditAction = 'Rejected';
      defaultNote = `${userRole === 'finance' ? 'Finance' : 'Manager'} rejected quote exception`;
      stepperConfig = [
        { step: 1, label: 'Submitted', status: 'COMPLETED', color: '#2F6F5E' },
        { step: 2, label: 'Sales Manager', status: currentStage === 'Finance' ? 'COMPLETED' : 'REJECTED', color: '#9E2A2B' },
        { step: 3, label: 'Finance', status: currentStage === 'Finance' ? 'REJECTED' : 'PENDING', color: '#94A3B8' },
        { step: 4, label: 'Confirmed', status: 'PENDING', color: '#94A3B8' }
      ];
    } else if (action === 'REVISION') {
      newStatus = 'REVISION_REQUESTED';
      newStage = 'Revision Requested';
      auditAction = 'Returned';
      defaultNote = `${userRole === 'finance' ? 'Finance' : 'Manager'} requested revision & discount justification`;
      stepperConfig = [
        { step: 1, label: 'Submitted', status: 'COMPLETED', color: '#2F6F5E' },
        { step: 2, label: 'Sales Manager', status: currentStage === 'Finance' ? 'COMPLETED' : 'REVISION_REQUESTED', color: '#B8863B' },
        { step: 3, label: 'Finance', status: currentStage === 'Finance' ? 'REVISION_REQUESTED' : 'PENDING', color: '#94A3B8' },
        { step: 4, label: 'Confirmed', status: 'PENDING', color: '#94A3B8' }
      ];
    } else {
      // APPROVE ACTION
      if (currentStage === 'Sales Manager' && isHighRisk) {
        // Multi-tier chain: Manager approval sends High-Risk quote to Finance step!
        newStatus = 'PENDING_FINANCE';
        newStage = 'Finance';
        auditAction = 'Manager Approved';
        defaultNote = 'Sales Manager approved quote. Routed to Finance for 2nd-level approval.';
        stepperConfig = [
          { step: 1, label: 'Submitted', status: 'COMPLETED', color: '#2F6F5E' },
          { step: 2, label: 'Sales Manager', status: 'COMPLETED', color: '#2F6F5E' },
          { step: 3, label: 'Finance', status: 'ACTIVE', color: '#3B82F6' },
          { step: 4, label: 'Confirmed', status: 'PENDING', color: '#94A3B8' }
        ];
      } else {
        // Finance approval (Stage 3) OR Medium-Risk quote manager approval -> Fully CONFIRMED & APPROVED!
        newStatus = 'APPROVED';
        newStage = 'Confirmed';
        auditAction = currentStage === 'Finance' ? 'Finance Approved' : 'Approved';
        defaultNote = currentStage === 'Finance'
          ? 'Finance second-level approval completed. Quotation confirmed.'
          : 'Sales Manager approved quote. Quotation confirmed.';
        stepperConfig = [
          { step: 1, label: 'Submitted', status: 'COMPLETED', color: '#2F6F5E' },
          { step: 2, label: 'Sales Manager', status: 'COMPLETED', color: '#2F6F5E' },
          { step: 3, label: 'Finance', status: 'COMPLETED', color: '#2F6F5E' },
          { step: 4, label: 'Confirmed', status: 'COMPLETED', color: '#2F6F5E' }
        ];
      }
    }

    if (itemIndex !== -1) {
      approvalsStore[itemIndex].status = newStatus;
      approvalsStore[itemIndex].stage = newStage;
      approvalsStore[itemIndex].stepper = stepperConfig;
      approvalsStore[itemIndex].managerNote = note || defaultNote;
      if (newStage === 'Finance') {
        approvalsStore[itemIndex].assignedTo = 'R. Iyer (Finance)';
      }

      if (!approvalsStore[itemIndex].auditTrail) approvalsStore[itemIndex].auditTrail = [];
      
      approvalsStore[itemIndex].auditTrail.push({
        user: userName,
        action: auditAction,
        date: currentDateStr,
        note: note || defaultNote
      });
    }

    // Synchronize with Quotation collection in DB
    const targetNumber = approvalsStore[itemIndex]?.quoteNumber || id;
    const dbQuote = await Quotation.findOne({ quoteNumber: { $regex: new RegExp(`^${targetNumber}$`, 'i') } });
    if (dbQuote) {
      dbQuote.status = newStatus;
      dbQuote.managerNote = note || defaultNote;
      await dbQuote.save();

      if (newStatus === 'CONFIRMED' || newStatus === 'APPROVED') {
        const { syncConfirmedQuotationToInvoice } = require('./quotationController');
        await syncConfirmedQuotationToInvoice(dbQuote);
      }
    }

    try {
      const { addRecentActivity } = require('./dashboardController');
      addRecentActivity(
        `Quote ${targetNumber} updated to ${newStage} (${newStatus}) by ${userName}`,
        'APPROVAL',
        newStatus === 'APPROVED' ? '#2F6F5E' : newStatus === 'PENDING_FINANCE' ? '#3B82F6' : newStatus === 'REVISION_REQUESTED' ? '#B8863B' : '#9E2A2B'
      );
    } catch (e) {
      // Ignore
    }

    res.json({
      success: true,
      message: `Quotation ${targetNumber} updated to stage '${newStage}' successfully!`,
      data: itemIndex !== -1 ? approvalsStore[itemIndex] : { quoteNumber: targetNumber, status: newStatus, stage: newStage }
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
