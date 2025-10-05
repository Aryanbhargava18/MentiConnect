const User = require('../models/User');
const MentorshipSession = require('../models/MentorshipSession');

// @desc    Create a video call room
// @route   POST /api/video/create-room
exports.createVideoRoom = async (req, res) => {
  try {
    const { sessionId, participantId } = req.body;
    const userId = req.user.id;

    // Validate session and participants
    const session = await MentorshipSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Check if user is part of the session
    if (session.mentor.toString() !== userId && session.mentee.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Generate unique room ID
    const roomId = `room_${sessionId}_${Date.now()}`;
    
    // Update session with meeting link
    session.meetingLink = `https://meet.menticonnect.com/${roomId}`;
    await session.save();

    // Get participant details
    const participant = await User.findById(participantId).select('username avatarUrl');
    
    res.status(200).json({
      roomId,
      meetingLink: session.meetingLink,
      sessionId,
      participant: {
        id: participant._id,
        username: participant.username,
        avatarUrl: participant.avatarUrl
      },
      session: {
        title: session.title,
        scheduledDate: session.scheduledDate,
        duration: session.duration
      }
    });
  } catch (error) {
    console.error('Error creating video room:', error);
    res.status(500).json({ message: 'Failed to create video room' });
  }
};

// @desc    Join a video call room
// @route   POST /api/video/join-room
exports.joinVideoRoom = async (req, res) => {
  try {
    const { roomId } = req.body;
    const userId = req.user.id;

    // Extract session ID from room ID
    const sessionId = roomId.split('_')[1];
    const session = await MentorshipSession.findById(sessionId);
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Check if user is part of the session
    if (session.mentor.toString() !== userId && session.mentee.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get other participant
    const otherParticipantId = session.mentor.toString() === userId ? session.mentee : session.mentor;
    const otherParticipant = await User.findById(otherParticipantId).select('username avatarUrl');

    res.status(200).json({
      roomId,
      sessionId,
      otherParticipant: {
        id: otherParticipant._id,
        username: otherParticipant.username,
        avatarUrl: otherParticipant.avatarUrl
      },
      session: {
        title: session.title,
        scheduledDate: session.scheduledDate,
        duration: session.duration,
        agenda: session.agenda
      }
    });
  } catch (error) {
    console.error('Error joining video room:', error);
    res.status(500).json({ message: 'Failed to join video room' });
  }
};

// @desc    End a video call
// @route   POST /api/video/end-call
exports.endVideoCall = async (req, res) => {
  try {
    const { roomId, duration, notes } = req.body;
    const userId = req.user.id;

    // Extract session ID from room ID
    const sessionId = roomId.split('_')[1];
    const session = await MentorshipSession.findById(sessionId);
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Check if user is part of the session
    if (session.mentor.toString() !== userId && session.mentee.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update session with call details
    session.status = 'completed';
    if (notes) {
      if (session.mentor.toString() === userId) {
        session.notes.mentor = notes;
      } else {
        session.notes.mentee = notes;
      }
    }

    await session.save();

    res.status(200).json({
      message: 'Call ended successfully',
      session: {
        id: session._id,
        status: session.status,
        duration: duration,
        notes: session.notes
      }
    });
  } catch (error) {
    console.error('Error ending video call:', error);
    res.status(500).json({ message: 'Failed to end video call' });
  }
};

// @desc    Get video call history
// @route   GET /api/video/history
exports.getVideoCallHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 10, page = 1 } = req.query;

    const sessions = await MentorshipSession.find({
      $or: [{ mentor: userId }, { mentee: userId }],
      sessionType: 'video_call',
      status: 'completed'
    })
    .populate(['mentor', 'mentee'], 'username avatarUrl')
    .sort({ scheduledDate: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const total = await MentorshipSession.countDocuments({
      $or: [{ mentor: userId }, { mentee: userId }],
      sessionType: 'video_call',
      status: 'completed'
    });

    res.status(200).json({
      sessions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching video history:', error);
    res.status(500).json({ message: 'Failed to fetch video history' });
  }
};
