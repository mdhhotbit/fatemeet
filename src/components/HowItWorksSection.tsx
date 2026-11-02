import React from 'react';
import { Compass, ShieldCheck, Zap, Code, Lock, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

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
        <p className="font-editorial text-blue-300 text-sm tracking-widest uppercase mb-2">
          Protocol & Architecture
        </p>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
          HOW LUCKYFACE WORKS
        </h2>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          An intersection of human history, complete privacy, and authentic Base Mainnet transactions.
        </p>
      </div>

      {/* 3 Step Flow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="p-7 rounded-3xl bg-[#060C1E] border border-white/10 hover:border-[#0052FF]/40 transition-all flex flex-col justify-between shadow-xl">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#0052FF]/15 border border-[#0052FF]/30 flex items-center justify-center text-[#0052FF] mb-5">
              <Compass className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono text-blue-400 uppercase tracking-widest block mb-1">
              Step 01
            </span>
            <h3 className="font-display text-xl font-bold text-white mb-2">
              Connect EVM Wallet
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Connect your EVM browser wallet (MetaMask, Rabby, Coinbase Wallet) to Base Mainnet (Chain ID 8453). Zero personal registration, no email, no name required.
            </p>
          </div>
          <div className="pt-4 mt-6 border-t border-white/5 text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero personal data collected</span>
          </div>
        </div>

        <div className="p-7 rounded-3xl bg-[#060C1E] border border-white/10 hover:border-[#0052FF]/40 transition-all flex flex-col justify-between shadow-xl">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#0052FF]/15 border border-[#0052FF]/30 flex items-center justify-center text-[#0052FF] mb-5">
              <Zap className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono text-blue-400 uppercase tracking-widest block mb-1">
              Step 02
            </span>
            <h3 className="font-display text-xl font-bold text-white mb-2">
              On-Chain Transaction
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Pressing "REVEAL MY DESTINY" requests your wallet transaction approval on Base Mainnet. Users pay ONLY standard Base network gas (approx. &lt; $0.001). 0 ETH application fees.
            </p>
          </div>
          <div className="pt-4 mt-6 border-t border-white/5 text-[11px] text-slate-400 font-mono">
            <span>0 ETH platform fee · No tokens required</span>
          </div>
        </div>

        <div className="p-7 rounded-3xl bg-[#060C1E] border border-white/10 hover:border-[#0052FF]/40 transition-all flex flex-col justify-between shadow-xl">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#0052FF]/15 border border-[#0052FF]/30 flex items-center justify-center text-[#0052FF] mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono text-blue-400 uppercase tracking-widest block mb-1">
              Step 03
            </span>
            <h3 className="font-display text-xl font-bold text-white mb-2">
              Privacy-First Reveal
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Upon confirmed transaction receipt, your encounter is derived off-chain using transaction entropy. A verified BaseScan link is provided with full private local storage.
            </p>
          </div>
          <div className="pt-4 mt-6 border-t border-white/5 text-[11px] text-slate-400 font-mono">
            <span>Personality ID kept off-chain</span>
          </div>
        </div>
      </div>

      {/* Smart Contract Architecture Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#060C1E] to-[#040816] border border-[#0052FF]/30 mb-12 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#0052FF]/15 border border-[#0052FF]/30 text-xs font-mono text-blue-300">
              <Sparkles className="w-3.5 h-3.5 text-[#0052FF]" />
              <span>BASE MAINNET PROTOCOL</span>
            </div>
            <h3 className="font-display text-2xl font-bold text-white">
              Lightweight Smart Contract & Privacy Architecture
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              LuckyFace is built strictly on <strong>Base Mainnet (Chain ID 8453)</strong>. By executing transactions consuming &lt; 28,000 gas units, it offers an economical, authentic Web3 discovery journey without leaking user selections to the public ledger.
            </p>
          </div>

          <button
            onClick={onOpenContractModal}
            className="px-6 py-3.5 bg-[#0052FF] hover:bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shrink-0 shadow-lg shadow-[#0052FF]/20"
          >
            <Code className="w-4 h-4" />
            <span>Deploy / Configure Contract</span>
          </button>
        </div>
      </div>

      {/* Protocol Rule & Privacy Guarantee */}
      <div className="p-6 rounded-3xl bg-[#040816] border border-white/10 text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3">
        <div className="flex items-center gap-2 text-blue-300 font-semibold uppercase tracking-wider text-xs font-display">
          <ShieldCheck className="w-4 h-4 text-[#0052FF]" />
          <span>Strict Protocol Rule & Privacy Guarantee</span>
        </div>
        <p>
          <strong>No successful transaction = No personality selection.</strong> If a transaction is rejected by the user or fails on-chain, no personality is ever revealed.
        </p>
        <p className="text-slate-400">
          <strong>Privacy By Design:</strong> While the transaction event verifies that a selection occurred, individual personality choices and encounter chronicles remain strictly <strong>OFF-CHAIN</strong> on your device, ensuring maximum privacy for every explorer.
        </p>
      </div>

      {/* CTA */}
      <div className="text-center mt-12">
        <button
          onClick={onTriggerReveal}
          className="px-10 py-4 bg-[#0052FF] hover:bg-blue-600 text-white font-display text-sm font-bold uppercase tracking-widest rounded-xl shadow-xl shadow-[#0052FF]/30 cursor-pointer transition-all hover:scale-[1.02]"
        >
          START ON-CHAIN DISCOVERY
        </button>
      </div>
    </section>
  );
};
