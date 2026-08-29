import express from 'express';
import {
  getCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  getOrganizationCampaigns
} from '../controllers/campaignController.js';
import { authenticateUser, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getCampaigns);
router.get('/organization/my-campaigns', authenticateUser, authorizeRoles('charity', 'admin'), getOrganizationCampaigns);
router.get('/:id', getCampaignById);
router.post('/', authenticateUser, authorizeRoles('charity', 'admin'), createCampaign);
router.put('/:id', authenticateUser, authorizeRoles('charity', 'admin'), updateCampaign);
router.delete('/:id', authenticateUser, authorizeRoles('charity', 'admin'), deleteCampaign);

export default router;
