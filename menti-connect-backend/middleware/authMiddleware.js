// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const axios = require('axios');

// Helper function to validate GitHub token
const validateGitHubToken = async (accessToken) => {
    try {
        const response = await axios.get('https://api.github.com/user', {
            headers: {
                'Authorization': `token ${accessToken}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        return response.status === 200;
    } catch (error) {
        return false;
    } 
};

exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Get user from database
            const user = await User.findById(decoded.id);
            if (!user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            // Only validate GitHub token if it exists and is not a test token
            if (user.githubAccessToken && !user.githubAccessToken.startsWith('test_')) {
                try {
                    const isTokenValid = await validateGitHubToken(user.githubAccessToken);
                    if (!isTokenValid) {
                        console.log('GitHub token invalid, clearing it');
                        user.githubAccessToken = undefined;
                        await user.save();
                    }
                } catch (githubError) {
                    console.log('GitHub token validation failed, but continuing:', githubError.message);
                    // Don't fail authentication if GitHub validation fails
                }
            }
            
            // Attach user to the request object, excluding the access token for security
            req.user = await User.findById(decoded.id).select('-githubAccessToken');
            next();
        } catch (error) {
            console.error('Auth middleware error:', error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};