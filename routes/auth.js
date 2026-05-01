// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/db');
const { SECRET } = require('../middleware/auth');
const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, brandName, website, measurements } = req.body;
    if (!name || !email || !password || !role) return res.status(400).json({ error: 'Missing required fields' });
    if (db.users.find(u => u.email === email)) return res.status(409).json({ error: 'Email already registered' });

    const hash = await bcrypt.hash(password, 10);
    const user = {
      id: db.nextId++,
      name, email,
      password: hash,
      role,
      status: role === 'consumer' ? 'active' : 'pending',
      createdAt: new Date().toISOString(),
    };
    if (role === 'consumer' && measurements) user.measurements = measurements;
    if (role === 'retailer' || role === 'designer') {
      user.brandName = brandName || '';
      user.website = website || '';
    }
    db.users.push(user);

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, SECRET, { expiresIn: '7d' });
    const { password: _, ...safeUser } = user;
    res.status(201).json({ message: 'Registered successfully', token, user: safeUser });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = db.users.find(u => u.email === email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    if (user.status === 'pending') return res.status(403).json({ error: 'Account pending admin approval' });
    if (user.status === 'rejected') return res.status(403).json({ error: 'Account has been rejected' });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, SECRET, { expiresIn: '7d' });
    const { password: _, ...safeUser } = user;
    res.json({ message: 'Login successful', token, user: safeUser });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/auth/me
router.get('/me', require('../middleware/auth').authMiddleware, (req, res) => {
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { password: _, ...safeUser } = user;
  res.json(safeUser);
});

module.exports = router;
