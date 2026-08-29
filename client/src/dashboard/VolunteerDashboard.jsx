import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import volunteerService from '../services/volunteerService.js';
import { useAuth } from '../context/AuthContext.jsx';
import {
  HandHeart,
  Calendar,
  Clock,
  Award,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  MapPin,
  ExternalLink,
  PencilLine,
  Save
} from 'lucide-react';

export const VolunteerDashboard = () => {
  const { user, updateProfile } = useAuth();
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    totalApplications: 0,
    approvedCount: 0,
    pendingCount: 0,
    totalHours: 0
  });
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileSkills, setProfileSkills] = useState('');
  const [profileBio, setProfileBio] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const res = await volunteerService.getUserApplications();
        if (res.success) {
          setApplications(res.applications);
          setStats(res.stats);
        }
      } catch (err) {
        console.error('Failed to load volunteer data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
      setProfilePhone(user.phone || '');
      setProfileSkills(Array.isArray(user.skills) ? user.skills.join(', ') : '');
      setProfileBio(user.bio || '');
    }
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);

    try {
      await updateProfile({
        name: profileName,
        phone: profilePhone,
        bio: profileBio,
        skills: profileSkills
          .split(',')
          .map(skill => skill.trim())
          .filter(Boolean)
      });
      alert('Volunteer profile updated successfully!');
    } catch (err) {
      alert(err.message || 'Failed to update volunteer profile');
    } finally {
      setSavingProfile(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <Loader2 size={36} className="animate-spin text-emerald-500 mx-auto" />
        <p className="text-xs text-slate-500">Loading volunteer assignments...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Service Hours</span>
            <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600">
              <Clock size={18} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400 mt-2">
            {stats.totalHours} Hours
          </div>
          <div className="text-xs text-slate-400 mt-1">Verified community service</div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Approved Shifts</span>
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">
            {stats.approvedCount}
          </div>
          <div className="text-xs text-slate-400 mt-1">Confirmed volunteer events</div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Applications</span>
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600">
              <HandHeart size={18} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            {stats.totalApplications}
          </div>
          <div className="text-xs text-slate-400 mt-1">{stats.pendingCount} pending review</div>
        </div>
      </div>

      {/* Volunteer Profile Editor */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">My Profile</h3>
            <p className="text-xs text-slate-500">Update the details you shared when you joined.</p>
          </div>

          {!isEditingProfile ? (
            <button
              type="button"
              onClick={() => setIsEditingProfile(true)}
              className="px-3 py-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <PencilLine size={14} />
              Edit
            </button>
          ) : (
            <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600">
              <PencilLine size={18} />
            </div>
          )}
        </div>

        {isEditingProfile && (
          <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
              <input
                type="text"
                value={profilePhone}
                onChange={(e) => setProfilePhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Skills</label>
              <input
                type="text"
                value={profileSkills}
                onChange={(e) => setProfileSkills(e.target.value)}
                placeholder="Community Support, Teaching, Logistics"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Bio</label>
              <textarea
                rows={4}
                value={profileBio}
                onChange={(e) => setProfileBio(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingProfile}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-2 cursor-pointer"
              >
                {savingProfile ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                <span>{savingProfile ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Volunteer Certificate Badge Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
            <Award size={32} />
          </div>
          <div>
            <h3 className="text-lg font-bold">
              Level 2 Certified Community Steward
            </h3>
            <p className="text-xs text-purple-200/80 mt-0.5">
              You have completed multiple verified relief drives. Certificate valid for academic & corporate recognition.
            </p>
          </div>
        </div>

        <button
          onClick={() => alert('Certificate downloaded to device!')}
          className="px-5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-600 text-white text-xs font-bold shrink-0 cursor-pointer"
        >
          Download Certificate
        </button>
      </div>

      {/* Applications Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            My Volunteering Commitments
          </h3>
          <Link
            to="/volunteers"
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
          >
            Browse New Events
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500 space-y-3">
            <p>No volunteer opportunity matches your current profile yet.</p>
            <p>Update your skills and bio, then browse openings to find a better fit.</p>
            <Link to="/volunteers" className="font-bold text-emerald-600 hover:underline">
              Browse volunteer opportunities
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b">
                <tr>
                  <th className="p-3.5">Event Title</th>
                  <th className="p-3.5">Applied Date</th>
                  <th className="p-3.5">Availability Note</th>
                  <th className="p-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                      {app.opportunityTitle}
                    </td>
                    <td className="p-3.5 text-slate-500">
                      {new Date(app.appliedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300 italic">
                      {app.availability}
                    </td>
                    <td className="p-3.5 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold capitalize ${
                        app.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : app.status === 'rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerDashboard;
