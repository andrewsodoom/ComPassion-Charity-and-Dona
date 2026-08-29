import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Heart,
  Lock,
  Mail,
  Loader2,
  Eye,
  EyeOff,
  ShieldCheck,
  Users,
  FileCheck
} from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(email, password);
      redirectByRole(res.user.role);
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const redirectByRole = (role) => {
    switch (role) {
      case 'admin':
        navigate('/dashboard/admin');
        break;
      case 'charity':
        navigate('/dashboard/charity');
        break;
      case 'volunteer':
        navigate('/dashboard/volunteer');
        break;
      case 'donor':
      default:
        navigate('/dashboard/donor');
        break;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px- py-10 sm:py-16 space-y-12">
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white mx-auto shadow-md shadow-emerald-500/20">
          <Heart size={24} className="fill-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Welcome to ComPassion Charity and Donation
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Log in to manage your donations, organize campaigns, or volunteer for causes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start h-full">
        {/* Left Col (5 cols): Standard Login Form */}
        <div className="lg:col-span-5 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Account Sign In
          </h2>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  title={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <span>Sign In to Account</span>}
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div>
              Forgot your password?{' '}
              <Link to="/forgot-password" className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                Reset it here
              </Link>
            </div>
            <div>
              Don't have an account yet?{' '}
              <Link to="/register" className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                Create one now
              </Link>
            </div>
          </div>
        </div>

        {/* Right Col (7 cols): Platform Overview */}
        <div className="lg:col-span-7 overflow-hidden rounded-3xl bg-slate-900 text-white shadow-xl">
          <div className="relative h-48 sm:h-56">
            <img
              src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1200&auto=format&fit=crop&q=85"
              alt="Volunteers supporting their community"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent" />
            <div className="absolute bottom-5 left-6 right-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
                ComPassion in action
              </p>
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight">
                Give with confidence.
              </h2>
            </div>
          </div>

          <div className="space-y-6 p-6 sm:p-8">
            <p className="max-w-xl text-sm leading-relaxed text-slate-300">
              ComPassion Charity and Donation brings donors, verified organizations, and volunteers together to turn generosity into measurable local impact.
            </p>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <ShieldCheck size={20} className="text-emerald-400" />
                <h3 className="text-xs font-bold">Verified causes</h3>
                <p className="text-[11px] leading-relaxed text-slate-400">Support organizations reviewed for transparency.</p>
              </div>
              <div className="space-y-2">
                <FileCheck size={20} className="text-sky-400" />
                <h3 className="text-xs font-bold">Clear giving records</h3>
                <p className="text-[11px] leading-relaxed text-slate-400">Receive receipts and follow campaign progress.</p>
              </div>
              <div className="space-y-2">
                <Users size={20} className="text-amber-300" />
                <h3 className="text-xs font-bold">Community powered</h3>
                <p className="text-[11px] leading-relaxed text-slate-400">Join people making practical change together.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
