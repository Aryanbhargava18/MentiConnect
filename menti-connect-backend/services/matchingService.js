// services/matchingService.js
const User = require('../models/User');
const { analyzeUserActivity } = require('./githubService');

// Advanced ML-based matching algorithm
class MatchingService {
  constructor() {
    this.weights = {
      skills: 0.3,
      githubActivity: 0.25,
      availability: 0.2,
      experience: 0.15,
      goals: 0.1
    };
  }

  // Calculate compatibility score between two users
  async calculateCompatibility(user1, user2) {
    let totalScore = 0;
    const factors = {};

    // Skills matching (30% weight)
    const skillScore = this.calculateSkillMatch(user1.skills, user2.skills);
    factors.skills = skillScore;
    totalScore += skillScore * this.weights.skills;

    // GitHub activity compatibility (25% weight)
    const githubScore = await this.calculateGitHubCompatibility(user1._id, user2._id);
    factors.github = githubScore;
    totalScore += githubScore * this.weights.githubActivity;

    // Availability matching (20% weight)
    const availabilityScore = this.calculateAvailabilityMatch(user1.availability, user2.availability);
    factors.availability = availabilityScore;
    totalScore += availabilityScore * this.weights.availability;

    // Experience level compatibility (15% weight)
    const experienceScore = this.calculateExperienceMatch(user1, user2);
    factors.experience = experienceScore;
    totalScore += experienceScore * this.weights.experience;

    // Goals alignment (10% weight)
    const goalsScore = this.calculateGoalsMatch(user1.goals, user2.goals);
    factors.goals = goalsScore;
    totalScore += goalsScore * this.weights.goals;

    return {
      totalScore: Math.round(totalScore * 100),
      factors,
      recommendations: this.generateRecommendations(factors)
    };
  }

  // Calculate skill matching score
  calculateSkillMatch(skills1, skills2) {
    if (!skills1 || !skills2 || skills1.length === 0 || skills2.length === 0) {
      return 0;
    }

    const commonSkills = skills1.filter(skill => skills2.includes(skill));
    const totalSkills = new Set([...skills1, ...skills2]).size;
    
    return commonSkills.length / totalSkills;
  }

  // Calculate GitHub activity compatibility
  async calculateGitHubCompatibility(userId1, userId2) {
    try {
      const [activity1, activity2] = await Promise.all([
        analyzeUserActivity(userId1),
        analyzeUserActivity(userId2)
      ]);

      if (!activity1 || !activity2) return 0.5;

      // Compare activity levels
      const activityLevels = { high: 3, medium: 2, low: 1 };
      const levelDiff = Math.abs(activityLevels[activity1.activityLevel] - activityLevels[activity2.activityLevel]);
      const activityScore = 1 - (levelDiff / 2);

      // Compare programming languages
      const commonLanguages = activity1.languages.filter(lang => 
        activity2.languages.includes(lang)
      );
      const languageScore = commonLanguages.length / Math.max(activity1.languages.length, activity2.languages.length);

      return (activityScore + languageScore) / 2;
    } catch (error) {
      console.error('GitHub compatibility error:', error);
      return 0.5;
    }
  }

  // Calculate availability matching
  calculateAvailabilityMatch(availability1, availability2) {
    if (!availability1 || !availability2 || availability1.length === 0 || availability2.length === 0) {
      return 0.5;
    }

    // Simple overlap calculation - can be enhanced with time parsing
    const overlap = availability1.filter(slot => availability2.includes(slot));
    return overlap.length / Math.max(availability1.length, availability2.length);
  }

  // Calculate experience level compatibility
  calculateExperienceMatch(user1, user2) {
    const experienceLevels = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 };
    
    const level1 = experienceLevels[user1.experienceLevel] || 2;
    const level2 = experienceLevels[user2.experienceLevel] || 2;
    
    // Ideal: mentor should be 1-2 levels above mentee
    const diff = Math.abs(level1 - level2);
    return diff <= 2 ? (2 - diff) / 2 : 0;
  }

  // Calculate goals matching
  calculateGoalsMatch(goals1, goals2) {
    if (!goals1 || !goals2 || goals1.length === 0 || goals2.length === 0) {
      return 0.5;
    }

    const commonGoals = goals1.filter(goal => goals2.includes(goal));
    return commonGoals.length / Math.max(goals1.length, goals2.length);
  }

  // Generate personalized recommendations
  generateRecommendations(factors) {
    const recommendations = [];

    if (factors.skills < 0.3) {
      recommendations.push("Consider learning complementary skills to improve matching");
    }

    if (factors.github < 0.4) {
      recommendations.push("Increase GitHub activity to find more compatible matches");
    }

    if (factors.availability < 0.3) {
      recommendations.push("Update your availability to find better time matches");
    }

    if (factors.experience < 0.5) {
      recommendations.push("Consider adjusting your experience level for better matches");
    }

    return recommendations;
  }

  // Find best matches for a user
  async findBestMatches(userId, limit = 10) {
    try {
      const currentUser = await User.findById(userId);
      if (!currentUser) throw new Error('User not found');

      // Get potential matches based on role
      const potentialMatches = await this.getPotentialMatches(currentUser);
      
      // Calculate compatibility for each match
      const matchesWithScores = await Promise.all(
        potentialMatches.map(async (match) => {
          const compatibility = await this.calculateCompatibility(currentUser, match);
          return {
            ...match.toObject(),
            compatibility,
            matchScore: compatibility.totalScore,
            aiInsights: {
              compatibilityScore: compatibility.totalScore,
              factors: compatibility.factors,
              recommendations: compatibility.recommendations
            }
          };
        })
      );

      // Sort by compatibility score
      return matchesWithScores
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, limit);
    } catch (error) {
      console.error('Error finding matches:', error);
      throw error;
    }
  }

  // Get potential matches based on user role
  async getPotentialMatches(user) {
    const query = {
      _id: { $ne: user._id },
      $or: []
    };

    // Role-based matching
    if (user.role === 'mentor' || user.role === 'both') {
      query.$or.push({ role: 'mentee' }, { role: 'both' });
    }
    if (user.role === 'mentee' || user.role === 'both') {
      query.$or.push({ role: 'mentor' }, { role: 'both' });
    }

    // Exclude already matched users
    if (user.acceptedMatches && user.acceptedMatches.length > 0) {
      query._id.$nin = user.acceptedMatches;
    }
    if (user.rejectedMatches && user.rejectedMatches.length > 0) {
      query._id.$nin = [...(query._id.$nin || []), ...user.rejectedMatches];
    }

    return await User.find(query)
      .select('-githubAccessToken -__v')
      .limit(50);
  }
}

module.exports = new MatchingService();
