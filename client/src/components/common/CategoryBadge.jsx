import React from 'react';
import {
  GraduationCap,
  HeartPulse,
  Utensils,
  Home,
  TreePine,
  Cat,
  Flame,
  Globe
} from 'lucide-react';

const CATEGORY_STYLES = {
  Education: {
    icon: GraduationCap,
    emoji: '🎓',
    bg: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800'
  },
  Healthcare: {
    icon: HeartPulse,
    emoji: '🏥',
    bg: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800'
  },
  Food: {
    icon: Utensils,
    emoji: '🍲',
    bg: 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800'
  },
  Housing: {
    icon: Home,
    emoji: '🏠',
    bg: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800'
  },
  Environment: {
    icon: TreePine,
    emoji: '🌱',
    bg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
  },
  Animals: {
    icon: Cat,
    emoji: '🐾',
    bg: 'bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border-orange-200 dark:border-orange-800'
  },
  'Disaster Relief': {
    icon: Flame,
    emoji: '🚨',
    bg: 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-800'
  }
};

export const CategoryBadge = ({ category, showIcon = true, size = 'sm', className = '' }) => {
  const style = CATEGORY_STYLES[category] || {
    icon: Globe,
    emoji: '✨',
    bg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700'
  };

  const Icon = style.icon;

  const sizeClasses = {
    xs: 'text-[11px] px-2 py-0.5 gap-1 font-medium',
    sm: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    md: 'text-sm px-3 py-1.5 gap-2 font-semibold'
  };

  return (
    <span className={`inline-flex items-center rounded-full border ${style.bg} ${sizeClasses[size]} ${className}`}>
      {showIcon && <span className="text-xs">{style.emoji}</span>}
      <span>{category}</span>
    </span>
  );
};

export default CategoryBadge;
