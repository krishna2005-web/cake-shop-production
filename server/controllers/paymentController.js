// ===========================================
// Payment Controller (Razorpay)
// Supports UPI, GPay, Cards, NetBanking
// ===========================================
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay instance
let razorpayInstance = null;

function getRazorpay() {
  if (!razorpayInstance && process.env.RAZORPAY_KEY_ID && !process.env.RAZORPAY_KEY_ID.startsWith('rzp_test_your')) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
}

/**
 * Create Razorpay order
 * POST /api/payment/create-order
 */
const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid amount is required',
      });
    }

    const razorpay = getRazorpay();

    // If Razorpay is not configured, use demo mode
    if (!razorpay) {
      return res.json({
        success: true,
        order: {
          id: 'demo_order_' + Date.now(),
          amount: Math.round(amount * 100), // paise
          currency: 'INR',
        },
        key: 'demo_key',
        isDemo: true,
      });
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(amount * 100), // Razorpay uses paise (1 INR = 100 paise)
      currency: 'INR',
      receipt: 'order_' + Date.now(),
      notes: {
        userId: (req.user._id || req.user.id).toString(),
      },
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      key: process.env.RAZORPAY_KEY_ID,
      isDemo: false,
    });
  } catch (error) {
    console.error('Razorpay create order error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Verify Razorpay payment signature
 * POST /api/payment/verify
 */
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Demo mode check
    if (razorpay_order_id && razorpay_order_id.startsWith('demo_')) {
      return res.json({
        success: true,
        verified: true,
        paymentId: 'demo_pay_' + Date.now(),
        isDemo: true,
      });
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.json({
        success: true,
        verified: true,
        paymentId: 'demo_pay_' + Date.now(),
        isDemo: true,
      });
    }

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    const isValid = expectedSignature === razorpay_signature;

    if (isValid) {
      res.json({
        success: true,
        verified: true,
        paymentId: razorpay_payment_id,
        isDemo: false,
      });
    } else {
      res.status(400).json({
        success: false,
        verified: false,
        message: 'Payment verification failed',
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createOrder, verifyPayment };
