// Quotation Controller for DealFlow360
// Handles DB quotation retrieval, creation with multi-tier discount validation, status updates, and deletion
const Quotation = require('../models/Quotation');
const Invoice = require('../models/Invoice');

// Helper function to sync a confirmed quotation to Invoice collection
const syncConfirmedQuotationToInvoice = async (quote) => {
  try {
    if (!['CONFIRMED', 'APPROVED'].includes(quote.status)) return;

    const targetRef = quote.quoteNumber;
    const invNum = `INV-${targetRef.replace('Q-', '')}`;

    const existingInvoice = await Invoice.findOne({
      $or: [
        { orderRef: targetRef },
        { invoiceNumber: invNum }
      ]
    });

    const formattedAmount = `$${Number(quote.totalAmount || 0).toLocaleString()}`;
    const invoiceItems = (quote.lineItems || []).map((item) => ({
      product: item.product,
      qty: item.qty,
      price: `$${(item.price * item.qty * (1 - (item.discount || 0) / 100)).toLocaleString()}`
    }));

    if (existingInvoice) {
      const updateData = {
        amount: formattedAmount,
        numericAmount: quote.totalAmount,
        customer: quote.customerName
      };
      if (invoiceItems.length > 0) {
        updateData.items = invoiceItems;
      }
      await Invoice.updateOne({ _id: existingInvoice._id }, { $set: updateData });
    } else {
      await Invoice.create({
        invoiceNumber: invNum,
        customer: quote.customerName,
        amount: formattedAmount,
        numericAmount: quote.totalAmount,
        status: 'Unpaid',
        dueDate: 'Sep 25',
        createdDate: 'Aug 24, 2026',
        orderRef: targetRef,
        deliveryStatus: 'Order Confirmed - Split Allocation Pending',
        items: invoiceItems
      });
    }
  } catch (err) {
    console.error(`Failed to sync quote ${quote.quoteNumber} to invoice:`, err.message);
  }
};

// @desc Get all quotations from DB
// @route GET /api/quotations
// @access Private
const getQuotations = async (req, res) => {
  try {
    const quotations = await Quotation.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: quotations.length,
      data: quotations
    });
  } catch (error) {
    console.error('Error fetching quotations:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch quotations' });
  }
};

// @desc Get single quotation by ID or quoteNumber from DB
// @route GET /api/quotations/:id
// @access Private
const getQuotationById = async (req, res) => {
  try {
    const { id } = req.params;
    let quotation;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      quotation = await Quotation.findById(id);
    }

    if (!quotation) {
      quotation = await Quotation.findOne({ quoteNumber: { $regex: new RegExp(`^${id}$`, 'i') } });
    }

    if (!quotation) {
      quotation = await Quotation.findOne();
    }

    if (!quotation) {
      return res.status(404).json({ success: false, message: 'Quotation not found' });
    }

    res.json({ success: true, data: quotation });
  } catch (error) {
    console.error('Error fetching quotation detail:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch quotation details' });
  }
};

// @desc Create a new quotation in DB with automated discount governance evaluation
// @route POST /api/quotations
// @access Private
const createQuotation = async (req, res) => {
  try {
    const { customerName, customerTier = 'Gold', priceList = 'Standard Enterprise 2026', lineItems = [], salesRep = 'Surjeet Kumar', status: requestedStatus } = req.body;

    if (!customerName || lineItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Customer name and line items are required' });
    }

    const tierLimits = { Bronze: 5, BRONZE: 5, Silver: 10, SILVER: 10, Gold: 15, GOLD: 15, Platinum: 20, PLATINUM: 20 };
    const allowedLimit = tierLimits[customerTier] || 15;

    let totalRaw = 0;
    let totalDiscounted = 0;
    let maxItemDiscount = 0;
    let violationMessage = null;

    const processedLineItems = lineItems.map((item, index) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.qty) || 1;
      const discount = Number(item.discount) || 0;
      const limit = Number(item.limit) || (item.product?.toLowerCase().includes('service') ? 10 : allowedLimit);
      const itemTotal = price * qty * (1 - discount / 100);

      totalRaw += price * qty;
      totalDiscounted += itemTotal;
      if (discount > maxItemDiscount) maxItemDiscount = discount;

      if (discount > limit && !violationMessage) {
        const overPt = discount - limit;
        violationMessage = `${item.product || 'Line item'} discount ${discount}% exceeds ceiling limit of ${limit}% by ${overPt} points.`;
      }

      return {
        id: `l-${Date.now()}-${index}`,
        product: item.product || 'Standard Product',
        qty,
        price,
        discount,
        limit
      };
    });

    const overallDiscountPercentage = totalRaw > 0 ? Math.round(((totalRaw - totalDiscounted) / totalRaw) * 100) : 0;

    const riskScore = Number((overallDiscountPercentage * 0.8 + (violationMessage ? 10 : 2)).toFixed(1));
    const riskLevel = riskScore > 15 ? 'HIGH' : riskScore > 8 ? 'MEDIUM' : 'LOW';
    
    let status = requestedStatus || (riskScore > 8 || violationMessage ? 'PENDING_APPROVAL' : 'DRAFT');

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const quoteNumber = `Q-${randomNum}`;

    const newQuote = await Quotation.create({
      quoteNumber,
      customerName,
      customerTier,
      priceList,
      salesRep,
      totalAmount: Math.round(totalDiscounted),
      discountPercentage: overallDiscountPercentage,
      riskScore,
      riskLevel,
      status,
      ceilingViolation: violationMessage,
      lineItems: processedLineItems
    });

    if (newQuote.status === 'CONFIRMED') {
      await syncConfirmedQuotationToInvoice(newQuote);
    }

    try {
      const { addRecentActivity } = require('./dashboardController');
      addRecentActivity(
        `${customerName} quotation (${newQuote.quoteNumber}) created — ${status}`,
        'QUOTATION',
        status === 'CONFIRMED' ? '#262B33' : status === 'PENDING_APPROVAL' ? '#B8863B' : '#2F6F5E'
      );
    } catch (e) {
      // Activity logging optional
    }

    res.status(201).json({
      success: true,
      message: status === 'APPROVED' ? 'Quotation created and auto-approved!' : 'Quotation saved successfully.',
      data: newQuote
    });
  } catch (error) {
    console.error('Create quotation error:', error);
    res.status(500).json({ success: false, message: 'Failed to create quotation' });
  }
};

// @desc Update quotation status or line items in DB
// @route PATCH /api/quotations/:id/status
// @access Private
const updateQuotationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note, lineItems, customerName, priceList } = req.body;

    let quote;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      quote = await Quotation.findById(id);
    }
    if (!quote) {
      quote = await Quotation.findOne({ quoteNumber: { $regex: new RegExp(`^${id}$`, 'i') } });
    }

    if (!quote) {
      return res.status(404).json({ success: false, message: 'Quotation not found' });
    }

    if (status) quote.status = status;
    if (note) quote.managerNote = note;
    if (customerName) quote.customerName = customerName;
    if (priceList) quote.priceList = priceList;

    if (lineItems && Array.isArray(lineItems)) {
      quote.lineItems = lineItems;
      let totalRaw = 0;
      let totalDiscounted = 0;
      lineItems.forEach((item) => {
        const p = Number(item.price) || 0;
        const q = Number(item.qty) || 1;
        const d = Number(item.discount) || 0;
        totalRaw += p * q;
        totalDiscounted += p * q * (1 - d / 100);
      });
      quote.totalAmount = Math.round(totalDiscounted);
    }

    await quote.save();

    if (quote.status === 'CONFIRMED') {
      await syncConfirmedQuotationToInvoice(quote);
    }

    try {
      const { addRecentActivity } = require('./dashboardController');
      addRecentActivity(
        `Quote ${quote.quoteNumber} updated (${status || 'Saved'})`,
        'QUOTATION',
        '#B8863B'
      );
    } catch (e) {
      // Ignore
    }

    res.json({
      success: true,
      message: `Quotation updated successfully!`,
      data: quote
    });
  } catch (error) {
    console.error('Update quotation error:', error);
    res.status(500).json({ success: false, message: 'Failed to update quotation' });
  }
};

// @desc Delete a quotation from DB
// @route DELETE /api/quotations/:id
// @access Private
const deleteQuotation = async (req, res) => {
  try {
    const { id } = req.params;

    let quote;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      quote = await Quotation.findById(id);
    }
    if (!quote) {
      quote = await Quotation.findOne({ quoteNumber: { $regex: new RegExp(`^${id}$`, 'i') } });
    }
    if (!quote) {
      quote = await Quotation.findOne({ _id: id });
    }

    if (!quote) {
      return res.status(404).json({ success: false, message: 'Quotation not found' });
    }

    const deletedQuoteNumber = quote.quoteNumber;
    const deletedIdStr = quote._id.toString();

    // 1. Delete from MongoDB collection
    await Quotation.deleteOne({ _id: quote._id });

    // 2. Delete corresponding invoice if any
    await Invoice.deleteOne({ orderRef: deletedQuoteNumber });

    // 3. Sync with approvalController approvalsStore if present
    try {
      const { approvalsStore } = require('./approvalController');
      const appIdx = approvalsStore.findIndex(
        (a) => String(a._id) === String(deletedIdStr) || String(a._id) === String(id) || a.quoteNumber === deletedQuoteNumber
      );
      if (appIdx !== -1) {
        approvalsStore.splice(appIdx, 1);
      }
    } catch (e) {
      // Ignore
    }

    // 4. Log activity
    try {
      const { addRecentActivity } = require('./dashboardController');
      addRecentActivity(`Quotation ${deletedQuoteNumber} deleted`, 'QUOTATION', '#9E2A2B');
    } catch (e) {
      // Ignore
    }

    res.json({
      success: true,
      message: `Quotation ${deletedQuoteNumber} deleted successfully!`,
      data: { id: deletedIdStr, quoteNumber: deletedQuoteNumber }
    });
  } catch (error) {
    console.error('Delete quotation error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete quotation' });
  }
};

module.exports = {
  getQuotations,
  getQuotationById,
  createQuotation,
  updateQuotationStatus,
  deleteQuotation,
  syncConfirmedQuotationToInvoice
};
