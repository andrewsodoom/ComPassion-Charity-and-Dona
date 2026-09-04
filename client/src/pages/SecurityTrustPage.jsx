import React from 'react';
import { Shield, LockKeyhole, AlertTriangle, CheckCircle2 } from 'lucide-react';

const SecurityTrustPage = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div
        className="relative isolate overflow-hidden rounded-3xl border border-slate-200 bg-cover bg-center p-6 shadow-xl dark:border-slate-800 sm:p-8"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1800&q=85')"
        }}
      >
        <div className="absolute inset-0 z-0 bg-slate-950/75" />
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-950/65 via-slate-950/35 to-emerald-950/70" />
        <div className="relative z-10 flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-300">
            <Shield size={22} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">Trust</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Security & Trust</h1>
          </div>
        </div>

        <div className="relative z-10 space-y-6 text-sm leading-7 text-white/90 dark:text-slate-300">
          <p>
            Trust is essential for charity giving. ComPassion is designed to make campaign activity, donor receipts, volunteer coordination, and nonprofit verification more transparent and easier to review.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/70 p-4 border border-slate-200 dark:border-slate-700">
              <LockKeyhole className="text-emerald-600 dark:text-emerald-300 mb-2" size={18} />
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">Authentication</h3>
              <p>Account access is protected by secure token-based authentication and role-based permissions.</p>
            </div>
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/70 p-4 border border-slate-200 dark:border-slate-700">
              <CheckCircle2 className="text-emerald-600 dark:text-emerald-300 mb-2" size={18} />
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">Verification</h3>
              <p>Charities can provide compliance documents and metadata for due diligence review.</p>
            </div>
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/70 p-4 border border-slate-200 dark:border-slate-700">
              <AlertTriangle className="text-amber-600 dark:text-amber-300 mb-2" size={18} />
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">Fraud controls</h3>
              <p>Abuse, fake submissions, and suspicious activity are escalated for review by administrators.</p>
            </div>
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/70 p-4 border border-slate-200 dark:border-slate-700">
              <Shield className="text-blue-600 dark:text-blue-300 mb-2" size={18} />
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">Operational transparency</h3>
              <p>Campaigns, updates, receipts, and milestones are visible so supporters can track impact.</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">What we do</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Use role-based access to restrict sensitive actions.</li>
              <li>Protect personal account information and verification data.</li>
              <li>Store donation and program records to support transparency.</li>
              <li>Provide clear platform rules for volunteers and partner organizations.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">What users should do</h2>
            <p>
              Keep account credentials secure, use trusted devices, and report suspicious activity immediately. If you notice any misuse, notify the platform administrators so it can be reviewed and addressed quickly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityTrustPage;
