import express from 'express';
import { createCampaignUpdate, getCampaignUpdates } from '../controllers/updateController.js';
import { authenticateUser, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/campaign/:campaignId', getCampaignUpdates);
router.post('/', authenticateUser, authorizeRoles('charity', 'admin'), createCampaignUpdate);

export default router;
