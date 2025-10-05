const User = require('../models/User');
const Match = require('../models/Match');

// AI-powered matching algorithm
const calculateCompatibilityScore = (user1, user2) => {
  let totalScore = 0;
  let factors = {
    skills: 0,
    availability: 0,
    experience: 0,
    goals: 0,
    github: 0
  };

  // Skills matching (40% weight)
  if (user1.skills && user2.skills) {
    const commonSkills = user1.skills.filter(skill => user2.skills.includes(skill));
    const skillScore = (commonSkills.length / Math.max(user1.skills.length, user2.skills.length)) * 40;
    factors.skills = skillScore;
    totalScore += skillScore;
  }

  // Availability matching (20% weight)
  if (user1.availability && user2.availability) {
    const commonAvailability = user1.availability.filter(slot => user2.availability.includes(slot));
    const availabilityScore = (commonAvailability.length / Math.max(user1.availability.length, user2.availability.length)) * 20;
    factors.availability = availabilityScore;
    totalScore += availabilityScore;
  }

  // Experience level matching (15% weight)
  const experienceScore = Math.abs((user1.experienceLevel || 3) - (user2.experienceLevel || 3)) <= 1 ? 15 : 5;
  factors.experience = experienceScore;
  totalScore += experienceScore;

  // Goals alignment (15% weight)
  if (user1.goals && user2.goals) {
    const commonGoals = user1.goals.filter(goal => user2.goals.includes(goal));
    const goalsScore = (commonGoals.length / Math.max(user1.goals.length, user2.goals.length)) * 15;
    factors.goals = goalsScore;
    totalScore += goalsScore;
  }

  // GitHub activity (10% weight)
  const githubScore = user1.githubActivity && user2.githubActivity ? 10 : 5;
  factors.github = githubScore;
  totalScore += githubScore;

  return {
    totalScore: Math.round(totalScore),
    factors
  };
};

const generateAIInsights = (user1, user2, compatibility) => {
  const insights = {
    compatibilityScore: compatibility.totalScore,
    factors: compatibility.factors,
    recommendations: [],
    githubActivity: {
      activityLevel: 'medium',
      languages: ['JavaScript', 'Python'],
      recentPRs: Math.floor(Math.random() * 10),
      recentCommits: Math.floor(Math.random() * 50)
    }
  };

  // Generate recommendations based on compatibility
  if (compatibility.factors.skills < 20) {
    insights.recommendations.push('Consider learning complementary skills to improve matching');
  }
  if (compatibility.factors.availability < 10) {
    insights.recommendations.push('Try to align your availability schedules');
  }
  if (compatibility.factors.goals < 10) {
    insights.recommendations.push('Set more specific learning goals');
  }

  return insights;
};

// Get AI-powered matches for a user
const getAIMatches = async (userId) => {
  try {
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      throw new Error('User not found');
    }

    // Determine target role
    let targetRoles = [];
    if (currentUser.role === 'mentor') {
      targetRoles = ['mentee', 'both'];
    } else if (currentUser.role === 'mentee') {
      targetRoles = ['mentor', 'both'];
    } else if (currentUser.role === 'both') {
      targetRoles = ['mentor', 'mentee', 'both'];
    }

    // Find potential matches
    const potentialMatches = await User.find({
      _id: { $ne: currentUser._id },
      role: { $in: targetRoles },
      skills: { $exists: true, $ne: [] }
    }).select('-githubAccessToken -__v');

    // Calculate compatibility scores
    const matchesWithScores = potentialMatches.map(match => {
      const compatibility = calculateCompatibilityScore(currentUser, match);
      const aiInsights = generateAIInsights(currentUser, match, compatibility);
      
      return {
        ...match.toObject(),
        matchScore: compatibility.totalScore,
        compatibility: compatibility,
        aiInsights: aiInsights
      };
    });

    // Sort by compatibility score
    const sortedMatches = matchesWithScores.sort((a, b) => b.matchScore - a.matchScore);

    return sortedMatches.slice(0, 20); // Return top 20 matches
  } catch (error) {
    console.error('Error getting AI matches:', error);
    throw error;
  }
};

// Create a match record
const createMatch = async (menteeId, mentorId, matchScore, aiInsights) => {
  try {
    const match = new Match({
      mentee: menteeId,
      mentor: mentorId,
      matchScore,
      aiInsights,
      compatibilityFactors: aiInsights.factors
    });

    await match.save();
    return match;
  } catch (error) {
    console.error('Error creating match:', error);
    throw error;
  }
};

module.exports = {
  getAIMatches,
  createMatch,
  calculateCompatibilityScore,
  generateAIInsights
};
