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
            if (role) user.role = role;
            if (skills) user.skills = skills;
            if (mentoringCapacity !== undefined) user.mentoringCapacity = mentoringCapacity;
            if (availability) user.availability = availability;

            const updatedUser = await user.save();
            res.status(200).json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create test user for development
// @route   POST /api/users/test
exports.createTestUser = async (req, res) => {
    try {
        const { username, email, role = 'mentee', skills = [], availability = [] } = req.body;
        
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(200).json({
                message: 'Test user already exists',
                user,
                token: require('jsonwebtoken').sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' })
            });
        }

        // Create new test user
        user = await User.create({
            githubId: `test_${Date.now()}`,
            username: username || 'Test User',
            email: email || 'test@example.com',
            avatarUrl: 'https://via.placeholder.com/150',
            role,
            skills,
            availability,
            githubAccessToken: 'test_token_' + Date.now()
        });

        const token = require('jsonwebtoken').sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.status(201).json({
            message: 'Test user created successfully',
            user,
            token
        });
    } catch (error) {
        console.error('Error creating test user:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};