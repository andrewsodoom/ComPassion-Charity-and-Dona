import express from 'express';
import {
  getOpportunities,
  createOpportunity,
  applyForOpportunity,
  getVolunteerApplications,
  getUserApplications,
  updateApplicationStatus
} from '../controllers/volunteerController.js';
import { authenticateUser, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/opportunities', getOpportunities);
router.post('/opportunities', authenticateUser, authorizeRoles('charity', 'admin'), createOpportunity);
router.post('/apply', authenticateUser, authorizeRoles('volunteer'), applyForOpportunity);
router.get('/applications/organization', authenticateUser, authorizeRoles('charity', 'admin'), getVolunteerApplications);
router.get('/applications/my', authenticateUser, authorizeRoles('volunteer'), getUserApplications);
router.put('/applications/:id/status', authenticateUser, authorizeRoles('charity', 'admin'), updateApplicationStatus);

export default router;
