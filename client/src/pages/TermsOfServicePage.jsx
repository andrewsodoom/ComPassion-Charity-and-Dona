import React from 'react';
import { FileText, Gavel, CheckCircle2 } from 'lucide-react';

const TermsOfServicePage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-300">
            <FileText size={22} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600 dark:text-amber-300">Legal</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Terms of Service</h1>
          </div>
        </div>

        <div className="space-y-6 text-sm leading-7 text-slate-600 dark:text-slate-300">
          <p>
            By using ComPassion Charity and Donation, you agree to use the platform responsibly and in accordance with all applicable laws. These terms support a fair, transparent, and community-first experience for donors, charities, and volunteers.
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/70 p-4 border border-slate-200 dark:border-slate-700">
              <CheckCircle2 className="text-emerald-600 dark:text-emerald-300 mb-2" size={18} />
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">Responsible use</h3>
              <p>Users must provide truthful account, campaign, and verification details.</p>
            </div>
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/70 p-4 border border-slate-200 dark:border-slate-700">
              <Gavel className="text-emerald-600 dark:text-emerald-300 mb-2" size={18} />
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">Compliance</h3>
              <p>Charities and volunteers must adhere to local laws and the relevant campaign rules.</p>
            </div>
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/70 p-4 border border-slate-200 dark:border-slate-700">
              <FileText className="text-emerald-600 dark:text-emerald-300 mb-2" size={18} />
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">Platform rules</h3>
              <p>We may suspend misuse, fraud, spam, or content that violates community standards.</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Service scope</h2>
            <p>
              ComPassion provides a platform to facilitate campaign discovery, donations, charity verification, volunteer signups, and communications. We are not a law firm, tax advisor, or regulated financial institution unless otherwise specified.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Donation and volunteer responsibilities</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Donors are responsible for confirming the appropriateness of their contribution.</li>
              <li>Volunteers agree to disclose relevant availability and skills accurately.</li>
              <li>Charities agree to provide truthful legal and verification information for review.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Changes to the service</h2>
            <p>
              We may update features, workflows, and policies over time. Continued use of the platform after changes indicates your acceptance of the revised terms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
