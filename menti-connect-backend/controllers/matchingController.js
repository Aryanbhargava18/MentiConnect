// controllers/matchController.js
const User = require('../models/User');
const Match = require('../models/Match');
const { getAIMatches, createMatch } = require('../services/aiMatchingService');
const { createNotificationHelper } = require('./notificationController');
const { analyzeUserActivity } = require('../services/githubService');

// @desc    Get potential matches for the logged-in user
// @route   GET /api/matches
exports.getMatches = async (req, res) => {
    try {
        const currentUser = req.user;
        
        // Get AI-powered matches
        const matches = await getAIMatches(currentUser._id);
        
        res.status(200).json(matches);
    } catch (error) {
        console.error('Error getting matches:', error);
        res.status(500).json({ message: 'Failed to fetch matches' });
    }
};

// @desc    Get AI-powered matches
// @route   GET /api/matches/ai
exports.getAIMatches = async (req, res) => {
    try {
        const currentUser = req.user;
        const matches = await getAIMatches(currentUser._id);
        res.status(200).json(matches);
    } catch (error) {
        console.error('Error getting AI matches:', error);
        res.status(500).json({ message: 'Failed to fetch AI matches' });
    }
};

// @desc    Accept a match (connect with someone)
// @route   POST /api/matches/accept/:matchId
exports.acceptMatch = async (req, res) => {
    try {
        const { matchId } = req.params;
        const currentUser = req.user;
        
        // Validate matchId
        if (!matchId || matchId === currentUser._id.toString()) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid match ID' 
            });
        }

        // Check if already connected
        if (currentUser.acceptedMatches.includes(matchId)) {
            return res.status(400).json({ 
                success: false,
                message: 'Already connected with this user' 
            });
        }

        // Get the target user to check their capacity
        const targetUser = await User.findById(matchId);
        if (!targetUser) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        // Check if target user has capacity (for mentors)
        if (targetUser.role === 'mentor' && targetUser.acceptedMatches.length >= targetUser.mentoringCapacity) {
            return res.status(400).json({ 
                success: false,
                message: 'This mentor has reached their capacity limit' 
            });
        }
        
        // Add the match to both users' accepted matches
        const [updatedCurrentUser, updatedTargetUser] = await Promise.all([
            User.findByIdAndUpdate(
                currentUser._id,
                { $addToSet: { acceptedMatches: matchId } },
                { new: true }
            ),
            User.findByIdAndUpdate(
                matchId,
                { $addToSet: { acceptedMatches: currentUser._id } },
                { new: true }
            )
        ]);

        if (!updatedCurrentUser || !updatedTargetUser) {
            return res.status(500).json({ 
                success: false,
                message: 'Failed to update connection' 
            });
        }

        // Create match record
        const matchRecord = await createMatch(
            currentUser._id,
            matchId,
            85, // Default match score
            {
                compatibilityScore: 85,
                factors: { skills: 30, availability: 20, experience: 15, goals: 10, github: 10 },
                recommendations: ['Great match! Start your mentorship journey.']
            }
        );

        // Create a conversation between the matched users
        try {
            const Conversation = require('../models/Conversation');
            const existingConversation = await Conversation.findOne({
                participants: { $all: [currentUser._id, matchId] }
            });

            if (!existingConversation) {
                const conversation = new Conversation({
                    participants: [currentUser._id, matchId],
                    conversationType: 'mentorship',
                    metadata: {
                        mentorshipGoal: 'Professional development',
                        startDate: new Date()
                    }
                });
                await conversation.save();
                console.log('Conversation created between users');
            }
        } catch (conversationError) {
            console.error('Error creating conversation:', conversationError);
        }

        // Send notifications
        try {
            await createNotificationHelper(
                currentUser._id,
                'match',
                'New Connection!',
                `You've successfully connected with ${targetUser.username}`,
                { matchId: matchRecord._id }
            );
            
            await createNotificationHelper(
                matchId,
                'match',
                'New Connection!',
                `${currentUser.username} wants to connect with you`,
                { matchId: matchRecord._id }
            );
        } catch (notificationError) {
            console.error('Notification error:', notificationError);
            // Don't fail the connection if notification fails
        }

        res.status(200).json({ 
            success: true,
            message: 'Match accepted successfully!',
            connection: {
                currentUser: {
                    id: updatedCurrentUser._id,
                    username: updatedCurrentUser.username,
                    acceptedMatches: updatedCurrentUser.acceptedMatches
                },
                targetUser: {
                    id: updatedTargetUser._id,
                    username: updatedTargetUser.username
                }
            }
        });
    } catch (error) {
        console.error('Error accepting match:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to accept match' 
        });
    }
};

// @desc    Reject a match
// @route   POST /api/matches/reject/:matchId
exports.rejectMatch = async (req, res) => {
    try {
        const { matchId } = req.params;
        const currentUser = req.user;
        
        // Validate matchId
        if (!matchId || matchId === currentUser._id.toString()) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid match ID' 
            });
        }

        // Check if already rejected
        if (currentUser.rejectedMatches.includes(matchId)) {
            return res.status(400).json({ 
                success: false,
                message: 'Already rejected this user' 
            });
        }
        
        // Add the match to user's rejected matches
        const updatedUser = await User.findByIdAndUpdate(
            currentUser._id,
            { $addToSet: { rejectedMatches: matchId } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        res.status(200).json({ 
            success: true,
            message: 'Match rejected successfully',
            rejectedMatches: updatedUser.rejectedMatches 
        });
    } catch (error) {
        console.error('Error rejecting match:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to reject match' 
        });
    }
};