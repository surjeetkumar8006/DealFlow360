const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const quotationRoutes = require('./routes/quotationRoutes');
const approvalRoutes = require('./routes/approvalRoutes');
const fulfillmentRoutes = require('./routes/fulfillmentRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();

// Connect to MongoDB Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'ok', message: 'DealFlow360 API Server Operational', timestamp: new Date() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/quotations', quotationRoutes);
app.use('/api/approvals', approvalRoutes);
app.use('/api/fulfillment', fulfillmentRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/products', productRoutes);

// 404 Route Not Found Handler
app.use(notFound);

// Global Error Handler Middleware
app.use(errorHandler);

// Start Express Server
const PORT = env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🚀 DealFlow360 Server running on port ${PORT}`);
  console.log(`Environment: ${env.NODE_ENV}`);
  console.log(`===================================================`);
});

module.exports = app;
