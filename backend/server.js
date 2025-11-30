const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(express.json());

// CORS configuration: allow localhost for dev, and production frontend URL from env
const allowedOrigins = ["http://localhost:3000", "http://localhost:3001"];
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// Serve static files from backend/public (images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint
app.get('/health', (req, res) => {
  try {
    console.log('Health check request received');
    res.json({ status: 'OK' });
  } catch (err) {
    console.error('Health check error:', err);
    res.status(500).json({ error: 'Health check failed' });
  }
});

// Try to connect to DB but don't block
setTimeout(() => {
  try {
    const connectDB = require('./config/db');
    connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/clothingdb').catch(err => {
      console.warn('DB connection error (continuing):', err.message);
    });
  } catch (e) {
    console.warn('DB connection setup error:', e.message);
  }
}, 100);

// Load routes
try {
  app.use('/api/auth', require('./routes/auth'));
  console.log('Auth routes loaded');
} catch (e) {
  console.error('Error loading auth routes:', e.message);
  console.error(e.stack);
}

try {
  app.use('/api/products', require('./routes/products'));
  console.log('Products routes loaded');
} catch (e) {
  console.error('Error loading products routes:', e.message);
  console.error(e.stack);
}

try {
  app.use('/api/cart', require('./routes/cart'));
  console.log('Cart routes loaded');
} catch (e) {
  console.error('Error loading cart routes:', e.message);
  console.error(e.stack);
}

try {
  app.use('/api/orders', require('./routes/orders'));
  console.log('Orders routes loaded');
} catch (e) {
  console.error('Error loading orders routes:', e.message);
  console.error(e.stack);
}

const PORT = process.env.PORT || 5000;

// Start server in a try-catch
try {
  const server = app.listen(PORT, () => {
    console.log(`\n✅ Server started on port ${PORT}`);
    console.log('✅ Server is running and ready for requests\n');
  });

  // Keep server alive
  server.keepAliveTimeout = 65000;
  
  // Add server error handler
  server.on('error', (err) => {
    console.error('Server error:', err);
  });
  
  console.log('Server instance created, listening on port', PORT);
} catch (e) {
  console.error('Failed to start server:', e);
  console.error(e.stack);
}

// Handle errors
process.on('unhandledRejection', (err) => {
  console.error('⚠️ Unhandled Rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('⚠️ Uncaught Exception:', err);
  console.error(err.stack);
  // Don't exit, just log it
});
