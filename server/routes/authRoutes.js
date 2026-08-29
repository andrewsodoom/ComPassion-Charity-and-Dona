import express from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  submitVerificationDocuments,
  requestPasswordReset,
  resetPassword
} from '../controllers/authController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', resetPassword);
router.get('/me', authenticateUser, getMe);
router.put('/profile', authenticateUser, updateProfile);
router.post('/verify-documents', authenticateUser, submitVerificationDocuments);

export default router;
