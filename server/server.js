// ===========================================
// Express Server - Main Entry Point
// ===========================================
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const express = require('express');
const session = require('express-session');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const passport = require('./config/passport');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// ===========================================
// Connect to Database
// ===========================================
connectDB();

// ===========================================
// Middleware
// ===========================================
app.set('trust proxy', 1); // Trust first proxy (Render load balancers)
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan('dev'));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'cake-shop-secret-key-dev',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  },
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// ===========================================
// Routes
// ===========================================
app.use('/api/auth', require('./routes/auth'));
app.use('/api/cakes', require('./routes/cakes'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/chatbot', require('./routes/chatbot'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '🎂 Cake Shop API is running!',
    timestamp: new Date().toISOString(),
  });
});

// ===========================================
// Error Handler
// ===========================================
app.use(errorHandler);

// ===========================================
// Start Server
// ===========================================
app.listen(PORT, () => {
  console.log(`\n🎂 ================================`);
  console.log(`   Cake Shop API Server`);
  console.log(`   Running on: http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🎂 ================================\n`);
});

module.exports = app;
