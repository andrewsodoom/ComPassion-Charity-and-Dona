import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import campaignService from '../services/campaignService.js';
import donationService from '../services/donationService.js';
import CampaignCard from '../components/campaign/CampaignCard.jsx';
import CampaignFilter from '../components/campaign/CampaignFilter.jsx';
import DonationModal from '../components/donation/DonationModal.jsx';
import PaymentGatewayModal from '../components/donation/PaymentGatewayModal.jsx';
import DonationSuccessModal from '../components/donation/DonationSuccessModal.jsx';
import DonationReceipt from '../components/donation/DonationReceipt.jsx';
import { Heart, Loader2, Sparkles, FilterX } from 'lucide-react';

export const CampaignsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state initialized from URL
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [status, setStatus] = useState('all');
  const [isVerifiedOnly, setIsVerifiedOnly] = useState(searchParams.get('verified') === 'true');
  const [urgentOnly, setUrgentOnly] = useState(searchParams.get('urgent') === 'true');
  const [sortBy, setSortBy] = useState('featured');

  // Donation flow state
  const [selectedCampaignForDonation, setSelectedCampaignForDonation] = useState(null);
  const [donationPayload, setDonationPayload] = useState(null);
  const [completedDonation, setCompletedDonation] = useState(null);
  const [fullReceiptData, setFullReceiptData] = useState(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // Synchronize with URL
  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (selectedCategory !== 'All') params.category = selectedCategory;
    if (isVerifiedOnly) params.verified = 'true';
    if (urgentOnly) params.urgent = 'true';
    setSearchParams(params, { replace: true });
  }, [search, selectedCategory, isVerifiedOnly, urgentOnly]);

  // Fetch campaigns
  useEffect(() => {
    const fetchFilteredCampaigns = async () => {
      setLoading(true);
      try {
        const query = {
          search,
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          status,
          isVerified: isVerifiedOnly ? 'true' : undefined,
          urgent: urgentOnly ? 'true' : undefined,
          sortBy
        };
        const res = await campaignService.getCampaigns(query);
        if (res.success) {
          setCampaigns(res.campaigns);
        }
      } catch (err) {
        console.error('Failed to fetch campaigns:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredCampaigns();
  }, [search, selectedCategory, status, isVerifiedOnly, urgentOnly, sortBy]);

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
    setCampaigns(prev =>
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

  const clearAllFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setIsVerifiedOnly(false);
    setUrgentOnly(false);
    setSortBy('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Explore Charity Campaigns
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Discover vetted humanitarian initiatives, education drives, medical funds, and environmental missions
        </p>
      </div>

      {/* Filter Component */}
      <CampaignFilter
        search={search}
        setSearch={setSearch}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        status={status}
        setStatus={setStatus}
        isVerifiedOnly={isVerifiedOnly}
        setIsVerifiedOnly={setIsVerifiedOnly}
        urgentOnly={urgentOnly}
        setUrgentOnly={setUrgentOnly}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* Results Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
        <span>
          Showing <strong className="text-slate-800 dark:text-slate-200">{campaigns.length}</strong> active campaign{campaigns.length === 1 ? '' : 's'}
        </span>
        {(search || selectedCategory !== 'All' || isVerifiedOnly || urgentOnly) && (
          <button
            onClick={clearAllFilters}
            className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <FilterX size={14} /> Clear all filters
          </button>
        )}
      </div>

      {/* Campaign Cards Grid */}
      {loading ? (
        <div className="py-24 text-center space-y-3">
          <Loader2 size={36} className="animate-spin text-emerald-500 mx-auto" />
          <p className="text-xs text-slate-400">Loading verified campaigns...</p>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
            <Heart size={32} />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">No campaigns found</h3>
            <p className="text-xs text-slate-500">
              Try adjusting your search terms or category filter to discover other initiatives.
            </p>
          </div>
          <button
            onClick={clearAllFilters}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {campaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onDonateClick={handleDonateClick}
            />
          ))}
        </div>
      )}

      {/* DONATION MODALS */}
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

export default CampaignsPage;
