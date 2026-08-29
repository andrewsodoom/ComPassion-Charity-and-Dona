import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService.js';
import { useCurrency } from '../context/CurrencyContext.jsx';
import VerifiedBadge from '../components/common/VerifiedBadge.jsx';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from 'recharts';
import {
  ShieldCheck,
  Users,
  Heart,
  TrendingUp,
  Award,
  Check,
  X,
  FileText,
  Loader2,
  PieChart as PieIcon,
  BarChart3
} from 'lucide-react';

export const AdminDashboard = () => {
  const { formatAmount } = useCurrency();
  const [stats, setStats] = useState(null);
  const [charities, setCharities] = useState([]);
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'verifications' | 'users'

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [sRes, vRes, uRes, aRes] = await Promise.all([
        adminService.getStats(),
        adminService.getVerifications(),
        adminService.getUsers(),
        adminService.getAnalytics()
      ]);

      if (sRes.success) setStats(sRes.stats);
      if (vRes.success) setCharities(vRes.charities);
      if (uRes.success) setUsers(uRes.users);
      if (aRes.success) setAnalytics(aRes);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleReviewVerification = async (userId, newStatus) => {
    try {
      const res = await adminService.reviewVerification(userId, {
        status: newStatus,
        adminNotes: newStatus === 'verified' ? 'Approved after legal documentation vetting' : 'Insufficient registration proof'
      });
      if (res.success) {
        alert(`Charity verification updated to: ${newStatus}`);
        fetchAdminData();
      }
    } catch (err) {
      alert('Failed to update verification: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <Loader2 size={36} className="animate-spin text-emerald-500 mx-auto" />
        <p className="text-xs text-slate-500">Loading administrative controls...</p>
      </div>
    );
  }

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#f43f5e', '#06b6d4'];

  return (
    <div className="space-y-8">
      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Platform Volume</span>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            {formatAmount(stats?.totalDonationsAmount || 0)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">{stats?.totalDonationsCount} donations processed</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Active Campaigns</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {stats?.activeCampaignsCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">{stats?.successRate}% success rate</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Verified Charities</span>
          <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
            {stats?.verifiedCharitiesCount}
          </div>
          <div className="text-[11px] text-amber-500 font-semibold mt-0.5">{stats?.pendingVerificationsCount} pending review</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Platform Users</span>
          <div className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">
            {users.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">{stats?.totalVolunteersCount} volunteers</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-xs sm:text-sm font-bold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 transition-colors border-b-2 cursor-pointer ${
            activeTab === 'overview'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Analytics & Performance
        </button>

        <button
          onClick={() => setActiveTab('verifications')}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'verifications'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck size={15} />
          <span>Charity Verification Hub ({charities.filter(c => c.organization?.verificationStatus === 'pending').length} Pending)</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 transition-colors border-b-2 cursor-pointer ${
            activeTab === 'users'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          User Accounts Directory ({users.length})
        </button>
      </div>

      {/* TAB 1: ANALYTICS */}
      {activeTab === 'overview' && analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Trend Chart */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <BarChart3 size={18} className="text-emerald-600" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Monthly Donations Volume
              </h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.monthlyDonations || []}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(val) => [`₹${Number(val).toLocaleString()}`, 'Raised']}
                    contentStyle={{ borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Bar dataKey="amount" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Distribution Chart */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <PieIcon size={18} className="text-blue-600" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Donations by Cause Category
              </h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.categoryDistribution || []}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {(analytics.categoryDistribution || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => [`₹${Number(val).toLocaleString()}`, 'Raised']}
                    contentStyle={{ borderRadius: '12px', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VERIFICATIONS QUEUE */}
      {activeTab === 'verifications' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
              Charity Legal Documents & Verification Hub
            </h3>
            <p className="text-xs text-slate-500">
              Audit tax-exemption certificates, legal incorporation papers, and assign official ✓ Verified badges.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b">
                <tr>
                  <th className="p-3.5">Organization</th>
                  <th className="p-3.5">Registration & Tax ID</th>
                  <th className="p-3.5">Location</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {charities.map((c) => {
                  const status = c.organization?.verificationStatus || 'pending';
                  return (
                    <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {c.organization?.legalName || c.name}
                        </div>
                        <div className="text-[11px] text-slate-400">{c.email}</div>
                      </td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-300">
                        <div>Reg: <strong className="font-mono">{c.organization?.registrationNumber || 'N/A'}</strong></div>
                        <div className="text-[11px] text-slate-400">Tax ID: {c.organization?.taxExemptId || 'N/A'}</div>
                      </td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-300">
                        {c.organization?.city || 'Accra'}, {c.organization?.country || 'Ghana'}
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                          status === 'verified'
                            ? 'bg-emerald-100 text-emerald-800'
                            : status === 'rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        {status !== 'verified' && (
                          <button
                            onClick={() => handleReviewVerification(c.id, 'verified')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Check size={12} />
                            <span>Verify ✓</span>
                          </button>
                        )}
                        {status !== 'rejected' && (
                          <button
                            onClick={() => handleReviewVerification(c.id, 'rejected')}
                            className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-rose-100 hover:text-rose-700 text-slate-700 font-semibold text-[11px] inline-flex items-center gap-1 cursor-pointer"
                          >
                            <X size={12} />
                            <span>Decline</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: USERS DIRECTORY */}
      {activeTab === 'users' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Registered Platform Users Directory
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3.5">Name</th>
                  <th className="p-3.5">Email</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <img src={u.avatar} alt="" className="w-6 h-6 rounded-full" />
                      <span>{u.name}</span>
                    </td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-400">{u.email}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
