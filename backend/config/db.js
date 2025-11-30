const mongoose = require('mongoose');

let dbConnected = false;

const connectDB = async (mongoURI) => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB connected');
    dbConnected = true;
  } catch (err) {
    console.warn('MongoDB connection failed - server running without DB:', err.message);
    dbConnected = false;
    // Don't exit - let the server run without DB for now
  }
};

module.exports = connectDB;
module.exports.isConnected = () => dbConnected;
