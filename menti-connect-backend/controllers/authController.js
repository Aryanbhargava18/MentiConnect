// controllers/authController.js
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Handle GitHub OAuth callback
// @route   GET /auth/github/callback
exports.githubCallback = (req, res) => {
    const token = generateToken(req.user._id);
    // Redirect to frontend auth callback page with token in URL
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
};

// @desc    Logout user (clear GitHub token)
// @route   POST /auth/logout
exports.logout = async (req, res) => {
    try {
        // Clear GitHub access token from user record
        if (req.user && req.user.id) {
            const User = require('../models/User');
            await User.findByIdAndUpdate(req.user.id, { 
                $unset: { githubAccessToken: 1 } 
            });
        }
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Server error during logout' });
    }
};