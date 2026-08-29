import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Copy, Check, QrCode, Share2 } from 'lucide-react';

export const QRCodeModal = ({ isOpen, onClose, campaign }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !campaign) return null;

  const campaignUrl = `${window.location.origin}/campaigns/${campaign.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(campaignUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl relative text-center space-y-5 animate-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
          <QrCode size={24} />
        </div>

        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Scan & Donate on Mobile
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
            {campaign.title}
          </p>
        </div>

        {/* QR Code Canvas */}
        <div className="p-4 bg-white rounded-2xl border border-slate-100 dark:border-slate-800 inline-block shadow-inner">
          <QRCodeSVG
            value={campaignUrl}
            size={180}
            level="H"
            includeMargin={true}
            imageSettings={{
              src: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2310b981'><path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/></svg>",
              height: 28,
              width: 28,
              excavate: true
            }}
          />
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Point your phone camera or UPI / Banking app to open and contribute instantly.
        </p>

        {/* Share Link Box */}
        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          <input
            type="text"
            readOnly
            value={campaignUrl}
            className="text-xs bg-transparent flex-1 text-slate-600 dark:text-slate-300 outline-hidden truncate px-1"
          />
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;
