import React from 'react';

interface LogoProps {
  variant?: 'full' | 'mark' | 'white-on-dark';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ variant = 'full', className = '', size = 'md' }: LogoProps) {
  // Dimensions based on size
  const sizes = {
    sm: { width: variant === 'mark' ? 28 : 110, height: 28 },
    md: { width: variant === 'mark' ? 36 : 140, height: 36 },
    lg: { width: variant === 'mark' ? 48 : 190, height: 48 },
  };

  const { width, height } = sizes[size];
  const isWhite = variant === 'white-on-dark';

  if (variant === 'mark') {
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`transition-transform hover:scale-105 ${className}`}
        aria-label="Abhoyy Logo Mark"
        role="img"
      >
        {/* Bold Angular A Mark */}
        <path
          d="M24 5L7 38H16L24 22L32 38H41L24 5Z"
          fill="currentColor"
        />
        {/* Central Crossbar / Core */}
        <polygon points="24,17 18,29 30,29" fill={isWhite ? '#0B0B14' : '#F7F6FF'} />
        {/* Microphone Beneath / Integrated in Central Core */}
        <rect x="21" y="22" width="6" height="10" rx="3" fill="currentColor" />
        <path
          d="M19 28C19 30.76 21.24 33 24 33C26.76 33 29 30.76 29 28"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <line x1="24" y1="33" x2="24" y2="38" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="20" y1="38" x2="28" y2="38" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        {/* Subtle Orbit Arc */}
        <path
          d="M6 34C10 40 38 43 43 31"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="2 3"
          opacity="0.6"
        />
      </svg>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 select-none font-bold tracking-tight ${className}`}>
      {/* Mark */}
      <svg
        width={height}
        height={height}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-hidden="true"
      >
        {/* Angular A */}
        <path
          d="M24 5L7 38H16L24 22L32 38H41L24 5Z"
          fill="currentColor"
        />
        {/* Core Cutout */}
        <polygon points="24,17 18,29 30,29" fill={isWhite ? '#0B0B14' : '#F7F6FF'} />
        {/* Microphone */}
        <rect x="21" y="22" width="6" height="9" rx="3" fill="currentColor" />
        <path
          d="M19 27C19 29.76 21.24 32 24 32C26.76 32 29 29.76 29 27"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line x1="24" y1="32" x2="24" y2="37" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="20" y1="37" x2="28" y2="37" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>

      {/* Wordmark: Abhoyy with 'o' containing play button and underline swoosh */}
      <div className="flex flex-col leading-none">
        <div className="flex items-center text-xl sm:text-2xl font-black tracking-tight">
          <span>Abh</span>
          {/* 'o' with play button */}
          <span className="relative inline-flex items-center justify-center mx-[0.5px]">
            <span className="inline-block w-4 h-4 sm:w-5 sm:h-5 rounded-full border-[2.8px] border-current"></span>
            <span
              className="absolute inline-block w-0 h-0 border-y-[3.5px] border-y-transparent border-l-[6px] border-l-current ml-0.5"
              aria-hidden="true"
            ></span>
          </span>
          <span>yy</span>
        </div>
        {/* Underline Swoosh */}
        <svg
          viewBox="0 0 100 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-1.5 mt-0.5 opacity-80"
          aria-hidden="true"
        >
          <path
            d="M2 3C25 7 70 8 98 2"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}
