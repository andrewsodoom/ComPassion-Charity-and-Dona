import express from 'express';
import {
  getAdminStats,
  getPendingVerifications,
  reviewVerification,
  getAllUsers,
  getPlatformAnalytics
} from '../controllers/adminController.js';
import { authenticateUser, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// All routes here require Admin role
router.use(authenticateUser, authorizeRoles('admin'));

router.get('/stats', getAdminStats);
router.get('/verifications', getPendingVerifications);
router.put('/verifications/:userId', reviewVerification);
router.get('/users', getAllUsers);
router.get('/analytics', getPlatformAnalytics);

export default router;
