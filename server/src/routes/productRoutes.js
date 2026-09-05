const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getPriceFields,
  updatePriceFields
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');

// Price Fields routes
router.get('/price-fields', getPriceFields);
router.put('/price-fields', protect, updatePriceFields);

// Product CRUD routes
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', protect, createProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;
