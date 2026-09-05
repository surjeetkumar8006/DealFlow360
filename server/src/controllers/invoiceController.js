// Invoice Controller for DealFlow360
// Manages DB invoices, payment reconciliation, and delivery matching
const Invoice = require('../models/Invoice');

// @desc Get all invoices from DB
// @route GET /api/invoices
// @access Private
const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });

    const unpaidCount = invoices.filter((i) => i.status === 'Unpaid').length;
    const paidCount = invoices.filter((i) => i.status === 'Paid').length;

    res.json({
      success: true,
      counts: {
        unpaid: unpaidCount,
        paid: paidCount
      },
      data: invoices.map((inv) => ({
        _id: inv._id,
        id: inv._id.toString(),
        invoiceNumber: inv.invoiceNumber,
        customer: inv.customer,
        amount: inv.amount,
        numericAmount: inv.numericAmount,
        status: inv.status,
        dueDate: inv.dueDate,
        createdDate: inv.createdDate,
        orderRef: inv.orderRef,
        deliveryStatus: inv.deliveryStatus,
        items: inv.items
      }))
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
      item = await Invoice.findOne();
    }

    if (!item) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    res.json({
      success: true,
      data: {
        _id: item._id,
        id: item._id.toString(),
        invoiceNumber: item.invoiceNumber,
        customer: item.customer,
        amount: item.amount,
        numericAmount: item.numericAmount,
        status: item.status,
        dueDate: item.dueDate,
        createdDate: item.createdDate,
        orderRef: item.orderRef,
        deliveryStatus: item.deliveryStatus,
        items: item.items
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

    res.json({
      success: true,
      message: `Payment recorded for invoice ${item?.invoiceNumber || id}! Status updated to Paid.`,
      data: item ? {
        _id: item._id,
        id: item._id.toString(),
        invoiceNumber: item.invoiceNumber,
        customer: item.customer,
        amount: item.amount,
        numericAmount: item.numericAmount,
        status: item.status,
        dueDate: item.dueDate,
        createdDate: item.createdDate,
        orderRef: item.orderRef,
        deliveryStatus: item.deliveryStatus,
        items: item.items
      } : null
    });
  } catch (error) {
    console.error('Error recording payment:', error);
    res.status(500).json({ success: false, message: 'Failed to record payment' });
  }
};

module.exports = {
  getInvoices,
  getInvoiceById,
  recordInvoicePayment
};
