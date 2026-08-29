import db from '../config/db.js';

export const getUserNotifications = (req, res) => {
  try {
    const notifications = db.find('notifications', n => n.userId === req.user.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const unreadCount = notifications.filter(n => !n.isRead).length;

    res.json({
      success: true,
      unreadCount,
      notifications
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
};

export const markAsRead = (req, res) => {
  try {
    const { id } = req.params;
    const notification = db.findById('notifications', id);

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    if (notification.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const updated = db.update('notifications', id, { isRead: true });

    res.json({
      success: true,
      notification: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update notification' });
  }
};

export const markAllAsRead = (req, res) => {
  try {
    const userNotifications = db.find('notifications', n => n.userId === req.user.id && !n.isRead);

    userNotifications.forEach(n => {
      db.update('notifications', n.id, { isRead: true });
    });

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update notifications' });
  }
};
