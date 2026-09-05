const express = require('express');
const router = express.Router();
const {
  getSubscriptions,
  getSubscriptionById,
  createSubscriptionPlan,
  updateSubscriptionStatus
} = require('../controllers/subscriptionController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getSubscriptions);
router.get('/:id', protect, getSubscriptionById);
router.post('/', protect, createSubscriptionPlan);
router.post('/:id/status', protect, updateSubscriptionStatus);

module.exports = router;
