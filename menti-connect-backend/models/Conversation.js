const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  conversationType: {
    type: String,
    enum: ['mentorship', 'general'],
    default: 'mentorship'
  },
  metadata: {
    mentorshipGoal: String,
    startDate: Date,
    endDate: Date
  }
}, { timestamps: true });

const Conversation = mongoose.model('Conversation', conversationSchema);
module.exports = Conversation;