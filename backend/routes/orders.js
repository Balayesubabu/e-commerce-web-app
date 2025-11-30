const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const sendEmail = require('../utils/sendEmail');

// POST /api/orders/checkout
router.post('/checkout', async (req, res) => {
  try {
    const { items: rawItems, customerName, customerEmail, token } = req.body;

    let user = null;
    if (token) {
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const User = require('../models/User');
        user = await User.findById(decoded.id);
      } catch (e) { /* ignore */ }
    }

    let items = [];
    if (rawItems && rawItems.length > 0) {
      for (const it of rawItems) {
        const p = await Product.findById(it.productId);
        if (!p) return res.status(404).json({ msg: 'Product not found' });
        items.push({
          product: p._id,
          name: p.name,
          size: it.size,
          quantity: Number(it.quantity),
          price: p.price
        });
      }
    } else if (user) {
      const cart = await Cart.findOne({ user: user._id }).populate('items.product');
      if (!cart || cart.items.length === 0) return res.status(400).json({ msg: 'Cart empty' });
      items = cart.items.map(it => ({
        product: it.product._id,
        name: it.product.name,
        size: it.size,
        quantity: it.quantity,
        price: it.product.price
      }));
      cart.items = [];
      await cart.save();
    } else {
      return res.status(400).json({ msg: 'No items and not logged in' });
    }

    const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

    const order = new Order({
      user: user ? user._id : null,
      customerName: customerName || (user ? user.name : 'Guest'),
      customerEmail: customerEmail || (user ? user.email : ''),
      items,
      total
    });
    await order.save();

    const html = `
      <h2>Order Confirmation</h2>
      <p>Order ID: ${order._id}</p>
      <p>Order Date: ${order.orderDate}</p>
      <h3>Items</h3>
      <ul>
        ${items.map(it => `<li>${it.name} - Size: ${it.size} - Qty: ${it.quantity} - ₹${it.price}</li>`).join('')}
      </ul>
      <p>Total: ₹${total}</p>
      <p>Thanks for your order!</p>
    `;
    if (order.customerEmail) {
      await sendEmail({ to: order.customerEmail, subject: 'Order Confirmation', html });
    }

    res.json({ orderId: order._id, order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders/my
router.get('/my', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ orderDate: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
