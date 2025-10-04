// models/Feedback.js
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  categories: {
    communication: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    expertise: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    helpfulness: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    punctuality: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    professionalism: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    }
  },
  comment: {
    type: String,
    maxlength: 1000
  },
  type: {
    type: String,
    enum: ['mentor_feedback', 'mentee_feedback', 'peer_feedback'],
    required: true
  },
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    default: null
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedAt: {
    type: Date,
    default: null
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  helpful: {
    type: Number,
    default: 0
  },
  notHelpful: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String
  }],
  response: {
    type: String,
    maxlength: 1000
  },
  responseAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

// Ensure user can't rate themselves
feedbackSchema.pre('save', function(next) {
  if (this.fromUser.toString() === this.toUser.toString()) {
    return next(new Error('Users cannot rate themselves'));
  }
  next();
});

// Index for efficient queries
feedbackSchema.index({ toUser: 1, type: 1, createdAt: -1 });
feedbackSchema.index({ fromUser: 1, toUser: 1 }, { unique: true });
feedbackSchema.index({ rating: 1, isVerified: 1 });

const Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback;
