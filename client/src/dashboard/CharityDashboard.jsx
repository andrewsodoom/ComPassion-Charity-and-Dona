import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import campaignService from '../services/campaignService.js';
import volunteerService from '../services/volunteerService.js';
import donationService from '../services/donationService.js';
import authService from '../services/authService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useCurrency } from '../context/CurrencyContext.jsx';
import VerifiedBadge from '../components/common/VerifiedBadge.jsx';
import AICampaignHelperModal from '../components/campaign/AICampaignHelperModal.jsx';
import CampaignProgress from '../components/campaign/CampaignProgress.jsx';
import {
  Heart,
  PlusCircle,
  Sparkles,
  Users,
  HandHeart,
  FileCheck,
  Building2,
  ShieldCheck,
  Edit,
  Trash2,
  Check,
  X,
  Loader2,
  Share2,
  MessageSquarePlus,
  ArrowRight
} from 'lucide-react';

export const CharityDashboard = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || (searchParams.get('action') === 'create' ? 'create' : 'campaigns');

  const { user, refreshUser } = useAuth();
  const { formatAmount } = useCurrency();

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [loading, setLoading] = useState(true);

  const [campaigns, setCampaigns] = useState([]);
  const [applications, setApplications] = useState([]);
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState({
    totalRaised: 0,
    totalDonors: 0,
    activeCampaigns: 0,
    volunteerApplications: 0
  });

  // Create / Edit Campaign Form State
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Education');
  const [targetAmount, setTargetAmount] = useState('500000');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState('');
  const [endDate, setEndDate] = useState('');
  const [matchingDonorPledge, setMatchingDonorPledge] = useState('');
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [submittingCampaign, setSubmittingCampaign] = useState(false);

  // Post Update Modal State
  const [updateModalCampaign, setUpdateModalCampaign] = useState(null);
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateContent, setUpdateContent] = useState('');
  const [updateImage, setUpdateImage] = useState('');
  const [postingUpdate, setPostingUpdate] = useState(false);

  // Create Volunteer Opportunity State
  const [volTitle, setVolTitle] = useState('');
  const [volCampaignId, setVolCampaignId] = useState('');
  const [volLocation, setVolLocation] = useState('');
  const [volDate, setVolDate] = useState('');
  const [volTime, setVolTime] = useState('09:00 AM - 01:00 PM');
  const [volSpots, setVolSpots] = useState('15');
  const [volSkills, setVolSkills] = useState('Community Support, Logistics');
  const [volDesc, setVolDesc] = useState('');
  const [isCreatingVol, setIsCreatingVol] = useState(false);

  // Verification Submission State
  const [legalName, setLegalName] = useState(user?.organization?.legalName || '');
  const [regNumber, setRegNumber] = useState(user?.organization?.registrationNumber || '');
  const [taxId, setTaxId] = useState(user?.organization?.taxExemptId || '');
  const [country, setCountry] = useState(user?.organization?.country || 'Ghana');
  const [organizationType, setOrganizationType] = useState(user?.organization?.organizationType || 'nonprofit');
  const [taxIdLabel, setTaxIdLabel] = useState(user?.organization?.taxIdLabel || 'Tax Identification Number');
  const [docName, setDocName] = useState('Verification Document.pdf');
  const [docUrl, setDocUrl] = useState('');
  const [submittingVerification, setSubmittingVerification] = useState(false);

  const normalizeAttachmentUrl = (value, fallback) => {
    if (typeof value !== 'string') return fallback;
    const trimmed = value.trim();
    if (!trimmed) return fallback;
    return /^https?:\/\//i.test(trimmed) || /^data:/i.test(trimmed) || /^blob:/i.test(trimmed) ? trimmed : fallback;
  };

  const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file selected'));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Unable to read file'));
    reader.readAsDataURL(file);
  });

  const handleCampaignImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setImage(dataUrl);
      event.target.value = '';
    } catch (err) {
      alert('Unable to attach the campaign image. Please try again.');
    }
  };

  const clearCampaignImage = () => {
    setImage('');
  };

  const handleVerificationDocumentUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setDocName(file.name);
      setDocUrl(dataUrl);
      event.target.value = '';
    } catch (err) {
      alert('Unable to attach the verification document. Please try again.');
    }
  };

  const clearVerificationDocument = () => {
    setDocName('');
    setDocUrl('');
  };

  const handleUpdateImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setUpdateImage(dataUrl);
      event.target.value = '';
    } catch (err) {
      alert('Unable to attach the campaign update image. Please try again.');
    }
  };

  const clearUpdateImage = () => {
    setUpdateImage('');
  };

  const normalizeMediaList = (items, fallbackItem) => {
    if (!Array.isArray(items)) {
      const single = normalizeAttachmentUrl(items, fallbackItem);
      return single ? [single] : [];
    }

    return items
      .map(item => normalizeAttachmentUrl(item, fallbackItem))
      .filter(Boolean)
      .filter((item, index, array) => array.indexOf(item) === index);
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [cRes, aRes, dRes] = await Promise.all([
        campaignService.getOrganizationCampaigns(),
        volunteerService.getOrganizationApplications(),
        donationService.getOrganizationDonations()
      ]);

      if (cRes.success) setCampaigns(cRes.campaigns);
      if (aRes.success) setApplications(aRes.applications);
      if (dRes.success) {
        setDonations(dRes.donations);
        const total = dRes.donations.reduce((sum, d) => sum + (d.amount || 0), 0);
        setStats({
          totalRaised: total,
          totalDonors: dRes.stats?.uniqueDonors || 0,
          activeCampaigns: cRes.campaigns.filter(c => c.status === 'active').length,
          volunteerApplications: aRes.applications.length
        });
      }
    } catch (err) {
      console.error('Error fetching charity data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Handle AI Fill
  const handleApplyAI = (generated) => {
    setTitle(generated.title);
    setTagline(generated.tagline);
    setDescription(generated.description);
    if (generated.suggestedGoal) setTargetAmount(String(generated.suggestedGoal));
  };

  // Handle Create Campaign Submit
  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    setSubmittingCampaign(true);
    try {
      const fallbackImage = 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80';
      const safeImage = normalizeAttachmentUrl(image, fallbackImage);
      const payload = {
        title,
        tagline: tagline || title,
        description,
        category,
        targetAmount: Number(targetAmount),
        location: location || 'Regional',
        image: safeImage,
        gallery: normalizeMediaList([safeImage], safeImage),
        endDate: endDate || new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        matchingDonorPledge: matchingDonorPledge || null
      };

      const res = await campaignService.createCampaign(payload);
      if (res.success) {
        alert('🎉 Campaign launched successfully!');
        setTitle('');
        setTagline('');
        setDescription('');
        setTargetAmount('500000');
        setActiveTab('campaigns');
        fetchDashboardData();
      }
    } catch (err) {
      alert('Failed to launch campaign: ' + err.message);
    } finally {
      setSubmittingCampaign(false);
    }
  };

  // Handle Post Update Submit
  const handlePostUpdate = async (e) => {
    e.preventDefault();
    if (!updateModalCampaign) return;
    setPostingUpdate(true);
    try {
      const res = await campaignService.postUpdate({
        campaignId: updateModalCampaign.id,
        title: updateTitle,
        content: updateContent,
        images: updateImage ? [updateImage] : []
      });
      if (res.success) {
        alert('📢 Progress update published! Donors have been notified.');
        setUpdateModalCampaign(null);
        setUpdateTitle('');
        setUpdateContent('');
        setUpdateImage('');
        fetchDashboardData();
      }
    } catch (err) {
      alert('Failed to post update: ' + err.message);
    } finally {
      setPostingUpdate(false);
    }
  };

  // Handle Create Volunteer Opp
  const handleCreateVolunteerOpp = async (e) => {
    e.preventDefault();
    try {
      const res = await volunteerService.createOpportunity({
        title: volTitle,
        campaignId: volCampaignId || null,
        location: volLocation,
        date: volDate,
        time: volTime,
        spotsNeeded: Number(volSpots),
        skillsRequired: volSkills.split(',').map(s => s.trim()),
        description: volDesc
      });
      if (res.success) {
        alert('Volunteer opportunity posted!');
        setIsCreatingVol(false);
        setVolTitle('');
        setVolDesc('');
      }
    } catch (err) {
      alert('Failed to create opportunity: ' + err.message);
    }
  };

  // Review Application
  const handleReviewApplication = async (appId, newStatus) => {
    try {
      const res = await volunteerService.updateApplicationStatus(appId, newStatus);
      if (res.success) {
        setApplications(prev =>
          prev.map(a => (a.id === appId ? { ...a, status: newStatus } : a))
        );
      }
    } catch (err) {
      alert('Failed to update application status: ' + err.message);
    }
  };

  // Submit Verification Documents
  const handleSubmitVerification = async (e) => {
    e.preventDefault();
    setSubmittingVerification(true);
    try {
      const trimmedDocumentName = docName?.trim();
      const trimmedDocumentUrl = normalizeAttachmentUrl(docUrl, '');
      const res = await authService.submitVerification({
        legalName,
        registrationNumber: regNumber,
        taxExemptId: taxId,
        country,
        organizationType,
        taxIdLabel,
        documentName: trimmedDocumentName || 'Verification Document',
        documentUrl: trimmedDocumentUrl || 'https://example.com/verification-document',
        documents: trimmedDocumentUrl ? [{
          name: trimmedDocumentName || 'Verification Document',
          url: trimmedDocumentUrl,
          submittedAt: new Date().toISOString()
        }] : []
      });
      if (res.success) {
        alert('Verification documents submitted for admin review!');
        refreshUser();
      }
    } catch (err) {
      alert('Submission failed: ' + err.message);
    } finally {
      setSubmittingVerification(false);
    }
  };

  const isVerified = user?.organization?.verificationStatus === 'verified';

  return (
    <div className="space-y-8">
      {/* Verification Status Banner */}
      <div className={`p-4 sm:p-5 rounded-3xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
        isVerified
          ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
          : 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${isVerified ? 'bg-emerald-200 text-emerald-800' : 'bg-amber-200 text-amber-800'}`}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                {user?.organization?.legalName || user?.name}
              </span>
              {isVerified ? <VerifiedBadge size="sm" /> : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
                  Verification Pending
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isVerified
                ? 'Your organization is officially verified. Campaigns display the green trust badge.'
                : 'Submit legal incorporation and compliance documents to get verified.'}
            </p>
          </div>
        </div>

        {!isVerified && (
          <button
            onClick={() => setActiveTab('verification')}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shrink-0 cursor-pointer"
          >
            Submit Documents
          </button>
        )}
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Raised</span>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            {formatAmount(stats.totalRaised)}
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Donors</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {stats.totalDonors}
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Active Campaigns</span>
          <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
            {stats.activeCampaigns}
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Volunteer Signups</span>
          <div className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">
            {stats.volunteerApplications}
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-xs sm:text-sm font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('campaigns')}
          className={`pb-3 transition-colors border-b-2 cursor-pointer shrink-0 ${
            activeTab === 'campaigns'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          My Campaigns ({campaigns.length})
        </button>

        <button
          onClick={() => setActiveTab('create')}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer shrink-0 ${
            activeTab === 'create'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <PlusCircle size={15} />
          <span>Launch Campaign</span>
        </button>

        <button
          onClick={() => setActiveTab('volunteers')}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer shrink-0 ${
            activeTab === 'volunteers'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <HandHeart size={15} />
          <span>Volunteer Applicants ({applications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('donations')}
          className={`pb-3 transition-colors border-b-2 cursor-pointer shrink-0 ${
            activeTab === 'donations'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Donations Ledger ({donations.length})
        </button>

        <button
          onClick={() => setActiveTab('verification')}
          className={`pb-3 transition-colors border-b-2 cursor-pointer shrink-0 ${
            activeTab === 'verification'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Org Verification
        </button>
      </div>

      {/* TAB 1: CAMPAIGNS LIST */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Manage Organization Campaigns
            </h3>
            <button
              onClick={() => setActiveTab('create')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle size={15} />
              <span>Create Campaign</span>
            </button>
          </div>

          {campaigns.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <p className="text-xs text-slate-500">You have not created any campaigns yet.</p>
              <button
                onClick={() => setActiveTab('create')}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold cursor-pointer"
              >
                Create Your First Campaign
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {campaigns.map((c) => (
                <div key={c.id} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {c.category}
                      </span>
                      <h4 className="font-bold text-base text-slate-900 dark:text-white mt-1 line-clamp-1">
                        {c.title}
                      </h4>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full capitalize ${
                      c.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {c.status}
                    </span>
                  </div>

                  <CampaignProgress
                    raisedAmount={c.raisedAmount}
                    targetAmount={c.targetAmount}
                    donorCount={c.donorCount}
                    size="sm"
                  />

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <Link
                      to={`/campaigns/${c.id}`}
                      className="text-xs font-bold text-slate-600 hover:text-emerald-600 transition-colors"
                    >
                      View Live Page →
                    </Link>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setUpdateModalCampaign(c)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <MessageSquarePlus size={14} />
                        <span>Post Update</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CREATE CAMPAIGN WIZARD */}
      {activeTab === 'create' && (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">
                Launch a New Fundraising Campaign
              </h3>
              <p className="text-xs text-slate-500">
                Craft your cause story, set funding targets, and attract donors worldwide
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAIModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer"
            >
              <Sparkles size={16} />
              <span>Use AI Story Writer</span>
            </button>
          </div>

          <form onSubmit={handleCreateCampaign} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Campaign Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Provide Solar Tablets to 200 Rural Girls"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                >
                  <option value="Education">🎓 Education</option>
                  <option value="Healthcare">🏥 Healthcare</option>
                  <option value="Food">🍲 Food Relief</option>
                  <option value="Environment">🌱 Environment</option>
                  <option value="Animals">🐾 Animals</option>
                  <option value="Disaster Relief">🚨 Disaster Relief</option>
                  <option value="Housing">🏠 Housing</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Target Fundraising Goal (INR ₹)
                </label>
                <input
                  type="number"
                  required
                  min="1000"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  placeholder="500000"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Location / Beneficiary Area
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Alwar, Rajasthan, India"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Cover Image URL or Upload
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                  <input
                    id="campaign-image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCampaignImageUpload}
                  />
                  <label
                    htmlFor="campaign-image-upload"
                    className="px-3 py-2.5 rounded-xl bg-slate-800 dark:bg-slate-700 text-white text-xs font-bold cursor-pointer whitespace-nowrap"
                  >
                    Upload
                  </label>
                  <button
                    type="button"
                    onClick={clearCampaignImage}
                    className="px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold whitespace-nowrap cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                One-Sentence Tagline / Hook
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Brief emotional summary displayed on search cards"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Cause Story & Impact Breakdown
              </label>
              <textarea
                required
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the background problem, exact field solution, and why donor funding is urgently needed..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 leading-relaxed"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Corporate Matching Pledge Notice (Optional)
              </label>
              <input
                type="text"
                value={matchingDonorPledge}
                onChange={(e) => setMatchingDonorPledge(e.target.value)}
                placeholder="e.g. Google Grants matches 100% of donations made this month!"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submittingCampaign}
                className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                {submittingCampaign ? <Loader2 size={18} className="animate-spin" /> : <span>Publish Campaign to ComPassion</span>}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: VOLUNTEER APPLICANTS */}
      {activeTab === 'volunteers' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Volunteer Applications Review
              </h3>
              <p className="text-xs text-slate-500">Review, approve, or decline community volunteers</p>
            </div>
            <button
              onClick={() => setIsCreatingVol(true)}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle size={15} />
              <span>Post Volunteer Event</span>
            </button>
          </div>

          {/* Form to create event if opened */}
          {isCreatingVol && (
            <form onSubmit={handleCreateVolunteerOpp} className="p-6 rounded-3xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/50 space-y-4 text-xs">
              <div className="flex items-center justify-between font-bold text-purple-900 dark:text-purple-300">
                <span>Create New Volunteer Opportunity</span>
                <button type="button" onClick={() => setIsCreatingVol(false)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Opportunity Title (e.g. Weekend Food Packing Drive)"
                  value={volTitle}
                  onChange={(e) => setVolTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border"
                />
                <input
                  type="text"
                  required
                  placeholder="Location (e.g. Central Community Center)"
                  value={volLocation}
                  onChange={(e) => setVolLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border"
                />
                <input
                  type="date"
                  required
                  value={volDate}
                  onChange={(e) => setVolDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border"
                />
                <input
                  type="number"
                  placeholder="Spots Needed (e.g. 20)"
                  value={volSpots}
                  onChange={(e) => setVolSpots(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border"
                />
              </div>

              <textarea
                placeholder="Description of duties and schedule..."
                rows={2}
                value={volDesc}
                onChange={(e) => setVolDesc(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border"
              />

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs"
              >
                Publish Volunteer Drive
              </button>
            </form>
          )}

          {applications.length === 0 ? (
            <div className="p-8 text-center rounded-3xl bg-white dark:bg-slate-900 text-xs text-slate-500">
              No volunteer applications received yet.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b">
                  <tr>
                    <th className="p-3.5">Volunteer</th>
                    <th className="p-3.5">Opportunity</th>
                    <th className="p-3.5">Contact / Availability</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 dark:text-white">{app.volunteerName}</div>
                        <div className="text-[11px] text-slate-400">{app.volunteerEmail}</div>
                      </td>
                      <td className="p-3.5 font-medium">{app.opportunityTitle}</td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-300">
                        <div>{app.volunteerPhone || '—'}</div>
                        <div className="text-[11px] text-slate-400 italic">{app.availability}</div>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                          app.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.status === 'rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        {app.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => handleReviewApplication(app.id, 'approved')}
                              className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700 cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReviewApplication(app.id, 'rejected')}
                              className="px-3 py-1 rounded-lg bg-slate-200 text-slate-700 font-semibold text-[11px] hover:bg-slate-300 cursor-pointer"
                            >
                              Decline
                            </button>
                          </>
                        ) : (
                          <span className="text-[11px] text-slate-400">Reviewed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: DONATIONS LEDGER */}
      {activeTab === 'donations' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Received Contributions Ledger
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Receipt #</th>
                  <th className="p-3.5">Donor</th>
                  <th className="p-3.5">Campaign</th>
                  <th className="p-3.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {donations.map((d) => (
                  <tr key={d.id}>
                    <td className="p-3.5 text-slate-400">
                      {new Date(d.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3.5 font-mono font-bold text-slate-700 dark:text-slate-300">{d.receiptNumber}</td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 dark:text-white">{d.donorName}</div>
                      <div className="text-[10px] text-slate-400">{d.donorEmail}</div>
                    </td>
                    <td className="p-3.5 font-medium">{d.campaignTitle}</td>
                    <td className="p-3.5 text-right font-extrabold text-emerald-600">
                      {formatAmount(d.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: ORGANIZATION VERIFICATION */}
      {activeTab === 'verification' && (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
          <div>
            <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">
              Charity Legal Verification & Tax Compliance
            </h3>
            <p className="text-xs text-slate-500">
              Submit your organization credentials to earn the green Verified badge and build instant donor trust.
            </p>
          </div>

          <form onSubmit={handleSubmitVerification} className="space-y-4 text-xs max-w-xl">
            <div>
              <label className="block font-bold mb-1">Legal Registered Name</label>
              <input
                type="text"
                required
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold mb-1">Country</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border"
                >
                  <option value="Ghana">Ghana</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block font-bold mb-1">Organization Type</label>
                <select
                  value={organizationType}
                  onChange={(e) => setOrganizationType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border"
                >
                  <option value="nonprofit">NGO / Nonprofit</option>
                  <option value="foundation">Foundation</option>
                  <option value="charity">Charity</option>
                  <option value="trust">Trust</option>
                  <option value="association">Association</option>
                  <option value="school">School / Educational Institution</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold mb-1">Govt. Registration #</label>
                <input
                  type="text"
                  required
                  value={regNumber}
                  onChange={(e) => setRegNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Tax ID Label</label>
                <select
                  value={taxIdLabel}
                  onChange={(e) => setTaxIdLabel(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border"
                >
                  <option value="Tax Identification Number">Tax Identification Number</option>
                  <option value="Registration Number">Registration Number</option>
                  <option value="Charity Number">Charity Number</option>
                  <option value="Trust Registration ID">Trust Registration ID</option>
                  <option value="TIN">TIN</option>
                  <option value="Tax Exemption ID">Tax Exemption ID</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold mb-1">{taxIdLabel}</label>
              <input
                type="text"
                required
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border"
              />
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-bold mb-1">Document Name</label>
                <input
                  type="text"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder="80G Tax Exemption Certificate.pdf"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Document URL or File Link</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={docUrl}
                    onChange={(e) => setDocUrl(e.target.value)}
                    placeholder="https://example.com/docs/80g_cert.pdf"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border"
                  />
                  <input
                    id="verification-document-upload"
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,image/*"
                    className="hidden"
                    onChange={handleVerificationDocumentUpload}
                  />
                  <label
                    htmlFor="verification-document-upload"
                    className="px-3 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold cursor-pointer whitespace-nowrap"
                  >
                    Upload
                  </label>
                  <button
                    type="button"
                    onClick={clearVerificationDocument}
                    className="px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold whitespace-nowrap cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submittingVerification}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
            >
              {submittingVerification ? 'Submitting...' : 'Submit Credentials for Review'}
            </button>
          </form>
        </div>
      )}

      {/* AI STORY MODAL */}
      <AICampaignHelperModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onApplyGenerated={handleApplyAI}
        initialCategory={category}
      />

      {/* POST UPDATE MODAL */}
      {updateModalCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-base text-slate-900 dark:text-white">
                Post Field Progress Update
              </h4>
              <button onClick={() => setUpdateModalCampaign(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <p className="text-xs text-slate-500">
              For: <strong className="text-slate-800 dark:text-slate-200">{updateModalCampaign.title}</strong>
            </p>

            <form onSubmit={handlePostUpdate} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Update Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 150 Children Received Digital Study Kits!"
                  value={updateTitle}
                  onChange={(e) => setUpdateTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Progress Details & Message</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share what was accomplished with donor funds..."
                  value={updateContent}
                  onChange={(e) => setUpdateContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Image URL or Upload (Optional)</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={updateImage}
                    onChange={(e) => setUpdateImage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border"
                  />
                  <input
                    id="update-image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleUpdateImageUpload}
                  />
                  <label
                    htmlFor="update-image-upload"
                    className="px-3 py-2.5 rounded-xl bg-slate-800 dark:bg-slate-700 text-white text-xs font-bold cursor-pointer whitespace-nowrap"
                  >
                    Upload
                  </label>
                  <button
                    type="button"
                    onClick={clearUpdateImage}
                    className="px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold whitespace-nowrap cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={postingUpdate}
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
              >
                {postingUpdate ? 'Publishing & Notifying Donors...' : 'Publish Update & Notify Donors'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CharityDashboard;
