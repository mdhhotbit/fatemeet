import React from 'react';

interface FateMeetLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'compact' | 'icon';
  showTagline?: boolean;
}

export const FateMeetLogo: React.FC<FateMeetLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
  showTagline = true,
}) => {
  const sizeMap = {
    sm: { box: 28, text: 'text-base font-extrabold', sub: 'text-[9px]' },
    md: { box: 36, text: 'text-xl font-black tracking-tight', sub: 'text-[10px]' },
    lg: { box: 48, text: 'text-2xl sm:text-3xl font-black tracking-tight', sub: 'text-xs' },
    xl: { box: 64, text: 'text-4xl sm:text-5xl font-black tracking-tight', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Base-Native Fatemeet Symbol: Iconic Electric Blue Portal with Intertwined Destiny Glyph */}
      <div
        className="relative shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
        style={{ width: currentSize.box, height: currentSize.box }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_0_16px_rgba(0,82,255,0.45)]"
        >
          <defs>
            {/* Base Blue Primary Gradient */}
            <linearGradient id="baseBlueDisc" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="45%" stopColor="#0052FF" />
              <stop offset="100%" stopColor="#0A2580" />
            </linearGradient>

            {/* Radiant Cyan & Gold Accent Flare */}
            <linearGradient id="fateGlyph" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="40%" stopColor="#BAE6FD" />
              <stop offset="75%" stopColor="#F5D77F" />
              <stop offset="100%" stopColor="#EAB308" />
            </linearGradient>

            <linearGradient id="outerOrbit" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#0052FF" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0052FF" stopOpacity="0.1" />
            </linearGradient>

            <radialGradient id="portalCore" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#BAE6FD" stopOpacity="0.9" />
              <stop offset="40%" stopColor="#0052FF" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#02081C" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Outer Orbit Halo */}
          <circle
            cx="50"
            cy="50"
            r="46"
            stroke="url(#outerOrbit)"
            strokeWidth="2"
            strokeDasharray="4 3"
          />

          {/* Solid Base Blue Emblem Disc */}
          <circle cx="50" cy="50" r="40" fill="url(#baseBlueDisc)" />

          {/* Inner Light Core */}
          <circle cx="50" cy="50" r="28" fill="url(#portalCore)" />

          {/* Stylized Modern "FM" Infinity Portal Glyph */}
          {/* Top 'F' Wing */}
          <path
            d="M 32 30 H 68 C 73 30, 76 34, 73 38 L 48 62 H 32 Z"
            fill="url(#fateGlyph)"
            opacity="0.95"
          />
          {/* Intersecting 'M' Wings forming the Destiny Knot */}
          <path
            d="M 68 70 H 32 C 27 70, 24 66, 27 62 L 52 38 H 68 Z"
            fill="url(#fateGlyph)"
            opacity="0.85"
          />

          {/* Center Luminous Spark of Fate */}
          <circle cx="50" cy="50" r="5" fill="#FFFFFF" className="animate-pulse" />
          <circle cx="50" cy="50" r="8" stroke="#38BDF8" strokeWidth="1.5" strokeOpacity="0.8" />
        </svg>
      </div>

      {variant !== 'icon' && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1">
            <span
              className={`font-display text-white group-hover:text-blue-200 transition-colors ${currentSize.text}`}
            >
              FATEMEET
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#0052FF] shadow-[0_0_8px_#0052FF] inline-block mb-1" />
          </div>

          {showTagline && variant === 'full' && (
            <span
              className={`font-sans-clean font-medium text-slate-400 tracking-wider uppercase mt-0.5 ${currentSize.sub}`}
            >
              50 Lives <span className="text-blue-400">·</span> Built on Base
            </span>
          )}
        </div>
      )}
    </div>
  );
};
