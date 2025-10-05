const express = require('express');
const { 
  getConversations, 
  getMessages, 
  sendMessage, 
  createConversation, 
  getUnreadCount 
} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/conversations', protect, getConversations);
router.get('/conversations/:conversationId/messages', protect, getMessages);
router.post('/conversations/:conversationId/messages', protect, sendMessage);
router.post('/conversations', protect, createConversation);
router.get('/unread-count', protect, getUnreadCount);

module.exports = router;