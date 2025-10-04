// routes/githubRoutes.js
const express = require('express');
const { getPullRequests } = require('../controllers/githubController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/prs', protect, getPullRequests);

module.exports = router;