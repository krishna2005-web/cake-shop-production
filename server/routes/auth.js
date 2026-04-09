// ===========================================
// Auth Routes
// ===========================================
const express = require('express');
const router = express.Router();
const passport = require('passport');
const { demoLogin, getCurrentUser, logout } = require('../controllers/authController');

// Google OAuth routes (only if configured)
router.get('/google', (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID === 'your_google_client_id') {
    return res.status(400).json({
      success: false,
      message: 'Google OAuth is not configured. Use demo login instead.',
    });
  }
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect(process.env.CLIENT_URL || 'http://localhost:5173');
  }
);

// Demo login (for testing without Google OAuth)
router.post('/demo-login', demoLogin);

// Get current user
router.get('/me', getCurrentUser);

// Logout
router.post('/logout', logout);

module.exports = router;
