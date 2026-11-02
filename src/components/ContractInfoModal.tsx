import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, ShieldCheck, Terminal, BookOpen, AlertCircle, Sparkles } from 'lucide-react';
import {
  BASE_CHAIN_ID,
  CONTRACT_ADDRESS,
  IS_CONTRACT_CONFIGURED,
  SOLIDITY_CONTRACT_CODE,
} from '../config/contract';

interface ContractInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContractInfoModal: React.FC<ContractInfoModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<'remix' | 'solidity' | 'spec'>('remix');

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(SOLIDITY_CONTRACT_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-[#060C1E] border border-[#0052FF]/30 rounded-3xl shadow-2xl shadow-[#0052FF]/15 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#040816]/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0052FF]/20 border border-[#0052FF]/40 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-[#0052FF]" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-white">
                Base Smart Contract Integration
              </h3>
              <p className="text-[11px] text-blue-300 font-mono">Decentralized Pseudorandom Discovery Architecture</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Strip */}
        <div className="px-6 py-3 bg-[#030612] border-b border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-mono">Contract Status:</span>
            <span
              className={`px-2.5 py-0.5 rounded-full font-mono text-[11px] font-medium ${
                IS_CONTRACT_CONFIGURED
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                  : 'bg-[#0052FF]/15 text-blue-300 border border-[#0052FF]/30'
              }`}
            >
              {IS_CONTRACT_CONFIGURED ? `Active (${CONTRACT_ADDRESS.slice(0, 10)}...)` : 'Ready for Base Mainnet Deployment'}
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-slate-400 text-xs">
            <span>Target: Base Mainnet</span>
            <span className="text-slate-600">·</span>
            <span>Chain ID: {BASE_CHAIN_ID}</span>
          </div>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-white/10 bg-[#050B1B] px-6 pt-2">
          <button
            onClick={() => setActiveTab('remix')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer font-display ${
              activeTab === 'remix'
                ? 'border-[#0052FF] text-white font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Remix IDE Deployment
          </button>
          <button
            onClick={() => setActiveTab('solidity')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer font-display ${
              activeTab === 'solidity'
                ? 'border-[#0052FF] text-white font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Solidity Source Code
          </button>
          <button
            onClick={() => setActiveTab('spec')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer font-display ${
              activeTab === 'spec'
                ? 'border-[#0052FF] text-white font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            ABI & Event Spec
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[62vh] overflow-y-auto space-y-4">
          {activeTab === 'remix' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <div className="p-4 rounded-2xl bg-[#0052FF]/10 border border-[#0052FF]/25 text-blue-200 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#0052FF] shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed">
                  <strong>Zero Platform Fees:</strong> Fatemeet is non-profit and gas-efficient. There are zero creator commissions, no token requirements, no administrative backdoor controls, and encounters are recorded on Base Mainnet.
                </p>
              </div>

              <ol className="space-y-3 list-decimal list-inside pl-1 text-slate-200">
                <li className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <strong className="text-blue-300 font-display">Copy Contract:</strong> Switch to the "Solidity Source Code" tab and click <em>Copy Contract Code</em>.
                </li>
                <li className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <strong className="text-blue-300 font-display">Open Remix IDE:</strong> Visit{' '}
                  <a
                    href="https://remix.ethereum.org"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#0052FF] hover:underline inline-flex items-center gap-1 font-semibold"
                  >
                    <span>remix.ethereum.org</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  , create a new file named <code className="text-blue-200 font-mono bg-white/5 px-1 py-0.5 rounded">FateMeet.sol</code>, and paste the code.
                </li>
                <li className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <strong className="text-blue-300 font-display">Compile:</strong> In the Solidity Compiler tab, select compiler version <code className="text-blue-200 font-mono bg-white/5 px-1 py-0.5 rounded">0.8.20</code> or higher and click <em>Compile FateMeet.sol</em>.
                </li>
                <li className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <strong className="text-blue-300 font-display">Deploy on Base:</strong> In "Deploy & Run Transactions", set Environment to <em>"Injected Provider - MetaMask / Rabby"</em>. Confirm your wallet is connected to <strong>Base Mainnet (Chain ID 8453)</strong>. Click <em>Deploy</em> and confirm in your wallet.
                </li>
                <li className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <strong className="text-blue-300 font-display">Connect to Website:</strong> Copy your newly deployed contract address and paste it into <code className="text-blue-200 font-mono bg-white/5 px-1 py-0.5 rounded">src/config/contract.ts</code> or the environment variable <code className="text-blue-200 font-mono bg-white/5 px-1 py-0.5 rounded">VITE_FATE_MEET_CONTRACT_ADDRESS</code>. The website connects smoothly with zero redesign needed!
                </li>
              </ol>
            </div>
          )}

          {activeTab === 'solidity' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">FateMeet.sol (Solidity ^0.8.20)</span>
                <button
                  onClick={handleCopyCode}
                  className="px-3.5 py-1.5 bg-[#0052FF] hover:bg-blue-600 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg shadow-[#0052FF]/20 transition-colors"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied to Clipboard!' : 'Copy Contract Code'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-2xl bg-[#030612] text-blue-200/90 font-mono text-xs overflow-x-auto border border-white/10 leading-relaxed max-h-[45vh]">
                {SOLIDITY_CONTRACT_CODE}
              </pre>
            </div>
          )}

          {activeTab === 'spec' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-300">
              <div className="p-4 rounded-2xl bg-[#030612] border border-white/10 space-y-2">
                <h4 className="font-display text-white font-bold text-sm">Target Functions:</h4>
                <ul className="space-y-1.5 font-mono text-xs text-blue-300">
                  <li className="p-1.5 bg-white/[0.02] rounded"><code>function reveal() external returns (uint256 personalityId);</code></li>
                  <li className="p-1.5 bg-white/[0.02] rounded"><code>function getLastEncounter(address user) external view returns (uint256);</code></li>
                  <li className="p-1.5 bg-white/[0.02] rounded"><code>function getEncounterCount(address user) external view returns (uint256);</code></li>
                  <li className="p-1.5 bg-white/[0.02] rounded"><code>function totalEncounters() external view returns (uint256);</code></li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-[#030612] border border-white/10 space-y-2">
                <h4 className="font-display text-white font-bold text-sm">Target Event:</h4>
                <pre className="font-mono text-xs text-[#0052FF] p-3 rounded-xl bg-white/[0.02] border border-white/5">
{`event EncounterRevealed(
    address indexed user,
    uint256 personalityId,
    uint256 timestamp
);`}
                </pre>
                <p className="text-xs text-slate-400 pt-1 leading-relaxed">
                  <strong>Architectural note:</strong> A transaction receipt does not expose a Solidity function's return value directly in frontend calls. The frontend listens to and decodes the <code className="text-blue-300 font-mono">EncounterRevealed</code> event logs from the confirmed receipt to determine the revealed personality ID.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#040816] border-t border-white/10 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold rounded-xl border border-white/10 cursor-pointer transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
