const express = require('express');
const router = express.Router();
const {
  getInvoices,
  getInvoiceById,
  recordInvoicePayment,
  approveInvoice
} = require('../controllers/invoiceController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getInvoices);
router.get('/:id', protect, getInvoiceById);
router.post('/:id/pay', protect, recordInvoicePayment);
router.post('/:id/approve', protect, approveInvoice);

module.exports = router;
