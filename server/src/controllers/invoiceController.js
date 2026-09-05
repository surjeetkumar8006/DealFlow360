// Invoice Controller for DealFlow360
// Manages DB invoices, payment reconciliation, and delivery matching
const Invoice = require('../models/Invoice');
const Quotation = require('../models/Quotation');

const DEFAULT_INVOICES = [
  {
    invoiceNumber: 'INV-1006',
    customer: 'Orion Ltd',
    amount: '$41,000',
    numericAmount: 41000,
    status: 'Unpaid',
    approvalStatus: 'APPROVED',
    dueDate: 'Sep 25',
    createdDate: 'Aug 24, 2026',
    orderRef: 'Q-1006',
    deliveryStatus: 'Order Confirmed - Split Allocation Pending',
    items: [{ product: 'Data Center Infrastructure Bundle', qty: 1, price: '$41,000' }]
  },
  {
    invoiceNumber: 'INV-1042',
    customer: 'Acme Corp',
    amount: '$2,730',
    numericAmount: 2730,
    status: 'Unpaid',
    approvalStatus: 'PENDING_FINANCE',
    dueDate: 'Sep 10',
    createdDate: 'Aug 20, 2026',
    orderRef: 'Q-1042',
    deliveryStatus: 'Split Allocated (East Depot + Main Warehouse)',
    items: [
      { product: 'Laptop Pro 14', qty: 2, price: '$2,280' },
      { product: 'Onsite Setup Service', qty: 1, price: '$450' }
    ]
  },
  {
    invoiceNumber: 'INV-1043',
    customer: 'Acme Corp',
    amount: '$46',
    numericAmount: 46,
    status: 'Paid',
    approvalStatus: 'AUTO_APPROVED',
    dueDate: 'Sep 15',
    createdDate: 'Aug 15, 2026',
    orderRef: 'Q-1042 (Recurring)',
    deliveryStatus: 'Digital Service Active',
    items: [{ product: 'Care Plan 2yr (Monthly Subscription)', qty: 1, price: '$46' }]
  },
  {
    invoiceNumber: 'INV-1038',
    customer: 'Nova Retail',
    amount: '$9,750',
    numericAmount: 9750,
    status: 'Paid',
    approvalStatus: 'APPROVED',
    dueDate: 'Aug 30',
    createdDate: 'Aug 15, 2026',
    orderRef: 'Q-1004',
    deliveryStatus: 'Fully Delivered (West Hub)',
    items: [{ product: 'POS Hardware Terminal', qty: 5, price: '$9,750' }]
  },
  {
    invoiceNumber: 'INV-1035',
    customer: 'Beta Industries',
    amount: '$1,200',
    numericAmount: 1200,
    status: 'Unpaid',
    approvalStatus: 'PENDING_APPROVAL',
    dueDate: 'Oct 05',
    createdDate: 'Aug 22, 2026',
    orderRef: 'Q-1039',
    deliveryStatus: 'Partial Delivery (East Depot)',
    items: [{ product: 'Support SLA (Quarterly)', qty: 1, price: '$1,200' }]
  },
  {
    invoiceNumber: 'INV-6685',
    customer: 'New Prod.',
    amount: '$34,600',
    numericAmount: 34600,
    status: 'Unpaid',
    approvalStatus: 'APPROVED',
    dueDate: 'Sep 25',
    createdDate: 'Aug 24, 2026',
    orderRef: 'Q-6685',
    deliveryStatus: 'Order Confirmed - Split Allocation Pending',
    items: [{ product: 'High Performance Infrastructure Package', qty: 1, price: '$34,600' }]
  }
];

// @desc Get all invoices from DB
// @route GET /api/invoices
// @access Private
const getInvoices = async (req, res) => {
  try {
    // 1. Ensure seed invoices exist in MongoDB if missing
    for (const seedInv of DEFAULT_INVOICES) {
      const exists = await Invoice.findOne({
        $or: [{ invoiceNumber: seedInv.invoiceNumber }, { orderRef: seedInv.orderRef }]
      }).catch(() => null);

      if (!exists) {
        await Invoice.create(seedInv).catch(() => null);
      }
    }

    // 2. Auto-sync any confirmed or approved quotations to Invoice collection
    try {
      const { syncConfirmedQuotationToInvoice } = require('./quotationController');
      const confirmedQuotes = await Quotation.find({ status: { $in: ['CONFIRMED', 'APPROVED'] } }).catch(() => []);
      for (const q of confirmedQuotes) {
        await syncConfirmedQuotationToInvoice(q);
      }
    } catch (e) {
      console.warn('Sync confirmed quotes warning:', e.message);
    }

    // 3. Fetch all invoices from MongoDB
    let invoices = await Invoice.find().sort({ createdAt: -1 }).catch(() => []);

    if (!invoices || invoices.length === 0) {
      invoices = DEFAULT_INVOICES;
    }

    const unpaidCount = invoices.filter((i) => i.status === 'Unpaid').length;
    const paidCount = invoices.filter((i) => i.status === 'Paid').length;
    const pendingApprovalCount = invoices.filter((i) => ['PENDING_FINANCE', 'PENDING_APPROVAL'].includes(i.approvalStatus)).length;

    res.json({
      success: true,
      counts: {
        unpaid: unpaidCount,
        paid: paidCount,
        pendingApproval: pendingApprovalCount
      },
      data: invoices.map((inv) => {
        const obj = typeof inv.toObject === 'function' ? inv.toObject() : inv;
        return {
          _id: obj._id ? obj._id.toString() : obj.invoiceNumber,
          id: obj._id ? obj._id.toString() : obj.invoiceNumber,
          invoiceNumber: obj.invoiceNumber,
          customer: obj.customer,
          amount: obj.amount,
          numericAmount: obj.numericAmount,
          status: obj.status,
          approvalStatus: obj.approvalStatus || (obj.invoiceNumber === 'INV-1042' ? 'PENDING_FINANCE' : obj.invoiceNumber === 'INV-1035' ? 'PENDING_APPROVAL' : 'APPROVED'),
          dueDate: obj.dueDate || 'Sep 25',
          createdDate: obj.createdDate || 'Aug 24, 2026',
          orderRef: obj.orderRef,
          deliveryStatus: obj.deliveryStatus || 'Order Confirmed - Split Allocation Pending',
          items: obj.items || []
        };
      })
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch invoices' });
  }
};

// @desc Get single invoice by ID or invoiceNumber from DB
// @route GET /api/invoices/:id
// @access Private
const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    let item;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      item = await Invoice.findById(id);
    }
    if (!item) {
      item = await Invoice.findOne({
        $or: [
          { invoiceNumber: { $regex: new RegExp(`^${id}$`, 'i') } },
          { orderRef: { $regex: new RegExp(`^${id}$`, 'i') } }
        ]
      });
    }

    if (!item) {
      item = DEFAULT_INVOICES.find((i) => i.invoiceNumber.toLowerCase() === id.toLowerCase() || i.orderRef.toLowerCase() === id.toLowerCase()) || DEFAULT_INVOICES[0];
    }

    const obj = typeof item.toObject === 'function' ? item.toObject() : item;

    res.json({
      success: true,
      data: {
        _id: obj._id ? obj._id.toString() : obj.invoiceNumber,
        id: obj._id ? obj._id.toString() : obj.invoiceNumber,
        invoiceNumber: obj.invoiceNumber,
        customer: obj.customer,
        amount: obj.amount,
        numericAmount: obj.numericAmount,
        status: obj.status,
        approvalStatus: obj.approvalStatus || (obj.invoiceNumber === 'INV-1042' ? 'PENDING_FINANCE' : obj.invoiceNumber === 'INV-1035' ? 'PENDING_APPROVAL' : 'APPROVED'),
        dueDate: obj.dueDate || 'Sep 25',
        createdDate: obj.createdDate || 'Aug 24, 2026',
        orderRef: obj.orderRef,
        deliveryStatus: obj.deliveryStatus || 'Order Confirmed - Split Allocation Pending',
        items: obj.items || []
      }
    });
  } catch (error) {
    console.error('Error fetching invoice details:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch invoice details' });
  }
};

// @desc Record payment for invoice in DB
// @route POST /api/invoices/:id/pay
// @access Private
const recordInvoicePayment = async (req, res) => {
  try {
    const { id } = req.params;
    let item;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      item = await Invoice.findById(id);
    }
    if (!item) {
      item = await Invoice.findOne({ invoiceNumber: { $regex: new RegExp(`^${id}$`, 'i') } });
    }

    if (item) {
      item.status = 'Paid';
      item.approvalStatus = 'APPROVED';
      await item.save();
    }

    try {
      const { addRecentActivity } = require('./dashboardController');
      addRecentActivity(
        `Payment received for invoice ${item?.invoiceNumber || id} (${item?.customer || ''})`,
        'INVOICE',
        '#2F6F5E'
      );
    } catch (e) {
      // Ignore
    }

    const obj = item && typeof item.toObject === 'function' ? item.toObject() : item;

    res.json({
      success: true,
      message: `Payment recorded for invoice ${obj?.invoiceNumber || id}! Status updated to Paid.`,
      data: obj ? {
        _id: obj._id ? obj._id.toString() : obj.invoiceNumber,
        id: obj._id ? obj._id.toString() : obj.invoiceNumber,
        invoiceNumber: obj.invoiceNumber,
        customer: obj.customer,
        amount: obj.amount,
        numericAmount: obj.numericAmount,
        status: obj.status,
        approvalStatus: obj.approvalStatus || 'APPROVED',
        dueDate: obj.dueDate || 'Sep 25',
        createdDate: obj.createdDate || 'Aug 24, 2026',
        orderRef: obj.orderRef,
        deliveryStatus: obj.deliveryStatus || 'Order Confirmed - Split Allocation Pending',
        items: obj.items || []
      } : null
    });
  } catch (error) {
    console.error('Error recording payment:', error);
    res.status(500).json({ success: false, message: 'Failed to record payment' });
  }
};

// @desc Approve invoice for release & payment reconciliation
// @route POST /api/invoices/:id/approve
// @access Private
const approveInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    let item;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      item = await Invoice.findById(id);
    }
    if (!item) {
      item = await Invoice.findOne({ invoiceNumber: { $regex: new RegExp(`^${id}$`, 'i') } });
    }

    if (item) {
      item.approvalStatus = 'APPROVED';
      await item.save();
    }

    try {
      const { addRecentActivity } = require('./dashboardController');
      addRecentActivity(
        `Invoice ${item?.invoiceNumber || id} approved for release by Finance/Manager`,
        'INVOICE',
        '#2F6F5E'
      );
    } catch (e) {
      // Ignore
    }

    const obj = item && typeof item.toObject === 'function' ? item.toObject() : item;

    res.json({
      success: true,
      message: `Invoice ${obj?.invoiceNumber || id} approved successfully!`,
      data: obj ? {
        _id: obj._id ? obj._id.toString() : obj.invoiceNumber,
        id: obj._id ? obj._id.toString() : obj.invoiceNumber,
        invoiceNumber: obj.invoiceNumber,
        customer: obj.customer,
        amount: obj.amount,
        numericAmount: obj.numericAmount,
        status: obj.status,
        approvalStatus: 'APPROVED',
        dueDate: obj.dueDate || 'Sep 25',
        createdDate: obj.createdDate || 'Aug 24, 2026',
        orderRef: obj.orderRef,
        deliveryStatus: obj.deliveryStatus || 'Order Confirmed - Split Allocation Pending',
        items: obj.items || []
      } : null
    });
  } catch (error) {
    console.error('Error approving invoice:', error);
    res.status(500).json({ success: false, message: 'Failed to approve invoice' });
  }
};

module.exports = {
  getInvoices,
  getInvoiceById,
  recordInvoicePayment,
  approveInvoice,
  DEFAULT_INVOICES
};
