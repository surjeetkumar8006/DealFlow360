const express = require('express');
const router = express.Router();
const {
  getFulfillmentStock,
  getOrdersAwaitingFulfillment,
  getFulfillmentOrderById,
  allocateFulfillmentOrder
} = require('../controllers/fulfillmentController');
const { protect } = require('../middleware/auth');

router.get('/stock', protect, getFulfillmentStock);
router.get('/orders', protect, getOrdersAwaitingFulfillment);
router.get('/orders/:id', protect, getFulfillmentOrderById);
router.post('/orders/:id/allocate', protect, allocateFulfillmentOrder);

module.exports = router;
