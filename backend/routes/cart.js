const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get user's cart
router.get('/', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) cart = { items: [] };
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add/update item (requires auth)
router.post('/add', auth, async (req, res) => {
  try {
    const { productId, size, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ msg: 'Product not found' });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const idx = cart.items.findIndex(it => it.product.toString() === productId && it.size === size);
    if (idx > -1) {
      cart.items[idx].quantity = Number(quantity);
    } else {
      cart.items.push({ product: productId, size, quantity });
    }
    await cart.save();
    const populated = await Cart.findById(cart._id).populate('items.product');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove item
router.post('/remove', auth, async (req, res) => {
  try {
    const { productId, size } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.json({ items: [] });
    cart.items = cart.items.filter(it => !(it.product.toString() === productId && it.size === size));
    await cart.save();
    const populated = await Cart.findById(cart._id).populate('items.product');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
