const MentorshipSession = require('../models/MentorshipSession');
const Feedback = require('../models/Feedback');
const User = require('../models/User');
const { createNotificationHelper } = require('./notificationController');

// @desc    Create a mentorship session
// @route   POST /api/mentorship/sessions
exports.createSession = async (req, res) => {
  try {
    const { menteeId, title, description, scheduledDate, duration = 60, sessionType = 'video_call' } = req.body;
    const mentorId = req.user.id;

    // Validate mentor-mentee relationship
    const mentor = await User.findById(mentorId);
    const mentee = await User.findById(menteeId);

    if (!mentor || !mentee) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!mentor.acceptedMatches.includes(menteeId) || !mentee.acceptedMatches.includes(mentorId)) {
      return res.status(403).json({ message: 'Users are not connected' });
    }

    // Generate meeting link for video calls
    const meetingLink = sessionType === 'video_call' ? 
      `https://meet.menticonnect.com/${mentorId}-${menteeId}-${Date.now()}` : null;

    const session = new MentorshipSession({
      mentor: mentorId,
      mentee: menteeId,
      title,
      description,
      scheduledDate: new Date(scheduledDate),
      duration,
      sessionType,
      meetingLink,
      agenda: [
        { topic: 'Introduction & Goals', duration: 10, completed: false },
        { topic: 'Main Discussion', duration: 40, completed: false },
        { topic: 'Action Items & Next Steps', duration: 10, completed: false }
      ]
    });

    await session.save();
    await session.populate(['mentor', 'mentee'], 'username email avatarUrl');

    // Send notifications
    await createNotificationHelper(
      menteeId,
      'session',
      'New Mentorship Session Scheduled',
      `${mentor.username} has scheduled a session: "${title}"`,
      { sessionId: session._id }
    );

    res.status(201).json(session);
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ message: 'Failed to create session' });
  }
};

// @desc    Get user's mentorship sessions
// @route   GET /api/mentorship/sessions
exports.getSessions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, type, upcoming } = req.query;

    let query = {
      $or: [{ mentor: userId }, { mentee: userId }]
    };

    if (status) query.status = status;
    if (type) query.sessionType = type;
    if (upcoming === 'true') {
      query.scheduledDate = { $gte: new Date() };
    }

    const sessions = await MentorshipSession.find(query)
      .populate('mentor', 'username email avatarUrl')
      .populate('mentee', 'username email avatarUrl')
      .sort({ scheduledDate: -1 });

    res.status(200).json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ message: 'Failed to fetch sessions' });
  }
};

// @desc    Update session status
// @route   PUT /api/mentorship/sessions/:sessionId/status
exports.updateSessionStatus = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { status, notes, agenda } = req.body;
    const userId = req.user.id;

    const session = await MentorshipSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Check if user is part of the session
    if (session.mentor.toString() !== userId && session.mentee.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updates = { status };
    if (notes) {
      if (session.mentor.toString() === userId) {
        updates['notes.mentor'] = notes;
      } else {
        updates['notes.mentee'] = notes;
      }
    }
    if (agenda) {
      updates.agenda = agenda;
    }

    const updatedSession = await MentorshipSession.findByIdAndUpdate(
      sessionId,
      updates,
      { new: true }
    ).populate(['mentor', 'mentee'], 'username email avatarUrl');

    res.status(200).json(updatedSession);
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).json({ message: 'Failed to update session' });
  }
};

// @desc    Submit feedback for a session
// @route   POST /api/mentorship/feedback
exports.submitFeedback = async (req, res) => {
  try {
    const { sessionId, rating, categories, comment, strengths, improvements, wouldRecommend } = req.body;
    const fromUserId = req.user.id;

    const session = await MentorshipSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Determine who the feedback is for
    const toUserId = session.mentor.toString() === fromUserId ? session.mentee : session.mentor;

    const feedback = new Feedback({
      from: fromUserId,
      to: toUserId,
      session: sessionId,
      type: 'session',
      rating,
      categories,
      comment,
      strengths,
      improvements,
      wouldRecommend
    });

    await feedback.save();
    await feedback.populate(['from', 'to'], 'username email avatarUrl');

    // Update session with feedback
    if (session.mentor.toString() === fromUserId) {
      session.feedback.mentor = { rating, comment, submittedAt: new Date() };
    } else {
      session.feedback.mentee = { rating, comment, submittedAt: new Date() };
    }
    await session.save();

    res.status(201).json(feedback);
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ message: 'Failed to submit feedback' });
  }
};

// @desc    Get mentorship analytics
// @route   GET /api/mentorship/analytics
exports.getMentorshipAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get session statistics
    const totalSessions = await MentorshipSession.countDocuments({
      $or: [{ mentor: userId }, { mentee: userId }]
    });

    const completedSessions = await MentorshipSession.countDocuments({
      $or: [{ mentor: userId }, { mentee: userId }],
      status: 'completed'
    });

    const upcomingSessions = await MentorshipSession.countDocuments({
      $or: [{ mentor: userId }, { mentee: userId }],
      status: 'scheduled',
      scheduledDate: { $gte: new Date() }
    });

    // Get feedback statistics
    const feedbackStats = await Feedback.aggregate([
      { $match: { to: userId } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalFeedback: { $sum: 1 },
          wouldRecommend: { $sum: { $cond: ['$wouldRecommend', 1, 0] } }
        }
      }
    ]);

    // Get recent sessions
    const recentSessions = await MentorshipSession.find({
      $or: [{ mentor: userId }, { mentee: userId }]
    })
    .populate(['mentor', 'mentee'], 'username avatarUrl')
    .sort({ scheduledDate: -1 })
    .limit(5);

    // Get monthly session trends
    const monthlyTrends = await MentorshipSession.aggregate([
      { $match: { $or: [{ mentor: userId }, { mentee: userId }] } },
      {
        $group: {
          _id: {
            year: { $year: '$scheduledDate' },
            month: { $month: '$scheduledDate' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    res.status(200).json({
      totalSessions,
      completedSessions,
      upcomingSessions,
      completionRate: totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0,
      averageRating: feedbackStats[0]?.averageRating || 0,
      totalFeedback: feedbackStats[0]?.totalFeedback || 0,
      recommendationRate: feedbackStats[0] ? Math.round((feedbackStats[0].wouldRecommend / feedbackStats[0].totalFeedback) * 100) : 0,
      recentSessions,
      monthlyTrends
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
};

// @desc    Get mentorship dashboard data
// @route   GET /api/mentorship/dashboard
exports.getMentorshipDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get upcoming sessions
    const upcomingSessions = await MentorshipSession.find({
      $or: [{ mentor: userId }, { mentee: userId }],
      status: 'scheduled',
      scheduledDate: { $gte: new Date() }
    })
    .populate(['mentor', 'mentee'], 'username avatarUrl')
    .sort({ scheduledDate: 1 })
    .limit(3);

    // Get recent activity
    const recentSessions = await MentorshipSession.find({
      $or: [{ mentor: userId }, { mentee: userId }]
    })
    .populate(['mentor', 'mentee'], 'username avatarUrl')
    .sort({ updatedAt: -1 })
    .limit(5);

    // Get pending feedback
    const pendingFeedback = await MentorshipSession.find({
      $or: [{ mentor: userId }, { mentee: userId }],
      status: 'completed',
      $or: [
        { 'feedback.mentor.rating': { $exists: false } },
        { 'feedback.mentee.rating': { $exists: false } }
      ]
    })
    .populate(['mentor', 'mentee'], 'username avatarUrl')
    .limit(3);

    // Get mentorship stats
    const stats = await MentorshipSession.aggregate([
      { $match: { $or: [{ mentor: userId }, { mentee: userId }] } },
      {
        $group: {
          _id: null,
          totalSessions: { $sum: 1 },
          completedSessions: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          upcomingSessions: { $sum: { $cond: [{ $eq: ['$status', 'scheduled'] }, 1, 0] } }
        }
      }
    ]);

    res.status(200).json({
      upcomingSessions,
      recentSessions,
      pendingFeedback,
      stats: stats[0] || { totalSessions: 0, completedSessions: 0, upcomingSessions: 0 }
    });
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard' });
  }
};
