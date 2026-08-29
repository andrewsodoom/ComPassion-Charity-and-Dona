import React from 'react';
import { CheckCircle } from 'lucide-react';

export const VerifiedBadge = ({ size = 'md', showText = true, className = '' }) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs font-semibold px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-semibold px-3 py-1.5 gap-2'
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  };

  return (
    <span
      className={`inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60 shadow-xs ${sizeClasses[size]} ${className}`}
      title="Verified Charity Organization - Legal & Tax Registration Vetted by Platform Administrators"
    >
      <CheckCircle size={iconSizes[size]} className="text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-950" />
      {showText && <span>Verified Charity</span>}
    </span>
  );
};

export default VerifiedBadge;
