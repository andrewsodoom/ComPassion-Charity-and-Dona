import { v4 as uuidv4 } from 'uuid';
import db from '../config/db.js';

export const processDonation = (req, res) => {
  try {
    const {
      campaignId,
      amount,
      tipAmount = 0,
      currency = 'INR',
      donorName,
      donorEmail,
      donorPhone,
      paymentMethod = 'Stripe Card (Simulated)',
      isRecurring = false,
      frequency = 'one-time',
      isAnonymous = false,
      dedication = null,
      donorMessage = ''
    } = req.body;

    const numAmount = Number(amount);
    const numTip = Number(tipAmount || 0);

    if (!campaignId || !Number.isFinite(numAmount) || numAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Valid campaign and donation amount are required' });
    }

    if (!Number.isFinite(numTip) || numTip < 0) {
      return res.status(400).json({ success: false, message: 'Tip amount must be a non-negative number' });
    }

    const campaign = db.findById('campaigns', campaignId);
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    if (campaign.status !== 'active') {
      return res.status(409).json({ success: false, message: 'This campaign is no longer accepting donations' });
    }

    const donorId = req.user ? req.user.id : null;
    const finalDonorName = isAnonymous ? 'Anonymous Donor' : (donorName || req.user?.name || 'Kind Donor');
    const finalDonorEmail = donorEmail || req.user?.email || 'donor@example.com';
    const finalDonorPhone = donorPhone || req.user?.phone || '';

    const totalPaid = numAmount + numTip;

    const receiptNumber = `REC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const transactionId = `txn_sim_${paymentMethod.toLowerCase().includes('rzp') || paymentMethod.toLowerCase().includes('upi') ? 'rzp' : 'strp'}_${Date.now().toString().slice(-6)}${Math.floor(1000 + Math.random() * 9000)}`;

    const organization = db.findById('users', campaign.organizationId);

    const donation = {
      id: `don_${uuidv4().substring(0, 8)}`,
      receiptNumber,
      donorId,
      donorName: finalDonorName,
      donorEmail: finalDonorEmail,
      donorPhone: finalDonorPhone,
      campaignId: campaign.id,
      campaignTitle: campaign.title,
      organizationId: campaign.organizationId,
      organizationName: campaign.organizationName,
      amount: numAmount,
      tipAmount: numTip,
      totalPaid,
      currency,
      paymentMethod,
      paymentStatus: 'completed',
      transactionId,
      isRecurring: Boolean(isRecurring),
      frequency: isRecurring ? (frequency || 'monthly') : 'one-time',
      isAnonymous: Boolean(isAnonymous),
      dedication: dedication || null,
      donorMessage: donorMessage || '',
      taxDeductible: true,
      taxExemptionCode: organization?.organization?.taxExemptId ? `Tax Exemption ID: ${organization.organization.taxExemptId}` : 'Section 80G / 501(c)(3) Eligible',
      createdAt: new Date().toISOString()
    };

    db.insert('donations', donation);

    // Update Campaign raised amount & donor count
    const newRaised = campaign.raisedAmount + numAmount;
    const newDonorCount = campaign.donorCount + 1;
    const isNowCompleted = newRaised >= campaign.targetAmount;

    const updatedCampaign = db.update('campaigns', campaign.id, {
      raisedAmount: newRaised,
      donorCount: newDonorCount,
      status: isNowCompleted ? 'completed' : campaign.status
    });

    // Create Notification for Donor (if registered)
    if (donorId) {
      db.insert('notifications', {
        id: `notif_${uuidv4().substring(0, 8)}`,
        userId: donorId,
        title: 'Donation Confirmed & Receipt Ready 🎉',
        message: `Thank you! Your donation of ${currency} ${numAmount.toLocaleString()} to '${campaign.title}' was successful. Receipt: ${receiptNumber}`,
        type: 'donation_success',
        link: `/receipt/${receiptNumber}`,
        isRead: false,
        createdAt: new Date().toISOString()
      });
    }

    // Create Notification for Charity Organization
    if (campaign.organizationId) {
      db.insert('notifications', {
        id: `notif_${uuidv4().substring(0, 8)}`,
        userId: campaign.organizationId,
        title: 'New Donation Received! 💰',
        message: `${finalDonorName} donated ${currency} ${numAmount.toLocaleString()} to '${campaign.title}'.`,
        type: 'donation_received',
        link: `/dashboard/charity`,
        isRead: false,
        createdAt: new Date().toISOString()
      });
    }

    // If milestone reached (100% funded)
    if (isNowCompleted && campaign.status !== 'completed') {
      db.insert('notifications', {
        id: `notif_${uuidv4().substring(0, 8)}`,
        userId: campaign.organizationId,
        title: 'Goal Achieved! 🎯 Campaign 100% Funded!',
        message: `Congratulations! '${campaign.title}' has reached its fundraising target of ${currency} ${campaign.targetAmount.toLocaleString()}!`,
        type: 'campaign_milestone',
        link: `/campaigns/${campaign.id}`,
        isRead: false,
        createdAt: new Date().toISOString()
      });
    }

    res.status(201).json({
      success: true,
      message: 'Donation processed successfully',
      donation,
      campaign: updatedCampaign
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to process donation', error: err.message });
  }
};

export const getReceiptById = (req, res) => {
  try {
    const { receiptId } = req.params;

    const donation = db.findOne('donations', d => d.receiptNumber === receiptId || d.id === receiptId);
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Receipt not found' });
    }

    const campaign = db.findById('campaigns', donation.campaignId);
    const charityUser = db.findById('users', donation.organizationId);

    const fullReceipt = {
      ...donation,
      organizationDetails: {
        name: charityUser?.organization?.legalName || donation.organizationName,
        registrationNumber: charityUser?.organization?.registrationNumber || 'REG-NGO-99881',
        taxExemptId: charityUser?.organization?.taxExemptId || 'Tax Compliance ID',
        address: `${charityUser?.organization?.city || 'Accra'}, ${charityUser?.organization?.country || 'Ghana'}`,
        phone: charityUser?.organization?.phone || charityUser?.phone || '+233 24 000 0000',
        email: charityUser?.email || 'contact@charity.org',
        website: charityUser?.organization?.website || 'https://compassion.charity',
        isVerified: charityUser?.organization?.verificationStatus === 'verified'
      },
      campaignDetails: {
        title: campaign?.title || donation.campaignTitle,
        category: campaign?.category || 'General Fund',
        targetAmount: campaign?.targetAmount,
        raisedAmount: campaign?.raisedAmount
      },
      verificationSignature: `SHA256-${Buffer.from(donation.receiptNumber + donation.transactionId).toString('base64').substring(0, 24)}`
    };

    res.json({
      success: true,
      receipt: fullReceipt
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve receipt', error: err.message });
  }
};

export const getUserDonations = (req, res) => {
  try {
    const donations = db.find('donations', d => d.donorId === req.user.id || (req.user.email && d.donorEmail.toLowerCase() === req.user.email.toLowerCase()))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const totalDonated = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
    const uniqueCampaigns = new Set(donations.map(d => d.campaignId)).size;
    const recurringCount = donations.filter(d => d.isRecurring).length;

    res.json({
      success: true,
      stats: {
        totalDonated,
        donationCount: donations.length,
        campaignsSupported: uniqueCampaigns,
        recurringCount
      },
      donations
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch user donations' });
  }
};

export const getOrganizationDonations = (req, res) => {
  try {
    const orgId = req.user.id;
    const donations = db.find('donations', d => d.organizationId === orgId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const totalRaised = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
    const uniqueDonors = new Set(donations.map(d => d.donorEmail)).size;

    res.json({
      success: true,
      stats: {
        totalRaised,
        totalDonations: donations.length,
        uniqueDonors
      },
      donations
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch organization donations' });
  }
};
