// routes/products.js
const express = require('express');
const db = require('../models/db');
const { authMiddleware, requireRole } = require('../middleware/auth');
const router = express.Router();

// GET /api/products — public, with filters
router.get('/', (req, res) => {
  let products = db.products.filter(p => p.status === 'active');
  const { category, style, size, search, retailerId } = req.query;
  if (category) products = products.filter(p => p.category === category);
  if (style) products = products.filter(p => p.style === style);
  if (size) products = products.filter(p => p.sizes.includes(size));
  if (search) products = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  if (retailerId) products = products.filter(p => p.retailerId == retailerId);
  res.json(products);
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
  const product = db.products.find(p => p.id == req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// POST /api/products — retailer/designer/admin
router.post('/', authMiddleware, requireRole('retailer', 'designer', 'admin'), (req, res) => {
  const { name, category, style, price, sizes, color, desc } = req.body;
  if (!name || !category || !price) return res.status(400).json({ error: 'Missing fields' });
  const user = db.users.find(u => u.id === req.user.id);
  const product = {
    id: db.nextId++,
    name, category, style, price,
    sizes: sizes || ['S','M','L'],
    color: color || '#cccccc',
    desc: desc || '',
    retailerId: req.user.id,
    retailerName: user?.brandName || user?.name,
    status: 'active',
    createdAt: new Date().toISOString(),
  };
  db.products.push(product);
  res.status(201).json(product);
});

// PUT /api/products/:id
router.put('/:id', authMiddleware, requireRole('retailer', 'designer', 'admin'), (req, res) => {
  const idx = db.products.findIndex(p => p.id == req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const product = db.products[idx];
  if (req.user.role !== 'admin' && product.retailerId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
  db.products[idx] = { ...product, ...req.body, id: product.id };
  res.json(db.products[idx]);
});

// DELETE /api/products/:id
router.delete('/:id', authMiddleware, requireRole('retailer', 'designer', 'admin'), (req, res) => {
  const idx = db.products.findIndex(p => p.id == req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  if (req.user.role !== 'admin' && db.products[idx].retailerId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
  db.products.splice(idx, 1);
  res.json({ message: 'Deleted' });
});

module.exports = router;
