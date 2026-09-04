import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, FileCheck, CheckCircle2, Lock, Sparkles, Building2, HelpCircle } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="mx-auto max-w-5xl space-y-16 px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      {/* Header */}
      <div
        className="relative isolate overflow-hidden rounded-[2rem] bg-cover bg-center px-5 py-14 text-center shadow-xl sm:px-10 sm:py-20"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1800&q=85')"
        }}
      >
        <div className="absolute inset-0 z-0 bg-slate-950/70" />
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-950/60 via-slate-950/25 to-emerald-950/65" />
        <div className="relative mx-auto max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
            <Sparkles size={14} />
            <span>Our Vision & Transparency Standard</span>
          </div>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
            Pioneering Radical Transparency in Philanthropy
          </h1>
          <p className="text-sm leading-relaxed text-slate-100 sm:text-base">
            ComPassion Charity and Donation was built on the belief that giving should be effortless, secure, and completely verifiable. We empower grassroots charities and global causes while guaranteeing donors full fiscal accountability.
          </p>
        </div>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <ShieldCheck size={26} />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            100% Verified Nonprofits
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Every organization undergoes rigorous vetting of tax exemption credentials, registration documents, and ground-level audits before receiving the green Verified badge.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <FileCheck size={26} />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Instant Tax-Ready Receipts
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            All donations generate serial-numbered receipts that are prepared for verified charitable tax compliance and donor reporting across supported jurisdictions.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Lock size={26} />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Secure Payment Architecture
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            We partner with premier payment gateways (Stripe, Razorpay, UPI) to provide 256-bit encrypted transactions, multi-currency support, and fraud protection.
          </p>
        </div>
      </div>

      {/* Tax Section */}
      <section id="tax" className="p-8 sm:p-10 rounded-3xl bg-slate-100/90 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-600 text-white">
            <FileCheck size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Tax Benefits & Compliance Information
            </h3>
            <p className="text-xs text-slate-500">How your donations meet local country compliance requirements</p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Donations made to verified charities on ComPassion are tracked with transparent legal registration details, tax identification records, and official receipts that support donor reporting in the relevant jurisdiction. Each electronic receipt includes the charity’s legal registration number, tax reference details, authorized signatory, and digital verification seal.
        </p>
      </section>

      {/* FAQ */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              How does ComPassion verify charities?
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Charities submit official incorporation documents, tax registration details, and supporting compliance records. Our platform administrators review each filing before issuing the verified checkmark badge.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Can I get a tax receipt for monthly recurring donations?
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Yes! An individual receipt is generated for each monthly recurring pledge and archived in your Donor Dashboard for 1-click download during tax filing season.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              How do volunteer hours get certified?
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              When a charity accepts your volunteer application, the shift is logged in your Volunteer Dashboard. Upon completion, you earn verified community service hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
