// routes/matchRoutes.js
const express = require('express');
const { getMatches, getAIMatches, acceptMatch, rejectMatch } = require('../controllers/matchingController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', protect, getMatches);
router.get('/ai', protect, getAIMatches);
router.post('/accept/:matchId', protect, acceptMatch);
router.post('/reject/:matchId', protect, rejectMatch);

module.exports = router;