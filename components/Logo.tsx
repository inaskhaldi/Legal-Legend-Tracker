import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        className={className}
        viewBox="0 0 52 52" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Legal Legend Tracker Logo"
        role="img"
    >
        {/* Base and Pillar */}
        <path d="M4 47H48" stroke="#4A5568" strokeWidth="3" strokeLinecap="round" />
        <path d="M26 47V5" stroke="#4A5568" strokeWidth="3" strokeLinecap="round" />
        
        {/* Crossbeam */}
        <path d="M4 9H48" stroke="#4A5568" strokeWidth="3" strokeLinecap="round" />

        {/* Left Side: Justice Scale Pan */}
        <g>
            <path d="M16 9V17" stroke="#3182CE" strokeWidth="3" strokeLinecap="round"/>
            <path d="M6 26C6 22.6863 10.4772 20 16 20C21.5228 20 26 22.6863 26 26" stroke="#3182CE" strokeWidth="3" strokeLinecap="round"/>
        </g>

        {/* Right Side: Progress Bar Chart */}
        <g>
             <rect x="30" y="22" width="5" height="12" rx="2" fill="#D69E2E" />
             <rect x="36" y="18" width="5" height="16" rx="2" fill="#D69E2E" />
             <rect x="42" y="14" width="5" height="20" rx="2" fill="#D69E2E" />
        </g>
    </svg>
);