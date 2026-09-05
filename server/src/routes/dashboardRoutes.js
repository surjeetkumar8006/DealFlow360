const express = require('express');
const router = express.Router();
const { getDashboardStats, getReportsAnalytics, getDealHealthStats, processDealHealthAction } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

router.get('/stats', protect, getDashboardStats);
router.get('/reports', getReportsAnalytics);
router.get('/deal-health', getDealHealthStats);
router.post('/deal-health/action', protect, processDealHealthAction);

module.exports = router;
