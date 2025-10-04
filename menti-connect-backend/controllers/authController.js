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
    // Redirect to frontend with token in URL
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${token}`);
};