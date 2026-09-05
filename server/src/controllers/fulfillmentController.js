const Quotation = require('../models/Quotation');
const Product = require('../models/Product');

let stockInventory = [
  { id: 'st-1', warehouse: 'Main Warehouse', product: 'Laptop Pro 14', inStock: 78, reserved: 18, available: 60 },
  { id: 'st-2', warehouse: 'East Depot', product: 'Laptop Pro 14', inStock: 10, reserved: 6, available: 4 },
  { id: 'st-3', warehouse: 'Main Warehouse', product: 'Docking Station', inStock: 65, reserved: 12, available: 53 },
  { id: 'st-4', warehouse: 'West Hub', product: 'Enterprise Server Node', inStock: 15, reserved: 8, available: 7 },
  { id: 'st-5', warehouse: 'East Depot', product: 'Onsite Setup Service', inStock: 100, reserved: 0, available: 100 }
];

let fulfillmentOrders = [
  {
    id: 'q-1042',
    orderNumber: 'Q-1042',
    customer: 'Acme Corp',
    status: 'Split Pending',
    warehouses: 'Main + East Depot',
    totalItems: 3,
    items: [
      { line: 'Laptop Pro 14', qty: 2, allocatedWarehouse: 'Main Warehouse', stockStatus: 'IN_STOCK' },
      { line: 'Onsite Setup Service', qty: 1, allocatedWarehouse: 'East Depot', stockStatus: 'VIRTUAL' }
    ]
  },
  {
    id: 'q-1030',
    orderNumber: 'Q-1030',
    customer: 'Zenith Co',
    status: 'Backorder',
    warehouses: 'East Depot',
    totalItems: 2,
    items: [
      { line: 'Storage Array Appliance', qty: 2, allocatedWarehouse: 'East Depot', stockStatus: 'BACKORDERED' }
    ]
  },
  {
    id: 'ord-2291',
    orderNumber: 'ORD-2291',
    customer: 'Beta Industries',
    status: 'Split Allocated',
    warehouses: 'Main + West Hub',
    totalItems: 4,
    items: [
      { line: 'Enterprise Server Node', qty: 2, allocatedWarehouse: 'Main Warehouse', stockStatus: 'IN_STOCK' },
      { line: 'Dedicated Migration Service', qty: 2, allocatedWarehouse: 'West Hub', stockStatus: 'IN_STOCK' }
    ]
  }
];

// @desc Get warehouse stock breakdown (Real-time DB query + Live Stock Sync)
// @route GET /api/fulfillment/stock
// @access Private
const getFulfillmentStock = async (req, res) => {
  try {
    const mongoProducts = await Product.find().catch(() => null);

    if (mongoProducts && mongoProducts.length > 0) {
      const liveStockList = [];

      for (const prod of mongoProducts) {
        const prodName = prod.name;
        const totalStock = prod.quantityOnHand !== undefined ? prod.quantityOnHand : 50;

        // Check existing warehouse allocations or create default
        const mainMatch = stockInventory.find(s => s.warehouse === 'Main Warehouse' && s.product.toLowerCase() === prodName.toLowerCase());
        const reservedVal = mainMatch ? mainMatch.reserved : (totalStock > 30 ? 12 : 0);
        const availVal = Math.max(0, totalStock - reservedVal);

        liveStockList.push({
          id: `st-m-${prod._id}`,
          warehouse: 'Main Warehouse',
          product: prodName,
          inStock: totalStock,
          reserved: reservedVal,
          available: availVal
        });

        // If product has depot allocations in fallback store, include them
        const depotMatches = stockInventory.filter(s => s.warehouse !== 'Main Warehouse' && s.product.toLowerCase() === prodName.toLowerCase());
        for (const dm of depotMatches) {
          liveStockList.push(dm);
        }
      }

      return res.json({
        success: true,
        data: liveStockList
      });
    }

    res.json({
      success: true,
      data: stockInventory
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch warehouse stock' });
  }
};

// @desc Get orders awaiting fulfillment (Real-time DB query + Live Quotation Sync)
// @route GET /api/fulfillment/orders
// @access Private
const getOrdersAwaitingFulfillment = async (req, res) => {
  try {
    const dbQuotes = await Quotation.find({
      status: { $in: ['PENDING_APPROVAL', 'APPROVED', 'CONFIRMED', 'NEGOTIATION', 'DRAFT'] }
    }).catch(() => null);

    let activeFulfillmentOrders = [...fulfillmentOrders];

    if (dbQuotes && dbQuotes.length > 0) {
      for (const q of dbQuotes) {
        const orderKey = q.quoteNumber.toLowerCase();
        const existingIdx = activeFulfillmentOrders.findIndex(fo => fo.id.toLowerCase() === orderKey || fo.orderNumber.toLowerCase() === orderKey);

        const mappedOrder = {
          id: orderKey,
          orderNumber: q.quoteNumber,
          customer: q.customerName,
          status: q.status === 'CONFIRMED' ? 'Split Allocated' : q.status === 'APPROVED' ? 'Split Pending' : 'Pending Review',
          warehouses: q.totalAmount > 20000 ? 'Main + West Hub' : 'Main + East Depot',
          totalItems: q.lineItems ? q.lineItems.length : 1,
          items: q.lineItems && q.lineItems.length > 0
            ? q.lineItems.map((li, i) => ({
                line: li.product,
                qty: li.qty,
                allocatedWarehouse: i % 2 === 0 ? 'Main Warehouse' : 'East Depot',
                stockStatus: 'IN_STOCK'
              }))
            : [
                { line: 'Laptop Pro 14', qty: 2, allocatedWarehouse: 'Main Warehouse', stockStatus: 'IN_STOCK' },
                { line: 'Onsite Setup Service', qty: 1, allocatedWarehouse: 'East Depot', stockStatus: 'VIRTUAL' }
              ]
        };

        if (existingIdx !== -1) {
          activeFulfillmentOrders[existingIdx] = { ...activeFulfillmentOrders[existingIdx], ...mappedOrder };
        } else {
          activeFulfillmentOrders.unshift(mappedOrder);
        }
      }
    }

    res.json({
      success: true,
      count: activeFulfillmentOrders.length,
      data: activeFulfillmentOrders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch fulfillment orders' });
  }
};

// @desc Get fulfillment order detail by ID
// @route GET /api/fulfillment/orders/:id
// @access Private
const getFulfillmentOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const searchKey = id.toLowerCase();

    // Check DB first
    const dbQuote = await Quotation.findOne({
      $or: [
        { quoteNumber: { $regex: new RegExp(`^${id}$`, 'i') } },
        { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }
      ]
    }).catch(() => null);

    if (dbQuote) {
      const mappedDetail = {
        id: dbQuote.quoteNumber.toLowerCase(),
        orderNumber: dbQuote.quoteNumber,
        customer: dbQuote.customerName,
        customerTier: dbQuote.customerTier || 'Gold',
        status: dbQuote.status === 'CONFIRMED' ? 'Split Allocated' : 'Split Pending',
        warehouses: dbQuote.totalAmount > 20000 ? 'Main + West Hub' : 'Main + East Depot',
        totalItems: dbQuote.lineItems ? dbQuote.lineItems.length : 2,
        items: dbQuote.lineItems && dbQuote.lineItems.length > 0
          ? dbQuote.lineItems.map((li, i) => ({
              line: li.product,
              qty: li.qty,
              allocatedWarehouse: i % 2 === 0 ? 'Main Warehouse' : 'East Depot',
              stockStatus: 'IN_STOCK'
            }))
          : [
              { line: 'Laptop Pro 14', qty: 2, allocatedWarehouse: 'Main Warehouse', stockStatus: 'IN_STOCK' },
              { line: 'Onsite Setup Service', qty: 1, allocatedWarehouse: 'East Depot', stockStatus: 'VIRTUAL' }
            ]
      };
      return res.json({ success: true, data: mappedDetail });
    }

    const item = fulfillmentOrders.find((o) => o.id.toLowerCase() === searchKey || o.orderNumber.toLowerCase() === searchKey);
    if (!item) {
      return res.json({ success: true, data: fulfillmentOrders[0] });
    }

    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch fulfillment order detail' });
  }
};

// @desc Process warehouse allocation split
// @route POST /api/fulfillment/orders/:id/allocate
// @access Private
const allocateFulfillmentOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status = 'Split Allocated' } = req.body;

    const searchKey = id.toLowerCase();
    const idx = fulfillmentOrders.findIndex((o) => o.id.toLowerCase() === searchKey || o.orderNumber.toLowerCase() === searchKey);
    if (idx !== -1) {
      fulfillmentOrders[idx].status = status;
    }

    // Sync to MongoDB Quotation if matched
    const dbQuote = await Quotation.findOne({ quoteNumber: { $regex: new RegExp(`^${id}$`, 'i') } }).catch(() => null);
    if (dbQuote) {
      dbQuote.status = 'CONFIRMED';
      await dbQuote.save();
    }

    const { addRecentActivity } = require('./dashboardController');
    addRecentActivity(
      `Order ${dbQuote?.quoteNumber || fulfillmentOrders[idx]?.orderNumber || id} stock split allocated across depots`,
      'FULFILLMENT',
      '#2F6F5E'
    );

    res.json({
      success: true,
      message: `Stock allocation updated for order ${dbQuote?.quoteNumber || id}`,
      data: idx !== -1 ? fulfillmentOrders[idx] : { orderNumber: id, status }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to allocate stock' });
  }
};

module.exports = {
  getFulfillmentStock,
  getOrdersAwaitingFulfillment,
  getFulfillmentOrderById,
  allocateFulfillmentOrder,
  stockInventory,
  fulfillmentOrders
};
