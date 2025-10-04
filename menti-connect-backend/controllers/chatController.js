// controllers/chatController.js
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');
const notificationService = require('../services/notificationService');

// @desc    Get user conversations
// @route   GET /api/chat/conversations
exports.getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id
    })
    .populate('participants', 'username avatarUrl')
    .populate('lastMessage')
    .sort({ lastMessageAt: -1 });

    res.status(200).json(conversations);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new conversation
// @route   POST /api/chat/conversations
exports.createConversation = async (req, res) => {
  try {
    const { participants } = req.body;
    
    // Check if conversation already exists
    const existingConversation = await Conversation.findOne({
      participants: { $all: participants }
    });

    if (existingConversation) {
      return res.status(200).json(existingConversation);
    }

    const conversation = new Conversation({
      participants,
      type: 'direct'
    });

    await conversation.save();
    await conversation.populate('participants', 'username avatarUrl');

    res.status(201).json(conversation);
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get messages for a conversation
// @route   GET /api/chat/messages/:conversationId
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    
    // First get the conversation to find participants
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    const messages = await Message.find({
      conversation: conversationId
    })
    .populate('sender', 'username avatarUrl')
    .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Send a message
// @route   POST /api/chat/messages
exports.sendMessage = async (req, res) => {
  try {
    const { content, conversationId } = req.body;

    const message = new Message({
      conversation: conversationId,
      sender: req.user.id,
      content,
      type: 'text'
    });

    await message.save();
    await message.populate('sender', 'username avatarUrl');

    // Update conversation
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
      lastMessageAt: new Date()
    });

    res.status(201).json(message);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Mark message as read
// @route   PUT /api/chat/messages/:messageId/read
exports.markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;

    await Message.findByIdAndUpdate(messageId, {
      read: true,
      readAt: new Date()
    });

    res.status(200).json({ message: 'Message marked as read' });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
