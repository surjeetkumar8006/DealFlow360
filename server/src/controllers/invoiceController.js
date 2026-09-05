// Invoice Controller for DealFlow360
// Manages one-time & recurring invoices, payment reconciliation, and delivery matching

let invoicesStore = [
  {
    id: 'inv-1042',
    invoiceNumber: 'INV-1042',
    customer: 'Acme Corp',
    amount: '$2,730',
    numericAmount: 2730,
    status: 'Unpaid',
    dueDate: 'Sep 10',
    createdDate: 'Aug 20, 2026',
    orderRef: 'Q-1042',
    deliveryStatus: 'Split Allocated (East Depot + Main Warehouse)',
    items: [
      { product: 'Laptop Pro 14', qty: 2, price: '$2,280' },
      { product: 'Onsite Setup', qty: 1, price: '$450' }
    ]
  },
  {
    id: 'inv-1043',
    invoiceNumber: 'INV-1043',
    customer: 'Acme Corp',
    amount: '$46',
    numericAmount: 46,
    status: 'Paid',
    dueDate: 'Sep 15',
    createdDate: 'Aug 15, 2026',
    orderRef: 'Q-1042 (Recurring)',
    deliveryStatus: 'Digital Service Active',
    items: [
      { product: 'Care Plan 2yr (Monthly Subscription)', qty: 1, price: '$46' }
    ]
  },
  {
    id: 'inv-1038',
    invoiceNumber: 'INV-1038',
    customer: 'Nova Retail',
    amount: '$9,750',
    numericAmount: 9750,
    status: 'Paid',
    dueDate: 'Aug 30',
    createdDate: 'Aug 15, 2026',
    orderRef: 'Q-1004',
    deliveryStatus: 'Fully Delivered (West Hub)',
    items: [
      { product: 'POS Hardware Terminal', qty: 5, price: '$9,750' }
    ]
  },
  {
    id: 'inv-1035',
    invoiceNumber: 'INV-1035',
    customer: 'Beta Industries',
    amount: '$1,200',
    numericAmount: 1200,
    status: 'Unpaid',
    dueDate: 'Oct 05',
    createdDate: 'Aug 22, 2026',
    orderRef: 'Q-1039',
    deliveryStatus: 'Partial Delivery (East Depot)',
    items: [
      { product: 'Support SLA (Quarterly)', qty: 1, price: '$1,200' }
    ]
  }
];

// @desc Get all invoices
// @route GET /api/invoices
// @access Private
const getInvoices = async (req, res) => {
  try {
    const counts = {
      unpaid: 4,
      paid: 21
    };

    res.json({
      success: true,
      counts,
      data: invoicesStore
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch invoices' });
  }
};

// @desc Get single invoice by ID
// @route GET /api/invoices/:id
// @access Private
const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = invoicesStore.find((inv) => inv.id.toLowerCase() === id.toLowerCase() || inv.invoiceNumber.toLowerCase() === id.toLowerCase());

    if (!item) {
      return res.json({ success: true, data: invoicesStore[0] });
    }

    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch invoice details' });
  }
};

// @desc Record payment for invoice
// @route POST /api/invoices/:id/pay
// @access Private
const recordInvoicePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const idx = invoicesStore.findIndex((inv) => inv.id.toLowerCase() === id.toLowerCase() || inv.invoiceNumber.toLowerCase() === id.toLowerCase());

    if (idx !== -1) {
      invoicesStore[idx].status = 'Paid';
    }

    const { addRecentActivity } = require('./dashboardController');
    addRecentActivity(
      `Payment received for invoice ${invoicesStore[idx]?.invoiceNumber || id} (${invoicesStore[idx]?.customer || ''})`,
      'INVOICE',
      '#2F6F5E'
    );

    res.json({
      success: true,
      message: `Payment recorded for invoice ${invoicesStore[idx]?.invoiceNumber || id}! Status updated to Paid.`,
      data: invoicesStore[idx] || invoicesStore[0]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to record payment' });
  }
};

module.exports = {
  getInvoices,
  getInvoiceById,
  recordInvoicePayment,
  invoicesStore
};
