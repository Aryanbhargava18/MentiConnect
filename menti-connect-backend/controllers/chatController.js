const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Get all conversations for a user
// @route   GET /api/chat/conversations
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const conversations = await Conversation.find({
      participants: userId,
      isActive: true
    })
    .populate('participants', 'username avatarUrl role')
    .populate('lastMessage')
    .sort({ lastMessageAt: -1 });

    res.status(200).json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Failed to fetch conversations' });
  }
};

// @desc    Get messages for a conversation
// @route   GET /api/chat/conversations/:conversationId/messages
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    // Verify user is part of conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.includes(userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'username avatarUrl')
      .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      { conversation: conversationId, sender: { $ne: userId }, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
};

// @desc    Send a message
// @route   POST /api/chat/conversations/:conversationId/messages
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { content, messageType = 'text' } = req.body;
    const userId = req.user.id;

    // Verify user is part of conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.includes(userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Create message
    const message = new Message({
      conversation: conversationId,
      sender: userId,
      content,
      messageType
    });

    await message.save();

    // Update conversation
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
      lastMessageAt: new Date()
    });

    // Populate sender info
    await message.populate('sender', 'username avatarUrl');

    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
};

// @desc    Create a new conversation
// @route   POST /api/chat/conversations
exports.createConversation = async (req, res) => {
  try {
    const { participantId } = req.body;
    const userId = req.user.id;

    if (userId === participantId) {
      return res.status(400).json({ message: 'Cannot create conversation with yourself' });
    }

    // Check if conversation already exists
    const existingConversation = await Conversation.findOne({
      participants: { $all: [userId, participantId] },
      isActive: true
    });

    if (existingConversation) {
      return res.status(200).json(existingConversation);
    }

    // Create new conversation
    const conversation = new Conversation({
      participants: [userId, participantId],
      conversationType: 'mentorship'
    });

    await conversation.save();
    await conversation.populate('participants', 'username avatarUrl role');

    res.status(201).json(conversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ message: 'Failed to create conversation' });
  }
};

// @desc    Get unread message count
// @route   GET /api/chat/unread-count
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const unreadCount = await Message.countDocuments({
      conversation: { $in: await Conversation.find({ participants: userId }).distinct('_id') },
      sender: { $ne: userId },
      isRead: false
    });

    res.status(200).json({ unreadCount });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({ message: 'Failed to get unread count' });
  }
};