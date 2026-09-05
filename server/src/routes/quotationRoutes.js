const express = require('express');
const router = express.Router();
const { getQuotations, getQuotationById, createQuotation, updateQuotationStatus, deleteQuotation } = require('../controllers/quotationController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getQuotations);
router.get('/:id', protect, getQuotationById);
router.post('/', protect, createQuotation);
router.patch('/:id/status', protect, updateQuotationStatus);
router.delete('/:id', protect, deleteQuotation);

module.exports = router;
