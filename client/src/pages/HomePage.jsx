import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import campaignService from '../services/campaignService.js';
import { useCurrency } from '../context/CurrencyContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import CampaignCard from '../components/campaign/CampaignCard.jsx';
import DonationModal from '../components/donation/DonationModal.jsx';
import PaymentGatewayModal from '../components/donation/PaymentGatewayModal.jsx';
import DonationSuccessModal from '../components/donation/DonationSuccessModal.jsx';
import DonationReceipt from '../components/donation/DonationReceipt.jsx';
import donationService from '../services/donationService.js';
import {
  Heart,
  ShieldCheck,
  Flame,
  Users,
  Sparkles,
  ArrowRight,
  Gift,
  FileCheck,
  HandHeart,
  Award,
  CheckCircle2,
  TrendingUp,
  Globe2
} from 'lucide-react';

export const HomePage = () => {
  const { formatAmount } = useCurrency();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [featuredCampaigns, setFeaturedCampaigns] = useState([]);
  const [urgentCampaigns, setUrgentCampaigns] = useState([]);
  const [stats, setStats] = useState({
    totalRaised: 2540000,
    activeCampaigns: 12,
    verifiedCharities: 8,
    volunteers: 340
  });

  // Modals state
  const [selectedCampaignForDonation, setSelectedCampaignForDonation] = useState(null);
  const [donationPayload, setDonationPayload] = useState(null);
  const [completedDonation, setCompletedDonation] = useState(null);
  const [fullReceiptData, setFullReceiptData] = useState(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const res = await campaignService.getCampaigns();
        if (res.success) {
          const list = res.campaigns;
          setFeaturedCampaigns(list.filter(c => c.featured || c.status === 'active').slice(0, 6));
          setUrgentCampaigns(list.filter(c => c.urgent).slice(0, 3));

          const total = list.reduce((sum, c) => sum + (c.raisedAmount || 0), 0);
          setStats(prev => ({
            ...prev,
            totalRaised: Math.max(prev.totalRaised, total),
            activeCampaigns: list.filter(c => c.status === 'active').length
          }));
        }
      } catch (err) {
        console.error('Failed to load campaigns for homepage:', err);
      }
    };
    fetchHomeData();
  }, []);

  const handleDonateClick = (campaign) => {
    setSelectedCampaignForDonation(campaign);
  };

  const handleProceedToPayment = (payload) => {
    setDonationPayload(payload);
    setSelectedCampaignForDonation(null);
  };

  const handlePaymentSuccess = (donation, updatedCampaign) => {
    setDonationPayload(null);
    setCompletedDonation(donation);

    // Update local campaigns list
    setFeaturedCampaigns(prev =>
      prev.map(c => (c.id === updatedCampaign.id ? updatedCampaign : c))
    );
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
      console.error('Failed to load receipt:', err);
    }
  };

  const categories = [
    { name: 'Education', icon: '🎓', count: '14 Campaigns', desc: 'Books, digital tablets & school fees' },
    { name: 'Healthcare', icon: '🏥', count: '22 Campaigns', desc: 'Critical surgeries & emergency clinics' },
    { name: 'Food', icon: '🍲', count: '18 Campaigns', desc: 'Daily meals & family dry rations' },
    { name: 'Environment', icon: '🌱', count: '11 Campaigns', desc: 'Tree planting & clean water filters' },
    { name: 'Animals', icon: '🐾', count: '9 Campaigns', desc: 'Shelter care & stray veterinary rescue' },
    { name: 'Disaster Relief', icon: '🚨', count: '7 Campaigns', desc: 'Emergency flood & crisis aid' }
  ];

  return (
    <div className="space-y-10 lg:space-y-14 pb-20 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-8 pb-10 lg:pt-16 lg:pb-10">
        {/* Background glow ornaments */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-emerald-400/20 via-teal-400/10 to-transparent blur-3xl -z-10 rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Trust Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/80 text-xs font-semibold shadow-xs animate-in fade-in slide-in-from-bottom-2">
            <Sparkles size={14} className="text-emerald-600 dark:text-emerald-400" />
            <span>100% Tax-Exempt Nonprofits • Verified 80G & 501(c)(3) Compliant</span>
          </div>

          {/* Main Title */}
          <div className="space-y-4 max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
              Empower Real Change with <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400">Total Transparency</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
              ComPassion connects generous donors with thoroughly vetted charities and urgent humanitarian causes worldwide. Track every dollar with live progress metrics and instant tax receipts.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
            <Link
              to="/campaigns"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <Heart size={18} className="fill-white" />
              <span>Explore Verified Campaigns</span>
            </Link>

            <Link
              to={user?.role === 'charity' ? '/dashboard/charity' : '/register?role=charity'}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition-all"
            >
              <span>Start a Fundraiser</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Live Impact Counters Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-10 max-w-5xl mx-auto">
            <div className="p-5 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {formatAmount(stats.totalRaised, { compact: true })}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                Total Funds Raised
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {stats.activeCampaigns}+
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                Active Campaigns
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 flex items-center justify-center gap-1">
                <ShieldCheck size={26} /> {stats.verifiedCharities}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                Verified Organizations
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400">
                {stats.volunteers}+
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                Volunteers Registered
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. URGENT CAMPAIGNS ALERT BANNER */}
      {urgentCampaigns.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-900/90 via-rose-950 to-slate-900 text-white shadow-xl border border-rose-800/50 relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold">
                  <Flame size={14} className="text-rose-400" />
                  <span>URGENT HUMANITARIAN NEED</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold">
                  {urgentCampaigns[0].title}
                </h3>
                <p className="text-xs sm:text-sm text-rose-100/80 line-clamp-2">
                  {urgentCampaigns[0].tagline || urgentCampaigns[0].description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full md:w-auto">
                <button
                  onClick={() => handleDonateClick(urgentCampaigns[0])}
                  className="px-6 py-3.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-600/40 flex items-center justify-center gap-2 transition-transform hover:scale-105 cursor-pointer"
                >
                  <Heart size={16} className="fill-white" />
                  <span>Donate Immediately</span>
                </button>
                <Link
                  to={`/campaigns/${urgentCampaigns[0].id}`}
                  className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs text-center backdrop-blur-md transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. EXPLORE BY CAUSE / CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Explore Causes by Category
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Find initiatives tailored to the issues you care deeply about
            </p>
          </div>
          <Link
            to="/campaigns"
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            Browse all campaigns <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/campaigns?category=${encodeURIComponent(cat.name)}`}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/50 hover:shadow-lg dark:hover:shadow-emerald-950/20 transition-all text-center space-y-2 group"
            >
              <div className="text-3xl group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 transition-colors">
                {cat.name}
              </h4>
              <p className="text-[11px] text-slate-400 line-clamp-1">
                {cat.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. FEATURED CAMPAIGNS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
              <TrendingUp size={14} /> Active Fundraising Initiatives
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Featured Verified Campaigns
            </h2>
          </div>
          <Link
            to="/campaigns"
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            View All Campaigns ({featuredCampaigns.length}) <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredCampaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onDonateClick={handleDonateClick}
            />
          ))}
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              How ComPassion Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              A transparent bridge turning personal compassion into accountable community impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center font-extrabold text-lg">
                1
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Discover Verified Causes
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Browse campaigns backed by verified charities with legal 80G / 501(c)(3) tax credentials and audit oversight.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center font-extrabold text-lg">
                2
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Instant Secure Giving
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Contribute seamlessly with Cards, UPI QR codes, or NetBanking, receiving instant tax-deductible receipts.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 mx-auto flex items-center justify-center font-extrabold text-lg">
                3
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Track Impact & Progress
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Receive live field notifications with photos and milestones showing exactly how funds change lives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. VOLUNTEER TEASER BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-tr from-emerald-700 via-teal-800 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold backdrop-blur-md">
              <HandHeart size={14} />
              <span>COMMUNITY ACTION</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              Give Your Time: Become a ComPassion Volunteer
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
              Join hands on weekends for community food kitchens, tree planting drives, digital school setups, and disaster relief. Verified hours certificates provided for students & professionals.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link
              to="/volunteers"
              className="px-6 py-3.5 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs text-center shadow-lg transition-transform hover:scale-105"
            >
              Explore Volunteer Events
            </Link>
          </div>
        </div>
      </section>

      {/* DONATION MODALS STACK */}
      <DonationModal
        isOpen={!!selectedCampaignForDonation}
        onClose={() => setSelectedCampaignForDonation(null)}
        campaign={selectedCampaignForDonation}
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

      {/* Full Screen Printable Receipt Modal */}
      {isReceiptModalOpen && fullReceiptData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative max-w-3xl w-full my-8">
            <button
              onClick={() => setIsReceiptModalOpen(false)}
              className="no-print absolute -top-12 right-0 px-4 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-lg hover:bg-slate-100 cursor-pointer"
            >
              ✕ Close Receipt
            </button>
            <DonationReceipt receipt={fullReceiptData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
