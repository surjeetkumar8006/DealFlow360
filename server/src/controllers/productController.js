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
    const mongoProducts = await Product.find().catch(() => null);
    if (mongoProducts && mongoProducts.length > 0) {
      const formatted = mongoProducts.map((doc) => {
        const obj = doc.toObject();
        return {
          ...obj,
          id: obj._id ? obj._id.toString() : obj.id,
          _id: obj._id ? obj._id.toString() : obj.id,
          price: obj.price || (obj.listPrice ? `$${obj.listPrice}` : '$100'),
          quantityOnHand: obj.quantityOnHand !== undefined ? obj.quantityOnHand : 50,
          tax: obj.tax || (obj.taxRate ? `${obj.taxRate}%` : '15%'),
          unit: obj.unit || 'Each',
          status: obj.status || 'Active',
          variants: obj.variants || '-'
        };
      });

      // Merge any new in-memory products created in fallback mode
      for (const storeProd of productsStore) {
        if (!formatted.some(fp => fp.name.toLowerCase() === storeProd.name.toLowerCase())) {
          formatted.unshift(storeProd);
        }
      }

      return res.json({ success: true, data: formatted, count: formatted.length });
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
      product = productsStore.find((p) => (p.id && p.id.toString() === id) || (p._id && p._id.toString() === id)) || productsStore[0];
    } else {
      product = product.toObject();
      product.id = product._id.toString();
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
    const { name, category, price, listPrice, unit, tax, status, description, sku, quantityOnHand = 50 } = req.body;
    const parsedPrice = price || (listPrice ? `$${listPrice}` : '$100');
    const parsedListPrice = Number(listPrice) || Number(String(price).replace(/[^0-9.]/g, '')) || 100;
    const parsedStock = Number(quantityOnHand) !== undefined && !isNaN(Number(quantityOnHand)) ? Number(quantityOnHand) : 50;

    const newProd = {
      id: `p-${Date.now()}`,
      _id: `p-${Date.now()}`,
      name: name || 'New Product',
      sku: sku || `SKU-${Date.now()}`,
      category: category || 'Hardware',
      variants: '-',
      price: parsedPrice,
      listPrice: parsedListPrice,
      costPrice: parsedListPrice * 0.6,
      unit: unit || 'Each',
      tax: tax || '15%',
      status: status || 'Active',
      description: description || '',
      isSubscription: category === 'Subscription',
      recurring: 'Monthly',
      quantityOnHand: parsedStock,
      createdAt: new Date().toISOString()
    };
    productsStore.unshift(newProd);

    // Sync with warehouse stock inventory
    try {
      const { stockInventory } = require('./fulfillmentController');
      const existingStock = stockInventory.find(s => s.product.toLowerCase() === newProd.name.toLowerCase());
      if (!existingStock) {
        stockInventory.unshift({
          id: `st-${Date.now()}`,
          warehouse: 'Main Warehouse',
          product: newProd.name,
          inStock: parsedStock,
          reserved: 0,
          available: parsedStock
        });
      } else {
        existingStock.inStock = parsedStock;
        existingStock.available = Math.max(0, parsedStock - existingStock.reserved);
      }
    } catch (e) {
      console.warn('Warehouse stock sync warning:', e.message);
    }

    // Save to Mongo if DB connected
    const mongoDoc = await Product.create({
      name: newProd.name,
      sku: newProd.sku,
      category: newProd.category,
      listPrice: newProd.listPrice,
      costPrice: newProd.costPrice,
      unit: newProd.unit,
      taxRate: Number(String(tax).replace(/[^0-9.]/g, '')) || 15,
      description: newProd.description,
      isSubscription: newProd.isSubscription,
      recurring: newProd.recurring,
      quantityOnHand: newProd.quantityOnHand,
      status: newProd.status,
      variants: newProd.variants,
      price: newProd.price
    }).catch((err) => {
      console.warn('MongoDB Product.create warning:', err.message);
      return null;
    });

    const responseData = mongoDoc ? mongoDoc.toObject() : newProd;
    if (responseData._id) responseData.id = responseData._id.toString();

    res.status(201).json({ success: true, message: 'Product created successfully', data: responseData });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ success: false, message: 'Failed to create product' });
  }
};

// @desc Update product
// @route PUT /api/products/:id
// @access Private
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const targetId = id.toString();

    if (updateData.price && !updateData.listPrice) {
      const num = Number(String(updateData.price).replace(/[^0-9.]/g, ''));
      if (!isNaN(num) && num > 0) updateData.listPrice = num;
    }
    if (updateData.quantityOnHand !== undefined) {
      updateData.quantityOnHand = Number(updateData.quantityOnHand);
    }

    // 1. Update in-memory fallback store
    const index = productsStore.findIndex((p) =>
      (p.id && p.id.toString() === targetId) ||
      (p._id && p._id.toString() === targetId) ||
      (p.name && updateData.name && p.name.toLowerCase() === updateData.name.toLowerCase())
    );

    if (index !== -1) {
      productsStore[index] = { ...productsStore[index], ...updateData };
    }

    // 2. Update MongoDB Document if connected
    let updatedDoc = null;
    if (targetId.match(/^[0-9a-fA-F]{24}$/)) {
      updatedDoc = await Product.findByIdAndUpdate(targetId, updateData, { new: true }).catch(() => null);
    } else {
      updatedDoc = await Product.findOneAndUpdate(
        { $or: [{ sku: targetId }, { name: updateData.name || '' }] },
        updateData,
        { new: true }
      ).catch(() => null);
    }

    const finalProduct = updatedDoc ? updatedDoc.toObject() : (index !== -1 ? productsStore[index] : { ...updateData, _id: targetId, id: targetId });
    if (finalProduct._id) finalProduct.id = finalProduct._id.toString();

    // 3. Sync update to warehouse stock inventory
    try {
      const { addRecentActivity } = require('./dashboardController');
      const prodName = updateData.name || finalProduct.name;
      const stockItem = stockInventory.find(s => s.product.toLowerCase() === prodName.toLowerCase() || s.id === targetId);
      if (stockItem) {
        if (updateData.name) stockItem.product = updateData.name;
        if (updateData.quantityOnHand !== undefined) {
          stockItem.inStock = Number(updateData.quantityOnHand);
          stockItem.available = Math.max(0, stockItem.inStock - stockItem.reserved);
          addRecentActivity(`Warehouse stock updated for ${prodName} (Qty: ${stockItem.inStock})`, 'INVENTORY', '#262B33');
        }
      } else if (updateData.name || updateData.listPrice) {
        addRecentActivity(`Product Details updated for ${prodName}`, 'GENERAL', '#2F6F5E');
      }
    } catch (e) {
      // Ignore
    }

    res.json({
      success: true,
      message: `Product "${finalProduct.name || 'item'}" updated successfully!`,
      data: finalProduct
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ success: false, message: 'Failed to update product' });
  }
};

// @desc Delete product
// @route DELETE /api/products/:id
// @access Private
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const targetId = id.toString();

    let deletedName = '';
    const targetProd = productsStore.find((p) => (p.id && p.id.toString() === targetId) || (p._id && p._id.toString() === targetId));
    if (targetProd) deletedName = targetProd.name;

    productsStore = productsStore.filter((p) => (p.id && p.id.toString() !== targetId) && (p._id && p._id.toString() !== targetId));

    if (targetId.match(/^[0-9a-fA-F]{24}$/)) {
      await Product.findByIdAndDelete(targetId).catch(() => null);
    } else if (deletedName) {
      await Product.findOneAndDelete({ name: deletedName }).catch(() => null);
    }

    // Sync with warehouse stock
    try {
      const { stockInventory } = require('./fulfillmentController');
      if (deletedName) {
        const stockIdx = stockInventory.findIndex(s => s.product.toLowerCase() === deletedName.toLowerCase());
        if (stockIdx !== -1) {
          stockInventory.splice(stockIdx, 1);
        }
      }
    } catch (e) {
      // Ignore
    }

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
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
