import { v4 as uuidv4 } from 'uuid';
import db from '../config/db.js';

export const getOpportunities = async (req, res) => {
  try {
    const { search, location, campaignId, status = 'open' } = req.query;

    let opportunities = await db.getCollection('volunteerOpportunities');

    if (status !== 'all') {
      opportunities = opportunities.filter(o => o.status === status);
    }

    if (search) {
      const q = search.toLowerCase();
      opportunities = opportunities.filter(o =>
        o.title.toLowerCase().includes(q) ||
        o.description.toLowerCase().includes(q) ||
        o.organizationName.toLowerCase().includes(q) ||
        o.skillsRequired.some(s => s.toLowerCase().includes(q))
      );
    }

    if (location) {
      opportunities = opportunities.filter(o => o.location.toLowerCase().includes(location.toLowerCase()));
    }

    if (campaignId) {
      opportunities = opportunities.filter(o => o.campaignId === campaignId);
    }

    res.json({
      success: true,
      count: opportunities.length,
      opportunities: opportunities.sort((a, b) => new Date(a.date) - new Date(b.date))
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch volunteer opportunities', error: err.message });
  }
};

export const createOpportunity = async (req, res) => {
  try {
    const {
      title,
      campaignId,
      location,
      date,
      time,
      spotsNeeded = 10,
      skillsRequired = [],
      description
    } = req.body;

    if (!title || !location || !date || !description) {
      return res.status(400).json({ success: false, message: 'Title, location, date, and description are required' });
    }

    const charityUser = await db.findById('users', req.user.id);
    let campaignTitle = '';
    if (campaignId) {
      const campaign = await db.findById('campaigns', campaignId);
      campaignTitle = campaign ? campaign.title : '';
    }

    const newOpportunity = {
      id: `vol_opp_${uuidv4().substring(0, 8)}`,
      title,
      organizationId: req.user.id,
      organizationName: charityUser?.organization?.legalName || charityUser?.name || req.user.name,
      campaignId: campaignId || null,
      campaignTitle: campaignTitle || null,
      location,
      date,
      time: time || 'Flexible',
      spotsNeeded: Number(spotsNeeded),
      spotsFilled: 0,
      skillsRequired: Array.isArray(skillsRequired) ? skillsRequired : (typeof skillsRequired === 'string' ? skillsRequired.split(',').map(s => s.trim()) : []),
      description,
      status: 'open',
      createdAt: new Date().toISOString()
    };

    await db.insert('volunteerOpportunities', newOpportunity);

    res.status(201).json({
      success: true,
      message: 'Volunteer opportunity posted successfully',
      opportunity: newOpportunity
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create opportunity', error: err.message });
  }
};

export const applyForOpportunity = async (req, res) => {
  try {
    const { opportunityId, availability, experienceNote, phone } = req.body;

    const opportunity = await db.findById('volunteerOpportunities', opportunityId);
    if (!opportunity) {
      return res.status(404).json({ success: false, message: 'Volunteer opportunity not found' });
    }

    const existing = await db.findOne('volunteerApplications', a =>
      a.opportunityId === opportunityId && a.volunteerId === req.user.id
    );

    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already applied for this volunteer opportunity' });
    }

    const newApplication = {
      id: `app_vol_${uuidv4().substring(0, 8)}`,
      opportunityId,
      opportunityTitle: opportunity.title,
      volunteerId: req.user.id,
      volunteerName: req.user.name,
      volunteerEmail: req.user.email,
      volunteerPhone: phone || req.user.phone || '',
      organizationId: opportunity.organizationId,
      status: 'pending',
      availability: availability || 'Available on scheduled date',
      experienceNote: experienceNote || '',
      appliedAt: new Date().toISOString(),
      reviewedAt: null
    };

    await db.insert('volunteerApplications', newApplication);

    await db.insert('notifications', {
      id: `notif_${uuidv4().substring(0, 8)}`,
      userId: opportunity.organizationId,
      title: 'New Volunteer Application! 🙋',
      message: `${req.user.name} applied for '${opportunity.title}'.`,
      type: 'volunteer_application',
      link: '/dashboard/charity',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    res.status(201).json({
      success: true,
      message: 'Volunteer application submitted successfully!',
      application: newApplication
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Application failed', error: err.message });
  }
};

export const getVolunteerApplications = async (req, res) => {
  try {
    const orgId = req.user.id;
    const applications = await db.find('volunteerApplications', a => a.organizationId === orgId);
    const sorted = applications.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));

    res.json({
      success: true,
      applications: sorted
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch applications' });
  }
};

export const getUserApplications = async (req, res) => {
  try {
    const volunteerId = req.user.id;
    const applications = await db.find('volunteerApplications', a => a.volunteerId === volunteerId);
    const sorted = applications.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));

    const approvedCount = sorted.filter(a => a.status === 'approved').length;
    const totalHours = approvedCount * 5;

    res.json({
      success: true,
      stats: {
        totalApplications: sorted.length,
        approvedCount,
        pendingCount: sorted.filter(a => a.status === 'pending').length,
        totalHours
      },
      applications: sorted
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch user applications' });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const application = await db.findById('volunteerApplications', id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (application.organizationId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to review this application' });
    }

    const updated = await db.update('volunteerApplications', id, {
      status,
      reviewedAt: new Date().toISOString()
    });

    if (status === 'approved') {
      const opp = await db.findById('volunteerOpportunities', application.opportunityId);
      if (opp) {
        await db.update('volunteerOpportunities', opp.id, {
          spotsFilled: Math.min(opp.spotsNeeded, opp.spotsFilled + 1)
        });
      }
    }

    await db.insert('notifications', {
      id: `notif_${uuidv4().substring(0, 8)}`,
      userId: application.volunteerId,
      title: status === 'approved' ? 'Volunteer Application Approved! 🎉' : 'Volunteer Application Update',
      message: status === 'approved'
        ? `Great news! Your volunteer application for '${application.opportunityTitle}' has been approved.`
        : `Your application status for '${application.opportunityTitle}' was updated to: ${status}.`,
      type: status === 'approved' ? 'volunteer_approved' : 'volunteer_update',
      link: '/dashboard/volunteer',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: `Application marked as ${status}`,
      application: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update application', error: err.message });
  }
};
