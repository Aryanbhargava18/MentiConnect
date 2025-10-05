const User = require('../models/User');
const { analyzeUserActivity } = require('../services/githubService');

// @desc    Get analytics data for a user
// @route   GET /api/analytics
exports.getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has GitHub access token
    if (!user.githubAccessToken || user.githubAccessToken.startsWith('test_')) {
      // Return default analytics for test users
      return res.status(200).json({
        totalCommits: 0,
        pullRequests: 0,
        repositories: 0,
        stars: 0,
        languages: ['JavaScript', 'Python', 'React'],
        weeklyActivity: 0,
        monthlyActivity: 0,
        streak: 0,
        activityLevel: 'low',
        recentActivity: [],
        githubConnected: false
      });
    }

    try {
      // Get GitHub analytics
      const githubData = await analyzeUserActivity(user);
      
      if (!githubData) {
        return res.status(200).json({
          totalCommits: 0,
          pullRequests: 0,
          repositories: 0,
          stars: 0,
          languages: ['JavaScript', 'Python', 'React'],
          weeklyActivity: 0,
          monthlyActivity: 0,
          streak: 0,
          activityLevel: 'low',
          recentActivity: [],
          githubConnected: true
        });
      }

      res.status(200).json({
        totalCommits: githubData.totalCommits || 0,
        pullRequests: githubData.pullRequests || 0,
        repositories: githubData.repositories || 0,
        stars: githubData.stars || 0,
        languages: githubData.languages || ['JavaScript', 'Python', 'React'],
        weeklyActivity: githubData.weeklyActivity || 0,
        monthlyActivity: githubData.monthlyActivity || 0,
        streak: githubData.streak || 0,
        activityLevel: githubData.activityLevel || 'low',
        recentActivity: githubData.recentActivity || [],
        githubConnected: true
      });
    } catch (error) {
      console.error('GitHub analytics error:', error);
      // Return default data if GitHub API fails
      res.status(200).json({
        totalCommits: 0,
        pullRequests: 0,
        repositories: 0,
        stars: 0,
        languages: ['JavaScript', 'Python', 'React'],
        weeklyActivity: 0,
        monthlyActivity: 0,
        streak: 0,
        activityLevel: 'low',
        recentActivity: [],
        githubConnected: false
      });
    }
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
};