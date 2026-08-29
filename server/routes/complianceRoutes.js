import express from 'express';
import { submitComplianceReview } from '../controllers/complianceController.js';

const router = express.Router();

router.post('/submit', submitComplianceReview);

export default router;
