import React from 'react';
import { OrderStatus, STATUS_LABELS, STATUS_COLORS } from '../types';

interface StatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge = React.memo(function StatusBadge({ 
  status, 
  size = 'md',
  className = ''
}: StatusBadgeProps) {
  // Pwoteje kòd la si yon estati pa egzakteman nan objè yo
  const colors = STATUS_COLORS[status] || 'bg-slate-100 text-slate-700';
  const label = STATUS_LABELS[status] || status;
  
  const sizeClasses = size === 'sm' 
    ? 'text-[10px] px-2 py-0.5 gap-1' 
    : 'text-xs px-2.5 py-1 gap-1.5';

  return (
    <span 
      className={`inline-flex items-center rounded-full font-semibold font-display whitespace-nowrap transition-colors ${sizeClasses} ${colors} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 shrink-0" />
      {label}
    </span>
  );
});

interface CategoryBadgeProps {
  label: string;
  icon: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export const CategoryBadge = React.memo(function CategoryBadge({ 
  label, 
  icon, 
  active = false, 
  onClick,
  className = ''
}: CategoryBadgeProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex flex-col items-center justify-center gap-1.5 p-3 min-w-[72px] rounded-2xl transition-all active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
        active
          ? 'bg-navy text-white shadow-lg shadow-navy/25 font-bold'
          : 'bg-surface hover:bg-surface-2 text-navy font-medium'
      } ${className}`}
    >
      <span className="text-2xl leading-none select-none" role="img" aria-hidden="true">
        {icon}
      </span>
      <span className="text-[10px] font-display tracking-wide whitespace-nowrap">
        {label}
      </span>
    </button>
  );
});