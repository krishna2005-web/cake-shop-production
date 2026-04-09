# 🎂 Sweet Delights — Cake Shop Web Application

A full-stack, production-ready cake shop web application where users can browse cakes, customize orders, chat with an AI assistant, sign in, and make secure payments.

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![Express](https://img.shields.io/badge/Express-4-green) ![MongoDB](https://img.shields.io/badge/MongoDB-8-brightgreen) ![Tailwind](https://img.shields.io/badge/Tailwind-4-blue)

## ✨ Features

- 🎂 **Cake Browsing** — Browse 16+ cakes with filtering, search, and sorting
- 🎨 **Customization** — Choose size, flavor, and add personal messages
- 🛒 **Shopping Cart** — Full cart management with quantity controls
- 💳 **Checkout & Payment** — Multi-step checkout with Stripe integration (demo mode)
- 🔐 **Authentication** — Google OAuth + demo login for testing
- 🤖 **AI Chatbot** — OpenAI-powered assistant with rule-based fallback
- 📦 **Order Tracking** — Real-time order status with tracking timeline
- 🌙 **Dark Mode** — Toggle between light and dark themes
- 📱 **Responsive Design** — Works beautifully on all devices
- ⭐ **AI Recommendations** — Smart cake suggestions based on category

## 🛠 Tech Stack

| Layer       | Technology                         |
|-------------|-----------------------------------|
| Frontend    | React 18, Tailwind CSS 4, Vite    |
| Backend     | Node.js, Express.js               |
| Database    | MongoDB (Mongoose ODM)            |
| Auth        | Google OAuth 2.0 (Passport.js)    |
| Payments    | Stripe (Test Mode)                |
| AI Chatbot  | OpenAI API + Rule-based fallback  |

## 📁 Project Structure

```
cake-shop/
├── client/                    # React Frontend (Vite)
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── cake/          # CakeCard
│   │   │   ├── chatbot/       # ChatWidget
│   │   │   ├── layout/        # Navbar, Footer
│   │   │   └── ui/            # Loader
│   │   ├── context/           # Auth, Cart, Theme contexts
│   │   ├── pages/             # All page components
│   │   ├── services/          # API service layer
│   │   ├── App.jsx            # Root component with routing
│   │   └── index.css          # Global styles
│   └── vite.config.js
│
├── server/                    # Express Backend
│   ├── config/                # DB connection, Passport
│   ├── controllers/           # Business logic
│   ├── middleware/             # Auth, Error handling
│   ├── models/                # Mongoose schemas
│   ├── routes/                # API route definitions
│   ├── seed/                  # Database seed script
│   └── server.js              # Express app entry
│
├── .env                       # Environment variables
├── .env.example               # Template for env vars
└── package.json               # Root scripts
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18+ (https://nodejs.org)
- **MongoDB** running locally OR a MongoDB Atlas URI
  - Local: [Install MongoDB Community](https://www.mongodb.com/try/download/community)
  - Cloud: [Create free Atlas cluster](https://www.mongodb.com/atlas)

### Step 1: Clone & Install

```bash
cd "cake shop"

# Install all dependencies (root + client + server)
npm run install-all
```

### Step 2: Configure Environment

Edit the `.env` file in the root directory:

```env
# Required
MONGODB_URI=mongodb://localhost:27017/cakeshop

# Optional (for Google OAuth)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Optional (for Stripe payments)
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# Optional (for AI chatbot)
OPENAI_API_KEY=your_openai_key
```

> **Note:** The app works fully without any API keys using demo/mock modes!

### Step 3: Seed the Database

```bash
npm run seed
```

This adds 16 cakes to your database with realistic data and images.

### Step 4: Start the App

```bash
npm run dev
```

This starts both the frontend and backend:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

## 🗄 Database Schema

### Users
| Field     | Type    | Description              |
|-----------|---------|--------------------------|
| googleId  | String  | Google OAuth ID          |
| name      | String  | User's display name      |
| email     | String  | Email address (unique)   |
| avatar    | String  | Profile picture URL      |
| role      | String  | `user` or `admin`        |
| isDemo    | Boolean | Demo account flag        |

### Cakes
| Field       | Type     | Description               |
|-------------|----------|---------------------------|
| name        | String   | Cake name                 |
| description | String   | Full description          |
| category    | String   | birthday, wedding, etc.   |
| basePrice   | Number   | Starting price            |
| image       | String   | Image URL                 |
| sizes       | Array    | Available sizes & prices  |
| flavors     | Array    | Available flavors         |
| rating      | Number   | Average rating (0-5)      |
| featured    | Boolean  | Featured on homepage      |

### Cart
| Field    | Type     | Description               |
|----------|----------|---------------------------|
| userId   | ObjectId | Reference to User         |
| items    | Array    | Cart items with customization |

### Orders
| Field           | Type     | Description              |
|-----------------|----------|--------------------------|
| userId          | ObjectId | Reference to User        |
| items           | Array    | Order items              |
| totalAmount     | Number   | Total cost               |
| status          | String   | Order status             |
| paymentStatus   | String   | Payment status           |
| deliveryAddress | Object   | Delivery details         |
| trackingUpdates | Array    | Status change history    |

## 📡 API Endpoints

### Authentication
| Method | Endpoint                      | Description          |
|--------|-------------------------------|----------------------|
| GET    | `/api/auth/google`            | Start Google OAuth   |
| GET    | `/api/auth/google/callback`   | OAuth callback       |
| POST   | `/api/auth/demo-login`        | Demo login           |
| GET    | `/api/auth/me`                | Get current user     |
| POST   | `/api/auth/logout`            | Logout               |

### Cakes
| Method | Endpoint                | Description             |
|--------|-------------------------|-------------------------|
| GET    | `/api/cakes`            | List cakes (with filters) |
| GET    | `/api/cakes/:id`        | Get single cake         |
| GET    | `/api/cakes/featured`   | Get featured cakes      |
| GET    | `/api/cakes/categories` | Get all categories      |
| GET    | `/api/cakes/recommend`  | Get recommendations     |

### Cart (Auth Required)
| Method | Endpoint             | Description         |
|--------|----------------------|---------------------|
| GET    | `/api/cart`           | Get user's cart     |
| POST   | `/api/cart`           | Add item to cart    |
| PUT    | `/api/cart/:itemId`   | Update cart item    |
| DELETE | `/api/cart/:itemId`   | Remove cart item    |
| DELETE | `/api/cart`           | Clear cart          |

### Orders (Auth Required)
| Method | Endpoint                  | Description          |
|--------|---------------------------|----------------------|
| POST   | `/api/orders`             | Create order         |
| GET    | `/api/orders`             | Get user's orders    |
| GET    | `/api/orders/:id`         | Get order details    |
| PUT    | `/api/orders/:id/status`  | Update order status  |

### Payment (Auth Required)
| Method | Endpoint                    | Description             |
|--------|-----------------------------|-------------------------|
| POST   | `/api/payment/create-intent`| Create payment intent   |
| POST   | `/api/payment/confirm`      | Confirm payment         |

### Chatbot
| Method | Endpoint        | Description          |
|--------|-----------------|----------------------|
| POST   | `/api/chatbot`  | Send chat message    |

## 🎨 Features in Detail

### Demo Mode
The app is **fully functional without any API keys**:
- **Auth:** Use "Quick Demo Login" or enter any name/email
- **Payments:** Simulated payment in demo mode
- **Chatbot:** Rule-based responses covering recommendations, pricing, delivery, etc.

### Dark Mode
Click the sun/moon icon in the navbar. Preference is saved in localStorage.

### AI Chatbot
The chatbot responds to questions about:
- 🎂 Cake recommendations
- 💰 Pricing information
- 🎨 Customization options
- 🚗 Delivery details
- 🎈 Birthday/Wedding/Special occasion cakes

## 📝 License

MIT License — feel free to use this project for learning or as a starting point!
