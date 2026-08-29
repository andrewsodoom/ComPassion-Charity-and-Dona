import express from 'express';
import {
  generateCampaignStory,
  generateCampaignSummary,
  estimateImpact
} from '../controllers/aiController.js';

const router = express.Router();

router.post('/story', generateCampaignStory);
router.post('/summary', generateCampaignSummary);
router.post('/impact', estimateImpact);

export default router;
