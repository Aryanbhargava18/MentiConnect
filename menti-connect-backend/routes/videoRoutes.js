const express = require('express');
const { 
  createVideoRoom, 
  joinVideoRoom, 
  endVideoCall, 
  getVideoCallHistory 
} = require('../controllers/videoController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/create-room', protect, createVideoRoom);
router.post('/join-room', protect, joinVideoRoom);
router.post('/end-call', protect, endVideoCall);
router.get('/history', protect, getVideoCallHistory);

module.exports = router;
