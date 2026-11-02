import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, ShieldCheck, Terminal, BookOpen, AlertCircle } from 'lucide-react';
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
      <div className="relative w-full max-w-3xl bg-[#090d1c] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h3 className="font-cinzel text-base sm:text-lg font-bold text-white">
              SMART CONTRACT ARCHITECTURE (PHASE 2)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Strip */}
        <div className="px-6 py-3 bg-slate-950/90 border-b border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-mono">Contract Status:</span>
            <span
              className={`px-2 py-0.5 rounded font-mono font-medium ${
                IS_CONTRACT_CONFIGURED
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-950 text-amber-300 border border-amber-500/30'
              }`}
            >
              {IS_CONTRACT_CONFIGURED ? `Configured (${CONTRACT_ADDRESS.slice(0, 10)}...)` : 'Phase 1: Awaiting Phase 2 Deployment'}
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-slate-400">
            <span>Target: Base Mainnet</span>
            <span className="text-slate-600">·</span>
            <span>Chain ID: {BASE_CHAIN_ID}</span>
          </div>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-white/10 bg-slate-900/60 px-6 pt-2">
          <button
            onClick={() => setActiveTab('remix')}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-all cursor-pointer ${
              activeTab === 'remix'
                ? 'border-amber-400 text-amber-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Remix IDE Deployment Steps
          </button>
          <button
            onClick={() => setActiveTab('solidity')}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-all cursor-pointer ${
              activeTab === 'solidity'
                ? 'border-amber-400 text-amber-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Solidity Source Code
          </button>
          <button
            onClick={() => setActiveTab('spec')}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-all cursor-pointer ${
              activeTab === 'spec'
                ? 'border-amber-400 text-amber-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Interface Specification
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-4">
          {activeTab === 'remix' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs">
                  <strong>Phase 1 Integrity Guarantee:</strong> Do not invent fake contract addresses or simulate fake on-chain transactions. When ready to deploy to Base Mainnet, follow these standard Remix steps.
                </p>
              </div>

              <ol className="space-y-3 list-decimal list-inside pl-1 text-slate-200">
                <li className="p-3 rounded-lg bg-slate-950/60 border border-white/5">
                  <strong className="text-amber-300">Copy Contract:</strong> Switch to the "Solidity Source Code" tab and click <em>Copy Contract Code</em>.
                </li>
                <li className="p-3 rounded-lg bg-slate-950/60 border border-white/5">
                  <strong className="text-amber-300">Open Remix IDE:</strong> Visit{' '}
                  <a
                    href="https://remix.ethereum.org"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:underline inline-flex items-center gap-1"
                  >
                    <span>remix.ethereum.org</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  , create a new file named <code className="text-amber-200 font-mono">FateMeet.sol</code>, and paste the code.
                </li>
                <li className="p-3 rounded-lg bg-slate-950/60 border border-white/5">
                  <strong className="text-amber-300">Compile:</strong> In the Solidity Compiler tab, select compiler version <code className="text-amber-200 font-mono">0.8.20</code> or higher and click <em>Compile FateMeet.sol</em>.
                </li>
                <li className="p-3 rounded-lg bg-slate-950/60 border border-white/5">
                  <strong className="text-amber-300">Deploy on Base:</strong> In "Deploy & Run Transactions", set Environment to <em>"Injected Provider - MetaMask / Rabby"</em>. Confirm your wallet is connected to <strong>Base Mainnet (Chain ID 8453)</strong>. Click <em>Deploy</em> and confirm in your wallet.
                </li>
                <li className="p-3 rounded-lg bg-slate-950/60 border border-white/5">
                  <strong className="text-amber-300">Connect to Website:</strong> Copy your newly deployed contract address and paste it into <code className="text-amber-200 font-mono">src/config/contract.ts</code> or the environment variable <code className="text-amber-200 font-mono">VITE_FATE_MEET_CONTRACT_ADDRESS</code>. The website instantly switches into full on-chain production mode with zero redesign needed!
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
                  className="px-3 py-1.5 bg-amber-400 text-slate-950 text-xs font-bold rounded-lg hover:bg-amber-300 flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied to Clipboard!' : 'Copy Contract Code'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-slate-950 text-amber-200/90 font-mono text-xs overflow-x-auto border border-white/10 leading-relaxed">
                {SOLIDITY_CONTRACT_CODE}
              </pre>
            </div>
          )}

          {activeTab === 'spec' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-300">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-white/5 space-y-2">
                <h4 className="font-cinzel text-amber-200 font-bold text-sm">Target Functions:</h4>
                <ul className="space-y-1 font-mono text-xs text-slate-300">
                  <li><code className="text-amber-400">function reveal() external returns (uint256 personalityId);</code></li>
                  <li><code className="text-amber-400">function getLastEncounter(address user) external view returns (uint256);</code></li>
                  <li><code className="text-amber-400">function getEncounterCount(address user) external view returns (uint256);</code></li>
                  <li><code className="text-amber-400">function totalEncounters() external view returns (uint256);</code></li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-white/5 space-y-2">
                <h4 className="font-cinzel text-amber-200 font-bold text-sm">Target Event:</h4>
                <pre className="font-mono text-xs text-amber-400">
{`event EncounterRevealed(
    address indexed user,
    uint256 personalityId,
    uint256 timestamp
);`}
                </pre>
                <p className="text-xs text-slate-400 pt-1">
                  <strong>Crucial architectural note:</strong> A transaction receipt does not expose a Solidity function's return value directly in frontend calls. The frontend listens to and decodes the <code className="text-amber-300">EncounterRevealed</code> event logs from the confirmed receipt to determine the personality ID.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-white/10 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
