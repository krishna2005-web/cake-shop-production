// ===========================================
// Cake Model
// ===========================================
const mongoose = require('mongoose');

const cakeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['birthday', 'wedding', 'custom', 'cupcake', 'pastry', 'chocolate', 'fruit'],
  },
  basePrice: {
    type: Number,
    required: true,
    min: 0,
  },
  image: {
    type: String,
    required: true,
  },
  sizes: [{
    label: { type: String, required: true },
    multiplier: { type: Number, required: true, default: 1 },
  }],
  flavors: [{
    type: String,
  }],
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5,
  },
  reviews: {
    type: Number,
    default: 0,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  available: {
    type: Boolean,
    default: true,
  },
  tags: [{
    type: String,
  }],
}, {
  timestamps: true,
});

// Index for search and filtering
cakeSchema.index({ name: 'text', description: 'text' });
cakeSchema.index({ category: 1 });
cakeSchema.index({ featured: 1 });

module.exports = mongoose.model('Cake', cakeSchema);
