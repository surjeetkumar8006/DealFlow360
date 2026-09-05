// Fulfillment Controller for DealFlow360
// Manages warehouse inventory stock levels, split allocation across depots, and backorders

let stockInventory = [
  { id: 'st-1', warehouse: 'Main Warehouse', product: 'Laptop Pro 14', inStock: 40, reserved: 18, available: 22 },
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

// @desc Get warehouse stock breakdown
// @route GET /api/fulfillment/stock
// @access Private
const getFulfillmentStock = async (req, res) => {
  try {
    res.json({
      success: true,
      data: stockInventory
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch warehouse stock' });
  }
};

// @desc Get orders awaiting fulfillment
// @route GET /api/fulfillment/orders
// @access Private
const getOrdersAwaitingFulfillment = async (req, res) => {
  try {
    res.json({
      success: true,
      count: fulfillmentOrders.length,
      data: fulfillmentOrders
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
    const item = fulfillmentOrders.find((o) => o.id.toLowerCase() === id.toLowerCase() || o.orderNumber.toLowerCase() === id.toLowerCase());
    
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

    const idx = fulfillmentOrders.findIndex((o) => o.id.toLowerCase() === id.toLowerCase() || o.orderNumber.toLowerCase() === id.toLowerCase());
    if (idx !== -1) {
      fulfillmentOrders[idx].status = status;
    }

    const { addRecentActivity } = require('./dashboardController');
    addRecentActivity(
      `Order ${fulfillmentOrders[idx]?.orderNumber || id} stock split allocated across depots`,
      'FULFILLMENT',
      '#2F6F5E'
    );

    res.json({
      success: true,
      message: `Stock allocation updated for order ${fulfillmentOrders[idx]?.orderNumber || id}`,
      data: fulfillmentOrders[idx] || fulfillmentOrders[0]
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
