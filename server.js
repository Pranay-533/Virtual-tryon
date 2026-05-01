// server.js — Virtual Try-On Backend
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/orders', require('./routes/orders'));

// Page routes — serve HTML pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'public', 'register.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'public', 'dashboard.html')));
app.get('/catalog', (req, res) => res.sendFile(path.join(__dirname, 'public', 'catalog.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));
app.get('/cart', (req, res) => res.sendFile(path.join(__dirname, 'public', 'cart.html')));
app.get('/checkout', (req, res) => res.sendFile(path.join(__dirname, 'public', 'checkout.html')));
app.get('/order-confirmation', (req, res) => res.sendFile(path.join(__dirname, 'public', 'checkout.html')));
app.get('/my-orders', (req, res) => res.sendFile(path.join(__dirname, 'public', 'orders.html')));

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`\n🚀 Virtual Try-On Server running at http://localhost:${PORT}`);
    console.log(`\n📋 Demo Credentials:`);
    console.log(`   Admin:    admin@tryon.com     / admin123`);
    console.log(`   Retailer: retailer@tryon.com  / retailer123`);
    console.log(`   Consumer: consumer@tryon.com  / consumer123\n`);
  });
}

module.exports = app;
