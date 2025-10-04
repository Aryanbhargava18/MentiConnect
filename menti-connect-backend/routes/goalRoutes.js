// routes/goalRoutes.js
const express = require('express');
const {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  addMilestone,
  updateMilestone,
  addAchievement
} = require('../controllers/goalController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// @desc    Get user goals
// @route   GET /api/goals
router.get('/', protect, getGoals);

// @desc    Create new goal
// @route   POST /api/goals
router.post('/', protect, createGoal);

// @desc    Update goal
// @route   PUT /api/goals/:id
router.put('/:id', protect, updateGoal);

// @desc    Delete goal
// @route   DELETE /api/goals/:id
router.delete('/:id', protect, deleteGoal);

// @desc    Add milestone to goal
// @route   POST /api/goals/:id/milestones
router.post('/:id/milestones', protect, addMilestone);

// @desc    Update milestone
// @route   PUT /api/goals/:id/milestones/:milestoneId
router.put('/:id/milestones/:milestoneId', protect, updateMilestone);

// @desc    Add achievement to goal
// @route   POST /api/goals/:id/achievements
router.post('/:id/achievements', protect, addAchievement);

module.exports = router;
