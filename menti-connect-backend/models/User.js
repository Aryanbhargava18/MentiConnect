// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    githubId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatarUrl: { type: String },
    role: {
        type: String,
        enum: ['mentee', 'mentor', 'both'],
        default: 'mentee',
    },
    skills: { type: [String], default: [] },
    mentoringCapacity: { type: Number, default: 0 }, // Max mentees a mentor can take
    availability: { type: [String], default: [] }, // e.g., ["Mon 5-7pm", "Wed 6-8pm"]
    githubAccessToken: { type: String, required: true },
    acceptedMatches: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;