import React from 'react';

export const TurtleIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a4 4 0 0 0-4 4v1a7 7 0 0 0-7 7v1a2 2 0 0 0 2 2h1a7 7 0 0 0 14 0h1a2 2 0 0 0 2-2v-1a7 7 0 0 0-7-7V6a4 4 0 0 0-4-4z" fill="currentColor" fillOpacity="0.2" />
    <circle cx="12" cy="11" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M12 6v10M7 11h10M8.5 7.5l7 7M15.5 7.5l-7 7" stroke="currentColor" strokeWidth="1.5" />
    <path d="M4 11c-1.5-2-2.5-3-2-5s2.5-1 4 1" stroke="currentColor" strokeWidth="2" />
    <path d="M20 11c1.5-2 2.5-3 2-5s-2.5-1-4 1" stroke="currentColor" strokeWidth="2" />
    <path d="M6 17c-1 2-2 3.5-3 4s-2-1-1-3" stroke="currentColor" strokeWidth="2" />
    <path d="M18 17c1 2 2 3.5 3 4s2-1 1-3" stroke="currentColor" strokeWidth="2" />
  </svg>
);
