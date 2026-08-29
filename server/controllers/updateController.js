import { v4 as uuidv4 } from 'uuid';
import db from '../config/db.js';

export const createCampaignUpdate = (req, res) => {
  try {
    const { campaignId, title, content, images = [] } = req.body;

    if (!campaignId || !title || !content) {
      return res.status(400).json({ success: false, message: 'Campaign ID, title, and update content are required' });
    }

    const campaign = db.findById('campaigns', campaignId);
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    if (campaign.organizationId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to post updates for this campaign' });
    }

    const newUpdate = {
      id: `upd_${uuidv4().substring(0, 8)}`,
      campaignId,
      organizationId: req.user.id,
      title,
      content,
      images: Array.isArray(images) ? images : [images].filter(Boolean),
      createdAt: new Date().toISOString()
    };

    db.insert('campaignUpdates', newUpdate);

    // Find all donors who supported this campaign and send notifications
    const campaignDonations = db.find('donations', d => d.campaignId === campaignId);
    const donorIds = [...new Set(campaignDonations.map(d => d.donorId).filter(Boolean))];

    donorIds.forEach(donorId => {
      db.insert('notifications', {
        id: `notif_${uuidv4().substring(0, 8)}`,
        userId: donorId,
        title: `Campaign Update: ${title}`,
        message: `${campaign.organizationName} posted a new update on '${campaign.title}'. Check out the progress!`,
        type: 'campaign_update',
        link: `/campaigns/${campaign.id}`,
        isRead: false,
        createdAt: new Date().toISOString()
      });
    });

    res.status(201).json({
      success: true,
      message: `Update posted successfully and notified ${donorIds.length} donor(s)`,
      update: newUpdate
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to post campaign update', error: err.message });
  }
};

export const getCampaignUpdates = (req, res) => {
  try {
    const { campaignId } = req.params;
    const updates = db.find('campaignUpdates', u => u.campaignId === campaignId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      count: updates.length,
      updates
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch updates' });
  }
};
