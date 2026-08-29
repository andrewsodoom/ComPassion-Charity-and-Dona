import React from 'react';
import { Link } from 'react-router-dom';
import CategoryBadge from '../common/CategoryBadge.jsx';
import VerifiedBadge from '../common/VerifiedBadge.jsx';
import CampaignProgress from './CampaignProgress.jsx';
import { MapPin, Clock, Heart, Flame, Gift } from 'lucide-react';

export const CampaignCard = ({ campaign, onDonateClick }) => {
  if (!campaign) return null;

  // Calculate days left
  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(campaign.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  );

  return (
    <div className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl dark:hover:shadow-emerald-950/20 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Image Container */}
      <div className="relative aspect-16/10 overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={campaign.image}
          alt={campaign.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2 items-center">
          <CategoryBadge category={campaign.category} size="xs" />
          {campaign.urgent && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-600 text-white shadow-sm animate-pulse">
              <Flame size={12} /> Urgent
            </span>
          )}
        </div>

        {/* Days Left Chip */}
        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm">
          <Clock size={13} className="text-emerald-400" />
          {daysLeft > 0 ? `${daysLeft} days left` : 'Final day'}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Organization & Location */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                {campaign.organizationName}
              </span>
              {campaign.isVerified && <VerifiedBadge size="sm" showText={false} />}
            </div>
            {campaign.location && (
              <span className="text-[11px] text-slate-400 flex items-center gap-0.5 shrink-0">
                <MapPin size={11} /> {campaign.location.split(',')[0]}
              </span>
            )}
          </div>

          {/* Title */}
          <Link to={`/campaigns/${campaign.id}`} className="block">
            <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors line-clamp-2">
              {campaign.title}
            </h3>
          </Link>

          {/* Tagline / Snippet */}
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {campaign.tagline || campaign.description}
          </p>

          {/* Matching Donor Pledge Notice */}
          {campaign.matchingDonorPledge && (
            <div className="px-2.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-1.5 font-medium">
              <Gift size={13} className="text-amber-600 shrink-0" />
              <span className="truncate">{campaign.matchingDonorPledge}</span>
            </div>
          )}
        </div>

        {/* Progress Section */}
        <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <CampaignProgress
            raisedAmount={campaign.raisedAmount}
            targetAmount={campaign.targetAmount}
            donorCount={campaign.donorCount}
            size="sm"
          />

          {/* Action CTAs */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link
              to={`/campaigns/${campaign.id}`}
              className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-center transition-colors"
            >
              View Story
            </Link>
            <button
              onClick={() => onDonateClick ? onDonateClick(campaign) : null}
              className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 text-center transition-all hover:scale-[1.02] flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Heart size={14} className="fill-white" />
              Donate Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;
