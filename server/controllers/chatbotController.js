// ===========================================
// Chatbot Controller (OpenAI + Fallback)
// ===========================================
const Cake = require('../models/Cake');

// Rule-based responses for when OpenAI is not configured
const RULE_RESPONSES = {
  greeting: {
    patterns: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'howdy'],
    responses: [
      "Hello! 🎂 Welcome to Sweet Delights! I'm your cake assistant. How can I help you today?",
      "Hi there! 🍰 Looking for the perfect cake? I'm here to help!",
      "Hey! 👋 Welcome! Would you like to browse our cakes, get recommendations, or learn about customization?",
    ],
  },
  recommendation: {
    patterns: ['recommend', 'suggest', 'best cake', 'popular', 'what should', 'which cake', 'help me choose'],
    responses: [
      "Great question! 🌟 Our most popular cakes are:\n\n1. **Red Velvet Dream** - Rich and velvety, perfect for special occasions\n2. **Chocolate Truffle Tower** - For true chocolate lovers\n3. **Strawberry Bliss** - Light, fresh, and fruity\n\nWould you like details on any of these?",
      "I'd love to help! 🎂 What's the occasion? We have amazing options for:\n- 🎈 Birthdays\n- 💍 Weddings\n- 🎉 Celebrations\n- 🧁 Just because!\n\nTell me more and I'll find your perfect cake!",
    ],
  },
  birthday: {
    patterns: ['birthday', 'bday', 'birth day'],
    responses: [
      "Happy Birthday! 🎈🎂 Our birthday collection includes:\n\n- **Rainbow Funfetti** (₹649) - Colorful and fun!\n- **Classic Chocolate** (₹599) - Everyone's favorite\n- **Red Velvet Dream** (₹699) - Smooth cream cheese frosting\n\nAll birthday cakes can be customized with names and messages!",
    ],
  },
  wedding: {
    patterns: ['wedding', 'engagement', 'bridal'],
    responses: [
      "Congratulations! 💍✨ Our wedding cakes are showstoppers:\n\n- **Elegant White Rose** - 3-tier, starts at ₹4,999\n- **Rustic Naked Cake** - Beautiful and trendy, from ₹3,999\n\nWe offer free tastings for orders! Would you like to book one?",
    ],
  },
  price: {
    patterns: ['price', 'cost', 'how much', 'expensive', 'cheap', 'budget', 'affordable'],
    responses: [
      "Our cakes are priced to delight! 💰\n\n- 🧁 **Cupcakes**: from ₹349/box\n- 🎂 **Small cakes (6\")**: from ₹449\n- 🎂 **Medium cakes (8\")**: from ₹599\n- 🎂 **Large cakes (10\")**: from ₹899\n- 👰 **Wedding cakes**: from ₹3,999\n\nCustomization and special designs may vary. Check our menu for details!",
    ],
  },
  customize: {
    patterns: ['custom', 'personalize', 'message', 'write on', 'design', 'flavor', 'size'],
    responses: [
      "We love making custom cakes! 🎨 You can customize:\n\n- **Size**: Small, Medium, Large, or Extra Large\n- **Flavor**: Vanilla, Chocolate, Red Velvet, Strawberry & more\n- **Message**: Add a personal message on top\n- **Design**: Choose from our templates or go fully custom\n\nJust pick a cake and hit 'Customize' on its page!",
    ],
  },
  delivery: {
    patterns: ['deliver', 'shipping', 'ship', 'pickup', 'when', 'time', 'how long'],
    responses: [
      "We offer flexible delivery! 🚗\n\n- **Standard Delivery**: 2-3 business days\n- **Express Delivery**: Next day (extra charge)\n- **Same Day**: Available for select items\n- **Pickup**: Free! Come to our store\n\nDelivery is free on orders over ₹999! 🎉",
    ],
  },
  thanks: {
    patterns: ['thank', 'thanks', 'appreciate', 'great', 'awesome', 'perfect'],
    responses: [
      "You're welcome! 😊 Enjoy your cake! Is there anything else I can help with?",
      "Happy to help! 🎂 Don't forget to check our daily specials. Anything else?",
      "My pleasure! 🌟 If you need anything else, just ask!",
    ],
  },
  bye: {
    patterns: ['bye', 'goodbye', 'see you', 'later', 'quit', 'exit'],
    responses: [
      "Goodbye! 👋 Enjoy your sweet treats! Come back anytime! 🎂",
      "See you later! 🍰 Happy baking... I mean, happy eating! 😄",
    ],
  },
};

const DEFAULT_RESPONSE = "I'm not sure about that, but I'm here to help with cakes! 🎂\n\nYou can ask me about:\n- 🎂 Cake recommendations\n- 💰 Prices\n- 🎨 Customization options\n- 🚗 Delivery info\n- 🎈 Special occasions\n\nWhat would you like to know?";

/**
 * Get rule-based response
 */
function getRuleResponse(message) {
  const lower = message.toLowerCase();

  for (const [, data] of Object.entries(RULE_RESPONSES)) {
    if (data.patterns.some((pattern) => lower.includes(pattern))) {
      return data.responses[Math.floor(Math.random() * data.responses.length)];
    }
  }

  return DEFAULT_RESPONSE;
}

/**
 * Chat with AI assistant
 * POST /api/chatbot
 */
const chat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required',
      });
    }

    // Try OpenAI if configured
    if (process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.startsWith('your_')) {
      try {
        const OpenAI = require('openai');
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        // Get some cake data for context
        const cakes = await Cake.find({ available: true }).limit(10).select('name category basePrice flavors');

        const systemPrompt = `You are a friendly, helpful cake shop assistant for "Sweet Delights Bakery". 
You help customers browse cakes, choose flavors, understand pricing, and place orders.
Be enthusiastic, use cake-related emojis 🎂🍰🧁, and keep responses concise but helpful.

Available cakes: ${JSON.stringify(cakes.map((c) => ({ name: c.name, category: c.category, price: c.basePrice, flavors: c.flavors })))}

If asked about specific cakes, reference the available ones. If asked about things unrelated to cakes/bakery, 
politely redirect the conversation back to cakes.`;

        const messages = [
          { role: 'system', content: systemPrompt },
          ...history.slice(-6).map((h) => ({
            role: h.role,
            content: h.content,
          })),
          { role: 'user', content: message },
        ];

        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages,
          max_tokens: 500,
          temperature: 0.7,
        });

        return res.json({
          success: true,
          response: completion.choices[0].message.content,
          isAI: true,
        });
      } catch (aiError) {
        console.error('OpenAI error, falling back to rules:', aiError.message);
      }
    }

    // Fallback to rule-based
    const response = getRuleResponse(message);

    res.json({
      success: true,
      response,
      isAI: false,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { chat };
