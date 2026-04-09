// ===========================================
// Seed Script - Populate Database with Cakes
// ===========================================
require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });
const mongoose = require('mongoose');
const Cake = require('../models/Cake');

const cakes = [
  {
    name: 'Red Velvet Dream',
    description: 'A luxurious red velvet cake with smooth cream cheese frosting. Rich, moist, and absolutely stunning with its signature crimson hue.',
    category: 'birthday',
    basePrice: 35,
    image: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=500',
    sizes: [
      { label: 'Small (6")', multiplier: 0.8 },
      { label: 'Medium (8")', multiplier: 1 },
      { label: 'Large (10")', multiplier: 1.4 },
      { label: 'Extra Large (12")', multiplier: 1.8 },
    ],
    flavors: ['Red Velvet', 'Cream Cheese'],
    rating: 4.8,
    reviews: 142,
    featured: true,
    tags: ['bestseller', 'birthday', 'romantic'],
  },
  {
    name: 'Chocolate Truffle Tower',
    description: 'Three layers of dark chocolate cake with Belgian chocolate ganache, topped with handmade chocolate truffles.',
    category: 'chocolate',
    basePrice: 45,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500',
    sizes: [
      { label: 'Small (6")', multiplier: 0.8 },
      { label: 'Medium (8")', multiplier: 1 },
      { label: 'Large (10")', multiplier: 1.4 },
      { label: 'Extra Large (12")', multiplier: 1.8 },
    ],
    flavors: ['Dark Chocolate', 'Milk Chocolate', 'White Chocolate'],
    rating: 4.9,
    reviews: 208,
    featured: true,
    tags: ['bestseller', 'chocolate', 'premium'],
  },
  {
    name: 'Strawberry Bliss',
    description: 'Light vanilla sponge layered with fresh strawberry compote and whipped cream. Decorated with fresh berries.',
    category: 'fruit',
    basePrice: 38,
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500',
    sizes: [
      { label: 'Small (6")', multiplier: 0.8 },
      { label: 'Medium (8")', multiplier: 1 },
      { label: 'Large (10")', multiplier: 1.4 },
    ],
    flavors: ['Strawberry', 'Vanilla', 'Mixed Berry'],
    rating: 4.7,
    reviews: 95,
    featured: true,
    tags: ['fresh', 'fruity', 'light'],
  },
  {
    name: 'Classic Vanilla Elegance',
    description: 'A timeless vanilla bean cake with silky buttercream. Simple, elegant, and perfectly balanced.',
    category: 'birthday',
    basePrice: 28,
    image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=500',
    sizes: [
      { label: 'Small (6")', multiplier: 0.8 },
      { label: 'Medium (8")', multiplier: 1 },
      { label: 'Large (10")', multiplier: 1.4 },
      { label: 'Extra Large (12")', multiplier: 1.8 },
    ],
    flavors: ['Vanilla', 'French Vanilla', 'Vanilla Bean'],
    rating: 4.5,
    reviews: 176,
    featured: false,
    tags: ['classic', 'birthday', 'simple'],
  },
  {
    name: 'Elegant White Rose Wedding Cake',
    description: 'A stunning three-tier wedding cake adorned with handcrafted sugar roses. Ivory fondant with pearl accents.',
    category: 'wedding',
    basePrice: 180,
    image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=500',
    sizes: [
      { label: '2-Tier', multiplier: 1 },
      { label: '3-Tier', multiplier: 1.5 },
      { label: '4-Tier', multiplier: 2.2 },
    ],
    flavors: ['Vanilla', 'Almond', 'Lemon', 'Champagne'],
    rating: 4.9,
    reviews: 67,
    featured: true,
    tags: ['wedding', 'premium', 'elegant'],
  },
  {
    name: 'Rainbow Funfetti Cake',
    description: 'A vibrant and colorful cake filled with rainbow sprinkles inside and out. Perfect for kids and adults alike!',
    category: 'birthday',
    basePrice: 32,
    image: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=500',
    sizes: [
      { label: 'Small (6")', multiplier: 0.8 },
      { label: 'Medium (8")', multiplier: 1 },
      { label: 'Large (10")', multiplier: 1.4 },
    ],
    flavors: ['Vanilla Funfetti', 'Chocolate Funfetti'],
    rating: 4.6,
    reviews: 134,
    featured: true,
    tags: ['fun', 'colorful', 'kids', 'birthday'],
  },
  {
    name: 'Salted Caramel Delight',
    description: 'Rich caramel cake with layers of salted caramel buttercream and caramel drizzle. A perfect balance of sweet and salty.',
    category: 'custom',
    basePrice: 42,
    image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=500',
    sizes: [
      { label: 'Small (6")', multiplier: 0.8 },
      { label: 'Medium (8")', multiplier: 1 },
      { label: 'Large (10")', multiplier: 1.4 },
    ],
    flavors: ['Salted Caramel', 'Caramel Vanilla'],
    rating: 4.8,
    reviews: 89,
    featured: false,
    tags: ['caramel', 'gourmet', 'trending'],
  },
  {
    name: 'Lemon Sunshine Cake',
    description: 'Bright and zesty lemon cake with lemon curd filling and cream cheese frosting. Like sunshine in every bite!',
    category: 'fruit',
    basePrice: 30,
    image: 'https://images.unsplash.com/photo-1519869325930-281384f7e56d?w=500',
    sizes: [
      { label: 'Small (6")', multiplier: 0.8 },
      { label: 'Medium (8")', multiplier: 1 },
      { label: 'Large (10")', multiplier: 1.4 },
    ],
    flavors: ['Lemon', 'Lemon Raspberry'],
    rating: 4.5,
    reviews: 72,
    featured: false,
    tags: ['citrus', 'refreshing', 'summer'],
  },
  {
    name: 'Tiramisu Layer Cake',
    description: 'Italian-inspired layers of coffee-soaked sponge, mascarpone cream, and cocoa dust. An elegant dessert experience.',
    category: 'custom',
    basePrice: 48,
    image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=500',
    sizes: [
      { label: 'Small (6")', multiplier: 0.8 },
      { label: 'Medium (8")', multiplier: 1 },
      { label: 'Large (10")', multiplier: 1.4 },
    ],
    flavors: ['Coffee', 'Espresso', 'Amaretto'],
    rating: 4.7,
    reviews: 98,
    featured: true,
    tags: ['coffee', 'italian', 'premium'],
  },
  {
    name: 'Chocolate Chip Cookie Cupcakes',
    description: 'Moist chocolate chip cupcakes topped with cookie dough frosting and a mini cookie. Dozen pack.',
    category: 'cupcake',
    basePrice: 24,
    image: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=500',
    sizes: [
      { label: 'Half Dozen', multiplier: 0.6 },
      { label: 'Dozen', multiplier: 1 },
      { label: 'Two Dozen', multiplier: 1.8 },
    ],
    flavors: ['Chocolate Chip', 'Double Chocolate', 'Peanut Butter'],
    rating: 4.6,
    reviews: 156,
    featured: false,
    tags: ['cupcake', 'cookie', 'fun'],
  },
  {
    name: 'Rose Gold Drip Cake',
    description: 'A show-stopping celebration cake with rose gold chocolate drip, macarons, and edible flowers. Instagram-worthy!',
    category: 'custom',
    basePrice: 55,
    image: 'https://images.unsplash.com/photo-1557925923-cd4648e211a0?w=500',
    sizes: [
      { label: 'Small (6")', multiplier: 0.8 },
      { label: 'Medium (8")', multiplier: 1 },
      { label: 'Large (10")', multiplier: 1.5 },
    ],
    flavors: ['Vanilla', 'Chocolate', 'Strawberry'],
    rating: 4.9,
    reviews: 112,
    featured: true,
    tags: ['trendy', 'instagram', 'celebration', 'premium'],
  },
  {
    name: 'Classic Cheesecake',
    description: 'New York-style cheesecake with a buttery graham cracker crust. Creamy, rich, and irresistible.',
    category: 'pastry',
    basePrice: 35,
    image: 'https://images.unsplash.com/photo-1524351199432-03e1bc2e9141?w=500',
    sizes: [
      { label: 'Small (6")', multiplier: 0.8 },
      { label: 'Medium (8")', multiplier: 1 },
      { label: 'Large (10")', multiplier: 1.4 },
    ],
    flavors: ['Classic', 'Blueberry', 'Strawberry', 'Chocolate'],
    rating: 4.7,
    reviews: 188,
    featured: false,
    tags: ['cheesecake', 'classic', 'creamy'],
  },
  {
    name: 'Mango Passion Tropical Cake',
    description: 'Exotic mango and passion fruit layers with coconut cream frosting. A tropical paradise in every slice!',
    category: 'fruit',
    basePrice: 40,
    image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=500',
    sizes: [
      { label: 'Small (6")', multiplier: 0.8 },
      { label: 'Medium (8")', multiplier: 1 },
      { label: 'Large (10")', multiplier: 1.4 },
    ],
    flavors: ['Mango', 'Passion Fruit', 'Coconut Mango'],
    rating: 4.6,
    reviews: 64,
    featured: false,
    tags: ['tropical', 'exotic', 'summer'],
  },
  {
    name: 'Mini Velvet Cupcake Box',
    description: 'Assorted mini cupcakes in Red Velvet, Chocolate, and Vanilla. Perfect party pack with beautiful frosting swirls.',
    category: 'cupcake',
    basePrice: 18,
    image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=500',
    sizes: [
      { label: 'Box of 6', multiplier: 0.6 },
      { label: 'Box of 12', multiplier: 1 },
      { label: 'Box of 24', multiplier: 1.8 },
    ],
    flavors: ['Assorted', 'All Chocolate', 'All Vanilla', 'All Red Velvet'],
    rating: 4.5,
    reviews: 203,
    featured: false,
    tags: ['cupcake', 'mini', 'assorted', 'party'],
  },
  {
    name: 'Black Forest Gateau',
    description: 'Traditional German chocolate cake with cherries, whipped cream, and cherry brandy. A timeless masterpiece.',
    category: 'chocolate',
    basePrice: 38,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500',
    sizes: [
      { label: 'Small (6")', multiplier: 0.8 },
      { label: 'Medium (8")', multiplier: 1 },
      { label: 'Large (10")', multiplier: 1.4 },
    ],
    flavors: ['Cherry Chocolate', 'Classic'],
    rating: 4.7,
    reviews: 131,
    featured: false,
    tags: ['german', 'cherry', 'classic', 'chocolate'],
  },
  {
    name: 'Rustic Naked Wedding Cake',
    description: 'A beautiful naked cake with exposed layers, fresh flowers, and seasonal fruit. Rustic elegance at its finest.',
    category: 'wedding',
    basePrice: 150,
    image: 'https://images.unsplash.com/photo-1522767131594-6b7e96848fba?w=500',
    sizes: [
      { label: '2-Tier', multiplier: 1 },
      { label: '3-Tier', multiplier: 1.5 },
      { label: '4-Tier', multiplier: 2 },
    ],
    flavors: ['Vanilla', 'Lemon', 'Carrot', 'Victoria Sponge'],
    rating: 4.8,
    reviews: 54,
    featured: false,
    tags: ['wedding', 'rustic', 'naked', 'natural'],
  },
];

const seedCakes = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cakeshop');
    console.log('✅ Connected to MongoDB');

    // Clear existing cakes
    await Cake.deleteMany({});
    console.log('🗑️  Cleared existing cakes');

    // Insert seed data
    const inserted = await Cake.insertMany(cakes);
    console.log(`🎂 Seeded ${inserted.length} cakes successfully!`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedCakes();
