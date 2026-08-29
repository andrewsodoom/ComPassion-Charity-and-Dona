import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, FileCheck, Users, Mail } from 'lucide-react';
import api from '../../services/api.js';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (event) => {
    event.preventDefault();
    setStatus({ type: '', message: '' });
    setIsSubmitting(true);

    try {
      const response = await api.post('/newsletter/subscribe', { email });
      setStatus({ type: 'success', message: response.message });
      setEmail('');
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                <Heart size={20} className="fill-white" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                ComPassion Charity and Donation
              </span>
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              The modern, transparent charity ecosystem connecting generous donors, verified nonprofits, and passionate volunteers to drive measurable real-world change.
            </p>
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck size={16} className="text-emerald-500" /> 100% Verified Nonprofits
              </span>
              <span className="flex items-center gap-1">
                <FileCheck size={16} className="text-blue-500" /> Instant Tax Receipts
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Explore Causes
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><Link to="/campaigns?category=Education" className="hover:text-emerald-600 transition-colors">Education & Youth</Link></li>
              <li><Link to="/campaigns?category=Healthcare" className="hover:text-emerald-600 transition-colors">Emergency Healthcare</Link></li>
              <li><Link to="/campaigns?category=Food" className="hover:text-emerald-600 transition-colors">Hunger Relief</Link></li>
              <li><Link to="/campaigns?category=Environment" className="hover:text-emerald-600 transition-colors">Clean Water & Nature</Link></li>
              <li><Link to="/campaigns?category=Animals" className="hover:text-emerald-600 transition-colors">Animal Welfare</Link></li>
            </ul>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><Link to="/volunteers" className="hover:text-emerald-600 transition-colors">Volunteer Opportunities</Link></li>
              <li><Link to="/about" className="hover:text-emerald-600 transition-colors">How ComPassion Works</Link></li>
              <li><Link to="/about#tax" className="hover:text-emerald-600 transition-colors">Tax Exemption 80G / 501(c)(3)</Link></li>
              <li><Link to="/login" className="hover:text-emerald-600 transition-colors">Charity Verification Portal</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Impact Updates
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Subscribe to receive verified field reports and milestone updates.
            </p>
            <form onSubmit={handleSubscribe} className="flex items-center gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-3 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shrink-0 cursor-pointer"
              >
                {isSubmitting ? 'Joining...' : 'Join'}
              </button>
            </form>
            {status.message && (
              <p className={`text-xs ${status.type === 'error' ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {status.message}
              </p>
            )}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} ComPassion Charity and Donation. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="hover:text-slate-700 dark:hover:text-slate-300">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-slate-700 dark:hover:text-slate-300">Terms of Service</Link>
            <Link to="/security-trust" className="hover:text-slate-700 dark:hover:text-slate-300">Security & Trust</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
