import React, { useState, useEffect } from 'react';
import volunteerService from '../services/volunteerService.js';
import VolunteerCard from '../components/volunteer/VolunteerCard.jsx';
import VolunteerApplyModal from '../components/volunteer/VolunteerApplyModal.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { HeartHandshake, Search, MapPin, Loader2, Sparkles, Award, ShieldCheck } from 'lucide-react';

export const VolunteersPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [appliedOpportunityIds, setAppliedOpportunityIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');

  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  useEffect(() => {
    const fetchOpps = async () => {
      setLoading(true);
      try {
        const res = await volunteerService.getOpportunities({ search, location });
        if (res.success) {
          setOpportunities(res.opportunities);
        }
      } catch (err) {
        console.error('Failed to load volunteer opportunities:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOpps();
  }, [search, location]);

  useEffect(() => {
    const fetchMyApplications = async () => {
      if (!isAuthenticated || user?.role !== 'volunteer') {
        setAppliedOpportunityIds([]);
        return;
      }

      try {
        const res = await volunteerService.getUserApplications();
        if (res.success) {
          setAppliedOpportunityIds((res.applications || []).map(app => app.opportunityId));
        }
      } catch (err) {
        console.error('Failed to load my volunteer applications:', err);
      }
    };

    fetchMyApplications();
  }, [isAuthenticated, user]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
          <HeartHandshake size={15} />
          <span>ComPassion Grassroots Volunteer Network</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Join Volunteer Drives in Your Community
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Lend a hand with food packing, animal care, tree planting, and rural digital school setups. Build your impact record and earn verified hours certificates.
        </p>
      </div>

      {/* Search & Location Bar */}
      <div className="p-3 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by event title, cause, or skills (e.g. teaching, first aid)..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="relative">
          <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Filter by city / location (e.g. New Delhi, Seattle)..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Opportunities Grid */}
      {loading ? (
        <div className="py-24 text-center space-y-3">
          <Loader2 size={36} className="animate-spin text-emerald-500 mx-auto" />
          <p className="text-xs text-slate-500">Loading volunteer events...</p>
        </div>
      ) : opportunities.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 space-y-2">
          <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">No events match your criteria</h3>
          <p className="text-xs text-slate-500">Try adjusting your keywords or clearing the location filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((opp) => (
            <VolunteerCard
              key={opp.id}
              opportunity={opp}
              isApplied={appliedOpportunityIds.includes(opp.id)}
              onApplyClick={(o) => setSelectedOpportunity(o)}
            />
          ))}
        </div>
      )}

      {/* Application Modal */}
      {selectedOpportunity && (
        <VolunteerApplyModal
          isOpen={!!selectedOpportunity}
          onClose={() => setSelectedOpportunity(null)}
          opportunity={selectedOpportunity}
          onApplied={(application) => {
            if (application?.opportunityId) {
              setAppliedOpportunityIds(prev => prev.includes(application.opportunityId) ? prev : [...prev, application.opportunityId]);
            }
            setSelectedOpportunity(null);
          }}
        />
      )}
    </div>
  );
};

export default VolunteersPage;
