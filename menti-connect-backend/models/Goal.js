// models/Goal.js
const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  description: {
    type: String,
    maxlength: 1000
  },
  category: {
    type: String,
    enum: [
      'skill_development',
      'career_advancement',
      'project_completion',
      'learning',
      'networking',
      'certification',
      'other'
    ],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed', 'paused', 'cancelled'],
    default: 'not_started'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  targetDate: {
    type: Date,
    required: true
  },
  completedAt: {
    type: Date,
    default: null
  },
  milestones: [{
    title: String,
    description: String,
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: Date
  }],
  skills: [{
    type: String
  }],
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  mentorNotes: [{
    note: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  achievements: [{
    title: String,
    description: String,
    achievedAt: {
      type: Date,
      default: Date.now
    },
    verified: {
      type: Boolean,
      default: false
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  tags: [{
    type: String
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  visibility: {
    type: String,
    enum: ['private', 'mentor_only', 'public'],
    default: 'private'
  }
}, { timestamps: true });

// Index for efficient queries
goalSchema.index({ userId: 1, status: 1, targetDate: 1 });
goalSchema.index({ category: 1, isPublic: 1 });
goalSchema.index({ mentor: 1, status: 1 });

const Goal = mongoose.model('Goal', goalSchema);
module.exports = Goal;
