// ===========================================
// Payment Routes (Razorpay)
// ===========================================
const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const { createOrder, verifyPayment } = require('../controllers/paymentController');

router.use(isAuthenticated);

router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);

module.exports = router;
