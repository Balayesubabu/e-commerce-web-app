/**
 * Run: npm run seed
 * Populates 20 products into products collection.
 */
const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('../models/Product');

const products = [
  { name: 'Classic White T-Shirt', description: 'Soft cotton tee', price: 399, image: 'http://localhost:5000/images/classic_white_tshirt.jpg', category: 'Men', sizes: ['S','M','L','XL'] },
  { name: 'Blue Denim Jeans', description: 'Slim fit jeans', price: 1499, image: 'http://localhost:5000/images/blue_denim_jeans.jpg', category: 'Men', sizes: ['M','L','XL'] },
  { name: 'Red Hoodie', description: 'Warm hoodie', price: 999, image: 'http://localhost:5000/images/red_hoodie.jpg', category: 'Women', sizes: ['S','M','L'] },
  { name: 'Black Leather Jacket', description: 'Faux leather', price: 2999, image: 'http://localhost:5000/images/black_leather_jacket.jpg', category: 'Men', sizes: ['M','L','XL'] },
  { name: 'Floral Dress', description: 'Summer dress', price: 1899, image: 'http://localhost:5000/images/floral_dress.jpg', category: 'Women', sizes: ['S','M','L'] },
  { name: 'Kids Graphic Tee', description: 'Fun print', price: 299, image: 'http://localhost:5000/images/kids_graphic_tee.jpg', category: 'Kids', sizes: ['S','M'] },
  { name: 'Striped Shirt', description: 'Casual shirt', price: 699, image: 'http://localhost:5000/images/striped_shirt.jpg', category: 'Men', sizes: ['M','L','XL'] },
  { name: 'Black Skirt', description: 'A-line skirt', price: 899, image: 'http://localhost:5000/images/black_skirt.jpg', category: 'Women', sizes: ['S','M','L'] },
  { name: 'Running Shorts', description: 'Lightweight', price: 499, image: 'https://source.unsplash.com/400x400/?running-shorts,shorts', category: 'Men', sizes: ['M','L'] },
  { name: 'Cozy Sweatpants', description: 'Comfort fit', price: 799, image: 'https://source.unsplash.com/400x400/?sweatpants,cozy', category: 'Women', sizes: ['S','M','L','XL'] },
  { name: 'Denim Jacket', description: 'Classic denim', price: 2199, image: 'https://source.unsplash.com/400x400/?denim-jacket,jacket', category: 'Men', sizes: ['M','L','XL'] },
  { name: 'Kids Hoodie', description: 'Cute hoodie', price: 599, image: 'https://source.unsplash.com/400x400/?kids-hoodie,hoodie', category: 'Kids', sizes: ['S','M'] },
  { name: 'White Sneakers', description: 'Comfort soles', price: 1999, image: 'https://source.unsplash.com/400x400/?white-sneakers,sneakers', category: 'Women', sizes: ['S','M','L'] },
  { name: 'Formal Blazer', description: 'Office wear', price: 3499, image: 'https://source.unsplash.com/400x400/?blazer,formal-blazer', category: 'Men', sizes: ['M','L','XL'] },
  { name: 'Summer Hat', description: 'Sun protection', price: 299, image: 'https://source.unsplash.com/400x400/?summer-hat,hat', category: 'Women', sizes: ['S'] },
  { name: 'Cargo Pants', description: 'Utility pockets', price: 1299, image: 'https://source.unsplash.com/400x400/?cargo-pants,pants', category: 'Men', sizes: ['M','L','XL'] },
  { name: 'Maxi Dress', description: 'Flowy', price: 2199, image: 'https://source.unsplash.com/400x400/?maxi-dress,dress', category: 'Women', sizes: ['S','M','L'] },
  { name: 'Baby Romper', description: 'Soft fabric', price: 399, image: 'https://source.unsplash.com/400x400/?baby-romper,romper', category: 'Kids', sizes: ['S'] },
  { name: 'Sweater Vest', description: 'Layering piece', price: 749, image: 'https://source.unsplash.com/400x400/?sweater-vest,vest', category: 'Men', sizes: ['M','L'] },
  { name: 'Track Jacket', description: 'Sporty', price: 1199, image: 'https://source.unsplash.com/400x400/?track-jacket,jacket', category: 'Women', sizes: ['S','M','L'] }
];

async function connect() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/clothingdb';
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
}

async function start() {
  try {
    await connect();
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log('Seeded products');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

start();
