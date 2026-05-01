// routes/orders.js
const express = require('express');
const db = require('../models/db');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// POST /api/orders — place a new order
router.post('/', authMiddleware, (req, res) => {
  const { items, address, paymentMethod, totalAmount } = req.body;

  if (!items || !items.length) return res.status(400).json({ error: 'Cart is empty' });
  if (!address || !address.fullName || !address.addressLine || !address.city || !address.pincode || !address.phone) {
    return res.status(400).json({ error: 'Complete address is required' });
  }
  if (!paymentMethod) return res.status(400).json({ error: 'Payment method is required' });

  // Validate each item exists
  for (const item of items) {
    const product = db.products.find(p => p.id === item.productId);
    if (!product) return res.status(400).json({ error: `Product ID ${item.productId} not found` });
  }

  // Simulate payment processing
  let paymentStatus = 'pending';
  if (paymentMethod === 'cod') {
    paymentStatus = 'pay_on_delivery';
  } else if (paymentMethod === 'upi') {
    paymentStatus = 'paid'; // simulated
  } else if (paymentMethod === 'card') {
    paymentStatus = 'paid'; // simulated
  }

  const order = {
    id: db.nextId++,
    userId: req.user.id,
    items: items.map(item => {
      const product = db.products.find(p => p.id === item.productId);
      return {
        productId: item.productId,
        name: product.name,
        price: product.price,
        size: item.size,
        quantity: item.quantity || 1,
        image: product.image || null,
        retailerName: product.retailerName,
      };
    }),
    address,
    paymentMethod,
    paymentStatus,
    totalAmount: totalAmount || items.reduce((sum, item) => {
      const product = db.products.find(p => p.id === item.productId);
      return sum + (product ? product.price * (item.quantity || 1) : 0);
    }, 0),
    status: 'confirmed',
    orderedAt: new Date().toISOString(),
  };

  db.orders.push(order);
  res.status(201).json(order);
});

// GET /api/orders — get logged-in user's orders
router.get('/', authMiddleware, (req, res) => {
  const userOrders = db.orders.filter(o => o.userId === req.user.id);
  res.json(userOrders.reverse());
});

// GET /api/orders/:id — get single order
router.get('/:id', authMiddleware, (req, res) => {
  const order = db.orders.find(o => o.id == req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  if (order.userId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  res.json(order);
});

module.exports = router;
