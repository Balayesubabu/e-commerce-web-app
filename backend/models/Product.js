const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String,
  category: { type: String, enum: ['Men','Women','Kids'] },
  sizes: [String]
});

module.exports = mongoose.model('Product', ProductSchema);
