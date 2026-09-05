const mongoose = require('mongoose');
const env = require('./env');

const connectDB = async () => {
  try {
    console.log(`Connecting to MongoDB...`);
    // Set 8 second timeout for connection attempt
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`MongoDB Atlas / URI connection failed: ${error.message}`);
    console.log(`Fallback: Booting in-memory MongoDB server for seamless operation...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`In-Memory MongoDB Connected: ${conn.connection.host}`);
    } catch (memError) {
      console.error(`Failed to start in-memory MongoDB:`, memError.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
