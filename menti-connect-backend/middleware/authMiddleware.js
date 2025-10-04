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
            
            // Get user with GitHub access token to validate it
            const user = await User.findById(decoded.id);
            if (!user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            // Validate GitHub access token if it exists
            if (user.githubAccessToken) {
                const isTokenValid = await validateGitHubToken(user.githubAccessToken);
                if (!isTokenValid) {
                    // GitHub token is invalid, clear it and require re-authentication
                    user.githubAccessToken = undefined;
                    await user.save();
                    return res.status(401).json({ 
                        message: 'GitHub access revoked. Please re-authenticate.',
                        code: 'GITHUB_TOKEN_INVALID'
                    });
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