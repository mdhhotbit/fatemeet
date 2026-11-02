import React from 'react';
import { Sparkles, Compass, Shield, ArrowRight, ExternalLink } from 'lucide-react';

interface HeroSectionProps {
  onTriggerReveal: () => void;
  onOpenContractModal: () => void;
  isContractConfigured: boolean;
  totalEncountersCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onTriggerReveal,
  onOpenContractModal,
  isContractConfigured,
  totalEncountersCount,
}) => {
  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden flex flex-col items-center justify-center text-center px-4 sm:px-6">
      {/* Cinematic ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-amber-500/10 via-blue-600/10 to-transparent rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.12),transparent_70%)] blur-[80px] pointer-events-none -z-10" />

      {/* Subtle architectural hairline accents */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent pointer-events-none" />

      {/* Base Network & Phase Badge */}
      <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-[#0052FF]/10 backdrop-blur-md mb-8 transition-all hover:border-blue-400/50">
        <div className="w-2 h-2 rounded-full bg-[#0052FF] shadow-[0_0_8px_#0052FF]" />
        <span className="text-xs font-medium tracking-wider text-blue-200 uppercase">
          Base Blockchain Ecosystem
        </span>
        <span className="text-slate-500" aria-hidden="true">·</span>
        <span className="text-xs text-amber-300/90 font-mono">
          {isContractConfigured ? 'Mainnet Live' : 'Phase 1: Demo Active'}
        </span>
      </div>

      {/* Small heading */}
      <p className="font-editorial text-amber-200/90 italic text-lg sm:text-xl md:text-2xl mb-4 tracking-wide max-w-xl mx-auto">
        50 extraordinary lives. One unexpected encounter.
      </p>

      {/* Main headline */}
      <h1 className="font-cinzel text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white mb-6 leading-none max-w-4xl mx-auto">
        WHO IS WAITING <br className="hidden sm:inline" />
        <span className="gold-gradient-text drop-shadow-[0_4px_30px_rgba(212,175,55,0.25)]">
          FOR YOU?
        </span>
      </h1>

      {/* Description */}
      <p className="text-slate-300 text-base sm:text-lg md:text-xl font-normal max-w-2xl mx-auto mb-10 leading-relaxed text-wrap-balance">
        Discover the remarkable people who shaped our world. Every encounter reveals a different story.
      </p>

      {/* Main Button */}
      <div className="relative group mb-16">
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 rounded-xl blur-lg opacity-40 group-hover:opacity-75 transition duration-500 group-hover:duration-200 animate-pulse" />
        <button
          onClick={onTriggerReveal}
          className="relative px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-200 hover:to-amber-400 text-slate-950 font-cinzel text-base sm:text-lg font-bold tracking-widest uppercase rounded-lg shadow-2xl active:scale-[0.98] transition-all flex items-center gap-3 cursor-pointer"
        >
          <Compass className="w-5 h-5 text-slate-950 animate-spin-slow" />
          <span>REVEAL MY DESTINY</span>
          <Sparkles className="w-5 h-5 text-slate-950" />
        </button>
      </div>

      {/* Three facts strip */}
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-4 border-t border-white/5">
        <div className="p-4 sm:p-5 rounded-xl bg-slate-900/40 border border-white/5 flex flex-col items-center">
          <span className="font-cinzel text-2xl sm:text-3xl font-bold text-amber-200 mb-1 tabular-nums">
            50
          </span>
          <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">
            Remarkable Lives
          </span>
          <span className="text-[11px] text-slate-500 mt-1">Across 5 Historic Eras</span>
        </div>

        <div className="p-4 sm:p-5 rounded-xl bg-slate-900/40 border border-white/5 flex flex-col items-center">
          <span className="font-cinzel text-2xl sm:text-3xl font-bold text-slate-100 mb-1">
            1
          </span>
          <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">
            Random Encounter
          </span>
          <span className="text-[11px] text-slate-500 mt-1">Unbiased Historical Match</span>
        </div>

        <div className="p-4 sm:p-5 rounded-xl bg-slate-900/40 border border-white/5 flex flex-col items-center">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-3 h-3 rounded-full bg-[#0052FF]" />
            <span className="font-cinzel text-xl sm:text-2xl font-bold text-slate-100">
              Base
            </span>
          </div>
          <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">
            Built on Base
          </span>
          <span className="text-[11px] text-slate-500 mt-1">Chain ID 8453 · Low Gas</span>
        </div>
      </div>

      {/* Phase 1 / Phase 2 Transparency Banner */}
      <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400 bg-slate-950/70 border border-white/5 px-4 py-2 rounded-lg max-w-xl mx-auto">
        <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span>
          Phase 1 frontend ready. Pure discovery — zero app fees or subscriptions.
        </span>
        <button
          onClick={onOpenContractModal}
          className="text-amber-300 hover:text-amber-200 underline ml-1 inline-flex items-center gap-1 shrink-0"
        >
          <span>Remix Spec</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </section>
  );
};
