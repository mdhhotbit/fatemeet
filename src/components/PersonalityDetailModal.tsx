import React, { useState } from 'react';
import { X, Share2, Copy, Check, Sparkles } from 'lucide-react';
import { Personality } from '../types';
import { PortraitImage } from './PortraitImage';
import { getInitials } from '../lib/utils';

interface PersonalityDetailModalProps {
  personality: Personality | null;
  onClose: () => void;
}

export const PersonalityDetailModal: React.FC<PersonalityDetailModalProps> = ({
  personality,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!personality) return null;

  const handleShare = () => {
    const text = `Explore ${personality.name} on FATE MEET. 50 extraordinary lives waiting to be discovered.\n${window.location.origin}`;
    const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(xUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopy = () => {
    const text = `${personality.name} — ${personality.profession} (${personality.nationality}). Discover extraordinary lives on FATE MEET: ${window.location.origin}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#090e1d] border border-amber-500/30 rounded-2xl shadow-2xl shadow-amber-500/10 overflow-hidden my-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <span className="font-cinzel text-xs font-bold text-amber-200 uppercase tracking-widest">
              Historical Dossier
            </span>
            <span className="text-slate-500" aria-hidden="true">·</span>
            <span className="text-xs font-mono text-amber-400/80">ID #{personality.id}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close dossier"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-7 max-h-[80vh] overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
            <div className="sm:col-span-5 flex flex-col items-center">
              <div className="w-full max-w-[240px] sm:max-w-none rounded-xl overflow-hidden border border-amber-500/30 shadow-xl">
                <PortraitImage
                  src={personality.portraitUrl}
                  alt={personality.name}
                  initials={getInitials(personality.name)}
                  aspectRatio="portrait"
                />
              </div>
              <p className="text-[10px] text-slate-500 text-center mt-2 px-1 line-clamp-1">
                {personality.imageAttribution}
              </p>
            </div>

            <div className="sm:col-span-7 space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs text-amber-300/80">
                <span>{personality.category}</span>
                <span aria-hidden="true">·</span>
                <span>{personality.nationality}</span>
              </div>

              <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-white">
                {personality.name}
              </h2>

              <p className="font-editorial italic text-amber-100 text-base">
                {personality.profession}
              </p>

              <div className="text-xs font-mono text-slate-400">
                <span>Lifetime: {personality.birthDate}</span>
                {personality.deathDate ? (
                  <span> — {personality.deathDate}</span>
                ) : (
                  <span className="text-emerald-400 ml-1">(Living)</span>
                )}
              </div>

              {personality.quote && (
                <p className="text-xs sm:text-sm italic text-amber-200/80 bg-amber-500/5 p-3 rounded border-l-2 border-amber-400/60 font-editorial">
                  "{personality.quote}"
                </p>
              )}
            </div>
          </div>

          {/* Biography */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <h3 className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
              Biography
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              {personality.biography}
            </p>
          </div>

          {/* Major Achievements */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
              Notable Achievements
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {personality.majorAchievements.map((achieve, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5">✦</span>
                  <span>{achieve}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="px-3.5 py-2 bg-slate-900 border border-amber-500/30 text-amber-200 hover:text-white text-xs font-medium rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Share</span>
              </button>

              <button
                onClick={handleCopy}
                className="px-3 py-2 bg-slate-900 border border-white/10 text-slate-300 hover:text-white text-xs rounded-lg flex items-center gap-1 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Info</span>
                  </>
                )}
              </button>
            </div>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg cursor-pointer"
            >
              Close Dossier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
