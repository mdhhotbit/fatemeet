import React from 'react';
import { Compass, Sparkles, Shield, Lock, Dna, Users, Flame } from 'lucide-react';
import { FateMeetLogo } from './FateMeetLogo';

interface HeroSectionProps {
  onTriggerReveal: () => void;
  onOpenContractModal: () => void;
  onOpenPrivacyModal: () => void;
  isContractConfigured: boolean;
  totalEncountersCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onTriggerReveal,
  onOpenContractModal,
  onOpenPrivacyModal,
  isContractConfigured,
  totalEncountersCount,
}) => {
  return (
    <section className="relative pt-8 pb-20 md:pt-14 md:pb-28 overflow-hidden flex flex-col items-center justify-center text-center px-4 sm:px-6">
      {/* Modern Base Blue atmospheric ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] sm:w-[900px] h-[500px] bg-gradient-to-tr from-[#0052FF]/20 via-[#38BDF8]/10 to-transparent rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-[radial-gradient(ellipse_at_center,rgba(0,82,255,0.25),transparent_70%)] blur-[80px] pointer-events-none -z-10" />

      {/* Subtle architectural grid lines */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#0052FF]/30 to-transparent pointer-events-none" />

      {/* Primary Brand Emblem */}
      <div className="mb-6 flex flex-col items-center justify-center">
        <FateMeetLogo size="xl" variant="icon" />
      </div>

      {/* Clarifying Badge: NOT A DATING APP · INTERACTIVE RANDOM DISCOVERY */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#0052FF]/40 bg-[#0052FF]/10 backdrop-blur-md mb-6 transition-all hover:border-[#0052FF]/70">
        <span className="w-2 h-2 rounded-full bg-[#0052FF] animate-pulse shadow-[0_0_8px_#0052FF]" />
        <span className="text-xs font-semibold tracking-wide text-blue-200">
          Interactive Random Discovery <span className="text-slate-400">·</span> Not A Dating App
        </span>
        <span className="text-slate-500" aria-hidden="true">·</span>
        <span className="text-[11px] font-mono text-cyan-300">
          Base Ecosystem
        </span>
      </div>

      {/* Small heading */}
      <p className="font-sans-clean font-medium text-blue-300 text-sm sm:text-base md:text-lg mb-3 tracking-wide max-w-xl mx-auto">
        50 extraordinary personalities. One unexpected encounter.
      </p>

      {/* Main headline with modern Web3 typography */}
      <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white mb-6 leading-[1.05] max-w-5xl mx-auto">
        WHO IS WAITING <br className="hidden sm:inline" />
        <span className="base-gradient-text drop-shadow-[0_4px_35px_rgba(0,82,255,0.4)]">
          FOR YOU?
        </span>
      </h1>

      {/* Description */}
      <p className="text-slate-300 text-base sm:text-lg md:text-xl font-normal max-w-2xl mx-auto mb-10 leading-relaxed text-wrap-balance">
        Step into the portal of history. Experience a fun, randomness-based journey revealing the brilliant scientists, leaders, artists, and pioneers who shaped our world.
      </p>

      {/* Main Base-Blue CTA Button with glowing aura */}
      <div className="relative group mb-14">
        <div className="absolute -inset-1.5 bg-gradient-to-r from-[#0052FF] via-[#38BDF8] to-[#0052FF] rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition duration-500 group-hover:duration-200 animate-pulse" />
        <button
          onClick={onTriggerReveal}
          className="relative px-8 sm:px-12 py-4 sm:py-5 bg-[#0052FF] hover:bg-[#1A65FF] text-white font-display text-base sm:text-lg font-black tracking-widest uppercase rounded-xl shadow-2xl active:scale-[0.98] transition-all flex items-center gap-3 cursor-pointer border border-blue-400/40"
        >
          <Compass className="w-5 h-5 text-white animate-spin-slow" />
          <span>REVEAL MY DESTINY</span>
          <Sparkles className="w-5 h-5 text-cyan-200" />
        </button>
      </div>

      {/* Three Facts Cards (Base Network Language: Rounded-2xl, subtle blue border, glass surface) */}
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-4 border-t border-white/[0.08]">
        <div className="p-5 rounded-2xl bg-[#060C1E]/70 border border-white/10 hover:border-[#0052FF]/40 transition-all duration-300 flex flex-col items-center">
          <span className="font-display text-3xl sm:text-4xl font-black text-white mb-1 tabular-nums">
            50
          </span>
          <span className="text-xs uppercase tracking-wider text-blue-300 font-semibold">
            Famous Personalities
          </span>
          <span className="text-[11px] text-slate-400 mt-1">Across 5 Transformative Eras</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#060C1E]/70 border border-white/10 hover:border-[#0052FF]/40 transition-all duration-300 flex flex-col items-center">
          <span className="font-display text-3xl sm:text-4xl font-black text-white mb-1">
            1
          </span>
          <span className="text-xs uppercase tracking-wider text-cyan-300 font-semibold">
            Random Encounter
          </span>
          <span className="text-[11px] text-slate-400 mt-1">Unbiased On-Chain Match</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#060C1E]/70 border border-white/10 hover:border-[#0052FF]/40 transition-all duration-300 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3.5 h-3.5 rounded-full bg-[#0052FF] shadow-[0_0_10px_#0052FF]" />
            <span className="font-display text-2xl sm:text-3xl font-black text-white">
              Base
            </span>
          </div>
          <span className="text-xs uppercase tracking-wider text-blue-300 font-semibold">
            Built on Base
          </span>
          <span className="text-[11px] text-slate-400 mt-1">Chain ID 8453 · Ultra-Low Gas</span>
        </div>
      </div>

      {/* Privacy Guarantee Pill */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400 bg-slate-900/60 border border-white/[0.08] px-4 py-2.5 rounded-xl max-w-2xl mx-auto backdrop-blur-md">
        <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>
          100% Private. No sign-up, no email, no name, and zero third-party trackers.
        </span>
        <button
          onClick={onOpenPrivacyModal}
          className="text-emerald-300 hover:text-emerald-200 underline ml-1 inline-flex items-center gap-1 shrink-0 cursor-pointer"
        >
          <span>Privacy Charter</span>
        </button>
      </div>
    </section>
  );
};
