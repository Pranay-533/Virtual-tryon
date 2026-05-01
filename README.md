# FitMirror — Virtual Try-On Platform

## Quick Start

```bash
cd virtual-tryon
npm install
node server.js
```

Then open: http://localhost:3000

---

## Demo Credentials

| Role     | Email                  | Password     |
|----------|------------------------|--------------|
| Admin    | admin@tryon.com        | admin123     |
| Retailer | retailer@tryon.com     | retailer123  |
| Consumer | consumer@tryon.com     | consumer123  |

---

## Pages

| URL          | Description                        |
|--------------|------------------------------------|
| `/`          | Landing page                       |
| `/login`     | Sign in                            |
| `/register`  | 4-step registration (3 roles)      |
| `/catalog`   | Product catalog with filters       |
| `/dashboard` | Consumer / Retailer dashboard      |
| `/admin`     | Admin panel (admin only)           |

---

## API Endpoints

### Auth
- `POST /api/auth/register` — Register user
- `POST /api/auth/login` — Login
- `GET  /api/auth/me` — Get current user (auth required)

### Products
- `GET    /api/products` — List products (supports ?category=&style=&size=&search=)
- `GET    /api/products/:id` — Single product
- `POST   /api/products` — Add product (retailer/designer/admin)
- `PUT    /api/products/:id` — Update product
- `DELETE /api/products/:id` — Delete product

### Admin
- `GET /api/admin/stats` — Platform stats (admin only)
- `GET /api/admin/users` — All users (admin only)
- `GET /api/admin/pending` — Pending approvals (admin only)
- `PUT /api/admin/users/:id/approve` — Approve user
- `PUT /api/admin/users/:id/reject` — Reject user

---

## Project Structure

```
virtual-tryon/
├── server.js              # Express server + routes
├── models/
│   └── db.js              # In-memory DB (replace with MongoDB)
├── middleware/
│   └── auth.js            # JWT auth middleware
├── routes/
│   ├── auth.js            # Auth routes
│   ├── products.js        # Product routes
│   └── admin.js           # Admin routes
└── public/
    ├── index.html         # Landing page
    ├── login.html         # Login page
    ├── register.html      # Registration (4 steps)
    ├── catalog.html       # Product catalog + try-on
    ├── dashboard.html     # User dashboard
    ├── admin.html         # Admin panel
    └── css/
        └── style.css      # Shared styles
```

---

## To Connect a Real Database (MongoDB example)

Replace `models/db.js` with:

```js
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/fitmirror');
// Define User, Product schemas...
```

Then update routes to use `await User.findOne(...)` etc.
