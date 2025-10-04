// controllers/userController.js
const User = require('../models/User');

// @desc    Get current user's profile
// @route   GET /api/users/me
exports.getMe = async (req, res) => {
    // req.user is attached by the 'protect' middleware
    res.status(200).json(req.user);
};

// @desc    Update user profile
// @route   PUT /api/users/me
exports.updateMe = async (req, res) => {
    const { role, skills, mentoringCapacity, availability } = req.body;
    
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            user.role = role || user.role;
            user.skills = skills || user.skills;
            user.mentoringCapacity = mentoringCapacity || user.mentoringCapacity;
            user.availability = availability || user.availability;

            const updatedUser = await user.save();
            res.status(200).json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};