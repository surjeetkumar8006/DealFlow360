const express = require('express');
const router = express.Router();
const { getQuotations, getQuotationById, createQuotation, updateQuotationStatus } = require('../controllers/quotationController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getQuotations);
router.get('/:id', protect, getQuotationById);
router.post('/', protect, createQuotation);
router.patch('/:id/status', protect, updateQuotationStatus);

module.exports = router;
