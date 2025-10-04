// models/Conversation.js
const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    default: null
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  },
  unreadCount: {
    type: Map,
    of: Number,
    default: new Map()
  },
  archived: {
    type: Map,
    of: Boolean,
    default: new Map()
  },
  muted: {
    type: Map,
    of: Boolean,
    default: new Map()
  },
  type: {
    type: String,
    enum: ['direct', 'group'],
    default: 'direct'
  },
  name: {
    type: String,
    default: null
  },
  description: {
    type: String,
    default: null
  },
  avatar: {
    type: String,
    default: null
  }
}, { timestamps: true });

// Ensure participants array has exactly 2 users for direct messages
conversationSchema.pre('save', function(next) {
  if (this.type === 'direct' && this.participants.length !== 2) {
    return next(new Error('Direct conversations must have exactly 2 participants'));
  }
  next();
});

// Index for efficient queries
conversationSchema.index({ participants: 1, lastMessageAt: -1 });
conversationSchema.index({ 'participants.0': 1, 'participants.1': 1 });

const Conversation = mongoose.model('Conversation', conversationSchema);
module.exports = Conversation;
