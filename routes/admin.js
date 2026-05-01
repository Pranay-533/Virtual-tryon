// routes/admin.js
const express = require('express');
const db = require('../models/db');
const { authMiddleware, requireRole } = require('../middleware/auth');
const router = express.Router();

// GET /api/admin/users
router.get('/users', authMiddleware, requireRole('admin'), (req, res) => {
  const users = db.users.map(({ password, ...u }) => u);
  res.json(users);
});

// GET /api/admin/pending
router.get('/pending', authMiddleware, requireRole('admin'), (req, res) => {
  const pending = db.users
    .filter(u => u.status === 'pending')
    .map(({ password, ...u }) => u);
  res.json(pending);
});

// PUT /api/admin/users/:id/approve
router.put('/users/:id/approve', authMiddleware, requireRole('admin'), (req, res) => {
  const user = db.users.find(u => u.id == req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.status = 'approved';
  const { password, ...safeUser } = user;
  res.json({ message: 'User approved', user: safeUser });
});

// PUT /api/admin/users/:id/reject
router.put('/users/:id/reject', authMiddleware, requireRole('admin'), (req, res) => {
  const user = db.users.find(u => u.id == req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.status = 'rejected';
  const { password, ...safeUser } = user;
  res.json({ message: 'User rejected', user: safeUser });
});

// GET /api/admin/stats
router.get('/stats', authMiddleware, requireRole('admin'), (req, res) => {
  res.json({
    totalUsers: db.users.length,
    consumers: db.users.filter(u => u.role === 'consumer').length,
    retailers: db.users.filter(u => u.role === 'retailer').length,
    designers: db.users.filter(u => u.role === 'designer').length,
    pending: db.users.filter(u => u.status === 'pending').length,
    totalProducts: db.products.length,
  });
});

module.exports = router;
