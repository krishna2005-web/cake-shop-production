// ===========================================
// Cake Routes
// ===========================================
const express = require('express');
const router = express.Router();
const {
  getCakes,
  getCakeById,
  getFeaturedCakes,
  getRecommendations,
  getCategories,
} = require('../controllers/cakeController');

// Public routes
router.get('/featured', getFeaturedCakes);
router.get('/categories', getCategories);
router.get('/recommend', getRecommendations);
router.get('/', getCakes);
router.get('/:id', getCakeById);

module.exports = router;
