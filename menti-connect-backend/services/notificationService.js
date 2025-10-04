// services/notificationService.js
const Notification = require('../models/Notification');
const User = require('../models/User');

class NotificationService {
  // Create a new notification
  async createNotification(userId, type, title, message, data = {}, priority = 'medium', expiresAt = null) {
    try {
      const notification = new Notification({
        userId,
        type,
        title,
        message,
        data,
        priority,
        expiresAt
      });

      await notification.save();
      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Get notifications for a user
  async getUserNotifications(userId, limit = 20, skip = 0) {
    try {
      const notifications = await Notification.find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .populate('userId', 'username avatarUrl');

      return notifications;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  // Mark notification as read
  async markAsRead(notificationId, userId) {
    try {
      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, userId },
        { read: true },
        { new: true }
      );

      return notification;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Mark all notifications as read for a user
  async markAllAsRead(userId) {
    try {
      await Notification.updateMany(
        { userId, read: false },
        { read: true }
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  // Get unread count
  async getUnreadCount(userId) {
    try {
      const count = await Notification.countDocuments({
        userId,
        read: false
      });
      return count;
    } catch (error) {
      console.error('Error getting unread count:', error);
      throw error;
    }
  }

  // Delete notification
  async deleteNotification(notificationId, userId) {
    try {
      await Notification.findOneAndDelete({
        _id: notificationId,
        userId
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  // Send match request notification
  async sendMatchRequest(fromUserId, toUserId) {
    try {
      const fromUser = await User.findById(fromUserId);
      if (!fromUser) throw new Error('User not found');

      const notification = await this.createNotification(
        toUserId,
        'match_request',
        'New Match Request',
        `${fromUser.username} wants to connect with you!`,
        {
          fromUserId,
          fromUsername: fromUser.username,
          fromAvatar: fromUser.avatarUrl
        },
        'high'
      );

      return notification;
    } catch (error) {
      console.error('Error sending match request notification:', error);
      throw error;
    }
  }

  // Send match accepted notification
  async sendMatchAccepted(fromUserId, toUserId) {
    try {
      const fromUser = await User.findById(fromUserId);
      if (!fromUser) throw new Error('User not found');

      const notification = await this.createNotification(
        toUserId,
        'match_accepted',
        'Match Accepted!',
        `${fromUser.username} accepted your connection request. You can now start chatting!`,
        {
          fromUserId,
          fromUsername: fromUser.username,
          fromAvatar: fromUser.avatarUrl
        },
        'high'
      );

      return notification;
    } catch (error) {
      console.error('Error sending match accepted notification:', error);
      throw error;
    }
  }

  // Send message notification
  async sendMessageNotification(fromUserId, toUserId, messagePreview) {
    try {
      const fromUser = await User.findById(fromUserId);
      if (!fromUser) throw new Error('User not found');

      const notification = await this.createNotification(
        toUserId,
        'message_received',
        'New Message',
        `${fromUser.username}: ${messagePreview}`,
        {
          fromUserId,
          fromUsername: fromUser.username,
          fromAvatar: fromUser.avatarUrl,
          messagePreview
        },
        'medium'
      );

      return notification;
    } catch (error) {
      console.error('Error sending message notification:', error);
      throw error;
    }
  }

  // Send goal achievement notification
  async sendGoalAchievement(userId, goalTitle) {
    try {
      const notification = await this.createNotification(
        userId,
        'goal_achieved',
        'Goal Achieved! 🎉',
        `Congratulations! You've achieved your goal: ${goalTitle}`,
        {
          goalTitle
        },
        'high'
      );

      return notification;
    } catch (error) {
      console.error('Error sending goal achievement notification:', error);
      throw error;
    }
  }

  // Send skill verification notification
  async sendSkillVerification(userId, skillName, verifiedBy) {
    try {
      const verifier = await User.findById(verifiedBy);
      if (!verifier) throw new Error('Verifier not found');

      const notification = await this.createNotification(
        userId,
        'skill_verified',
        'Skill Verified!',
        `${verifier.username} verified your ${skillName} skill`,
        {
          skillName,
          verifiedBy,
          verifierName: verifier.username
        },
        'medium'
      );

      return notification;
    } catch (error) {
      console.error('Error sending skill verification notification:', error);
      throw error;
    }
  }

  // Send system announcement
  async sendSystemAnnouncement(userIds, title, message, priority = 'medium') {
    try {
      const notifications = await Promise.all(
        userIds.map(userId => 
          this.createNotification(
            userId,
            'system_announcement',
            title,
            message,
            {},
            priority
          )
        )
      );

      return notifications;
    } catch (error) {
      console.error('Error sending system announcement:', error);
      throw error;
    }
  }

  // Clean up expired notifications
  async cleanupExpiredNotifications() {
    try {
      const result = await Notification.deleteMany({
        expiresAt: { $lt: new Date() }
      });
      return result;
    } catch (error) {
      console.error('Error cleaning up expired notifications:', error);
      throw error;
    }
  }
}

module.exports = new NotificationService();