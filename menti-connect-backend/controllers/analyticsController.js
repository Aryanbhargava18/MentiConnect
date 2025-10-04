// controllers/analyticsController.js
const { analyzeUserActivity } = require('../services/githubService');

// @desc    Get GitHub analytics for user
// @route   GET /api/analytics/github
exports.getGitHubAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const { range = '30d' } = req.query;

    console.log('Analytics request for user:', userId, 'range:', range);

    // Get user from database to check GitHub token
    const User = require('../models/User');
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get GitHub activity analysis
    let githubData = null;
    try {
      if (user.githubAccessToken) {
        githubData = await analyzeUserActivity(userId);
        console.log('GitHub data fetched:', githubData);
      } else {
        console.log('No GitHub access token found');
      }
    } catch (githubError) {
      console.log('GitHub analysis failed:', githubError.message);
    }
    
    if (!githubData) {
      console.log('No GitHub data available, returning default analytics');
      // Return default analytics data with some realistic values
      return res.status(200).json({
        totalCommits: 0,
        pullRequests: 0,
        repositories: 0,
        stars: 0,
        languages: ['JavaScript', 'Python', 'React', 'Node.js'],
        activityLevel: 'low',
        recentPRs: 0,
        openSourceContributions: 0,
        skillIndicators: {
          frontend: 0,
          backend: 0,
          devops: 0,
          testing: 0
        },
        trends: {
          commitsTrend: 0,
          prTrend: 0,
          reposTrend: 0,
          starsTrend: 0
        },
        achievements: [
          {
            name: 'Getting Started',
            description: 'Complete your first commit',
            unlocked: false
          },
          {
            name: 'Active Developer',
            description: 'Make 10+ commits',
            unlocked: false
          },
          {
            name: 'Open Source Contributor',
            description: 'Contribute to open source projects',
            unlocked: false
          },
          {
            name: 'Code Reviewer',
            description: 'Review 5+ pull requests',
            unlocked: false
          }
        ],
        heatmap: Array(52).fill().map(() => Array(7).fill(0)),
        skills: [
          { name: 'JavaScript', level: 0 },
          { name: 'Python', level: 0 },
          { name: 'React', level: 0 },
          { name: 'Node.js', level: 0 },
          { name: 'TypeScript', level: 0 }
        ]
      });
    }

    // Calculate trends based on range
    const trends = calculateTrends(githubData, range);
    
    // Generate achievements
    const achievements = generateAchievements(githubData);
    
    // Create activity heatmap (mock data for now)
    const heatmap = generateHeatmap(githubData);
    
    // Skills assessment
    const skills = assessSkills(githubData);

    res.status(200).json({
      totalCommits: githubData.totalCommits || 0,
      pullRequests: githubData.recentPRs || 0,
      repositories: githubData.totalRepos || 0,
      stars: githubData.openSourceContributions || 0,
      languages: githubData.languages || [],
      activityLevel: githubData.activityLevel || 'low',
      recentPRs: githubData.recentPRs || 0,
      openSourceContributions: githubData.openSourceContributions || 0,
      skillIndicators: githubData.skillIndicators || {},
      trends: trends || {
        commitsTrend: 0,
        prTrend: 0,
        reposTrend: 0,
        starsTrend: 0
      },
      achievements: achievements || [],
      heatmap: heatmap || Array(52).fill().map(() => Array(7).fill(0)),
      skills: skills || []
    });
  } catch (error) {
    console.error('GitHub analytics error:', error);
    
    // Return default analytics data instead of error
    res.status(200).json({
      totalCommits: 0,
      pullRequests: 0,
      repositories: 0,
      stars: 0,
      languages: [],
      activityLevel: 'low',
      recentPRs: 0,
      openSourceContributions: 0,
      skillIndicators: {},
      trends: {
        commitsTrend: 0,
        prTrend: 0,
        reposTrend: 0,
        starsTrend: 0
      },
      achievements: [
        {
          name: 'Getting Started',
          description: 'Complete your first commit',
          unlocked: false
        },
        {
          name: 'Active Developer',
          description: 'Make 10+ commits',
          unlocked: false
        }
      ],
      heatmap: Array(52).fill().map(() => Array(7).fill(0)),
      skills: [
        { name: 'JavaScript', level: 0 },
        { name: 'Python', level: 0 },
        { name: 'React', level: 0 }
      ]
    });
  }
};

// Helper function to calculate trends
const calculateTrends = (githubData, range) => {
  // Mock trend calculations - in production, you'd compare with historical data
  const baseActivity = githubData.activityLevel === 'high' ? 100 : 
                     githubData.activityLevel === 'medium' ? 50 : 20;
  
  return {
    commitsTrend: Math.floor(Math.random() * 40) - 20, // -20 to +20
    prTrend: Math.floor(Math.random() * 30) - 15,
    reposTrend: Math.floor(Math.random() * 20) - 10,
    starsTrend: Math.floor(Math.random() * 50) - 25
  };
};

// Helper function to generate achievements
const generateAchievements = (githubData) => {
  const achievements = [];
  
  if (githubData.totalCommits > 100) {
    achievements.push({
      name: 'Commit Master',
      description: 'Made over 100 commits',
      unlocked: true
    });
  }
  
  if (githubData.recentPRs > 10) {
    achievements.push({
      name: 'Pull Request Pro',
      description: 'Created over 10 pull requests',
      unlocked: true
    });
  }
  
  if (githubData.languages.length > 5) {
    achievements.push({
      name: 'Polyglot',
      description: 'Worked with 5+ programming languages',
      unlocked: true
    });
  }
  
  if (githubData.activityLevel === 'high') {
    achievements.push({
      name: 'Active Developer',
      description: 'High GitHub activity level',
      unlocked: true
    });
  }
  
  // Add some locked achievements
  achievements.push({
    name: 'Open Source Hero',
    description: 'Contribute to 10+ open source projects',
    unlocked: githubData.openSourceContributions > 10
  });
  
  achievements.push({
    name: 'Repository Owner',
    description: 'Own 20+ repositories',
    unlocked: githubData.totalRepos > 20
  });
  
  return achievements;
};

// Helper function to generate activity heatmap
const generateHeatmap = (githubData) => {
  // Generate 52 weeks of data
  const weeks = [];
  for (let week = 0; week < 52; week++) {
    const days = [];
    for (let day = 0; day < 7; day++) {
      // Generate random activity level (0-4)
      const activity = Math.floor(Math.random() * 5);
      days.push(activity);
    }
    weeks.push(days);
  }
  return weeks;
};

// Helper function to assess skills
const assessSkills = (githubData) => {
  const skills = [];
  
  // Frontend skills
  if (githubData.skillIndicators.frontend > 0) {
    skills.push({
      name: 'Frontend Development',
      level: githubData.skillIndicators.frontend
    });
  }
  
  // Backend skills
  if (githubData.skillIndicators.backend > 0) {
    skills.push({
      name: 'Backend Development',
      level: githubData.skillIndicators.backend
    });
  }
  
  // DevOps skills
  if (githubData.skillIndicators.devops > 0) {
    skills.push({
      name: 'DevOps',
      level: githubData.skillIndicators.devops
    });
  }
  
  // Testing skills
  if (githubData.skillIndicators.testing > 0) {
    skills.push({
      name: 'Testing',
      level: githubData.skillIndicators.testing
    });
  }
  
  return skills;
};
