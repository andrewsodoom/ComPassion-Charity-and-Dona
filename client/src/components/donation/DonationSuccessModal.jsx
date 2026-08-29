import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  FileText,
  Share2,
  Heart,
  ExternalLink,
  X,
  Printer
} from 'lucide-react';

export const DonationSuccessModal = ({ isOpen, onClose, donation, onOpenReceipt }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      // Fire celebratory confetti blast
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 300);
    }
  }, [isOpen]);

  if (!isOpen || !donation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 sm:p-8 text-center space-y-6 animate-in zoom-in-95 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Success Icon */}
        <div className="w-20 h-20 rounded-3xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <CheckCircle2 size={44} />
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <h3 className="font-extrabold text-2xl text-slate-900 dark:text-white">
            Thank You for Your Gift!
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Your generous contribution is directly bringing relief and hope to those who need it most.
          </p>
        </div>

        {/* Receipt Preview Box */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-left space-y-2 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
            <span className="text-slate-500">Receipt No:</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{donation.receiptNumber}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Total Donated:</span>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
              {donation.currency} {donation.amount?.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Campaign:</span>
            <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[180px]">
              {donation.campaignTitle}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Tax Status:</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">80G / 501(c)(3) Eligible</span>
          </div>
        </div>

        {/* CTAs */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={() => {
              if (onOpenReceipt) onOpenReceipt(donation.receiptNumber);
              else navigate(`/receipt/${donation.receiptNumber}`);
            }}
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer"
          >
            <Printer size={16} />
            <span>View & Download Official Tax Receipt</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors cursor-pointer"
          >
            Return to Campaign
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonationSuccessModal;
