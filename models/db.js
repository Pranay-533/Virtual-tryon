// models/db.js — In-memory database (replace with MongoDB/MySQL in production)

const bcrypt = require('bcryptjs');

const db = {
  users: [],
  products: [],
  tryon_sessions: [],
  orders: [],
  nextId: 1,
};

// Seed admin
(async () => {
  const hash = await bcrypt.hash('admin123', 10);
  db.users.push({
    id: db.nextId++,
    name: 'Admin User',
    email: 'admin@tryon.com',
    password: hash,
    role: 'admin',
    status: 'active',
    createdAt: new Date().toISOString(),
  });

  // Seed retailer
  const rHash = await bcrypt.hash('retailer123', 10);
  db.users.push({
    id: db.nextId++,
    name: 'Fashion Store',
    email: 'retailer@tryon.com',
    password: rHash,
    role: 'retailer',
    status: 'approved',
    brandName: 'Fashion Store',
    website: 'https://fashionstore.com',
    createdAt: new Date().toISOString(),
  });

  // Seed consumer
  const cHash = await bcrypt.hash('consumer123', 10);
  db.users.push({
    id: db.nextId++,
    name: 'Jane Doe',
    email: 'consumer@tryon.com',
    password: cHash,
    role: 'consumer',
    status: 'active',
    measurements: { height: 165, weight: 60, chest: 86, waist: 70, hips: 94, size: 'M' },
    createdAt: new Date().toISOString(),
  });

  // Seed products
  const categories = ['tops', 'bottoms', 'dresses', 'accessories'];
  const styles = ['casual', 'formal', 'sport', 'ethnic'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = ['#e8c4b8', '#b8d4e8', '#c4e8b8', '#e8e8b8', '#d4b8e8', '#f0d0a0'];

  const sampleProducts = [
    { name: 'Linen Relaxed Shirt', category: 'tops', style: 'casual', price: 1299, sizes: ['S','M','L','XL'], color: '#e8d5c4', desc: 'Breathable linen shirt perfect for summer days.', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop' },
    { name: 'Tailored Blazer', category: 'tops', style: 'formal', price: 3499, sizes: ['S','M','L'], color: '#2c3e50', desc: 'Sharp tailored blazer for the modern professional.', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=500&fit=crop' },
    { name: 'Floral Sundress', category: 'dresses', style: 'casual', price: 1899, sizes: ['XS','S','M','L'], color: '#f4a7b9', desc: 'Light floral dress for warm breezy days.', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=500&fit=crop' },
    { name: 'Evening Gown', category: 'dresses', style: 'formal', price: 6999, sizes: ['S','M','L'], color: '#1a1a2e', desc: 'Elegant evening gown with draped silhouette.', image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&h=500&fit=crop' },
    { name: 'Slim Fit Chinos', category: 'bottoms', style: 'casual', price: 1599, sizes: ['S','M','L','XL','XXL'], color: '#c9b99a', desc: 'Versatile chinos that go from desk to weekend.', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=500&fit=crop' },
    { name: 'Pleated Trousers', category: 'bottoms', style: 'formal', price: 2299, sizes: ['S','M','L','XL'], color: '#4a4a4a', desc: 'Classic pleated trousers with a relaxed fit.', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=500&fit=crop' },
    { name: 'Gold Chain Necklace', category: 'accessories', style: 'casual', price: 899, sizes: ['ONE SIZE'], color: '#f5c842', desc: 'Delicate layered gold chain necklace.', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=500&fit=crop' },
    { name: 'Silk Scarf', category: 'accessories', style: 'ethnic', price: 1199, sizes: ['ONE SIZE'], color: '#e8a0a0', desc: 'Hand-painted silk scarf with vibrant motifs.', image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&h=500&fit=crop' },
    { name: 'Athletic Joggers', category: 'bottoms', style: 'sport', price: 1099, sizes: ['XS','S','M','L','XL'], color: '#3a3a3a', desc: 'High-performance joggers with moisture-wicking fabric.', image: 'https://images.unsplash.com/photo-1556906781-9a412961a28c?w=400&h=500&fit=crop' },
    { name: 'Embroidered Kurta', category: 'tops', style: 'ethnic', price: 2499, sizes: ['S','M','L','XL'], color: '#d4a8e0', desc: 'Hand-embroidered kurta with traditional motifs.', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=500&fit=crop' },
    { name: 'Maxi Wrap Skirt', category: 'bottoms', style: 'casual', price: 1399, sizes: ['XS','S','M','L'], color: '#a8d8b0', desc: 'Flowing wrap skirt in lightweight fabric.', image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&h=500&fit=crop' },
    { name: 'Leather Tote Bag', category: 'accessories', style: 'formal', price: 4999, sizes: ['ONE SIZE'], color: '#8B5E3C', desc: 'Structured leather tote with gold hardware.', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=500&fit=crop' },
  ];

  sampleProducts.forEach((p, i) => {
    db.products.push({
      id: db.nextId++,
      ...p,
      retailerId: 2,
      retailerName: 'Fashion Store',
      status: 'active',
      createdAt: new Date().toISOString(),
    });
  });
})();

module.exports = db;
