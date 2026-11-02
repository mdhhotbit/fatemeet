import React, { useState } from 'react';
import { X, Share2, Copy, Check, Sparkles, Award } from 'lucide-react';
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
    const text = `I just discovered ${personality.name} on LuckyFace — the interactive historical discovery experience on Base. Discover 50 extraordinary lives:\n${window.location.origin}`;
    const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(xUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopy = () => {
    const text = `${personality.name} — ${personality.profession} (${personality.nationality}). Discover extraordinary historical lives on LuckyFace: ${window.location.origin}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#060C1E] border border-[#0052FF]/30 rounded-3xl shadow-2xl shadow-[#0052FF]/15 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#040816]/90">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#0052FF]/15 text-blue-300 border border-[#0052FF]/30 font-display uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-[#0052FF]" />
              Historical Dossier
            </span>
            <span className="text-slate-600" aria-hidden="true">·</span>
            <span className="text-xs font-mono text-slate-400">ID #{personality.id}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close dossier"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
            <div className="sm:col-span-5 flex flex-col items-center">
              <div className="w-full max-w-[220px] sm:max-w-none rounded-2xl overflow-hidden border border-[#0052FF]/30 shadow-2xl shadow-[#0052FF]/10 ring-1 ring-white/10">
                <PortraitImage
                  src={personality.portraitUrl}
                  alt={personality.name}
                  initials={getInitials(personality.name)}
                  aspectRatio="portrait"
                />
              </div>
              <p className="text-[10px] text-slate-500 text-center mt-2.5 px-2 line-clamp-1">
                {personality.imageAttribution}
              </p>
            </div>

            <div className="sm:col-span-7 space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-300 font-medium">
                  {personality.category}
                </span>
                <span className="text-slate-500" aria-hidden="true">·</span>
                <span className="text-slate-300">{personality.nationality}</span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {personality.name}
              </h2>

              <p className="text-blue-200/90 font-medium text-sm sm:text-base">
                {personality.profession}
              </p>

              <div className="text-xs font-mono text-slate-400 py-1">
                <span>Lifetime: {personality.birthDate}</span>
                {personality.deathDate ? (
                  <span> — {personality.deathDate}</span>
                ) : (
                  <span className="text-emerald-400 ml-1.5 font-sans font-semibold">(Living)</span>
                )}
              </div>

              {personality.quote && (
                <div className="text-xs sm:text-sm italic text-blue-100/90 bg-[#0052FF]/10 p-3.5 rounded-xl border-l-2 border-[#0052FF] leading-relaxed">
                  "{personality.quote}"
                </div>
              )}
            </div>
          </div>

          {/* Biography */}
          <div className="space-y-2 pt-4 border-t border-white/10">
            <h3 className="text-xs font-display font-bold uppercase tracking-wider text-slate-400">
              Biography & Historical Legacy
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              {personality.biography}
            </p>
          </div>

          {/* Major Achievements */}
          <div className="space-y-2.5 pt-2">
            <h3 className="text-xs font-display font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#0052FF]" />
              Notable Achievements
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              {personality.majorAchievements.map((achieve, idx) => (
                <li key={idx} className="flex items-start gap-2.5 p-2 rounded-lg bg-white/[0.02] border border-white/5">
                  <span className="text-[#0052FF] font-bold mt-0.5">✦</span>
                  <span className="leading-relaxed">{achieve}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="px-4 py-2 bg-[#0052FF] hover:bg-blue-600 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg shadow-[#0052FF]/20 transition-all hover:scale-[1.02]"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Discovery</span>
              </button>

              <button
                onClick={handleCopy}
                className="px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-medium rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Summary</span>
                  </>
                )}
              </button>
            </div>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold rounded-xl border border-white/10 cursor-pointer transition-colors"
            >
              Close Dossier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
