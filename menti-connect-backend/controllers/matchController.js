// controllers/matchController.js
const User = require('../models/User');
const { sendMatchNotification } = require('../services/notificationService');

// @desc    Get potential matches for the logged-in user
// @route   GET /api/matches
exports.getMatches = async (req, res) => {
    const currentUser = req.user;

    try {
        // Simple matching: If user is a mentee, find mentors with skill overlap
        if (currentUser.role === 'mentee' || currentUser.role === 'both') {
            const mentors = await User.find({
                // Must be a mentor or both
                role: { $in: ['mentor', 'both'] },
                // Must have at least one skill in common
                skills: { $in: currentUser.skills },
                // Mentor's capacity is not full
                $expr: { $lt: [{ $size: "$acceptedMatches" }, "$mentoringCapacity"] },
                // Cannot be the user themselves
                _id: { $ne: currentUser._id },
            }).select('username email skills avatarUrl'); // Select fields to return
            
            res.status(200).json(mentors);
        } else {
            // Logic for mentors to find mentees can be added here
            res.status(200).json([]);
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Accept a match request
// @route   POST /api/matches/accept/:id
exports.acceptMatch = async (req, res) => {
    const menteeId = req.user.id;
    const mentorId = req.params.id;

    try {
        const mentee = await User.findById(menteeId);
        const mentor = await User.findById(mentorId);

        if (!mentor || !mentee) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Add to each other's acceptedMatches list
        mentee.acceptedMatches.push(mentorId);
        mentor.acceptedMatches.push(menteeId);

        await mentee.save();
        await mentor.save();
        
        // Trigger notification
        await sendMatchNotification(mentee, mentor);

        res.status(200).json({ message: 'Match accepted successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Reject a match (MVP: simple response, no state change)
// @route   POST /api/matches/reject/:id
exports.rejectMatch = (req, res) => {
    // In a full app, this might update a 'rejected' or 'suggested' list.
    // For the MVP, we just acknowledge the action.
    res.status(200).json({ message: 'Match rejected.' });
};