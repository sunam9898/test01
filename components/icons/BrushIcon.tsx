
import React from 'react';

export default function BrushIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m9.5 7.5 3 3m0 0 3-3m-3 3v4.5m0-13.5a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12.5 19.5v-1.125a3.375 3.375 0 0 0-3.375-3.375h-1.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12.5 19.5h-1.5" />
    </svg>
  );
}
