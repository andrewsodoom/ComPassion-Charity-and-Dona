import React from 'react';
import { useCurrency } from '../../context/CurrencyContext.jsx';
import { Sparkles, Trophy } from 'lucide-react';

export const CampaignProgress = ({
  raisedAmount = 0,
  targetAmount = 1,
  donorCount = 0,
  size = 'md',
  showDetails = true,
  className = ''
}) => {
  const { formatAmount } = useCurrency();

  const percentage = Math.min(100, Math.round((raisedAmount / (targetAmount || 1)) * 100));
  const isOverfunded = raisedAmount >= targetAmount;

  const heightClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {showDetails && (
        <div className="flex items-end justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg">
                {formatAmount(raisedAmount)}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                raised of {formatAmount(targetAmount)}
              </span>
            </div>
            {donorCount > 0 && (
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-700 dark:text-slate-300">{donorCount}</span> generous donors
              </div>
            )}
          </div>
          <div className="text-right">
            <span className={`inline-flex items-center gap-1 font-bold text-xs sm:text-sm ${
              isOverfunded ? 'text-emerald-600 dark:text-emerald-400 font-extrabold' : 'text-slate-700 dark:text-slate-200'
            }`}>
              {isOverfunded ? <Trophy size={14} className="text-amber-500" /> : null}
              {percentage}% funded
            </span>
          </div>
        </div>
      )}

      {/* Progress Bar Container */}
      <div className={`w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 relative ${heightClasses[size]}`}>
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${
            isOverfunded
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-sm shadow-emerald-500/50'
              : percentage >= 70
              ? 'bg-gradient-to-r from-emerald-600 to-emerald-400'
              : percentage >= 30
              ? 'bg-gradient-to-r from-teal-500 to-emerald-400'
              : 'bg-emerald-500'
          }`}
          style={{ width: `${Math.max(percentage, 3)}%` }}
        />
      </div>

      {/* Milestone Badges */}
      {showDetails && (
        <div className="flex items-center justify-between text-[10px] text-slate-400">
          <span>0%</span>
          <span className={percentage >= 50 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}>50% Halfway</span>
          <span className={percentage >= 100 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}>100% Goal</span>
        </div>
      )}
    </div>
  );
};

export default CampaignProgress;
