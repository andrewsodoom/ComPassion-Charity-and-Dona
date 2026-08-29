import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  LayoutDashboard,
  Heart,
  FileCheck,
  Building2,
  Users,
  HandHeart,
  ShieldCheck,
  LogOut,
  Sparkles,
  PlusCircle,
  Award
} from 'lucide-react';

export const DashboardLayout = ({ children, activeTab, onTabChange }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) {
    navigate('/login');
    return null;
  }

  const roleConfigs = {
    donor: {
      badge: 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border-blue-200',
      label: 'Donor Dashboard',
      navItems: [
        { id: 'overview', label: 'My Impact & Receipts', icon: LayoutDashboard },
        { id: 'campaigns', label: 'Supported Causes', icon: Heart }
      ]
    },
    charity: {
      badge: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-200',
      label: 'Charity Organization Hub',
      navItems: [
        { id: 'campaigns', label: 'Manage Campaigns', icon: Heart },
        { id: 'volunteers', label: 'Volunteer Applicants', icon: HandHeart },
        { id: 'donations', label: 'Donations Ledger', icon: FileCheck },
        { id: 'verification', label: 'Org Verification', icon: ShieldCheck }
      ]
    },
    volunteer: {
      badge: 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border-purple-200',
      label: 'Volunteer Workspace',
      navItems: [
        { id: 'shifts', label: 'My Volunteer Shifts', icon: HandHeart },
        { id: 'certificate', label: 'Hours & Badges', icon: Award }
      ]
    },
    admin: {
      badge: 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-200',
      label: 'Platform Administration',
      navItems: [
        { id: 'stats', label: 'Platform Analytics', icon: LayoutDashboard },
        { id: 'verifications', label: 'Charity Verifications', icon: ShieldCheck },
        { id: 'users', label: 'Users Directory', icon: Users }
      ]
    }
  };

  const config = roleConfigs[user.role] || roleConfigs.donor;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Welcome Bar */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`}
            alt={user.name}
            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/20"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {user.name}
              </h1>
              <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${config.badge}`}>
                {user.role}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {user.email} • {config.label}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user.role === 'charity' && (
            <Link
              to="/dashboard/charity?action=create"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <PlusCircle size={15} />
              <span>New Campaign</span>
            </Link>
          )}

          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
