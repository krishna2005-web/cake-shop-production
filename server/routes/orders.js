// ===========================================
// Order Routes
// ===========================================
const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} = require('../controllers/orderController');

// All order routes require authentication
router.use(isAuthenticated);

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', updateOrderStatus);

module.exports = router;
