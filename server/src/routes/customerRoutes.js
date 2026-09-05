const express = require('express');
const router = express.Router();
const { getCustomers, createCustomer } = require('../controllers/customerController');

router.route('/')
  .get(getCustomers)
  .post(createCustomer);

module.exports = router;
