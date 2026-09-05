// Quotation Controller for DealFlow360
// Handles quotation retrieval, creation with multi-tier discount validation, and status updates

let quotationsStore = [
  {
    _id: 'q-1042',
    quoteNumber: 'Q-1042',
    customerName: 'Acme Corp',
    customerTier: 'Silver',
    salesRep: 'Surjeet Kumar',
    priceList: 'Standard Enterprise 2026',
    totalAmount: 2970,
    discountPercentage: 14,
    riskScore: 18.5,
    riskLevel: 'HIGH',
    status: 'PENDING_APPROVAL',
    ceilingViolation: 'Onsite Setup Service discount 18% exceeds line limit ceiling of 10% by 8 points.',
    lineItems: [
      { id: 'l-1', product: 'Laptop Pro 14', qty: 2, price: 1200, discount: 12, limit: 15 },
      { id: 'l-2', product: 'Onsite Setup Service', qty: 1, price: 450, discount: 18, limit: 10 },
      { id: 'l-3', product: 'Extended Warranty', qty: 1, price: 180, discount: 10, limit: 15 }
    ],
    createdAt: new Date().toISOString()
  },
  {
    _id: 'q-1001',
    quoteNumber: 'Q-1001',
    customerName: 'Acme Corp',
    customerTier: 'Silver',
    salesRep: 'Surjeet Kumar',
    priceList: 'Standard Enterprise 2026',
    totalAmount: 12400,
    discountPercentage: 8,
    riskScore: 4.2,
    riskLevel: 'LOW',
    status: 'DRAFT',
    ceilingViolation: null,
    lineItems: [
      { id: 'l-10', product: 'Cloud Workstation License (Monthly)', qty: 10, price: 1240, discount: 8, limit: 15 }
    ],
    createdAt: new Date().toISOString()
  },
  {
    _id: 'q-1002',
    quoteNumber: 'Q-1002',
    customerName: 'Delta LLC',
    customerTier: 'Bronze',
    salesRep: 'Rahul Sharma',
    priceList: 'Standard Retail 2026',
    totalAmount: 3200,
    discountPercentage: 4,
    riskScore: 2.1,
    riskLevel: 'LOW',
    status: 'DRAFT',
    ceilingViolation: null,
    lineItems: [
      { id: 'l-11', product: 'Standard Support Package', qty: 1, price: 3200, discount: 4, limit: 5 }
    ],
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    _id: 'q-1003',
    quoteNumber: 'Q-1003',
    customerName: 'Beta Industries',
    customerTier: 'Gold',
    salesRep: 'Rahul Sharma',
    priceList: 'Enterprise Partner 2026',
    totalAmount: 28900,
    discountPercentage: 18,
    riskScore: 18.5,
    riskLevel: 'HIGH',
    status: 'PENDING_APPROVAL',
    ceilingViolation: 'Setup Service discount given is 18% (Allowed Gold tier ceiling is 15%). Exceeds threshold by 3 points.',
    lineItems: [
      { id: 'l-12', product: 'Enterprise Server Node', qty: 1, price: 15000, discount: 15, limit: 15 },
      { id: 'l-13', product: 'Dedicated Migration Service', qty: 1, price: 13900, discount: 18, limit: 10 }
    ],
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    _id: 'q-1004',
    quoteNumber: 'Q-1004',
    customerName: 'Nova Retail',
    customerTier: 'Gold',
    salesRep: 'Priya Verma',
    priceList: 'Standard Retail 2026',
    totalAmount: 9750,
    discountPercentage: 10,
    riskScore: 5.5,
    riskLevel: 'LOW',
    status: 'APPROVED',
    ceilingViolation: null,
    lineItems: [
      { id: 'l-14', product: 'POS Hardware Terminal', qty: 5, price: 1950, discount: 10, limit: 15 }
    ],
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    _id: 'q-1005',
    quoteNumber: 'Q-1005',
    customerName: 'Zenith Co',
    customerTier: 'Silver',
    salesRep: 'Surjeet Kumar',
    priceList: 'Standard Enterprise 2026',
    totalAmount: 15300,
    discountPercentage: 12,
    riskScore: 11.2,
    riskLevel: 'MEDIUM',
    status: 'NEGOTIATION',
    ceilingViolation: 'Portal negotiation active: Customer requested 12% discount.',
    lineItems: [
      { id: 'l-15', product: 'Storage Array Appliance', qty: 2, price: 7650, discount: 12, limit: 10 }
    ],
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    _id: 'q-1006',
    quoteNumber: 'Q-1006',
    customerName: 'Orion Ltd',
    customerTier: 'Gold',
    salesRep: 'Priya Verma',
    priceList: 'Enterprise Partner 2026',
    totalAmount: 41000,
    discountPercentage: 15,
    riskScore: 9.8,
    riskLevel: 'MEDIUM',
    status: 'CONFIRMED',
    ceilingViolation: null,
    lineItems: [
      { id: 'l-16', product: 'Data Center Infrastructure Bundle', qty: 1, price: 41000, discount: 15, limit: 15 }
    ],
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString()
  }
];

// @desc Get all quotations
// @route GET /api/quotations
// @access Private
const getQuotations = async (req, res) => {
  try {
    res.json({
      success: true,
      count: quotationsStore.length,
      data: quotationsStore
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch quotations' });
  }
};

// @desc Get single quotation by ID
// @route GET /api/quotations/:id
// @access Private
const getQuotationById = async (req, res) => {
  try {
    const { id } = req.params;
    const quotation = quotationsStore.find((q) => q._id === id || q.quoteNumber.toLowerCase() === id.toLowerCase());

    if (!quotation) {
      // Fallback to Q-1042 default wireframe quote
      return res.json({ success: true, data: quotationsStore[0] });
    }

    res.json({ success: true, data: quotation });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch quotation details' });
  }
};

// @desc Create a new quotation with automated discount governance evaluation
// @route POST /api/quotations
// @access Private
const createQuotation = async (req, res) => {
  try {
    const { customerName, customerTier = 'Bronze', priceList = 'Standard 2026', lineItems = [], salesRep = 'Sales Rep' } = req.body;

    if (!customerName || lineItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Customer name and line items are required' });
    }

    const tierLimits = { Bronze: 5, Silver: 10, Gold: 15 };
    const allowedLimit = tierLimits[customerTier] || 5;

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
    const status = riskScore > 8 || violationMessage ? 'PENDING_APPROVAL' : 'DRAFT';

    const newQuote = {
      _id: `q-${Date.now()}`,
      quoteNumber: `Q-${Math.floor(1000 + Math.random() * 9000)}`,
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
      lineItems: processedLineItems,
      createdAt: new Date().toISOString()
    };

    quotationsStore.unshift(newQuote);

    const { addRecentActivity } = require('./dashboardController');
    addRecentActivity(
      `${customerName} quotation (${newQuote.quoteNumber}) created — ${status === 'PENDING_APPROVAL' ? 'Pending Approval' : 'Draft'}`,
      'QUOTATION',
      status === 'PENDING_APPROVAL' ? '#B8863B' : '#2F6F5E'
    );

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

// @desc Update quotation status or line items
// @route PATCH /api/quotations/:id/status
// @access Private
const updateQuotationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note, lineItems, customerName, priceList } = req.body;

    const quoteIndex = quotationsStore.findIndex((q) => q._id === id || q.quoteNumber.toLowerCase() === id.toLowerCase());
    if (quoteIndex === -1) {
      return res.status(404).json({ success: false, message: 'Quotation not found' });
    }

    if (status) quotationsStore[quoteIndex].status = status;
    if (note) quotationsStore[quoteIndex].managerNote = note;
    if (customerName) quotationsStore[quoteIndex].customerName = customerName;
    if (priceList) quotationsStore[quoteIndex].priceList = priceList;

    if (lineItems && Array.isArray(lineItems)) {
      quotationsStore[quoteIndex].lineItems = lineItems;
      let totalRaw = 0;
      let totalDiscounted = 0;
      lineItems.forEach((item) => {
        const p = Number(item.price) || 0;
        const q = Number(item.qty) || 1;
        const d = Number(item.discount) || 0;
        totalRaw += p * q;
        totalDiscounted += p * q * (1 - d / 100);
      });
      quotationsStore[quoteIndex].totalAmount = Math.round(totalDiscounted);
    }

    const { addRecentActivity } = require('./dashboardController');
    addRecentActivity(
      `Quote ${quotationsStore[quoteIndex].quoteNumber} updated (${status || 'Saved'})`,
      'QUOTATION',
      '#B8863B'
    );

    res.json({
      success: true,
      message: `Quotation updated successfully!`,
      data: quotationsStore[quoteIndex]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update quotation' });
  }
};

module.exports = {
  getQuotations,
  getQuotationById,
  createQuotation,
  updateQuotationStatus,
  quotationsStore
};
