const Customer = require('../models/Customer');

// @desc Get all customers
// @route GET /api/customers
// @access Private
const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ name: 1 });
    res.json({
      success: true,
      count: customers.length,
      data: customers
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch customers' });
  }
};

// @desc Create a new customer
// @route POST /api/customers
// @access Private
const createCustomer = async (req, res) => {
  try {
    const { name, email, companyName, tier, phone, address, creditLimit } = req.body;

    if (!name || !companyName) {
      return res.status(400).json({ success: false, message: 'Name and Company Name are required' });
    }

    const customer = await Customer.create({
      name,
      email: email || `${name.toLowerCase().replace(/\s+/g, '')}@example.com`,
      companyName,
      tier: tier || 'Gold',
      phone: phone || '',
      address: address || '',
      creditLimit: creditLimit || 50000
    });

    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: customer
    });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ success: false, message: 'Failed to create customer' });
  }
};

module.exports = {
  getCustomers,
  createCustomer
};
