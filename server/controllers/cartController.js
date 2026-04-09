// ===========================================
// Cart Controller
// ===========================================
const Cart = require('../models/Cart');
const Cake = require('../models/Cake');

/**
 * Get user's cart
 * GET /api/cart
 */
const getCart = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    let cart = await Cart.findOne({ userId }).populate('items.cakeId', 'name image basePrice available');

    if (!cart) {
      cart = { items: [] };
    }

    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Add item to cart
 * POST /api/cart
 */
const addToCart = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { cakeId, quantity = 1, size, flavor, message } = req.body;

    // Validate cake exists
    const cake = await Cake.findById(cakeId);
    if (!cake) {
      return res.status(404).json({ success: false, message: 'Cake not found' });
    }

    // Calculate price based on size
    const sizeConfig = cake.sizes.find((s) => s.label === size) || cake.sizes[0];
    const price = cake.basePrice * (sizeConfig?.multiplier || 1) * quantity;

    // Find or create cart
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Add item
    cart.items.push({
      cakeId,
      quantity,
      size: size || sizeConfig?.label || 'Medium',
      flavor: flavor || cake.flavors[0] || 'Vanilla',
      message: message || '',
      price,
    });

    await cart.save();

    // Populate and return
    cart = await Cart.findById(cart._id).populate('items.cakeId', 'name image basePrice available');

    res.status(201).json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update cart item
 * PUT /api/cart/:itemId
 */
const updateCartItem = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { itemId } = req.params;
    const { quantity, size, flavor, message } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    // Get cake for price recalculation
    const cake = await Cake.findById(item.cakeId);
    const sizeConfig = cake?.sizes.find((s) => s.label === (size || item.size));

    if (quantity !== undefined) item.quantity = quantity;
    if (size) item.size = size;
    if (flavor) item.flavor = flavor;
    if (message !== undefined) item.message = message;

    // Recalculate price
    item.price = (cake?.basePrice || item.price) * (sizeConfig?.multiplier || 1) * item.quantity;

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate('items.cakeId', 'name image basePrice available');

    res.json({ success: true, data: updatedCart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Remove item from cart
 * DELETE /api/cart/:itemId
 */
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { itemId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate('items.cakeId', 'name image basePrice available');

    res.json({ success: true, data: updatedCart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Clear entire cart
 * DELETE /api/cart
 */
const clearCart = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    await Cart.findOneAndDelete({ userId });
    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
