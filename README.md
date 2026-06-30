# 🛍️ Rwanda Style — Modern E-Commerce Marketplace

> **EWA408510 Final Project** | Academic Year 2025–2026
> 
> A full-stack, production-ready e-commerce platform built for businesses and customers in Rwanda.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-green?style=for-the-badge)](https://rwanda-style.vercel.app)
[![Backend API](https://img.shields.io/badge/Backend%20API-Render-blue?style=for-the-badge)](https://rwanda-style.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge)](https://github.com/wtheophilusn-debug/Rwanda-Style)

---

## 🌐 Live Links

| Service | URL |
|---|---|
| 🖥️ Frontend | https://rwanda-style.vercel.app |
| ⚙️ Backend API | https://rwanda-style.onrender.com |
| 📦 GitHub Repo | https://github.com/wtheophilusn-debug/Rwanda-Style |

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Customer Dashboard](#-customer-dashboard)
- [Admin Dashboard](#-admin-dashboard)
- [Docker](#-docker)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Deployment](#-deployment)
- [Author](#-author)

---

## 📌 Project Overview

Rwanda Style is a modern B2C e-commerce web application designed to help businesses sell products online to customers in Rwanda. The platform provides a complete shopping experience from product browsing to checkout, with a full admin panel for business management.

---

## ✨ Features

### 🛒 Customer Features
- Browse and search products
- Filter by category and price
- Add products to cart
- Place and track orders
- Customer dashboard with order history
- Wishlist management
- Product reviews and ratings
- Saved delivery addresses
- Account settings and profile management

### 🔐 Authentication
- Register / Login / Logout
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes

### 🛠️ Admin Features
- Dashboard overview with charts and revenue stats
- Product management (Add / Edit / Delete)
- Order management with status updates
- Category management
- Customer overview
- Analytics with charts
- Invoice download

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS v4 |
| Backend | Node.js, Express.js v4 |
| Database | MongoDB Atlas |
| Authentication | JWT, bcrypt |
| Image Storage | Cloudinary |
| Charts | Recharts |
| Deployment | Vercel (frontend), Render (backend) |
| DevOps | Docker, Docker Compose, GitHub Actions |

---

## 📁 Project Structure

```
Rwanda-Style/
│
├── 📁 client/                    # React Frontend
│   ├── 📁 public/                # Static assets
│   ├── 📁 src/
│   │   ├── 📁 assets/            # Images and icons
│   │   ├── 📁 components/
│   │   │   ├── 📁 layout/
│   │   │   │   ├── Navbar.jsx    # Top navigation bar
│   │   │   │   └── Footer.jsx    # Footer
│   │   │   ├── 📁 ui/
│   │   │   │   ├── ProductCard.jsx     # Reusable product card
│   │   │   │   └── ProtectedRoute.jsx  # Route guard
│   │   │   ├── 📁 dashboard/     # Customer dashboard components
│   │   │   │   ├── DashboardLayout.jsx
│   │   │   │   ├── DashboardSidebar.jsx
│   │   │   │   └── DashboardTopbar.jsx
│   │   │   └── 📁 admin/         # Admin dashboard components
│   │   │       ├── AdminLayout.jsx
│   │   │       ├── AdminSidebar.jsx
│   │   │       └── AdminTopbar.jsx
│   │   ├── 📁 context/
│   │   │   ├── AuthContext.jsx   # Authentication state
│   │   │   └── CartContext.jsx   # Shopping cart state
│   │   ├── 📁 pages/
│   │   │   ├── Home.jsx          # Homepage with featured products
│   │   │   ├── Products.jsx      # Products listing with search/filter
│   │   │   ├── ProductDetail.jsx # Single product page
│   │   │   ├── Cart.jsx          # Shopping cart
│   │   │   ├── Checkout.jsx      # Order checkout
│   │   │   ├── Login.jsx         # Login page
│   │   │   ├── Register.jsx      # Registration page
│   │   │   ├── Orders.jsx        # Order history
│   │   │   ├── Profile.jsx       # User profile
│   │   │   ├── 📁 dashboard/     # Customer dashboard pages
│   │   │   │   ├── Overview.jsx        # Dashboard home with charts
│   │   │   │   ├── DashboardOrders.jsx # Orders with filters & invoice
│   │   │   │   ├── OrderTracking.jsx   # Visual order tracking
│   │   │   │   ├── DashboardWishlist.jsx
│   │   │   │   ├── DashboardCart.jsx
│   │   │   │   ├── DashboardReviews.jsx
│   │   │   │   ├── SavedAddresses.jsx
│   │   │   │   ├── PaymentMethods.jsx
│   │   │   │   ├── Notifications.jsx
│   │   │   │   └── AccountSettings.jsx
│   │   │   └── 📁 admin/         # Admin dashboard pages
│   │   │       ├── AdminOverview.jsx    # Stats, charts, recent orders
│   │   │       ├── AdminProducts.jsx    # Product CRUD
│   │   │       ├── AdminOrders.jsx      # Order management
│   │   │       ├── AdminCategories.jsx  # Category management
│   │   │       ├── AdminCustomers.jsx   # Customer list
│   │   │       ├── AdminAnalytics.jsx   # Revenue & analytics charts
│   │   │       └── AdminSettings.jsx    # Admin profile settings
│   │   ├── 📁 utils/
│   │   │   └── api.js            # Axios instance with JWT interceptor
│   │   ├── App.jsx               # Main app with all routes
│   │   ├── main.jsx              # React entry point
│   │   └── index.css             # Tailwind CSS import
│   ├── .env                      # Frontend env variables (not committed)
│   ├── vite.config.js            # Vite configuration
│   └── package.json
│
├── 📁 server/                    # Express Backend
│   ├── 📁 config/
│   │   ├── db.js                 # MongoDB connection
│   │   └── cloudinary.js        # Cloudinary configuration
│   ├── 📁 models/
│   │   ├── User.js               # User schema
│   │   ├── Product.js            # Product schema with reviews
│   │   ├── Category.js           # Category schema
│   │   ├── Order.js              # Order schema
│   │   └── Wishlist.js           # Wishlist schema
│   ├── 📁 controllers/
│   │   ├── authController.js     # Register, login, profile
│   │   ├── productController.js  # CRUD + reviews
│   │   ├── orderController.js    # Create, list, update status
│   │   ├── categoryController.js # CRUD categories
│   │   └── wishlistController.js # Toggle wishlist
│   ├── 📁 routes/
│   │   ├── auth.js               # /api/auth/*
│   │   ├── products.js           # /api/products/*
│   │   ├── orders.js             # /api/orders/*
│   │   ├── categories.js         # /api/categories/*
│   │   └── wishlist.js           # /api/wishlist/*
│   ├── 📁 middleware/
│   │   ├── auth.js               # JWT protect + adminOnly
│   │   └── upload.js             # Multer memory storage
│   ├── 📁 utils/
│   │   └── uploadToCloudinary.js # Upload buffer to Cloudinary
│   ├── seed.js                   # Database seed script
│   ├── index.js                  # Express app entry point
│   ├── .env                      # Server env variables (not committed)
│   └── package.json
│
├── 📁 database/
│   └── seed.js                   # Seed script reference
│
├── 📁 docs/                      # Project documentation
├── 📁 screenshots/               # Evidence screenshots
│
├── 📁 .github/
│   └── 📁 workflows/
│       └── ci.yml                # GitHub Actions CI/CD pipeline
│
├── Dockerfile                    # Docker build configuration
├── docker-compose.yml            # Docker Compose services
├── .dockerignore                 # Docker ignore rules
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore rules
├── ENVIRONMENT_CHECKLIST.md      # Dev environment documentation
└── README.md                     # This file
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed:

| Tool | Version | Check |
|---|---|---|
| Node.js LTS | v22.x | `node --version` |
| npm | v10.x | `npm --version` |
| Git | v2.x | `git --version` |
| Docker Desktop | v29.x | `docker --version` |

### 1. Clone the Repository

```bash
git clone https://github.com/wtheophilusn-debug/Rwanda-Style.git
cd Rwanda-Style
```

### 2. Setup Backend

```bash
cd server
npm install
```

Copy the environment file and fill in your credentials:

```bash
cp ../.env.example .env
```

Start the backend server:

```bash
npm run dev
```

Backend runs on: http://localhost:5000

### 3. Setup Frontend

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

Frontend runs on: http://localhost:5173

### 4. Seed the Database

With the backend running, seed sample data:

```bash
cd server
node seed.js
```

This creates:
- 5 categories
- 20 Rwandan products
- 1 admin account

### 5. Run with Docker

```bash
docker compose up --build
```

---

## 🔑 Environment Variables

Copy `.env.example` to `server/.env` and fill in all values:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

> ⚠️ Never commit `.env` to GitHub. It is listed in `.gitignore`.

---

## 📡 API Documentation

### Base URL
- Local: `http://localhost:5000/api`
- Production: `https://rwanda-style.onrender.com/api`

### Authentication Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/auth/register` | Register new user | Public |
| POST | `/auth/login` | Login user | Public |
| GET | `/auth/profile` | Get current user | 🔒 Required |
| PUT | `/auth/profile` | Update profile | 🔒 Required |

### Product Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/products` | Get all products (search, filter, paginate) | Public |
| GET | `/products/:id` | Get single product | Public |
| POST | `/products` | Create product | 🔒 Admin |
| PUT | `/products/:id` | Update product | 🔒 Admin |
| DELETE | `/products/:id` | Delete product | 🔒 Admin |
| POST | `/products/:id/reviews` | Add review | 🔒 Required |

### Order Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/orders` | Create order | 🔒 Required |
| GET | `/orders/my` | Get my orders | 🔒 Required |
| GET | `/orders` | Get all orders | 🔒 Admin |
| PUT | `/orders/:id/status` | Update order status | 🔒 Admin |

### Category Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/categories` | Get all categories | Public |
| POST | `/categories` | Create category | 🔒 Admin |
| DELETE | `/categories/:id` | Delete category | 🔒 Admin |

### Wishlist Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/wishlist` | Get my wishlist | 🔒 Required |
| POST | `/wishlist/:productId` | Toggle product in wishlist | 🔒 Required |

### Query Parameters for Products

```
GET /api/products?search=kitenge&category=<id>&sort=price_asc&page=1&limit=12
```

---

## 👤 Customer Dashboard

Access at: `/dashboard`

Login as a customer then click the user icon in the navbar.

| Page | Route | Description |
|---|---|---|
| Overview | `/dashboard` | Stats, spending chart, recent orders, recommendations |
| My Orders | `/dashboard/orders` | Filter, paginate, view details, download invoice |
| Order Tracking | `/dashboard/tracking` | Visual step-by-step tracking |
| Wishlist | `/dashboard/wishlist` | Saved products |
| Cart | `/dashboard/cart` | Cart management |
| Reviews | `/dashboard/reviews` | Write and view reviews |
| Addresses | `/dashboard/addresses` | Save delivery addresses |
| Payments | `/dashboard/payments` | Cards and mobile money |
| Notifications | `/dashboard/notifications` | Read/unread notifications |
| Settings | `/dashboard/settings` | Profile, password, security |

---

## 🛠️ Admin Dashboard

Access at: `/admin`

**Admin Login:**
- Email: `admin@rwandastyle.com`
- Password: `Admin@1234`

| Page | Route | Description |
|---|---|---|
| Overview | `/admin` | Revenue, orders, charts, recent orders |
| Products | `/admin/products` | Add, edit, delete products with image upload |
| Orders | `/admin/orders` | Manage all orders, update status, download invoices |
| Categories | `/admin/categories` | Add and delete product categories |
| Customers | `/admin/customers` | View all customers with spending data |
| Analytics | `/admin/analytics` | Revenue charts, order status, top products |
| Settings | `/admin/settings` | Admin profile and password |

---

## 🐳 Docker

The application is fully containerized.

### Run with Docker Compose

```bash
docker compose up --build
```

This starts:
- `server` — Express API on port `5000`
- `mongo` — MongoDB on port `27017`

### Stop containers

```bash
docker compose down
```

### Docker files

| File | Purpose |
|---|---|
| `Dockerfile` | Builds the Node.js app image |
| `docker-compose.yml` | Defines server + mongo services |
| `.dockerignore` | Excludes unnecessary files from build |

---

## ⚙️ CI/CD Pipeline

GitHub Actions workflow is configured at `.github/workflows/ci.yml`.

**Triggers:** Push or Pull Request to `main` branch

**Pipeline Steps:**
1. Checkout code
2. Setup Node.js v22
3. Install backend dependencies
4. Install frontend dependencies
5. Build frontend
6. Run backend tests

View workflow runs at: https://github.com/wtheophilusn-debug/Rwanda-Style/actions

---

## 🌍 Deployment

### Frontend — Vercel

- Platform: [Vercel](https://vercel.com)
- Root Directory: `client`
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variable: `VITE_API_URL=https://rwanda-style.onrender.com/api`
- Auto-deploys on every push to `main`

### Backend — Render

- Platform: [Render](https://render.com)
- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `node index.js`
- Auto-deploys on every push to `main`

### Database — MongoDB Atlas

- Cluster: `rwanda-style-cluster`
- Region: AWS Cape Town (`af-south-1`)
- Database: `rwanda_style`

### Images — Cloudinary

- Used for all product image uploads
- Images stored in the `rwanda-style` folder

---

## 🔒 Security

- JWT authentication with 7-day token expiry
- bcrypt password hashing (12 salt rounds)
- Helmet.js HTTP security headers
- CORS configured for allowed origins only
- Environment variables for all secrets
- Admin-only route protection
- Input validation on all API endpoints

---

## 👨‍💻 Author

**Amb. Theophilus Nehemiah**
Academic Year 2025–2026
EWA408510 — E-Commerce and Web Application

---

## 📄 License

This project was developed as a final examination project for EWA408510.
