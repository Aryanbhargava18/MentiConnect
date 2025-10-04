// controllers/matchingController.js
const User = require('../models/User');
const { analyzeUserActivity } = require('../services/githubService');

// @desc    Get potential matches based on user role and skills
// @route   GET /api/matches
exports.getMatches = async (req, res) => {
    try {
        const currentUser = req.user;
        const { role, skills } = currentUser;
        
        // Determine what type of users to find
        let targetRoles = [];
        if (role === 'mentor') {
            targetRoles = ['mentee', 'both'];
        } else if (role === 'mentee') {
            targetRoles = ['mentor', 'both'];
        } else if (role === 'both') {
            targetRoles = ['mentor', 'mentee', 'both'];
        }

        // Find users with target roles and skills
        let query = {
            _id: { $ne: currentUser._id }, // Exclude current user
            role: { $in: targetRoles },
            skills: { $exists: true, $ne: [] }
        };

        // If user has skills, find users with matching skills
        if (skills && skills.length > 0) {
            query.skills = { $in: skills };
        }

        const matches = await User.find(query)
            .select('-githubAccessToken -__v')
            .limit(20);

        // Sort by skill match count (basic matching algorithm)
        const sortedMatches = matches.sort((a, b) => {
            const aSkillMatches = a.skills ? a.skills.filter(skill => 
                currentUser.skills && currentUser.skills.includes(skill)
            ).length : 0;
            const bSkillMatches = b.skills ? b.skills.filter(skill => 
                currentUser.skills && currentUser.skills.includes(skill)
            ).length : 0;
            return bSkillMatches - aSkillMatches;
        });

        res.status(200).json(sortedMatches);
    } catch (error) {
        console.error('Error fetching matches:', error);
        res.status(500).json({ message: 'Failed to fetch matches' });
    }
};

// @desc    Get AI-powered matches based on GitHub activity and skills
// @route   GET /api/matches/ai
exports.getAIMatches = async (req, res) => {
    try {
        const currentUser = req.user;
        const { role, skills } = currentUser;
        
        // This is where we'll integrate AI matching in the future
        // For now, return enhanced matches with GitHub activity analysis
        
        // Determine what type of users to find
        let targetRoles = [];
        if (role === 'mentor') {
            targetRoles = ['mentee', 'both'];
        } else if (role === 'mentee') {
            targetRoles = ['mentor', 'both'];
        } else if (role === 'both') {
            targetRoles = ['mentor', 'mentee', 'both'];
        }

        // Find users with target roles
        const matches = await User.find({
            _id: { $ne: currentUser._id },
            role: { $in: targetRoles },
            skills: { $exists: true, $ne: [] }
        })
        .select('-githubAccessToken -__v')
        .limit(20);

        // Enhanced matching algorithm with GitHub analysis
        const enhancedMatches = await Promise.all(matches.map(async (match) => {
            const skillMatches = match.skills ? match.skills.filter(skill => 
                currentUser.skills && currentUser.skills.includes(skill)
            ).length : 0;
            
            const totalSkills = match.skills ? match.skills.length : 0;
            const baseMatchScore = totalSkills > 0 ? (skillMatches / totalSkills) * 100 : 0;
            
            // Get GitHub activity analysis for better matching
            let githubInsights = null;
            try {
                githubInsights = await analyzeUserActivity(match._id);
            } catch (error) {
                console.log('Could not analyze GitHub activity for user:', match.username);
            }
            
            // Calculate enhanced match score with GitHub data
            let enhancedScore = baseMatchScore;
            if (githubInsights) {
                // Boost score based on GitHub activity
                const activityBoost = githubInsights.activityLevel === 'high' ? 10 : 
                                    githubInsights.activityLevel === 'medium' ? 5 : 0;
                enhancedScore = Math.min(100, baseMatchScore + activityBoost);
            }
            
            return {
                ...match.toObject(),
                matchScore: Math.round(enhancedScore),
                skillMatches: skillMatches,
                aiInsights: {
                    compatibilityScore: enhancedScore,
                    recommendedSkills: match.skills ? match.skills.slice(0, 3) : [],
                    githubActivity: githubInsights ? {
                        activityLevel: githubInsights.activityLevel,
                        languages: githubInsights.languages,
                        recentPRs: githubInsights.recentPRs,
                        openSourceContributions: githubInsights.openSourceContributions
                    } : null,
                    // Future: Add more AI insights based on GitHub data
                }
            };
        }));

        // Sort by match score
        const sortedMatches = enhancedMatches.sort((a, b) => b.matchScore - a.matchScore);

        res.status(200).json(sortedMatches);
    } catch (error) {
        console.error('Error fetching AI matches:', error);
        res.status(500).json({ message: 'Failed to fetch AI matches' });
    }
};

// @desc    Accept a match (connect with someone)
// @route   POST /api/matches/accept/:matchId
exports.acceptMatch = async (req, res) => {
    try {
        const { matchId } = req.params;
        const currentUser = req.user;
        
        // Add the match to user's accepted matches
        const updatedUser = await User.findByIdAndUpdate(
            currentUser._id,
            { $addToSet: { acceptedMatches: matchId } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ 
            message: 'Match accepted successfully',
            acceptedMatches: updatedUser.acceptedMatches 
        });
    } catch (error) {
        console.error('Error accepting match:', error);
        res.status(500).json({ message: 'Failed to accept match' });
    }
};

// @desc    Reject a match
// @route   POST /api/matches/reject/:matchId
exports.rejectMatch = async (req, res) => {
    try {
        const { matchId } = req.params;
        const currentUser = req.user;
        
        // Add the match to user's rejected matches
        const updatedUser = await User.findByIdAndUpdate(
            currentUser._id,
            { $addToSet: { rejectedMatches: matchId } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ 
            message: 'Match rejected successfully',
            rejectedMatches: updatedUser.rejectedMatches 
        });
    } catch (error) {
        console.error('Error rejecting match:', error);
        res.status(500).json({ message: 'Failed to reject match' });
    }
};
