// ===========================================
// Chatbot Routes
// ===========================================
const express = require('express');
const router = express.Router();
const { chat } = require('../controllers/chatbotController');

// Chat endpoint - no auth required for better UX
router.post('/', chat);

module.exports = router;
