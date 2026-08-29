import express from 'express';
import {
  processDonation,
  getReceiptById,
  getUserDonations,
  getOrganizationDonations
} from '../controllers/donationController.js';
import { authenticateUser, optionalAuth, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.post('/process', optionalAuth, processDonation);
router.get('/receipt/:receiptId', getReceiptById);
router.get('/my-donations', authenticateUser, getUserDonations);
router.get('/organization/history', authenticateUser, authorizeRoles('charity', 'admin'), getOrganizationDonations);

export default router;
