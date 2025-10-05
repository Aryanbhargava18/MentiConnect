const express = require('express');
const { 
  getGoals, 
  createGoal, 
  updateGoal, 
  deleteGoal, 
  updateProgress 
} = require('../controllers/goalController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', protect, getGoals);
router.post('/', protect, createGoal);
router.put('/:goalId', protect, updateGoal);
router.delete('/:goalId', protect, deleteGoal);
router.put('/:goalId/progress', protect, updateProgress);

module.exports = router;