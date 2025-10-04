// controllers/dashboardController.js
const User = require('../models/User');
const Message = require('../models/Message');
const Goal = require('../models/Goal');
const Feedback = require('../models/Feedback');
const Notification = require('../models/Notification');
const matchingService = require('../services/matchingService');
const { analyzeUserActivity } = require('../services/githubService');

// @desc    Get comprehensive dashboard data
// @route   GET /api/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user's active matches
    const activeMatches = await User.find({
      _id: { $in: req.user.acceptedMatches || [] }
    }).select('username avatarUrl role matchScore');

    // Get unread messages count
    const unreadMessages = await Message.countDocuments({
      receiver: userId,
      read: false
    });

    // Get goals progress
    const goals = await Goal.find({ userId });
    const totalGoals = goals.length;
    const completedGoals = goals.filter(goal => goal.status === 'completed').length;
    const goalsProgress = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

    // Get GitHub activity
    const githubActivity = await analyzeUserActivity(userId);
    const githubCommits = githubActivity?.totalCommits || 0;

    // Get recent activity
    const recentActivity = await getRecentActivity(userId);

    // Get upcoming events (mock data for now)
    const upcomingEvents = [
      {
        title: 'Weekly Mentorship Check-in',
        time: 'Tomorrow at 2:00 PM'
      },
      {
        title: 'Goal Review Session',
        time: 'Friday at 10:00 AM'
      }
    ];

    // Get recent matches
    const recentMatches = await matchingService.findBestMatches(userId, 6);

    // Get recent messages
    const recentMessages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }]
    })
    .populate('sender', 'username avatarUrl')
    .populate('receiver', 'username avatarUrl')
    .sort({ createdAt: -1 })
    .limit(5);

    // Get recent goals
    const recentGoals = await Goal.find({ userId })
      .sort({ createdAt: -1 })
      .limit(4);

    // Get analytics data
    const analytics = await getAnalyticsData(userId);

    res.status(200).json({
      activeMatches: activeMatches.length,
      unreadMessages,
      goalsProgress,
      githubActivity: githubCommits,
      recentActivity,
      upcomingEvents,
      recentMatches,
      recentMessages,
      recentGoals,
      totalCommits: analytics.totalCommits,
      pullRequests: analytics.pullRequests,
      stars: analytics.stars,
      languages: analytics.languages,
      weeklyActivity: analytics.weeklyActivity,
      monthlyActivity: analytics.monthlyActivity,
      streak: analytics.streak
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper function to get recent activity
const getRecentActivity = async (userId) => {
  const activities = [];

  try {
    // Get recent matches
    const user = await User.findById(userId);
    if (user && user.acceptedMatches && user.acceptedMatches.length > 0) {
      const recentMatches = await User.find({
        _id: { $in: user.acceptedMatches }
      }).sort({ updatedAt: -1 }).limit(3);

      recentMatches.forEach(match => {
        activities.push({
          type: 'match',
          title: 'New Match',
          description: `Connected with ${match.username}`,
          time: '2 hours ago'
        });
      });
    }

    // Get recent messages
    const recentMessages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }]
    }).sort({ createdAt: -1 }).limit(2);

    recentMessages.forEach(message => {
      activities.push({
        type: 'message',
        title: 'New Message',
        description: `Received message from ${message.sender?.username || 'Unknown'}`,
        time: '1 hour ago'
      });
    });

    // Get recent goals
    const recentGoals = await Goal.find({ userId })
      .sort({ updatedAt: -1 })
      .limit(2);

    recentGoals.forEach(goal => {
      activities.push({
        type: 'goal',
        title: 'Goal Updated',
        description: `Progress on "${goal.title}"`,
        time: '3 hours ago'
      });
    });
  } catch (error) {
    console.error('Error getting recent activity:', error);
  }

  return activities;
};

// Helper function to get analytics data
const getAnalyticsData = async (userId) => {
  try {
    const githubData = await analyzeUserActivity(userId);
    
    return {
      totalCommits: githubData?.totalCommits || 0,
      pullRequests: githubData?.recentPRs || 0,
      stars: githubData?.openSourceContributions || 0,
      languages: githubData?.languages?.map(lang => ({
        name: lang,
        percentage: Math.floor(Math.random() * 40) + 20 // Mock percentage
      })) || [],
      weeklyActivity: Math.floor(Math.random() * 20) + 5,
      monthlyActivity: Math.floor(Math.random() * 100) + 20,
      streak: Math.floor(Math.random() * 30) + 1
    };
  } catch (error) {
    console.error('Analytics error:', error);
    return {
      totalCommits: 0,
      pullRequests: 0,
      stars: 0,
      languages: [],
      weeklyActivity: 0,
      monthlyActivity: 0,
      streak: 0
    };
  }
};
