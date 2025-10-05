const Goal = require('../models/Goal');
const User = require('../models/User');

// @desc    Get all goals for a user
// @route   GET /api/goals
exports.getGoals = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, category } = req.query;

    let query = { user: userId };
    if (status) query.status = status;
    if (category) query.category = category;

    const goals = await Goal.find(query)
      .populate('mentor', 'username avatarUrl')
      .sort({ createdAt: -1 });

    res.status(200).json(goals);
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({ message: 'Failed to fetch goals' });
  }
};

// @desc    Create a new goal
// @route   POST /api/goals
exports.createGoal = async (req, res) => {
  try {
    const { title, description, category, priority, targetDate, milestones, tags, mentor } = req.body;
    const userId = req.user.id;

    const goal = new Goal({
      user: userId,
      title,
      description,
      category,
      priority,
      targetDate,
      milestones,
      tags,
      mentor
    });

    await goal.save();
    await goal.populate('mentor', 'username avatarUrl');

    res.status(201).json(goal);
  } catch (error) {
    console.error('Error creating goal:', error);
    res.status(500).json({ message: 'Failed to create goal' });
  }
};

// @desc    Update a goal
// @route   PUT /api/goals/:goalId
exports.updateGoal = async (req, res) => {
  try {
    const { goalId } = req.params;
    const userId = req.user.id;
    const updates = req.body;

    const goal = await Goal.findOneAndUpdate(
      { _id: goalId, user: userId },
      updates,
      { new: true }
    ).populate('mentor', 'username avatarUrl');

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.status(200).json(goal);
  } catch (error) {
    console.error('Error updating goal:', error);
    res.status(500).json({ message: 'Failed to update goal' });
  }
};

// @desc    Delete a goal
// @route   DELETE /api/goals/:goalId
exports.deleteGoal = async (req, res) => {
  try {
    const { goalId } = req.params;
    const userId = req.user.id;

    const goal = await Goal.findOneAndDelete({ _id: goalId, user: userId });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.status(200).json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Error deleting goal:', error);
    res.status(500).json({ message: 'Failed to delete goal' });
  }
};

// @desc    Update goal progress
// @route   PUT /api/goals/:goalId/progress
exports.updateProgress = async (req, res) => {
  try {
    const { goalId } = req.params;
    const { progress, milestoneIndex } = req.body;
    const userId = req.user.id;

    const goal = await Goal.findOne({ _id: goalId, user: userId });
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    goal.progress = progress;

    // Update milestone if provided
    if (milestoneIndex !== undefined && goal.milestones[milestoneIndex]) {
      goal.milestones[milestoneIndex].completed = true;
      goal.milestones[milestoneIndex].completedAt = new Date();
    }

    // Update status based on progress
    if (progress === 100) {
      goal.status = 'completed';
      goal.completedDate = new Date();
    } else if (progress > 0) {
      goal.status = 'in_progress';
    }

    await goal.save();
    await goal.populate('mentor', 'username avatarUrl');

    res.status(200).json(goal);
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ message: 'Failed to update progress' });
  }
};