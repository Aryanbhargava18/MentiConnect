const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  mentee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed'],
    default: 'pending'
  },
  matchScore: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  compatibilityFactors: {
    skills: Number,
    availability: Number,
    experience: Number,
    goals: Number,
    github: Number
  },
  aiInsights: {
    compatibilityScore: Number,
    factors: {
      skills: Number,
      github: Number,
      availability: Number,
      experience: Number,
      goals: Number
    },
    recommendations: [String],
    githubActivity: {
      activityLevel: String,
      languages: [String],
      recentPRs: Number,
      recentCommits: Number
    }
  },
  initiatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  acceptedAt: Date,
  completedAt: Date,
  feedback: {
    menteeRating: Number,
    menteeComment: String,
    mentorRating: Number,
    mentorComment: String
  }
}, { timestamps: true });

const Match = mongoose.model('Match', matchSchema);
module.exports = Match;
