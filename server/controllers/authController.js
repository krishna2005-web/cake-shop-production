// ===========================================
// Auth Controller
// ===========================================
const User = require('../models/User');

/**
 * Demo login - for testing without Google OAuth
 * POST /api/auth/demo-login
 */
const demoLogin = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required',
      });
    }

    // Find or create demo user
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f472b6&color=fff`,
        isDemo: true,
      });
    }

    // Store user in session
    req.session.userId = user._id;

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get current authenticated user
 * GET /api/auth/me
 */
const getCurrentUser = async (req, res) => {
  try {
    let userId = req.user?._id || req.user?.id || req.session?.userId;

    if (!userId) {
      return res.json({ success: true, user: null });
    }

    const user = await User.findById(userId).select('-__v');

    if (!user) {
      return res.json({ success: true, user: null });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Logout user
 * POST /api/auth/logout
 */
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Logout failed' });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });
};

module.exports = { demoLogin, getCurrentUser, logout };
