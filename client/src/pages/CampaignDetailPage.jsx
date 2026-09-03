import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import campaignService from '../services/campaignService.js';
import donationService from '../services/donationService.js';
import aiService from '../services/aiService.js';
import { useCurrency } from '../context/CurrencyContext.jsx';
import CategoryBadge from '../components/common/CategoryBadge.jsx';
import VerifiedBadge from '../components/common/VerifiedBadge.jsx';
import CampaignProgress from '../components/campaign/CampaignProgress.jsx';
import QRCodeModal from '../components/campaign/QRCodeModal.jsx';
import DonationModal from '../components/donation/DonationModal.jsx';
import PaymentGatewayModal from '../components/donation/PaymentGatewayModal.jsx';
import DonationSuccessModal from '../components/donation/DonationSuccessModal.jsx';
import DonationReceipt from '../components/donation/DonationReceipt.jsx';
import VolunteerCard from '../components/volunteer/VolunteerCard.jsx';
import VolunteerApplyModal from '../components/volunteer/VolunteerApplyModal.jsx';
import {
  MapPin,
  Clock,
  Heart,
  Share2,
  QrCode,
  Sparkles,
  ShieldCheck,
  Building2,
  Gift,
  FileCheck,
  Flame,
  MessageCircle,
  Award,
  CheckCircle2,
  Calendar,
  Loader2,
  Copy,
  Check
} from 'lucide-react';

export const CampaignDetailPage = () => {
  const { id } = useParams();
  const { currency, currencySymbol, formatAmount } = useCurrency();

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('story'); // 'story' | 'updates' | 'donors' | 'volunteers'
  const [selectedImage, setSelectedImage] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // AI Summary State
  const [aiSummary, setAiSummary] = useState(null);
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false);

  // Modals
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [donationPayload, setDonationPayload] = useState(null);
  const [completedDonation, setCompletedDonation] = useState(null);
  const [fullReceiptData, setFullReceiptData] = useState(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // Volunteer Modal
  const [selectedVolunteerOpp, setSelectedVolunteerOpp] = useState(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      setLoading(true);
      try {
        const res = await campaignService.getCampaignById(id);
        if (res.success) {
          setCampaign(res.campaign);
          setSelectedImage(res.campaign.image);
        }
      } catch (err) {
        console.error('Failed to load campaign detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

  useEffect(() => {
    if (activeTab !== 'updates') return;

    const fetchUpdates = async () => {
      try {
        const res = await campaignService.getUpdates(id);
        if (res.success) {
          setCampaign(prev => prev ? { ...prev, updates: res.updates } : prev);
        }
      } catch (err) {
        console.error('Failed to refresh campaign updates:', err);
      }
    };

    fetchUpdates();
  }, [id, activeTab]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleGenerateSummary = async () => {
    if (!campaign) return;
    setAiSummaryLoading(true);
    try {
      const res = await aiService.generateSummary({
        title: campaign.title,
        description: campaign.description,
        category: campaign.category,
        raisedAmount: campaign.raisedAmount,
        targetAmount: campaign.targetAmount
      });
      if (res.success) {
        setAiSummary(res.takeaways);
      }
    } catch (err) {
      console.error('AI summary error:', err);
    } finally {
      setAiSummaryLoading(false);
    }
  };

  const handleProceedToPayment = (payload) => {
    setDonationPayload(payload);
    setIsDonationModalOpen(false);
  };

  const handlePaymentSuccess = (donation, updatedCampaign) => {
    setDonationPayload(null);
    setCompletedDonation(donation);
    setCampaign(prev => ({
      ...prev,
      ...updatedCampaign,
      recentDonations: [
        {
          id: donation.id,
          donorName: donation.isAnonymous ? 'Anonymous Supporter' : donation.donorName,
          amount: donation.amount,
          currency: donation.currency,
          donorMessage: donation.donorMessage,
          createdAt: donation.createdAt
        },
        ...(prev?.recentDonations || [])
      ]
    }));
  };

  const handleOpenReceipt = async (receiptNumber) => {
    try {
      const res = await donationService.getReceiptById(receiptNumber);
      if (res.success) {
        setFullReceiptData(res.receipt);
        setIsReceiptModalOpen(true);
        setCompletedDonation(null);
      }
    } catch (err) {
      console.error('Failed to fetch receipt:', err);
    }
  };

  if (loading) {
    return (
      <div className="py-32 text-center space-y-3">
        <Loader2 size={40} className="animate-spin text-emerald-500 mx-auto" />
        <p className="text-xs text-slate-500">Loading campaign details...</p>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center space-y-4">
        <h2 className="text-xl font-bold">Campaign Not Found</h2>
        <p className="text-xs text-slate-500">The requested fundraising initiative could not be found or may have concluded.</p>
        <Link to="/campaigns" className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold">
          Browse All Campaigns
        </Link>
      </div>
    );
  }

  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(campaign.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Top Header: Title & Badges */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <CategoryBadge category={campaign.category} size="md" />
          {campaign.isVerified && <VerifiedBadge size="md" />}
          {campaign.urgent && (
            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-rose-600 text-white shadow-xs animate-pulse">
              <Flame size={14} /> Urgent Need
            </span>
          )}
          {campaign.status === 'completed' && (
            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-emerald-700 text-white">
              <CheckCircle2 size={14} /> 100% Fully Funded
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          {campaign.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
            <Building2 size={15} className="text-emerald-600" />
            <span>{campaign.organizationName}</span>
          </div>
          {campaign.location && (
            <div className="flex items-center gap-1">
              <MapPin size={14} className="text-rose-500" />
              <span>{campaign.location}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Clock size={14} className="text-blue-500" />
            <span>{daysLeft > 0 ? `${daysLeft} days remaining` : 'Final day'}</span>
          </div>
        </div>
      </div>

      {/* Main Content Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column (8 cols): Media, Tabs, Story, Updates, Donors */}
        <div className="lg:col-span-8 space-y-8">
          {/* Main Media Gallery */}
          <div className="space-y-3">
            <div className="aspect-16/9 rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-md border border-slate-200/80 dark:border-slate-800">
              <img
                src={selectedImage || campaign.image}
                alt={campaign.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Gallery Thumbnails */}
            {campaign.gallery && campaign.gallery.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {campaign.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      selectedImage === img ? 'border-emerald-500 scale-105 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* AI Quick Summary Box */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-emerald-600 dark:text-emerald-400" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  AI Campaign Key Takeaways
                </h4>
              </div>
              {!aiSummary && (
                <button
                  onClick={handleGenerateSummary}
                  disabled={aiSummaryLoading}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {aiSummaryLoading ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                  <span>Generate Summary</span>
                </button>
              )}
            </div>

            {aiSummary ? (
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {aiSummary.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-0.5">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Click "Generate Summary" to get instant AI-extracted bullet points on this campaign's target goals and fiscal impact.
              </p>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-slate-200 dark:border-slate-800 flex gap-6 text-sm font-bold">
            <button
              onClick={() => setActiveTab('story')}
              className={`pb-3 transition-colors border-b-2 cursor-pointer ${
                activeTab === 'story'
                  ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Story & Cause
            </button>
            <button
              onClick={() => setActiveTab('updates')}
              className={`pb-3 transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'updates'
                  ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <span>Field Updates</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800">
                {campaign.updates?.length || 0}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('donors')}
              className={`pb-3 transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'donors'
                  ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <span>Donors Community</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800">
                {campaign.donorCount || 0}
              </span>
            </button>
            {campaign.volunteerOpportunities && campaign.volunteerOpportunities.length > 0 && (
              <button
                onClick={() => setActiveTab('volunteers')}
                className={`pb-3 transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'volunteers'
                    ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <span>Volunteering</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700">
                  {campaign.volunteerOpportunities.length}
                </span>
              </button>
            )}
          </div>

          {/* TAB 1: STORY */}
          {activeTab === 'story' && (
            <div className="space-y-6">
              <div className="prose dark:prose-invert max-w-none text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {campaign.description}
              </div>

              {/* Impact Milestones Grid */}
              {campaign.impactMetrics && campaign.impactMetrics.length > 0 && (
                <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
                  <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider">
                    Measurable Project Goals
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {campaign.impactMetrics.map((m, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                        <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{m.value}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{m.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Organization Credibility Card */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start gap-4">
                <img
                  src={campaign.organizationAvatar || 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=150&auto=format&fit=crop&q=80'}
                  alt={campaign.organizationName}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/20"
                />
                <div className="space-y-1.5 flex-1 text-xs">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {campaign.organizationName}
                    </h4>
                    {campaign.isVerified && <VerifiedBadge size="sm" />}
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {campaign.organizationInfo?.bio || 'Registered nonprofit organization dedicated to transparent grassroots impact.'}
                  </p>
                  <div className="flex flex-wrap gap-4 text-[11px] text-slate-500 pt-1">
                    <span>Reg #: <strong className="text-slate-700 dark:text-slate-300">{campaign.organizationInfo?.registrationNumber || '80G-DEL-2021'}</strong></span>
                    <span>Tax Exemption: <strong className="text-emerald-600">{campaign.organizationInfo?.taxExemptId || 'Section 80G Certified'}</strong></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: UPDATES TIMELINE */}
          {activeTab === 'updates' && (
            <div className="space-y-6">
              {(!campaign.updates || campaign.updates.length === 0) ? (
                <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-900 text-xs text-slate-500">
                  No field updates posted yet. Donors will receive notifications as soon as progress reports are published.
                </div>
              ) : (
                <div className="space-y-6">
                  {campaign.updates.map((upd) => (
                    <div key={upd.id} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold text-xs">
                            📢
                          </div>
                          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Field Progress Report</span>
                        </div>
                        <span className="text-xs text-slate-400">
                          {new Date(upd.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {upd.title}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                        {upd.content}
                      </p>

                      {upd.images && upd.images.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          {upd.images.map((imgUrl, imgIdx) => (
                            <img
                              key={imgIdx}
                              src={imgUrl}
                              alt="Update media"
                              className="rounded-2xl w-full h-48 object-cover border border-slate-200 dark:border-slate-700"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DONORS LIST */}
          {activeTab === 'donors' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-300 flex items-center justify-between">
                <span>Total Contributions: <strong>{campaign.donorCount}</strong></span>
                <span>Raised: <strong>{formatAmount(campaign.raisedAmount)}</strong></span>
              </div>

              {(!campaign.recentDonations || campaign.recentDonations.length === 0) ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  Be the first to donate to this campaign!
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {campaign.recentDonations.map((d) => (
                    <div key={d.id} className="py-4 flex items-start gap-3 text-xs">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold flex items-center justify-center shrink-0">
                        <Heart size={16} className="fill-emerald-600" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {d.donorName}
                          </span>
                          <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                            {formatAmount(d.amount)}
                          </span>
                        </div>
                        {d.donorMessage && (
                          <p className="text-slate-600 dark:text-slate-400 italic">
                            "{d.donorMessage}"
                          </p>
                        )}
                        <span className="text-[10px] text-slate-400 block">
                          {new Date(d.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: VOLUNTEERING */}
          {activeTab === 'volunteers' && campaign.volunteerOpportunities && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {campaign.volunteerOpportunities.map((opp) => (
                <VolunteerCard
                  key={opp.id}
                  opportunity={opp}
                  onApplyClick={(o) => setSelectedVolunteerOpp(o)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column (4 cols): Sticky Donation Box & Actions */}
        <div className="lg:col-span-4 sticky top-24 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
            {/* Progress Meter */}
            <CampaignProgress
              raisedAmount={campaign.raisedAmount}
              targetAmount={campaign.targetAmount}
              donorCount={campaign.donorCount}
              size="md"
            />

            {/* Matching Donor Pledge Notice */}
            {campaign.matchingDonorPledge && (
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                <Gift size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Matching Active: </span>
                  <span>{campaign.matchingDonorPledge}</span>
                </div>
              </div>
            )}

            {/* Primary Action Button */}
            <button
              onClick={() => setIsDonationModalOpen(true)}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Heart size={18} className="fill-white" />
              <span>Donate Now</span>
            </button>

            {/* Share & QR Row */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setIsQRModalOpen(true)}
                className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <QrCode size={15} />
                <span>QR Code</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedLink ? <Check size={15} className="text-emerald-500" /> : <Share2 size={15} />}
                <span>{copiedLink ? 'Copied' : 'Share'}</span>
              </button>
            </div>

            {/* Tax Exemption Trust Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                <FileCheck size={16} className="text-emerald-600" />
                <span>Tax Exemption Guarantee</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                All donations to this verified campaign are eligible for 80G / 501(c)(3) tax deductions. Official downloadable receipts are generated instantly upon checkout.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        campaign={campaign}
      />

      <DonationModal
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
        campaign={campaign}
        onProceedToPayment={handleProceedToPayment}
      />

      <PaymentGatewayModal
        isOpen={!!donationPayload}
        onClose={() => setDonationPayload(null)}
        donationData={donationPayload}
        onSuccess={handlePaymentSuccess}
      />

      <DonationSuccessModal
        isOpen={!!completedDonation}
        onClose={() => setCompletedDonation(null)}
        donation={completedDonation}
        onOpenReceipt={handleOpenReceipt}
      />

      {selectedVolunteerOpp && (
        <VolunteerApplyModal
          isOpen={!!selectedVolunteerOpp}
          onClose={() => setSelectedVolunteerOpp(null)}
          opportunity={selectedVolunteerOpp}
          onApplied={() => {
            alert('Volunteer application submitted!');
            setSelectedVolunteerOpp(null);
          }}
        />
      )}

      {/* Full Screen Printable Receipt Modal */}
      {isReceiptModalOpen && fullReceiptData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative max-w-3xl w-full my-8">
              <div className="no-print flex justify-end mb-3">
                <button
                  onClick={() => setIsReceiptModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-lg hover:bg-slate-100 cursor-pointer"
                >
                  ✕ Return to Campaign
                </button>
              </div>
            <DonationReceipt receipt={fullReceiptData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignDetailPage;
