const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /api/products
// supports: ?search=&category=&size=&minPrice=&maxPrice=&page=&limit=
router.get('/', async (req, res) => {
  try {
    const { search, category, size, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
    const query = {};
    if (search) query.$or = [
      { name: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') }
    ];
    if (category) query.category = category;
    if (size) query.sizes = size;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Product.find(query).skip(skip).limit(Number(limit)),
      Product.countDocuments(query)
    ]);
    res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ msg: 'Product not found' });
    res.json(p);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
