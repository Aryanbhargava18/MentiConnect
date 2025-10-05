const mongoose = require('mongoose');

const mentorshipSessionSchema = new mongoose.Schema({
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mentee: {
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
  scheduledDate: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // in minutes
    default: 60
  },
  status: {
    type: String,
    enum: ['scheduled', 'in_progress', 'completed', 'cancelled', 'no_show'],
    default: 'scheduled'
  },
  sessionType: {
    type: String,
    enum: ['video_call', 'voice_call', 'text_chat', 'in_person'],
    default: 'video_call'
  },
  meetingLink: {
    type: String
  },
  agenda: [{
    topic: String,
    duration: Number,
    completed: Boolean
  }],
  notes: {
    mentor: String,
    mentee: String,
    shared: String
  },
  feedback: {
    mentor: {
      rating: Number,
      comment: String,
      submittedAt: Date
    },
    mentee: {
      rating: Number,
      comment: String,
      submittedAt: Date
    }
  },
  recordingUrl: {
    type: String
  },
  resources: [{
    title: String,
    url: String,
    type: String // 'document', 'video', 'link', 'code'
  }],
  nextSession: {
    type: Date
  },
  tags: [String]
}, { timestamps: true });

const MentorshipSession = mongoose.model('MentorshipSession', mentorshipSessionSchema);
module.exports = MentorshipSession;
