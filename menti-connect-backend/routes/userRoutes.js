// routes/userRoutes.js
const express = require('express');
const { getMe, updateMe, createTestUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/me').get(protect, getMe).put(protect, updateMe);
router.route('/test').post(createTestUser);

module.exports = router;