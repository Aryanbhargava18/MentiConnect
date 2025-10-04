// controllers/goalController.js
const Goal = require('../models/Goal');
const User = require('../models/User');
const notificationService = require('../services/notificationService');

// @desc    Get user goals
// @route   GET /api/goals
exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.id })
      .populate('mentor', 'username avatarUrl')
      .sort({ createdAt: -1 });

    res.status(200).json(goals);
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new goal
// @route   POST /api/goals
exports.createGoal = async (req, res) => {
  try {
    const goalData = {
      ...req.body,
      userId: req.user.id
    };

    const goal = new Goal(goalData);
    await goal.save();
    await goal.populate('mentor', 'username avatarUrl');

    res.status(201).json(goal);
  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update goal
// @route   PUT /api/goals/:id
exports.updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const goal = await Goal.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      updates,
      { new: true }
    ).populate('mentor', 'username avatarUrl');

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    // Check if goal was completed
    if (updates.status === 'completed' && goal.status === 'completed') {
      await notificationService.sendGoalAchievement(req.user.id, goal.title);
    }

    res.status(200).json(goal);
  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete goal
// @route   DELETE /api/goals/:id
exports.deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;

    const goal = await Goal.findOneAndDelete({
      _id: id,
      userId: req.user.id
    });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.status(200).json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add milestone to goal
// @route   POST /api/goals/:id/milestones
exports.addMilestone = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const goal = await Goal.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      {
        $push: {
          milestones: {
            title,
            description
          }
        }
      },
      { new: true }
    ).populate('mentor', 'username avatarUrl');

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.status(200).json(goal);
  } catch (error) {
    console.error('Add milestone error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update milestone
// @route   PUT /api/goals/:id/milestones/:milestoneId
exports.updateMilestone = async (req, res) => {
  try {
    const { id, milestoneId } = req.params;
    const updates = req.body;

    const goal = await Goal.findOneAndUpdate(
      { _id: id, userId: req.user.id, 'milestones._id': milestoneId },
      {
        $set: {
          'milestones.$.title': updates.title,
          'milestones.$.description': updates.description,
          'milestones.$.completed': updates.completed,
          'milestones.$.completedAt': updates.completed ? new Date() : null
        }
      },
      { new: true }
    ).populate('mentor', 'username avatarUrl');

    if (!goal) {
      return res.status(404).json({ message: 'Goal or milestone not found' });
    }

    res.status(200).json(goal);
  } catch (error) {
    console.error('Update milestone error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add achievement to goal
// @route   POST /api/goals/:id/achievements
exports.addAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const goal = await Goal.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      {
        $push: {
          achievements: {
            title,
            description
          }
        }
      },
      { new: true }
    ).populate('mentor', 'username avatarUrl');

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.status(200).json(goal);
  } catch (error) {
    console.error('Add achievement error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
