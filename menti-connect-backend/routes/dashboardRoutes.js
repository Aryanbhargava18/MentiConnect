// routes/dashboardRoutes.js
const express = require('express');
const { getDashboard } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// @desc    Get dashboard data
// @route   GET /api/dashboard
router.get('/', protect, getDashboard);

module.exports = router;
