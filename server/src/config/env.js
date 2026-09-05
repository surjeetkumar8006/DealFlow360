const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dealflow360',
  JWT_SECRET: process.env.JWT_SECRET || 'dealflow360_super_secret_jwt_key_2026',
  NODE_ENV: process.env.NODE_ENV || 'development'
};
