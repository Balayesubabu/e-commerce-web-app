const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('../models/Product');

async function connect() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/clothingdb';
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
}

async function listSelected() {
  try {
    await connect();
    const names = [
      'Classic White T-Shirt',
      'Blue Denim Jeans',
      'Red Hoodie',
      'Black Leather Jacket',
      'Floral Dress',
      'Kids Graphic Tee',
      'Striped Shirt',
      'Black Skirt'
    ];
    const products = await Product.find({ name: { $in: names } }).select('name image price').lean();
    console.log('Found products:');
    products.forEach(p => console.log(`${p.name} -> ${p.image} (₹${p.price})`));
    process.exit(0);
  } catch (err) {
    console.error('Error verifying seed:', err.message || err);
    process.exit(1);
  }
}

listSelected();
