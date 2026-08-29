import express from 'express';
import {
  getUserNotifications,
  markAsRead,
  markAllAsRead
} from '../controllers/notificationController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateUser, getUserNotifications);
router.put('/:id/read', authenticateUser, markAsRead);
router.put('/mark-all-read', authenticateUser, markAllAsRead);

export default router;
