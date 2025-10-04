// routes/matchRoutes.js
const express = require('express');
const { getMatches, acceptMatch, rejectMatch } = require('../controllers/matchController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', protect, getMatches);
router.post('/accept/:id', protect, acceptMatch);
router.post('/reject/:id', protect, rejectMatch);

module.exports = router;