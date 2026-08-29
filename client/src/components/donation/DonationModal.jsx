import React, { useState, useEffect } from 'react';
import { useCurrency } from '../../context/CurrencyContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import aiService from '../../services/aiService.js';
import {
  Heart,
  X,
  ShieldCheck,
  Sparkles,
  Lock,
  Gift,
  EyeOff,
  Calendar,
  Check
} from 'lucide-react';

export const DonationModal = ({ isOpen, onClose, campaign, onProceedToPayment }) => {
  const { user } = useAuth();
  const { currency, currencySymbol, convertFromINR, convertToINR, formatAmount } = useCurrency();

  const presetsINR = [500, 1000, 2500, 5000, 10000];
  const presetsUSD = [10, 25, 50, 100, 250];

  const activePresets = currency === 'INR' ? presetsINR : presetsUSD;

  const [selectedAmount, setSelectedAmount] = useState(activePresets[1]);
  const [customAmount, setCustomAmount] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState('monthly');
  const [tipPercent, setTipPercent] = useState(10); // 0, 5, 10, 15
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [hasDedication, setHasDedication] = useState(false);
  const [dedicationType, setDedicationType] = useState('in_honor_of');
  const [dedicationName, setDedicationName] = useState('');
  const [donorMessage, setDonorMessage] = useState('');
  const [impactText, setImpactText] = useState('');

  const [donorName, setDonorName] = useState(user?.name || '');
  const [donorEmail, setDonorEmail] = useState(user?.email || '');
  const [donorPhone, setDonorPhone] = useState(user?.phone || '');

  const effectiveAmount = customAmount ? Number(customAmount) : selectedAmount;
  const tipAmount = Math.round((effectiveAmount * tipPercent) / 100);
  const totalAmount = effectiveAmount + tipAmount;

  // Update impact statement when amount changes
  useEffect(() => {
    if (effectiveAmount > 0 && campaign) {
      const inrValue = currency === 'INR' ? effectiveAmount : convertToINR(effectiveAmount);
      aiService.estimateImpact({
        amount: inrValue,
        currency: 'INR',
        category: campaign.category
      }).then(res => {
        if (res.success) setImpactText(res.impactStatement);
      }).catch(() => {});
    }
  }, [effectiveAmount, campaign, currency]);

  if (!isOpen || !campaign) return null;

  const handleContinue = (e) => {
    e.preventDefault();
    if (!effectiveAmount || effectiveAmount <= 0) {
      alert('Please select or enter a valid donation amount.');
      return;
    }

    const inrBaseAmount = currency === 'INR' ? effectiveAmount : convertToINR(effectiveAmount);
    const inrTipAmount = currency === 'INR' ? tipAmount : convertToINR(tipAmount);

    const donationPayload = {
      campaignId: campaign.id,
      amount: inrBaseAmount,
      tipAmount: inrTipAmount,
      currency: 'INR',
      displayCurrency: currency,
      displayAmount: effectiveAmount,
      displayTip: tipAmount,
      displayTotal: totalAmount,
      donorName: isAnonymous ? 'Anonymous Donor' : (donorName || 'Generous Donor'),
      donorEmail: donorEmail || 'donor@example.com',
      donorPhone,
      isRecurring,
      frequency,
      isAnonymous,
      dedication: hasDedication && dedicationName ? { type: dedicationType, name: dedicationName } : null,
      donorMessage
    };

    onProceedToPayment(donationPayload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-emerald-50/50 dark:bg-emerald-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/30">
              <Heart size={20} className="fill-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Make a Donation
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                {campaign.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <form onSubmit={handleContinue} className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Frequency Toggle (One-time vs Recurring) */}
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setIsRecurring(false)}
              className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                !isRecurring
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              One-Time Gift
            </button>
            <button
              type="button"
              onClick={() => setIsRecurring(true)}
              className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isRecurring
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              <Calendar size={14} />
              <span>Monthly Pledge</span>
            </button>
          </div>

          {/* Amount Presets */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Select Donation Amount ({currencySymbol})
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {activePresets.map((amt) => {
                const isSelected = !customAmount && selectedAmount === amt;
                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(amt);
                      setCustomAmount('');
                    }}
                    className={`py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/25 scale-105'
                        : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {currencySymbol}{amt.toLocaleString()}
                  </button>
                );
              })}
            </div>

            {/* Custom Amount Input */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                {currencySymbol}
              </span>
              <input
                type="number"
                min="1"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="Or enter custom amount..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* AI Impact Statement Banner */}
          {impactText && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
              <Sparkles size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Your Impact: </span>
                <span>{impactText}</span>
              </div>
            </div>
          )}

          {/* Platform Tip Selection */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Support ComPassion Operations (Optional Tip)
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                +{currencySymbol}{tipAmount.toLocaleString()} ({tipPercent}%)
              </span>
            </div>
            <div className="flex gap-2">
              {[0, 5, 10, 15].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setTipPercent(pct)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    tipPercent === pct
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-400'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {pct === 0 ? 'No Tip' : `${pct}%`}
                </button>
              ))}
            </div>
          </div>

          {/* Donor Information */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Donor Information (For Official 80G / 501c3 Tax Receipt)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder="Full Name"
                disabled={isAnonymous}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
              />
              <input
                type="email"
                value={donorEmail}
                onChange={(e) => setDonorEmail(e.target.value)}
                placeholder="Email Address"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Dedication & Anonymous Checkboxes */}
          <div className="space-y-3 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 rounded-sm text-emerald-600 focus:ring-emerald-500"
              />
              <span className="flex items-center gap-1">
                <EyeOff size={14} className="text-slate-400" /> Make this donation anonymous on public leaderboards
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={hasDedication}
                onChange={(e) => setHasDedication(e.target.checked)}
                className="w-4 h-4 rounded-sm text-emerald-600 focus:ring-emerald-500"
              />
              <span className="flex items-center gap-1">
                <Gift size={14} className="text-amber-500" /> Dedicate this gift in memory or honor of someone
              </span>
            </label>

            {hasDedication && (
              <div className="p-3 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 grid grid-cols-1 sm:grid-cols-2 gap-2 animate-in fade-in">
                <select
                  value={dedicationType}
                  onChange={(e) => setDedicationType(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                >
                  <option value="in_honor_of">In Honor of</option>
                  <option value="in_memory_of">In Memory of</option>
                </select>
                <input
                  type="text"
                  value={dedicationName}
                  onChange={(e) => setDedicationName(e.target.value)}
                  placeholder="Honoree's Name"
                  className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>
            )}

            {/* Encouraging Note */}
            <div>
              <input
                type="text"
                value={donorMessage}
                onChange={(e) => setDonorMessage(e.target.value)}
                placeholder="Leave an encouraging public message (optional)..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Submit CTA Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer"
            >
              <Lock size={16} />
              <span>Proceed to Secure Checkout ({currencySymbol}{totalAmount.toLocaleString()})</span>
            </button>
            <div className="mt-2.5 flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>256-Bit SSL Encrypted • Instant Tax Exemption Receipt</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DonationModal;
