// ===========================================
// Order Controller
// ===========================================
const Order = require('../models/Order');
const Cart = require('../models/Cart');

/**
 * Create order from cart
 * POST /api/orders
 */
const createOrder = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { deliveryAddress, deliveryDate, paymentId, paymentStatus } = req.body;

    // Get cart
    const cart = await Cart.findOne({ userId }).populate('items.cakeId', 'name image');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty',
      });
    }

    // Calculate total
    const totalAmount = cart.items.reduce((sum, item) => sum + item.price, 0);

    // Create order items with cake details
    const orderItems = cart.items.map((item) => ({
      cakeId: item.cakeId._id || item.cakeId,
      name: item.cakeId.name || 'Cake',
      quantity: item.quantity,
      size: item.size,
      flavor: item.flavor,
      message: item.message,
      price: item.price,
      image: item.cakeId.image || '',
    }));

    // Create order
    const order = await Order.create({
      userId,
      items: orderItems,
      totalAmount,
      deliveryAddress: deliveryAddress || {},
      deliveryDate: deliveryDate || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      paymentId: paymentId || '',
      paymentStatus: paymentStatus || 'pending',
      status: 'confirmed',
      trackingUpdates: [
        {
          status: 'confirmed',
          message: 'Your order has been confirmed!',
          timestamp: new Date(),
        },
      ],
    });

    // Clear cart after order
    await Cart.findOneAndDelete({ userId });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get user's orders
 * GET /api/orders
 */
const getOrders = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .populate('items.cakeId', 'name image');

    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get single order
 * GET /api/orders/:id
 */
const getOrderById = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const order = await Order.findOne({ _id: req.params.id, userId })
      .populate('items.cakeId', 'name image');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update order status (admin)
 * PUT /api/orders/:id/status
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.status = status;
    order.trackingUpdates.push({
      status,
      message: getStatusMessage(status),
      timestamp: new Date(),
    });

    await order.save();

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper: Status messages
function getStatusMessage(status) {
  const messages = {
    pending: 'Order is being reviewed',
    confirmed: 'Your order has been confirmed!',
    baking: 'Your cake is being baked with love! 🎂',
    ready: 'Your cake is ready for pickup/delivery!',
    out_for_delivery: 'Your cake is on its way! 🚗',
    delivered: 'Your cake has been delivered. Enjoy! 🎉',
    cancelled: 'Order has been cancelled',
  };
  return messages[status] || 'Status updated';
}

/**
 * Get all orders (Admin)
 * GET /api/orders/admin/all
 */
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .populate('items.cakeId', 'name image')
      .populate('userId', 'name email');

    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createOrder, getOrders, getOrderById, updateOrderStatus, getAllOrders };
