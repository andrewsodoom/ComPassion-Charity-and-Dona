import { v4 as uuidv4 } from 'uuid';
import db from '../config/db.js';

export const getAdminStats = (req, res) => {
  try {
    const donations = db.getCollection('donations');
    const campaigns = db.getCollection('campaigns');
    const users = db.getCollection('users');
    const volunteerApplications = db.getCollection('volunteerApplications');

    const totalDonationsAmount = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
    const activeCampaignsCount = campaigns.filter(c => c.status === 'active').length;
    const completedCampaignsCount = campaigns.filter(c => c.status === 'completed').length;
    
    const verifiedCharitiesCount = users.filter(u => u.role === 'charity' && u.organization?.verificationStatus === 'verified').length;
    const pendingVerificationsCount = users.filter(u => u.role === 'charity' && u.organization?.verificationStatus === 'pending').length;
    const totalDonorsCount = users.filter(u => u.role === 'donor').length;
    const totalVolunteersCount = users.filter(u => u.role === 'volunteer').length;

    const avgDonation = donations.length > 0 ? Math.round(totalDonationsAmount / donations.length) : 0;
    const successRate = campaigns.length > 0 ? Math.round((completedCampaignsCount / campaigns.length) * 100) : 0;

    res.json({
      success: true,
      stats: {
        totalDonationsAmount,
        totalDonationsCount: donations.length,
        activeCampaignsCount,
        completedCampaignsCount,
        totalCampaignsCount: campaigns.length,
        verifiedCharitiesCount,
        pendingVerificationsCount,
        totalDonorsCount,
        totalVolunteersCount,
        totalApplicationsCount: volunteerApplications.length,
        avgDonation,
        successRate
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to load admin stats', error: err.message });
  }
};

export const getPendingVerifications = (req, res) => {
  try {
    const charities = db.find('users', u => u.role === 'charity');
    const pendingList = charities.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      avatar: u.avatar,
      organization: u.organization,
      createdAt: u.createdAt
    }));

    res.json({
      success: true,
      charities: pendingList
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to load verifications' });
  }
};

export const reviewVerification = (req, res) => {
  try {
    const { userId } = req.params;
    const { status, adminNotes } = req.body; // 'verified' | 'rejected'

    if (!['verified', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const user = db.findById('users', userId);
    if (!user || user.role !== 'charity') {
      return res.status(404).json({ success: false, message: 'Charity organization not found' });
    }

    const updatedOrg = {
      ...user.organization,
      verificationStatus: status,
      adminNotes: adminNotes || '',
      verifiedAt: status === 'verified' ? new Date().toISOString() : null
    };

    db.update('users', userId, { organization: updatedOrg });

    // Update all campaigns of this charity
    const orgCampaigns = db.find('campaigns', c => c.organizationId === userId);
    orgCampaigns.forEach(c => {
      db.update('campaigns', c.id, { isVerified: status === 'verified' });
    });

    // Send notification to charity
    db.insert('notifications', {
      id: `notif_${uuidv4().substring(0, 8)}`,
      userId,
      title: status === 'verified' ? 'Organization Verified! ✓ 🎉' : 'Verification Update',
      message: status === 'verified'
        ? 'Congratulations! Your charity organization has been verified. You now have the verified checkmark badge across all your campaigns.'
        : `Your verification status was updated to ${status}. ${adminNotes ? 'Reason: ' + adminNotes : ''}`,
      type: 'verification_update',
      link: '/dashboard/charity',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: `Organization verification set to ${status}`
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to review verification', error: err.message });
  }
};

export const getAllUsers = (req, res) => {
  try {
    const { role, search } = req.query;
    let users = db.getCollection('users');

    if (role && role !== 'all') {
      users = users.filter(u => u.role === role);
    }

    if (search) {
      const q = search.toLowerCase();
      users = users.filter(u =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.organization?.legalName && u.organization.legalName.toLowerCase().includes(q))
      );
    }

    const safeUsers = users.map(u => {
      const { password: _, ...safe } = u;
      return safe;
    });

    res.json({
      success: true,
      users: safeUsers
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};

export const getPlatformAnalytics = (req, res) => {
  try {
    const donations = db.getCollection('donations');
    const campaigns = db.getCollection('campaigns');

    // Monthly donations breakdown
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyMap = {};
    months.forEach(m => { monthlyMap[m] = 0; });

    donations.forEach(d => {
      const date = new Date(d.createdAt);
      const m = months[date.getMonth()];
      monthlyMap[m] = (monthlyMap[m] || 0) + (d.amount || 0);
    });

    const monthlyDonations = Object.keys(monthlyMap).map(name => ({
      month: name,
      amount: monthlyMap[name] || 0
    }));

    // Category breakdown
    const categoryMap = {};
    campaigns.forEach(c => {
      categoryMap[c.category] = (categoryMap[c.category] || 0) + (c.raisedAmount || 0);
    });

    const categoryDistribution = Object.keys(categoryMap).map(category => ({
      name: category,
      value: categoryMap[category]
    }));

    // Payment methods breakdown
    const paymentMethodsMap = {};
    donations.forEach(d => {
      const method = d.paymentMethod.split(' ')[0] || 'Card';
      paymentMethodsMap[method] = (paymentMethodsMap[method] || 0) + 1;
    });

    const paymentDistribution = Object.keys(paymentMethodsMap).map(method => ({
      name: method,
      count: paymentMethodsMap[method]
    }));

    res.json({
      success: true,
      monthlyDonations,
      categoryDistribution,
      paymentDistribution
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to load platform analytics' });
  }
};
