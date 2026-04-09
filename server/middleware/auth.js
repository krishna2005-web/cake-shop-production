// ===========================================
// Authentication Middleware
// ===========================================

/**
 * Middleware to check if user is authenticated.
 * Works with both Passport sessions and demo auth.
 */
const isAuthenticated = (req, res, next) => {
  // Check for Passport session auth
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  // Check for demo auth (session-based)
  if (req.session && req.session.userId) {
    req.user = { _id: req.session.userId, id: req.session.userId };
    return next();
  }

  return res.status(401).json({
    success: false,
    message: 'Please log in to access this resource',
  });
};

/**
 * Middleware to check if user is admin.
 */
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Admin access required',
  });
};

module.exports = { isAuthenticated, isAdmin };
