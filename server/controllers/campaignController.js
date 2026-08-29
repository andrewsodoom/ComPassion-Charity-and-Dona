import { v4 as uuidv4 } from 'uuid';
import dbCompatibility from '../config/db.js';

const fallbackImage = 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80';

const normalizeMediaUrl = (value, fallback = fallbackImage) => {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  if (/^(https?:|data:)/i.test(trimmed)) return trimmed;
  return fallback;
};

const normalizeMediaList = (value, fallback = fallbackImage) => {
  const list = Array.isArray(value)
    ? value
    : typeof value === 'string' && value.trim()
      ? [value]
      : [];

  const normalized = list
    .filter(item => typeof item === 'string' && item.trim())
    .map(item => normalizeMediaUrl(item, fallback));

  return normalized.length > 0 ? [...new Set(normalized)] : [normalizeMediaUrl(fallback, fallback)];
};

export const getCampaigns = async (req, res) => {
  try {
    const {
      search,
      category,
      status = 'all',
      isVerified,
      urgent,
      featured,
      sortBy = 'featured',
      minAmount,
      maxAmount
    } = req.query;

    let campaigns = await dbCompatibility.find('campaigns', {});

    // Filter by Search Query
    if (search) {
      const q = search.toLowerCase();
      campaigns = campaigns.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        (c.location && c.location.toLowerCase().includes(q)) ||
        c.organizationName.toLowerCase().includes(q)
      );
    }

    // Filter by Category
    if (category && category !== 'All') {
      campaigns = campaigns.filter(c => c.category.toLowerCase() === category.toLowerCase());
    }

    // Filter by Status
    if (status !== 'all') {
      campaigns = campaigns.filter(c => c.status === status);
    }

    // Filter by Verified status
    if (isVerified === 'true') {
      campaigns = campaigns.filter(c => c.isVerified === true);
    }

    // Filter by Urgent
    if (urgent === 'true') {
      campaigns = campaigns.filter(c => c.urgent === true);
    }

    // Filter by Featured
    if (featured === 'true') {
      campaigns = campaigns.filter(c => c.featured === true);
    }

    // Filter by Amount Range
    if (minAmount) {
      campaigns = campaigns.filter(c => c.targetAmount >= Number(minAmount));
    }
    if (maxAmount) {
      campaigns = campaigns.filter(c => c.targetAmount <= Number(maxAmount));
    }

    // Sorting
    campaigns = [...campaigns].sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === 'most_funded') {
        const pctA = (a.raisedAmount / a.targetAmount) * 100;
        const pctB = (b.raisedAmount / b.targetAmount) * 100;
        return pctB - pctA;
      }
      if (sortBy === 'least_funded') {
        const pctA = (a.raisedAmount / a.targetAmount) * 100;
        const pctB = (b.raisedAmount / b.targetAmount) * 100;
        return pctA - pctB;
      }
      if (sortBy === 'ending_soon') {
        return new Date(a.endDate) - new Date(b.endDate);
      }
      if (sortBy === 'urgent') {
        return (b.urgent ? 1 : 0) - (a.urgent ? 1 : 0);
      }
      // Default: featured first, then newest
      if (a.featured !== b.featured) {
        return b.featured ? 1 : -1;
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    res.json({
      success: true,
      count: campaigns.length,
      campaigns
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch campaigns', error: err.message });
  }
};

export const getCampaignById = async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await dbCompatibility.findById('campaigns', id);

    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    // Attach organization details
    const organization = await dbCompatibility.findById('users', campaign.organizationId);
    
    // Attach updates for this campaign
    const updates = await dbCompatibility.find('campaignUpdates', {});
    const campaignUpdates = updates.filter(u => u.campaignId === id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Attach recent public donations
    const donations = await dbCompatibility.find('donations', {});
    const campaignDonations = donations.filter(d => d.campaignId === id)
      .map(d => ({
        id: d.id,
        donorName: d.isAnonymous ? 'Anonymous Supporter' : d.donorName,
        amount: d.amount,
        currency: d.currency,
        donorMessage: d.donorMessage,
        createdAt: d.createdAt
      }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);

    // Attach volunteer opportunities for this campaign
    const volunteerOpportunities = await dbCompatibility.find('volunteerOpportunities', {});

    res.json({
      success: true,
      campaign: {
        ...campaign,
        organizationInfo: organization?.organization || null,
        organizationAvatar: organization?.avatar || null,
        updates: campaignUpdates,
        recentDonations: campaignDonations,
        volunteerOpportunities: volunteerOpportunities.filter(v => v.campaignId === id)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to load campaign details', error: err.message });
  }
};

export const createCampaign = async (req, res) => {
  try {
    const {
      title,
      tagline,
      description,
      category,
      targetAmount,
      currency = 'INR',
      location,
      image,
      gallery,
      endDate,
      featured = false,
      urgent = false,
      matchingDonorPledge,
      impactMetrics
    } = req.body;

    if (!title || !description || !targetAmount || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, category, and target amount are required'
      });
    }

    const user = await dbCompatibility.findById('users', req.user.id);
    const isVerified = user?.organization?.verificationStatus === 'verified';
    const safeImage = normalizeMediaUrl(image, fallbackImage);
    const galleryImages = normalizeMediaList(gallery || safeImage, safeImage);

    const newCampaign = {
      id: `cmp_${uuidv4().substring(0, 8)}`,
      title,
      tagline: tagline || title,
      description,
      category,
      targetAmount: Number(targetAmount),
      raisedAmount: 0,
      donorCount: 0,
      currency,
      location: location || user?.organization?.city || 'Global',
      image: safeImage,
      gallery: galleryImages,
      organizationId: req.user.id,
      organizationName: user?.organization?.legalName || user?.name || req.user.name,
      isVerified,
      status: 'active',
      featured: Boolean(featured),
      urgent: Boolean(urgent),
      matchingDonorPledge: matchingDonorPledge || null,
      impactMetrics: impactMetrics || [
        { label: "Goal Target", value: `${currency} ${Number(targetAmount).toLocaleString()}` }
      ],
      endDate: endDate || new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString()
    };

    await dbCompatibility.insert('campaigns', newCampaign);

    res.status(201).json({
      success: true,
      message: 'Campaign created successfully',
      campaign: newCampaign
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create campaign', error: err.message });
  }
};

export const updateCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await dbCompatibility.findById('campaigns', id);

    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    if (campaign.organizationId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this campaign' });
    }

    const updated = await dbCompatibility.update('campaigns', id, req.body);

    res.json({
      success: true,
      message: 'Campaign updated successfully',
      campaign: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update campaign', error: err.message });
  }
};

export const deleteCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await dbCompatibility.findById('campaigns', id);

    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    if (campaign.organizationId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this campaign' });
    }

    // Remove the campaign
    await dbCompatibility.remove('campaigns', id);

    res.json({
      success: true,
      message: 'Campaign deleted successfully'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete campaign', error: err.message });
  }
};

export const getOrganizationCampaigns = async (req, res) => {
  try {
    const orgId = req.user.id;
    const campaigns = await dbCompatibility.find('campaigns', {});
    const orgCampaigns = campaigns.filter(c => c.organizationId === orgId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      campaigns: orgCampaigns
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to load organization campaigns' });
  }
};