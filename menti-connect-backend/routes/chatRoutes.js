// routes/chatRoutes.js
const express = require('express');
const {
  getConversations,
  createConversation,
  getMessages,
  sendMessage,
  markAsRead
} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// @desc    Get user conversations
// @route   GET /api/chat/conversations
router.get('/conversations', protect, getConversations);

// @desc    Create new conversation
// @route   POST /api/chat/conversations
router.post('/conversations', protect, createConversation);

// @desc    Get messages for conversation
// @route   GET /api/chat/messages/:conversationId
router.get('/messages/:conversationId', protect, getMessages);

// @desc    Send message
// @route   POST /api/chat/messages
router.post('/messages', protect, sendMessage);

// @desc    Mark message as read
// @route   PUT /api/chat/messages/:messageId/read
router.put('/messages/:messageId/read', protect, markAsRead);

module.exports = router;
