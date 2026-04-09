// ===========================================
// Cake Controller
// ===========================================
const Cake = require('../models/Cake');

/**
 * Get all cakes with filtering, sorting, and pagination
 * GET /api/cakes
 */
const getCakes = async (req, res) => {
  try {
    const { category, search, sort, page = 1, limit = 12, featured } = req.query;

    // Build filter
    const filter = { available: true };
    if (category && category !== 'all') {
      filter.category = category;
    }
    if (featured === 'true') {
      filter.featured = true;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Build sort
    let sortOption = { createdAt: -1 };
    if (sort === 'price_low') sortOption = { basePrice: 1 };
    if (sort === 'price_high') sortOption = { basePrice: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };
    if (sort === 'name') sortOption = { name: 1 };

    const total = await Cake.countDocuments(filter);
    const cakes = await Cake.find(filter)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: cakes,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get single cake by ID
 * GET /api/cakes/:id
 */
const getCakeById = async (req, res) => {
  try {
    const cake = await Cake.findById(req.params.id);

    if (!cake) {
      return res.status(404).json({
        success: false,
        message: 'Cake not found',
      });
    }

    res.json({ success: true, data: cake });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get featured cakes
 * GET /api/cakes/featured
 */
const getFeaturedCakes = async (req, res) => {
  try {
    const cakes = await Cake.find({ featured: true, available: true })
      .sort({ rating: -1 })
      .limit(8);

    res.json({ success: true, data: cakes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get cake recommendations based on category/preferences
 * GET /api/cakes/recommend
 */
const getRecommendations = async (req, res) => {
  try {
    const { category, exclude } = req.query;

    const filter = { available: true };
    if (category) filter.category = category;
    if (exclude) filter._id = { $ne: exclude };

    const cakes = await Cake.find(filter)
      .sort({ rating: -1, reviews: -1 })
      .limit(4);

    res.json({ success: true, data: cakes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get all categories
 * GET /api/cakes/categories
 */
const getCategories = async (req, res) => {
  try {
    const categories = await Cake.distinct('category');
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCakes, getCakeById, getFeaturedCakes, getRecommendations, getCategories };
