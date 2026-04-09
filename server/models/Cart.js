// ===========================================
// Cart Model
// ===========================================
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  cakeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cake',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  size: {
    type: String,
    required: true,
    default: 'Medium',
  },
  flavor: {
    type: String,
    required: true,
    default: 'Vanilla',
  },
  message: {
    type: String,
    default: '',
    maxlength: 100,
  },
  price: {
    type: Number,
    required: true,
  },
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  items: [cartItemSchema],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Cart', cartSchema);
