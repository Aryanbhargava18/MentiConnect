const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['learning', 'career', 'project', 'skill', 'personal'],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
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
    type: Date
  },
  completedDate: {
    type: Date
  },
  milestones: [{
    title: String,
    description: String,
    completed: Boolean,
    completedAt: Date
  }],
  tags: [String],
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

const Goal = mongoose.model('Goal', goalSchema);
module.exports = Goal;