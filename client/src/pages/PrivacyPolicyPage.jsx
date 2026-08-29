import React from 'react';
import { ShieldCheck, Lock, Database, EyeOff } from 'lucide-react';

const PrivacyPolicyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300">
            <ShieldCheck size={22} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-300">Privacy</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Privacy Policy</h1>
          </div>
        </div>

        <div className="space-y-6 text-sm leading-7 text-slate-600 dark:text-slate-300">
          <p>
            ComPassion Charity and Donation is committed to protecting the privacy of donors, volunteers, charities, and platform visitors. We only collect information needed to operate campaign support, donor receipts, volunteer coordination, and organization verification.
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/70 p-4 border border-slate-200 dark:border-slate-700">
              <Lock className="text-emerald-600 dark:text-emerald-300 mb-2" size={18} />
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">Data minimization</h3>
              <p>We collect only the fields required for login, donations, volunteer matching, and legal compliance.</p>
            </div>
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/70 p-4 border border-slate-200 dark:border-slate-700">
              <Database className="text-emerald-600 dark:text-emerald-300 mb-2" size={18} />
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">Secure storage</h3>
              <p>Personal and financial data is stored in protected systems with role-based access controls.</p>
            </div>
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/70 p-4 border border-slate-200 dark:border-slate-700">
              <EyeOff className="text-emerald-600 dark:text-emerald-300 mb-2" size={18} />
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">Limited sharing</h3>
              <p>We do not sell personal information. We may share data only with trusted service providers or compliance workflows where legally necessary.</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Information we collect</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Account details such as name, email, role, and password hash.</li>
              <li>Donation records and tax-relevant receipts.</li>
              <li>Volunteer profile details, availability, and experience notes.</li>
              <li>Charity verification data and uploaded legal documents.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">How we use information</h2>
            <p>
              We use this information to manage donations, issue receipts, review charity eligibility, coordinate volunteer events, and communicate service updates relevant to your account.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Your rights</h2>
            <p>
              You can request access to your information, request corrections, or ask for deletion where applicable by contacting the platform administrators through the support channel or account profile workflow.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Contact</h2>
            <p>
              For privacy inquiries, please contact the platform team through the designated support process on the website.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
