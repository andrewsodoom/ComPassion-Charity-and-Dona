import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import donationService from '../services/donationService.js';
import DonationReceipt from '../components/donation/DonationReceipt.jsx';
import { Loader2, ArrowLeft } from 'lucide-react';

export const ReceiptPage = () => {
  const { receiptId } = useParams();
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReceipt = async () => {
      setLoading(true);
      try {
        const res = await donationService.getReceiptById(receiptId);
        if (res.success) {
          setReceipt(res.receipt);
        } else {
          setError(res.message || 'Receipt not found');
        }
      } catch (err) {
        setError('Failed to load official receipt');
      } finally {
        setLoading(false);
      }
    };

    fetchReceipt();
  }, [receiptId]);

  if (loading) {
    return (
      <div className="py-32 text-center space-y-3">
        <Loader2 size={36} className="animate-spin text-emerald-500 mx-auto" />
        <p className="text-xs text-slate-500">Retrieving official tax receipt...</p>
      </div>
    );
  }

  if (error || !receipt) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4">
        <h2 className="text-xl font-bold">Receipt Not Found</h2>
        <p className="text-xs text-slate-500">{error || 'The specified receipt number does not exist in the public ledger.'}</p>
        <Link to="/" className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="no-print">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          <ArrowLeft size={14} /> Back to ComPassion
        </Link>
      </div>

      <DonationReceipt receipt={receipt} />
    </div>
  );
};

export default ReceiptPage;
