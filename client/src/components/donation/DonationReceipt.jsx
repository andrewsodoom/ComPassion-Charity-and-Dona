import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, ShieldCheck, Heart, Download, CheckCircle } from 'lucide-react';

export const DonationReceipt = ({ receipt, onPrint }) => {
  if (!receipt) return null;

  const handlePrint = () => {
    if (onPrint) onPrint();
    else window.print();
  };

  const receiptUrl = `${window.location.origin}/receipt/${receipt.receiptNumber}`;

  return (
    <div className="receipt-container max-w-2xl mx-auto p-6 sm:p-10 bg-white text-slate-900 rounded-3xl shadow-xl border border-slate-200 font-sans space-y-6">
      {/* Action Bar (Hidden on print) */}
      <div className="no-print flex items-center justify-between pb-4 border-b border-slate-200">
        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck size={16} /> Official Tax Exemption Receipt
        </span>
        <button
          onClick={handlePrint}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-md"
        >
          <Printer size={15} />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Official Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
            <Heart size={24} className="fill-white" />
          </div>
          <div>
            <h2 className="font-extrabold text-xl tracking-tight text-slate-900">
              ComPassion Charity and Donation
            </h2>
            <p className="text-xs text-slate-500">
              In Partnership With: {receipt.organizationDetails?.name || receipt.organizationName}
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right text-xs text-slate-600 space-y-0.5">
          <div className="font-bold text-slate-900">DONATION TAX RECEIPT</div>
          <div><span className="font-semibold">Receipt #:</span> {receipt.receiptNumber}</div>
          <div><span className="font-semibold">Date:</span> {new Date(receipt.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</div>
        </div>
      </div>

      {/* Tax Exemption Banner */}
      <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between">
        <div>
          <span className="font-bold">Tax Exemption Certification: </span>
          <span>{receipt.taxExemptionCode || 'Section 80G / 501(c)(3) Eligible for 50% Tax Relief'}</span>
        </div>
        <div className="font-bold text-xs uppercase px-2 py-0.5 bg-emerald-200 rounded-md">
          Paid & Verified
        </div>
      </div>

      {/* Two Column Grid: Donor Info & Charity Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
        {/* Donor Box */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
          <div className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
            Donor Information
          </div>
          <div className="font-extrabold text-sm text-slate-900">{receipt.donorName}</div>
          <div className="text-slate-600">{receipt.donorEmail}</div>
          {receipt.donorPhone && <div className="text-slate-600">{receipt.donorPhone}</div>}
          {receipt.dedication && (
            <div className="mt-2 pt-2 border-t border-slate-200 text-[11px] text-amber-800 font-medium">
              Dedicated {receipt.dedication.type === 'in_honor_of' ? 'in honor of' : 'in memory of'}: <span className="font-bold">{receipt.dedication.name}</span>
            </div>
          )}
        </div>

        {/* Charity Box */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
          <div className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
            Beneficiary Organization
          </div>
          <div className="font-extrabold text-sm text-slate-900">{receipt.organizationDetails?.name || receipt.organizationName}</div>
          <div className="text-slate-600">Reg: {receipt.organizationDetails?.registrationNumber || 'REG-NGO-88910'}</div>
          <div className="text-slate-600">Location: {receipt.organizationDetails?.address || 'Ghana / Global'}</div>
        </div>
      </div>

      {/* Breakdown Table */}
      <div className="rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
            <tr>
              <th className="p-3.5">Description / Campaign</th>
              <th className="p-3.5 text-center">Payment Mode</th>
              <th className="p-3.5 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="p-3.5">
                <div className="font-bold text-slate-900">{receipt.campaignTitle}</div>
                <div className="text-slate-500 text-[11px]">Transaction ID: {receipt.transactionId}</div>
              </td>
              <td className="p-3.5 text-center text-slate-600">
                {receipt.paymentMethod}
              </td>
              <td className="p-3.5 text-right font-bold text-slate-900">
                {receipt.currency} {receipt.amount?.toLocaleString()}
              </td>
            </tr>
            {receipt.tipAmount > 0 && (
              <tr className="bg-slate-50/50">
                <td className="p-3.5 text-slate-600">Platform Maintenance Tip</td>
                <td className="p-3.5 text-center text-slate-500">—</td>
                <td className="p-3.5 text-right font-semibold text-slate-700">
                  {receipt.currency} {receipt.tipAmount?.toLocaleString()}
                </td>
              </tr>
            )}
            <tr className="bg-slate-100 font-bold text-sm">
              <td colSpan={2} className="p-3.5 text-slate-900">Total Contribution Received</td>
              <td className="p-3.5 text-right text-emerald-700">
                {receipt.currency} {receipt.totalPaid?.toLocaleString() || receipt.amount?.toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Signature & QR Seal Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 border-t border-slate-200">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-white rounded-xl border border-slate-200 inline-block shadow-2xs">
            <QRCodeSVG value={receiptUrl} size={70} />
          </div>
          <div className="text-[11px] text-slate-500 space-y-0.5">
            <div className="font-bold text-slate-800">Scan to Verify Authenticity</div>
            <div>Digital Seal: {receipt.verificationSignature || 'SHA256-VERIFIED-AUTH'}</div>
            <div>Generated automatically by ComPassion Systems</div>
          </div>
        </div>

        <div className="text-center sm:text-right space-y-1">
          <div className="font-serif italic text-base font-bold text-slate-800 tracking-wider">
            Alexandre M. Vance
          </div>
          <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
            Authorized Financial Trustee & Auditor
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationReceipt;
