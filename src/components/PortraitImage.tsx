import React, { useState } from 'react';

interface PortraitImageProps {
  src: string;
  alt: string;
  initials: string;
  className?: string;
  aspectRatio?: 'portrait' | 'square' | 'hero';
}

export const PortraitImage: React.FC<PortraitImageProps> = ({
  src,
  alt,
  initials,
  className = '',
  aspectRatio = 'portrait',
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Sync if src prop changes
  React.useEffect(() => {
    setCurrentSrc(src);
    setHasError(false);
    setIsLoaded(false);
  }, [src]);

  // Aspect ratio classes
  const aspectClass =
    aspectRatio === 'square'
      ? 'aspect-square'
      : aspectRatio === 'hero'
      ? 'aspect-[4/5]'
      : 'aspect-[3/4]';

  const handleError = () => {
    // If not already on fallback image, try loading local fallback.webp
    if (currentSrc !== '/portraits/fallback.webp') {
      setCurrentSrc('/portraits/fallback.webp');
    } else {
      setHasError(true);
    }
  };

  if (hasError) {
    return (
      <div
        className={`relative ${aspectClass} w-full overflow-hidden bg-gradient-to-br from-slate-900 via-[#0d1424] to-slate-950 flex flex-col items-center justify-center p-4 border border-amber-500/20 ${className}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(212,175,55,0.15),transparent_70%)]" />
        <div className="w-16 h-16 rounded-full border border-amber-400/40 flex items-center justify-center bg-slate-900/80 shadow-lg mb-2 relative z-10">
          <span className="font-cinzel text-xl font-bold text-amber-200 tracking-wider">
            {initials}
          </span>
        </div>
        <p className="font-cinzel text-xs text-amber-300/80 tracking-widest uppercase text-center relative z-10 line-clamp-1">
          {alt}
        </p>
      </div>
    );
  }

  return (
    <div className={`relative ${aspectClass} w-full overflow-hidden bg-slate-950 ${className}`}>
      {/* Skeleton / Placeholder while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-900/80 animate-pulse flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border border-amber-400/30 flex items-center justify-center">
            <span className="font-cinzel text-xs text-amber-400/60 font-semibold">{initials}</span>
          </div>
        </div>
      )}

      <img
        src={currentSrc}
        alt={alt}
        width={400}
        height={400}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
        className={`w-full h-full object-cover transition-all duration-500 ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
        }`}
      />
    </div>
  );
};
