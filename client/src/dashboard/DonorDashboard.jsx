import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import donationService from '../services/donationService.js';
import { useCurrency } from '../context/CurrencyContext.jsx';
import DonationReceipt from '../components/donation/DonationReceipt.jsx';
import {
  Heart,
  FileCheck,
  Printer,
  Calendar,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Loader2,
  TrendingUp
} from 'lucide-react';

export const DonorDashboard = () => {
  const { formatAmount } = useCurrency();
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState({
    totalDonated: 0,
    donationCount: 0,
    campaignsSupported: 0,
    recurringCount: 0
  });
  const [loading, setLoading] = useState(true);

  // Receipt Modal
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [receiptLoading, setReceiptLoading] = useState(false);

  useEffect(() => {
    const fetchDonations = async () => {
      setLoading(true);
      try {
        const res = await donationService.getUserDonations();
        if (res.success) {
          setDonations(res.donations);
          setStats(res.stats);
        }
      } catch (err) {
        console.error('Failed to fetch donor stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, []);

  const handleOpenReceipt = async (receiptNumber) => {
    setReceiptLoading(true);
    try {
      const res = await donationService.getReceiptById(receiptNumber);
      if (res.success) {
        setSelectedReceipt(res.receipt);
      }
    } catch (err) {
      alert('Failed to load receipt: ' + err.message);
    } finally {
      setReceiptLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <Loader2 size={36} className="animate-spin text-emerald-500 mx-auto" />
        <p className="text-xs text-slate-500">Loading donor portfolio...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Donated</span>
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600">
              <Heart size={18} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">
            {formatAmount(stats.totalDonated)}
          </div>
          <div className="text-xs text-slate-400 mt-1">Across {stats.donationCount} contributions</div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Causes Supported</span>
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            {stats.campaignsSupported}
          </div>
          <div className="text-xs text-slate-400 mt-1">Unique humanitarian initiatives</div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recurring Pledges</span>
            <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600">
              <Calendar size={18} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400 mt-2">
            {stats.recurringCount} Active
          </div>
          <div className="text-xs text-slate-400 mt-1">Monthly community sustainers</div>
        </div>
      </div>

      {/* Tax Receipts & Donation Ledger */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileCheck size={20} className="text-emerald-600" />
              <span>Official Tax Receipts & Donation History</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Instant 1-click tax receipts compliant with Section 80G / 501(c)(3)
            </p>
          </div>
        </div>

        {donations.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500 space-y-3">
            <p>You have not made any donations yet.</p>
            <Link to="/campaigns" className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold inline-block">
              Explore Causes to Support
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Receipt #</th>
                  <th className="p-3.5">Campaign</th>
                  <th className="p-3.5">Payment Method</th>
                  <th className="p-3.5 text-right">Amount</th>
                  <th className="p-3.5 text-center">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {donations.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 text-slate-500 whitespace-nowrap">
                      {new Date(d.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="p-3.5 font-mono font-bold text-slate-700 dark:text-slate-300">
                      {d.receiptNumber}
                    </td>
                    <td className="p-3.5">
                      <Link to={`/campaigns/${d.campaignId}`} className="font-bold text-slate-900 dark:text-white hover:text-emerald-600 transition-colors line-clamp-1 max-w-[220px]">
                        {d.campaignTitle}
                      </Link>
                      <div className="text-[10px] text-slate-400">{d.organizationName}</div>
                    </td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {d.paymentMethod}
                    </td>
                    <td className="p-3.5 text-right font-extrabold text-emerald-600 dark:text-emerald-400">
                      {formatAmount(d.amount)}
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => handleOpenReceipt(d.receiptNumber)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 dark:bg-slate-800 dark:hover:bg-emerald-950/60 dark:text-slate-300 font-semibold text-[11px] flex items-center gap-1 mx-auto transition-colors cursor-pointer"
                      >
                        <Printer size={13} />
                        <span>Print Receipt</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Printable Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative max-w-3xl w-full my-8">
            <button
              onClick={() => setSelectedReceipt(null)}
              className="no-print absolute -top-12 right-0 px-4 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-lg hover:bg-slate-100 cursor-pointer"
            >
              ✕ Close Receipt
            </button>
            <DonationReceipt receipt={selectedReceipt} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DonorDashboard;
