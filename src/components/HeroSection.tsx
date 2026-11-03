import React from 'react';

interface HeroSectionProps {
  totalMessages: number | null;
  onScrollToForm: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ totalMessages, onScrollToForm }) => {
  return (
    <section className="relative pt-12 pb-10 sm:pt-16 sm:pb-14 px-4 sm:px-6 text-center max-w-4xl mx-auto">
      {/* Network Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/80 mb-6 shadow-xs">
        <span className="w-2 h-2 rounded-full bg-[#0052FF] animate-pulse" />
        <span className="text-xs font-semibold text-blue-900 tracking-wide">
          Base Mainnet
        </span>
        <span className="text-slate-300 font-normal">·</span>
        <span className="text-xs font-mono text-blue-700 font-medium">
          Chain ID 8453
        </span>
      </div>

      {/* Main Headline */}
      <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.08] mb-5">
        Your Words.{' '}
        <span className="text-[#0052FF]">Forever on Base.</span>
      </h1>

      {/* Description */}
      <p className="text-base sm:text-xl text-slate-600 font-normal max-w-2xl mx-auto mb-8 leading-relaxed">
        One transaction. One sentence. Permanently recorded on the Base blockchain.
      </p>

      {/* CTA Button to jump to form */}
      <div className="flex items-center justify-center mb-10">
        <button
          onClick={onScrollToForm}
          className="px-8 py-3.5 bg-[#0052FF] hover:bg-[#0047DB] active:scale-[0.98] text-white font-display text-sm font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-lg shadow-[#0052FF]/25 flex items-center gap-2"
        >
          <span>Sign the Guestbook</span>
          <span className="text-blue-200">↓</span>
        </button>
      </div>

      {/* Information strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0052FF]" />
            <span>0 Platform Fees</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Only Base network gas fees. No additional platform fees.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>100% Immutable</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Messages are etched directly into Base blockchain storage.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span>Live Onchain Messages</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            {totalMessages !== null ? (
              <strong className="text-slate-800">{totalMessages} message{totalMessages === 1 ? '' : 's'}</strong>
            ) : (
              'Reading messages...'
            )}{' '}
            permanently recorded on Base.
          </p>
        </div>
      </div>
    </section>
  );
};
