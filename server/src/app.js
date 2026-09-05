const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');

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
