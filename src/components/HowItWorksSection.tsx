import React from 'react';
import { Compass, ShieldCheck, Zap, Code, Lock } from 'lucide-react';

interface HowItWorksSectionProps {
  onOpenContractModal: () => void;
  onTriggerReveal: () => void;
  onOpenPrivacyModal?: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({
  onOpenContractModal,
  onTriggerReveal,
  onOpenPrivacyModal,
}) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <p className="font-editorial text-amber-300 text-sm tracking-widest uppercase mb-2">
          Architecture & Philosophy
        </p>
        <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
          HOW FATE MEET WORKS
        </h2>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          An intersection of timeless human history, private discovery, and the modern Base blockchain ecosystem.
        </p>
      </div>

      {/* 3 Step Flow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="p-6 rounded-2xl bg-[#090e1c] border border-white/10 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/5 rounded-bl-full pointer-events-none" />
          <div>
            <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300 mb-5">
              <Compass className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono text-amber-400/80 uppercase tracking-widest block mb-1">
              Step 01
            </span>
            <h3 className="font-cinzel text-xl font-bold text-white mb-2">
              Instant or On-Chain
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Experience the 50 lives freely with instant anonymous discovery, or connect an EVM wallet (MetaMask, Rabby, Coinbase Wallet) on Base Mainnet.
            </p>
          </div>
          <div className="pt-4 mt-6 border-t border-white/5 text-[11px] text-slate-400 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero personal information required</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#090e1c] border border-white/10 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full pointer-events-none" />
          <div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-5">
              <Zap className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono text-blue-400/80 uppercase tracking-widest block mb-1">
              Step 02
            </span>
            <h3 className="font-cinzel text-xl font-bold text-white mb-2">
              The Reveal Call
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Pressing "REVEAL MY DESTINY" triggers an unbiased selection. When using Base, it invokes the <code className="text-amber-300">reveal()</code> contract function using standard network gas only.
            </p>
          </div>
          <div className="pt-4 mt-6 border-t border-white/5 text-[11px] text-slate-400">
            No subscriptions · Zero platform markups
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#090e1c] border border-white/10 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/5 rounded-bl-full pointer-events-none" />
          <div>
            <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300 mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono text-amber-400/80 uppercase tracking-widest block mb-1">
              Step 03
            </span>
            <h3 className="font-cinzel text-xl font-bold text-white mb-2">
              Destiny Encounter
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              An extraordinary historical portrait, lifetime achievements, and biography are revealed. On-chain encounters generate a verifiable public BaseScan transaction proof.
            </p>
          </div>
          <div className="pt-4 mt-6 border-t border-white/5 text-[11px] text-slate-400">
            Cryptographic verification · Public archival proof
          </div>
        </div>
      </div>

      {/* Dual Discovery Architecture Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900/90 to-[#0c1222] border border-amber-500/20 mb-12">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-amber-400/10 border border-amber-400/20 text-xs font-mono text-amber-300">
              <span>SYSTEM ARCHITECTURE</span>
            </div>
            <h3 className="font-cinzel text-2xl font-bold text-white">
              Sovereign Discovery & Base Smart Contract
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              FATE MEET offers dual discovery modes: instant sovereign private encounters right in your browser with zero registration required, or verified on-chain encounters on Base Mainnet where each destiny match is permanently recorded.
            </p>
          </div>

          <button
            onClick={onOpenContractModal}
            className="px-6 py-3.5 bg-slate-900 border border-amber-400/40 hover:border-amber-400 text-amber-200 hover:text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shrink-0 shadow-lg"
          >
            <Code className="w-4 h-4 text-amber-400" />
            <span>View Smart Contract Spec</span>
          </button>
        </div>
      </div>

      {/* Honest Randomness Disclosure */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-white/10 text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3">
        <div className="flex items-center gap-2 text-amber-300 font-semibold uppercase tracking-wider text-xs">
          <ShieldCheck className="w-4 h-4" />
          <span>Honest Pseudorandomness Disclosure</span>
        </div>
        <p>
          The Solidity smart contract uses inexpensive on-chain pseudorandom inputs (including <code className="text-amber-200">prevrandao</code>, <code className="text-amber-200">block.timestamp</code>, and sender nonce). This design keeps gas costs minimal for all users.
        </p>
        <p className="text-slate-400">
          <strong>Important:</strong> We do not claim that this method provides cryptographically secure, manipulation-proof, or provably fair randomness. It is designed specifically for engaging, lightweight historical entertainment and social discovery on Base.
        </p>
      </div>

      {/* CTA */}
      <div className="text-center mt-12">
        <button
          onClick={onTriggerReveal}
          className="px-8 py-4 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 text-slate-950 font-cinzel text-xs sm:text-sm font-bold uppercase tracking-widest rounded-lg hover:from-amber-200 hover:to-amber-400 shadow-xl cursor-pointer"
        >
          Begin An Encounter Now
        </button>
      </div>
    </section>
  );
};
