import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService.js';
import { Mail, Loader2, CheckCircle2 } from 'lucide-react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await authService.requestPasswordReset({ email });
      setStatus({
        type: 'success',
        message: res.message || 'If an account exists, reset instructions have been sent.'
      });
      if (res.resetToken) {
        setStatus({
          type: 'success',
          message: `Reset token created in demo mode: ${res.resetToken}. Use it to reset via the reset-password endpoint.`
        });
      }
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Unable to request password reset.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
        <div className="mb-6 text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 flex items-center justify-center">
            <Mail size={22} />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Forgot Password</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enter your email and we’ll help you set a new password.
          </p>
        </div>

        {status.message && (
          <div className={`mb-4 rounded-xl border p-3 text-xs ${status.type === 'success'
            ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300'
            : 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300'}`}>
            {status.type === 'success' ? <CheckCircle2 size={14} className="inline mr-1.5" /> : null}
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : null}
            {loading ? 'Sending reset link...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-slate-500 dark:text-slate-400">
          Remember your password?{' '}
          <Link to="/login" className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
