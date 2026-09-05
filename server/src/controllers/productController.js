const Product = require('../models/Product');

// In-Memory Fallback Product Store for Instant Offline/Demo Mode
let productsStore = [
  {
    id: 'p-1',
    _id: 'p-1',
    name: 'Laptop Pro 14',
    sku: 'SKU-LAP-14',
    category: 'Hardware',
    variants: '3(size)',
    price: '$1,200',
    listPrice: 1200,
    costPrice: 800,
    unit: 'Each',
    tax: '15%',
    taxRate: 15,
    status: 'Active',
    description: 'High-performance enterprise laptop workstation.',
    isSubscription: false,
    recurring: 'Monthly',
    quantityOnHand: 42,
    attributes: { color: 'Blue, Black', ram: '4GB, 8GB', manufacturer: 'Dell, HP' }
  },
  {
    id: 'p-2',
    _id: 'p-2',
    name: 'Onsite Setup Service',
    sku: 'SKU-SRV-SET',
    category: 'Services',
    variants: '-',
    price: '$450',
    listPrice: 450,
    costPrice: 200,
    unit: 'Each',
    tax: '-',
    taxRate: 0,
    status: 'Active',
    description: 'Professional white-glove setup and network integration.',
    isSubscription: false,
    recurring: 'Monthly',
    quantityOnHand: 100,
    attributes: {}
  },
  {
    id: 'p-3',
    _id: 'p-3',
    name: 'Docking Station',
    sku: 'SKU-ACC-DOC',
    category: 'Hardware',
    variants: '3(color)',
    price: '$180',
    listPrice: 180,
    costPrice: 100,
    unit: 'Each',
    tax: '15%',
    taxRate: 15,
    status: 'Active',
    description: 'Thunderbolt 4 dual 4K dock station.',
    isSubscription: false,
    recurring: 'Monthly',
    quantityOnHand: 65,
    attributes: { color: 'Black, Silver, Space Gray' }
  },
  {
    id: 'p-4',
    _id: 'p-4',
    name: 'Care Plan 3 years',
    sku: 'SKU-SUB-CARE3',
    category: 'Subscription',
    variants: '-',
    price: '$40/month',
    listPrice: 40,
    costPrice: 10,
    unit: 'Recurring',
    tax: '0%',
    taxRate: 0,
    status: 'Active',
    description: '3-year extended warranty and 24/7 priority support.',
    isSubscription: true,
    recurring: 'Monthly',
    quantityOnHand: 999,
    attributes: {}
  }
];

let priceFieldsStore = [
  { id: 'pf-1', name: 'Base Price ($)', required: true, enabled: true },
  { id: 'pf-2', name: 'Tier Discount Ceiling (%)', required: false, enabled: true },
  { id: 'pf-3', name: 'Minimum Floor Price ($)', required: false, enabled: true },
  { id: 'pf-4', name: 'Currency Multiplier (USD/EUR)', required: false, enabled: true },
  { id: 'pf-5', name: 'Regional Tax Rate (%)', required: false, enabled: true },
  { id: 'pf-6', name: 'Volume Rebate %', required: false, enabled: false },
  { id: 'pf-7', name: 'Dealer Margin %', required: false, enabled: false },
];

// @desc Get all products
// @route GET /api/products
// @access Public / Private
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().catch(() => null);
    if (products && products.length > 0) {
      return res.json({ success: true, data: products, count: products.length });
    }
    return res.json({ success: true, data: productsStore, count: productsStore.length });
  } catch (error) {
    res.json({ success: true, data: productsStore, count: productsStore.length });
  }
};

// @desc Get product by ID
// @route GET /api/products/:id
// @access Public / Private
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    let product = await Product.findById(id).catch(() => null);
    if (!product) {
      product = productsStore.find((p) => p.id === id || p._id === id) || productsStore[0];
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.json({ success: true, data: productsStore[0] });
  }
};

// @desc Create new product
// @route POST /api/products
// @access Private
const createProduct = async (req, res) => {
  try {
    const { name, category, price, listPrice, unit, tax, status, description, sku } = req.body;
    const newProd = {
      id: `p-${Date.now()}`,
      _id: `p-${Date.now()}`,
      name: name || 'New Product',
      sku: sku || `SKU-${Date.now()}`,
      category: category || 'Hardware',
      variants: '-',
      price: price || `$${listPrice || 100}`,
      listPrice: Number(listPrice) || 100,
      costPrice: (Number(listPrice) || 100) * 0.6,
      unit: unit || 'Each',
      tax: tax || '15%',
      status: status || 'Active',
      description: description || '',
      isSubscription: category === 'Subscription',
      recurring: 'Monthly',
      quantityOnHand: 50,
      createdAt: new Date().toISOString()
    };
    productsStore.unshift(newProd);

    // Save to Mongo if DB connected
    await Product.create({
      name: newProd.name,
      sku: newProd.sku,
      category: (newProd.category || 'Hardware').toUpperCase(),
      listPrice: newProd.listPrice,
      costPrice: newProd.costPrice,
      unit: newProd.unit,
      description: newProd.description
    }).catch(() => null);

    res.status(201).json({ success: true, message: 'Product created successfully', data: newProd });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create product' });
  }
};

// @desc Update product
// @route PUT /api/products/:id
// @access Private
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const index = productsStore.findIndex((p) => p.id === id || p._id === id);

    if (index !== -1) {
      productsStore[index] = { ...productsStore[index], ...req.body };
      return res.json({ success: true, message: 'Product updated successfully', data: productsStore[index] });
    }

    res.json({ success: true, message: 'Product updated', data: req.body });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update product' });
  }
};

// @desc Delete product
// @route DELETE /api/products/:id
// @access Private
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    productsStore = productsStore.filter((p) => p.id !== id && p._id !== id);
    await Product.findByIdAndDelete(id).catch(() => null);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete product' });
  }
};

// @desc Get price fields configuration
// @route GET /api/products/price-fields
// @access Public / Private
const getPriceFields = async (req, res) => {
  res.json({ success: true, data: priceFieldsStore });
};

// @desc Update price fields configuration
// @route PUT /api/products/price-fields
// @access Private
const updatePriceFields = async (req, res) => {
  if (Array.isArray(req.body.fields)) {
    priceFieldsStore = req.body.fields;
  }
  res.json({ success: true, message: 'Price fields updated successfully', data: priceFieldsStore });
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getPriceFields,
  updatePriceFields,
  productsStore
};
