import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import db from '../config/db.js';
import { generateToken } from '../middleware/auth.js';
import { submitCharityVerificationToExternalSystem } from '../services/complianceService.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, role = 'donor', organization, phone, skills, bio } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const existingUser = await db.findOne('users', u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = {
      id: `usr_${uuidv4().substring(0, 8)}`,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      phone: phone || '',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      createdAt: new Date().toISOString()
    };

    if (role === 'charity') {
      newUser.organization = {
        legalName: organization?.legalName || name,
        registrationNumber: organization?.registrationNumber || '',
        country: organization?.country || 'Ghana',
        city: organization?.city || '',
        taxExemptId: organization?.taxExemptId || '',
        verificationStatus: 'pending',
        website: organization?.website || '',
        phone: organization?.phone || phone || '',
        bio: organization?.bio || bio || '',
        documents: []
      };
    }

    if (role === 'volunteer') {
      newUser.skills = skills || ['Community Support'];
      newUser.bio = bio || 'Passionate volunteer ready to help.';
    }

    await db.insert('users', newUser);

    const token = generateToken(newUser);
    const { password: _, ...safeUser } = newUser;

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: safeUser
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Registration failed', error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await db.findOne('users', u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user);
    const { password: _, ...safeUser } = user;

    res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: safeUser
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Login failed', error: err.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await db.findById('users', req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const { password: _, ...safeUser } = user;
    res.json({ success: true, user: safeUser });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching profile', error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, avatar, bio, skills, organization } = req.body;
    const existing = await db.findById('users', req.user.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (avatar) updateData.avatar = avatar;
    if (bio !== undefined) updateData.bio = bio;
    if (skills !== undefined) updateData.skills = skills;

    if (existing.role === 'charity' && organization) {
      updateData.organization = {
        ...existing.organization,
        ...organization
      };
    }

    const updated = await db.update('users', req.user.id, updateData);
    const { password: _, ...safeUser } = updated;

    res.json({ success: true, message: 'Profile updated successfully', user: safeUser });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update profile', error: err.message });
  }
};

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    const user = await db.findOne('users', u => u.email && u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.json({
        success: true,
        message: 'If an account exists for that email, reset instructions have been sent.'
      });
    }

    const resetToken = uuidv4();
    const expiresAt = new Date(Date.now() + (30 * 60 * 1000)).toISOString();

    await db.update('users', user.id, {
      passwordResetToken: resetToken,
      passwordResetExpiresAt: expiresAt
    });

    res.json({
      success: true,
      message: 'If an account exists for that email, reset instructions have been sent.',
      resetToken,
      expiresAt,
      demoMode: true
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Password reset request failed.', error: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ success: false, message: 'Reset token and new password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    const user = await db.findOne('users', u =>
      u.passwordResetToken === token &&
      u.passwordResetExpiresAt &&
      new Date(u.passwordResetExpiresAt).getTime() > Date.now()
    );

    if (!user) {
      return res.status(400).json({ success: false, message: 'This reset token is invalid or has expired.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    await db.update('users', user.id, {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpiresAt: null
    });

    res.json({
      success: true,
      message: 'Your password has been reset successfully.'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Password reset failed.', error: err.message });
  }
};

const normalizeDocumentEntry = (entry) => {
  if (!entry || typeof entry !== 'object') return null;

  const name = typeof entry.name === 'string' ? entry.name.trim() : '';
  const url = typeof entry.url === 'string' ? entry.url.trim() : '';
  if (!name && !url) return null;

  return {
    name: name || 'Verification Document',
    url: url || 'https://example.com/verification-document',
    submittedAt: entry.submittedAt || new Date().toISOString()
  };
};

export const submitVerificationDocuments = async (req, res) => {
  try {
    const user = await db.findById('users', req.user.id);
    if (!user || user.role !== 'charity') {
      return res.status(403).json({ success: false, message: 'Only charities can submit verification documents' });
    }

    const {
      legalName,
      registrationNumber,
      taxExemptId,
      documentName,
      documentUrl,
      documents,
      country = 'United States',
      organizationType,
      taxIdLabel = 'Tax Exemption ID'
    } = req.body;

    const existingDocs = Array.isArray(user.organization?.documents) ? user.organization.documents : [];
    const normalizedIncoming = Array.isArray(documents)
      ? documents.map(normalizeDocumentEntry).filter(Boolean)
      : [];

    const primaryDoc = documentName || documentUrl
      ? normalizeDocumentEntry({
          name: documentName,
          url: documentUrl,
          submittedAt: new Date().toISOString()
        })
      : null;

    const newDocs = [...existingDocs, ...normalizedIncoming, ...(primaryDoc ? [primaryDoc] : [])]
      .filter((doc, index, arr) => doc && arr.findIndex(item => item.url === doc.url && item.name === doc.name) === index);

    const compliancePayload = {
      charityId: user.id,
      email: user.email,
      country,
      organizationType: organizationType || 'nonprofit',
      legalName: legalName || user.organization?.legalName,
      registrationNumber: registrationNumber || user.organization?.registrationNumber,
      taxExemptId: taxExemptId || user.organization?.taxExemptId,
      taxIdLabel,
      documentName: primaryDoc?.name || documentName || 'Verification Document',
      documentUrl: primaryDoc?.url || documentUrl || 'https://example.com/verification-document',
      documents: newDocs,
      submittedBy: user.name,
      source: 'comPassion-platform'
    };

    const complianceResult = await submitCharityVerificationToExternalSystem(compliancePayload);

    const updatedOrg = {
      ...user.organization,
      legalName: legalName || user.organization?.legalName,
      registrationNumber: registrationNumber || user.organization?.registrationNumber,
      taxExemptId: taxExemptId || user.organization?.taxExemptId,
      country,
      organizationType: organizationType || user.organization?.organizationType || 'nonprofit',
      verificationStatus: complianceResult.success ? 'pending' : 'rejected',
      complianceReferenceId: complianceResult.referenceId || null,
      complianceStatus: complianceResult.status || 'pending',
      documents: newDocs,
      externalCompliance: complianceResult
    };

    const updated = await db.update('users', user.id, { organization: updatedOrg });
    const { password: _, ...safeUser } = updated;

    res.json({
      success: true,
      message: complianceResult.message || 'Verification documents submitted for review',
      compliance: complianceResult,
      user: safeUser
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Submission failed', error: err.message });
  }
};

