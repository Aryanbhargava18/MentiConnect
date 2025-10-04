// routes/analyticsRoutes.js
const express = require('express');
const { getGitHubAnalytics } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// @desc    Get GitHub analytics
// @route   GET /api/analytics/github
router.get('/github', protect, getGitHubAnalytics);

module.exports = router;
