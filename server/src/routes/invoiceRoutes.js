const express = require('express');
const router = express.Router();
const {
  getInvoices,
  getInvoiceById,
  recordInvoicePayment
} = require('../controllers/invoiceController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getInvoices);
router.get('/:id', protect, getInvoiceById);
router.post('/:id/pay', protect, recordInvoicePayment);

module.exports = router;
