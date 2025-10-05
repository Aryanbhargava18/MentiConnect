const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MentorshipSession'
  },
  type: {
    type: String,
    enum: ['mentorship', 'session', 'general'],
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  categories: {
    communication: Number,
    expertise: Number,
    helpfulness: Number,
    punctuality: Number,
    preparation: Number
  },
  comment: {
    type: String,
    trim: true
  },
  strengths: [String],
  improvements: [String],
  wouldRecommend: {
    type: Boolean,
    default: true
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'submitted', 'reviewed'],
    default: 'submitted'
  }
}, { timestamps: true });

const Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback;