import React from 'react';
import { Calendar, Clock, MapPin, Users, HeartHandshake, Award, CheckCircle2 } from 'lucide-react';
import VerifiedBadge from '../common/VerifiedBadge.jsx';

export const VolunteerCard = ({ opportunity, onApplyClick, isApplied = false }) => {
  if (!opportunity) return null;

  const spotsRemaining = Math.max(0, opportunity.spotsNeeded - (opportunity.spotsFilled || 0));
  const isDisabled = isApplied || spotsRemaining === 0;

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl dark:hover:shadow-emerald-950/20 transition-all flex flex-col justify-between space-y-5">
      <div className="space-y-3">
        {/* Organization Info */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
              {opportunity.organizationName}
            </span>
            <VerifiedBadge size="sm" showText={false} />
          </div>
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
            spotsRemaining > 0
              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
          }`}>
            {spotsRemaining > 0 ? `${spotsRemaining} spots open` : 'Spots Filled'}
          </span>
        </div>

        {/* Title & Linked Campaign */}
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            {opportunity.title}
          </h3>
          {opportunity.campaignTitle && (
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-0.5 line-clamp-1">
              Cause: {opportunity.campaignTitle}
            </p>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
          {opportunity.description}
        </p>

        {/* Event Logistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300 pt-1">
          <div className="flex items-center gap-1.5">
            <Calendar size={14} className="text-emerald-500 shrink-0" />
            <span>{new Date(opportunity.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-blue-500 shrink-0" />
            <span>{opportunity.time}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:col-span-2">
            <MapPin size={14} className="text-rose-500 shrink-0" />
            <span className="truncate">{opportunity.location}</span>
          </div>
        </div>

        {/* Skills Required Pills */}
        {opportunity.skillsRequired && opportunity.skillsRequired.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {opportunity.skillsRequired.map((skill, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action CTA */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <Award size={14} className="text-amber-500" />
          <span>Certificate of hours provided</span>
        </div>
        <button
          onClick={() => onApplyClick(opportunity)}
          disabled={isDisabled}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition-all ${
            isApplied
              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 shadow-none cursor-default'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 hover:scale-105 cursor-pointer'
          } ${isDisabled && !isApplied ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isApplied ? <CheckCircle2 size={14} /> : <HeartHandshake size={14} />}
          <span>{isApplied ? 'Applied' : 'Apply as Volunteer'}</span>
        </button>
      </div>
    </div>
  );
};

export default VolunteerCard;
