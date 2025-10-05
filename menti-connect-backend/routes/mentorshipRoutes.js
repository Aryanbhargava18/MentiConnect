const express = require('express');
const { 
  createSession, 
  getSessions, 
  updateSessionStatus, 
  submitFeedback, 
  getMentorshipAnalytics, 
  getMentorshipDashboard 
} = require('../controllers/mentorshipController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/dashboard', protect, getMentorshipDashboard);
router.get('/analytics', protect, getMentorshipAnalytics);
router.get('/sessions', protect, getSessions);
router.post('/sessions', protect, createSession);
router.put('/sessions/:sessionId/status', protect, updateSessionStatus);
router.post('/feedback', protect, submitFeedback);

module.exports = router;
