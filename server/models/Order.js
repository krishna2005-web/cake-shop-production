// ===========================================
// Order Model
// ===========================================
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  cakeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cake',
    required: true,
  },
  name: String,
  quantity: { type: Number, required: true, min: 1 },
  size: String,
  flavor: String,
  message: String,
  price: { type: Number, required: true },
  image: String,
});

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'baking', 'ready', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending',
  },
  paymentId: {
    type: String,
    default: '',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  },
  deliveryAddress: {
    street: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    zip: { type: String, default: '' },
    phone: { type: String, default: '' },
  },
  deliveryDate: {
    type: Date,
  },
  estimatedDelivery: {
    type: String,
    default: '2-3 business days',
  },
  trackingUpdates: [{
    status: String,
    message: String,
    timestamp: { type: Date, default: Date.now },
  }],
}, {
  timestamps: true,
});

orderSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
