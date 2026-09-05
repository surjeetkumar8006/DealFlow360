const jwt = require('jsonwebtoken');
const User = require('../models/User');
const env = require('../config/env');

const generateToken = (id) => {
  return jwt.sign({ id }, env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc Register new user
// @route POST /api/auth/register
// @access Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, companyName } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Default public signup role to customer for security, unless customer/sales_rep is specified
    let assignedRole = role ? role.toLowerCase() : 'customer';
    // Prevent unauthenticated users from signing up as admin/manager freely
    if (['admin', 'sales_manager', 'finance'].includes(assignedRole)) {
      assignedRole = 'customer';
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: assignedRole,
      companyName: companyName || ''
    });

    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      companyName: user.companyName,
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Login user & get JWT token
// @route POST /api/auth/login
// @access Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter both email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials: User not found' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials: Password incorrect' });
    }

    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      companyName: user.companyName,
      avgHistoricalDiscount: user.avgHistoricalDiscount,
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get current user profile
// @route GET /api/auth/me
// @access Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Seed initial demo accounts for Hackathon presentation
// @route POST /api/auth/seed-demo
// @access Public
const seedDemoAccounts = async (req, res) => {
  try {
    const demoAccounts = [
      { name: 'Alice Rep', email: 'sales@dealflow360.com', password: 'password123', role: 'sales_rep', companyName: 'DealFlow Sales Team' },
      { name: 'Marcus Manager', email: 'manager@dealflow360.com', password: 'password123', role: 'sales_manager', companyName: 'DealFlow Executive' },
      { name: 'Fiona Finance', email: 'finance@dealflow360.com', password: 'password123', role: 'finance', companyName: 'DealFlow Finance' },
      { name: 'Adam Admin', email: 'admin@dealflow360.com', password: 'password123', role: 'admin', companyName: 'DealFlow HQ' },
      { name: 'Acme Corp (Client)', email: 'customer@example.com', password: 'password123', role: 'customer', companyName: 'Acme Industries', tier: 'GOLD' }
    ];

    const results = [];
    for (const account of demoAccounts) {
      let existing = await User.findOne({ email: account.email });
      if (!existing) {
        existing = await User.create(account);
      }
      results.push({
        name: existing.name,
        email: existing.email,
        role: existing.role
      });
    }

    res.json({ message: 'Demo accounts ready!', accounts: results });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  seedDemoAccounts
};
