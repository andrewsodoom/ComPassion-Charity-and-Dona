import React from 'react';
import { Search, SlidersHorizontal, ShieldCheck, Check, Sparkles } from 'lucide-react';

const CATEGORIES = [
  { label: 'All Causes', value: 'All', emoji: '🌟' },
  { label: 'Education', value: 'Education', emoji: '🎓' },
  { label: 'Healthcare', value: 'Healthcare', emoji: '🏥' },
  { label: 'Food Relief', value: 'Food', emoji: '🍲' },
  { label: 'Housing', value: 'Housing', emoji: '🏠' },
  { label: 'Environment', value: 'Environment', emoji: '🌱' },
  { label: 'Animals', value: 'Animals', emoji: '🐾' },
  { label: 'Disaster Relief', value: 'Disaster Relief', emoji: '🚨' }
];

export const CampaignFilter = ({
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
  status,
  setStatus,
  isVerifiedOnly,
  setIsVerifiedOnly,
  urgentOnly,
  setUrgentOnly,
  sortBy,
  setSortBy
}) => {
  return (
    <div className="space-y-6">
      {/* Top Search and Sort Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Box */}
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campaigns by cause, title, city, or charity organization..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 shadow-2xs"
          />
        </div>

        {/* Sort & Toggle Row */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          {/* Verified Toggle */}
          <button
            onClick={() => setIsVerifiedOnly(!isVerifiedOnly)}
            className={`px-3.5 py-3 rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition-all border cursor-pointer ${
              isVerifiedOnly
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-600/30'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <ShieldCheck size={16} className={isVerifiedOnly ? 'text-white' : 'text-emerald-500'} />
            <span>Verified Nonprofits</span>
          </button>

          {/* Urgent Toggle */}
          <button
            onClick={() => setUrgentOnly(!urgentOnly)}
            className={`px-3.5 py-3 rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition-all border cursor-pointer ${
              urgentOnly
                ? 'bg-rose-600 text-white border-rose-600 shadow-sm shadow-rose-600/30'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <span>🚨 Urgent Only</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-3 px-3.5 rounded-2xl text-xs font-semibold bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-2xs"
            >
              <option value="featured">✨ Featured First</option>
              <option value="most_funded">📈 Highest % Funded</option>
              <option value="least_funded">🌱 Lowest % Funded</option>
              <option value="ending_soon">⏳ Ending Soonest</option>
              <option value="newest">🆕 Newest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 scale-105'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CampaignFilter;
