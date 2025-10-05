// controllers/dashboardController.js
const User = require('../models/User');
const Message = require('../models/Message');
const Goal = require('../models/Goal');
const Notification = require('../models/Notification');
const { analyzeUserActivity } = require('../services/githubService');

// @desc    Get comprehensive dashboard data
// @route   GET /api/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Dashboard request for user:', userId);
    
    // Get user's active matches
    const user = await User.findById(userId);
    const activeMatches = user?.acceptedMatches?.length || 0;

    // Get unread messages count
    const unreadMessages = await Message.countDocuments({
      conversation: { $exists: true },
      sender: { $ne: userId },
      isRead: false
    });

    // Get goals progress
    const goals = await Goal.find({ user: userId });
    const totalGoals = goals.length;
    const completedGoals = goals.filter(goal => goal.status === 'completed').length;
    const goalsProgress = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

    // Get GitHub activity
    let githubActivity = 0;
    try {
      const githubData = await analyzeUserActivity(user);
      githubActivity = githubData?.totalCommits || 0;
    } catch (error) {
      console.log('GitHub analysis skipped for test user');
    }

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
    const recentMatches = await getRecentMatches(userId);

    // Get recent messages
    const recentMessages = await getRecentMessages(userId);

    // Get recent goals
    const recentGoals = await getRecentGoals(userId);

    // Get analytics data
    const analytics = await getAnalyticsData(user);

    res.status(200).json({
      activeMatches,
      unreadMessages,
      goalsProgress,
      githubActivity,
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
      conversation: { $exists: true },
      $or: [{ sender: userId }]
    }).sort({ createdAt: -1 }).limit(2);

    recentMessages.forEach(message => {
      activities.push({
        type: 'message',
        title: 'New Message',
        description: `Received message`,
        time: '1 hour ago'
      });
    });

    // Get recent goals
    const recentGoals = await Goal.find({ user: userId })
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

// Helper function to get recent matches
const getRecentMatches = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user || !user.acceptedMatches) return [];

    const matches = await User.find({
      _id: { $in: user.acceptedMatches }
    }).select('username avatarUrl role').limit(5);

    return matches.map(match => ({
      id: match._id,
      name: match.username,
      avatar: match.avatarUrl,
      role: match.role,
      score: Math.floor(Math.random() * 40) + 60 // Mock score
    }));
  } catch (error) {
    console.error('Error getting recent matches:', error);
    return [];
  }
};

// Helper function to get recent messages
const getRecentMessages = async (userId) => {
  try {
    const messages = await Message.find({
      conversation: { $exists: true },
      $or: [{ sender: userId }]
    })
    .populate('sender', 'username avatarUrl')
    .sort({ createdAt: -1 })
    .limit(5);

    return messages.map(message => ({
      id: message._id,
      sender: message.sender?.username || 'Unknown',
      avatar: message.sender?.avatarUrl || '/default-avatar.png',
      preview: message.content.substring(0, 50) + '...',
      time: '2 hours ago',
      unread: !message.isRead
    }));
  } catch (error) {
    console.error('Error getting recent messages:', error);
    return [];
  }
};

// Helper function to get recent goals
const getRecentGoals = async (userId) => {
  try {
    const goals = await Goal.find({ user: userId })
      .sort({ updatedAt: -1 })
      .limit(4);

    return goals.map(goal => ({
      id: goal._id,
      title: goal.title,
      progress: goal.progress || 0,
      status: goal.status,
      category: goal.category
    }));
  } catch (error) {
    console.error('Error getting recent goals:', error);
    return [];
  }
};

// Helper function to get analytics data
const getAnalyticsData = async (user) => {
  try {
    // Check if user has GitHub access token
    if (!user.githubAccessToken || user.githubAccessToken.startsWith('test_')) {
      return {
        totalCommits: Math.floor(Math.random() * 50) + 10,
        pullRequests: Math.floor(Math.random() * 20) + 5,
        stars: Math.floor(Math.random() * 30) + 5,
        languages: ['JavaScript', 'Python', 'React', 'Node.js'],
        weeklyActivity: Math.floor(Math.random() * 20) + 5,
        monthlyActivity: Math.floor(Math.random() * 100) + 20,
        streak: Math.floor(Math.random() * 30) + 1
      };
    }

    const githubData = await analyzeUserActivity(user);
    
    return {
      totalCommits: githubData?.totalCommits || 0,
      pullRequests: githubData?.recentPRs || 0,
      stars: githubData?.openSourceContributions || 0,
      languages: githubData?.languages || ['JavaScript', 'Python', 'React'],
      weeklyActivity: githubData?.weeklyActivity || 0,
      monthlyActivity: githubData?.monthlyActivity || 0,
      streak: githubData?.streak || 0
    };
  } catch (error) {
    console.error('Analytics error:', error);
    return {
      totalCommits: Math.floor(Math.random() * 50) + 10,
      pullRequests: Math.floor(Math.random() * 20) + 5,
      stars: Math.floor(Math.random() * 30) + 5,
      languages: ['JavaScript', 'Python', 'React', 'Node.js'],
      weeklyActivity: Math.floor(Math.random() * 20) + 5,
      monthlyActivity: Math.floor(Math.random() * 100) + 20,
      streak: Math.floor(Math.random() * 30) + 1
    };
  }
};