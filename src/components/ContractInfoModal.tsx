import React, { useState, useEffect } from 'react';
import {
  X,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Terminal,
  BookOpen,
  AlertCircle,
  Sparkles,
  Save,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import {
  BASE_CHAIN_ID,
  SOLIDITY_CONTRACT_CODE,
  getStoredContractAddress,
  setStoredContractAddress,
  clearStoredContractAddress,
  isContractConfigured,
  BASESCAN_URL,
} from '../config/contract';

interface ContractInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContractAddressUpdated?: () => void;
}

export const ContractInfoModal: React.FC<ContractInfoModalProps> = ({
  isOpen,
  onClose,
  onContractAddressUpdated,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<'remix' | 'solidity' | 'config' | 'spec'>('remix');
  const [inputAddress, setInputAddress] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const activeContract = getStoredContractAddress();
  const configured = isContractConfigured();

  useEffect(() => {
    if (isOpen) {
      setInputAddress(activeContract || '');
      setSaveSuccess(false);
      setSaveError(null);
    }
  }, [isOpen, activeContract]);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(SOLIDITY_CONTRACT_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputAddress.trim();
    if (!trimmed.startsWith('0x') || trimmed.length !== 42) {
      setSaveError('Contract address must start with "0x" and be exactly 42 characters long.');
      setSaveSuccess(false);
      return;
    }

    const success = setStoredContractAddress(trimmed);
    if (success) {
      setSaveSuccess(true);
      setSaveError(null);
      if (onContractAddressUpdated) {
        onContractAddressUpdated();
      }
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      setSaveError('Failed to save contract address to browser storage.');
    }
  };

  const handleClearAddress = () => {
    clearStoredContractAddress();
    setInputAddress('');
    setSaveSuccess(false);
    setSaveError(null);
    if (onContractAddressUpdated) {
      onContractAddressUpdated();
    }
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
                Base Smart Contract Architecture
              </h3>
              <p className="text-[11px] text-blue-300 font-mono">
                Ultra-Low Gas · Privacy-First · Base Mainnet (Chain ID 8453)
              </p>
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
              className={`px-2.5 py-0.5 rounded-full font-mono text-[11px] font-medium flex items-center gap-1.5 ${
                configured
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-950 text-amber-300 border border-amber-500/30'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${configured ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              {configured
                ? `Active (${activeContract.slice(0, 8)}...${activeContract.slice(-6)})`
                : 'Contract Address Pending'}
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-slate-400 text-xs">
            <span>Target: Base Mainnet</span>
            <span className="text-slate-600">·</span>
            <span>Chain ID: {BASE_CHAIN_ID}</span>
          </div>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-white/10 bg-[#050B1B] px-6 pt-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('remix')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer font-display whitespace-nowrap ${
              activeTab === 'remix'
                ? 'border-[#0052FF] text-white font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Remix IDE Deployment Guide
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer font-display whitespace-nowrap ${
              activeTab === 'config'
                ? 'border-[#0052FF] text-white font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Activate Contract Address
          </button>
          <button
            onClick={() => setActiveTab('solidity')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer font-display whitespace-nowrap ${
              activeTab === 'solidity'
                ? 'border-[#0052FF] text-white font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Solidity Source Code
          </button>
          <button
            onClick={() => setActiveTab('spec')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer font-display whitespace-nowrap ${
              activeTab === 'spec'
                ? 'border-[#0052FF] text-white font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Event & Gas Spec
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[62vh] overflow-y-auto space-y-4">
          {/* REMIX DEPLOYMENT GUIDE */}
          {activeTab === 'remix' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <div className="p-4 rounded-2xl bg-[#0052FF]/10 border border-[#0052FF]/25 text-blue-200 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#0052FF] shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-semibold text-white">Strict Rules & Deployment Transparency:</p>
                  <p>
                    • <strong>Normal Gas Only:</strong> Users pay ONLY standard Base network gas (0 ETH transferred).
                  </p>
                  <p>
                    • <strong>Privacy-First:</strong> Selected personality IDs and personal history remain strictly <strong>OFF-CHAIN</strong>. No individual selections are published on the public ledger.
                  </p>
                  <p>
                    • <strong>Gas-Optimized:</strong> The contract consumes under 28,000 gas units per selection (~$0.0005 on Base).
                  </p>
                </div>
              </div>

              <ol className="space-y-3 list-decimal list-inside pl-1 text-slate-200">
                <li className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <strong className="text-blue-300 font-display">Step 1: Copy Contract Code:</strong> Switch to the "Solidity Source Code" tab and click <em>Copy Contract Code</em>.
                </li>
                <li className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <strong className="text-blue-300 font-display">Step 2: Open Remix IDE:</strong> Open{' '}
                  <a
                    href="https://remix.ethereum.org"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#0052FF] hover:underline inline-flex items-center gap-1 font-semibold"
                  >
                    <span>remix.ethereum.org</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  , create a new file named <code className="text-blue-200 font-mono bg-white/5 px-1 py-0.5 rounded">LuckyFace.sol</code>, and paste the code.
                </li>
                <li className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <strong className="text-blue-300 font-display">Step 3: Compile:</strong> In the Solidity Compiler tab, select compiler version <code className="text-blue-200 font-mono bg-white/5 px-1 py-0.5 rounded">0.8.20</code> or higher and click <em>Compile LuckyFace.sol</em>.
                </li>
                <li className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <strong className="text-blue-300 font-display">Step 4: Deploy on Base Mainnet:</strong> In "Deploy & Run Transactions", choose Environment: <em>"Injected Provider - MetaMask / Rabby / Coinbase"</em>. Ensure your wallet is connected to <strong>Base Mainnet (Chain ID 8453)</strong>. Click <em>Deploy</em> and confirm in your wallet. (Deployment gas is ~0.0001 ETH, costing ~$0.20).
                </li>
                <li className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <strong className="text-blue-300 font-display">Step 5: Activate Address:</strong> Switch to the "Activate Contract Address" tab, paste your deployed contract address (<code className="text-blue-200 font-mono bg-white/5 px-1 py-0.5 rounded">0x...</code>), and click <em>Save & Activate</em>. The app immediately begins routing real on-chain selections to your contract!
                </li>
              </ol>
            </div>
          )}

          {/* ACTIVATE CONTRACT TAB */}
          {activeTab === 'config' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                <h4 className="font-display text-sm font-bold text-white">
                  Base Mainnet Contract Address Configuration
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Enter the deployed LuckyFace contract address on Base Mainnet. Once saved, every selection button on the website will execute real transactions against this contract.
                </p>
              </div>

              <form onSubmit={handleSaveAddress} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-display uppercase tracking-wider">
                    Contract Address (Base Mainnet):
                  </label>
                  <input
                    type="text"
                    value={inputAddress}
                    onChange={(e) => setInputAddress(e.target.value)}
                    placeholder="0x..."
                    className="w-full px-4 py-3 bg-[#030612] border border-white/10 focus:border-[#0052FF] rounded-xl text-white font-mono text-sm placeholder-slate-600 focus:outline-none transition-colors"
                  />
                  <p className="text-[11px] text-slate-500 mt-1.5 font-mono">
                    Must start with 0x and be 42 characters. E.g. 0x1234567890abcdef1234567890abcdef12345678
                  </p>
                </div>

                {saveSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Contract address saved and activated for Base Mainnet!</span>
                  </div>
                )}

                {saveError && (
                  <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{saveError}</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#0052FF] hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-[#0052FF]/20 flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save & Activate Contract</span>
                  </button>

                  {configured && (
                    <a
                      href={`${BASESCAN_URL}/address/${activeContract}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium rounded-xl border border-white/10 flex items-center gap-1.5 transition-colors"
                    >
                      <span>View on BaseScan</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {configured && (
                    <button
                      type="button"
                      onClick={handleClearAddress}
                      className="px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-medium rounded-xl border border-rose-500/20 flex items-center gap-1.5 cursor-pointer ml-auto transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* SOLIDITY CODE TAB */}
          {activeTab === 'solidity' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">LuckyFace.sol (Solidity ^0.8.20)</span>
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

          {/* SPEC TAB */}
          {activeTab === 'spec' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-300">
              <div className="p-4 rounded-2xl bg-[#030612] border border-white/10 space-y-2">
                <h4 className="font-display text-white font-bold text-sm">Target Function & Gas:</h4>
                <div className="p-2.5 bg-white/[0.02] rounded-xl font-mono text-xs text-blue-300">
                  <code>function recordSelection() external returns (uint256 selectionNumber);</code>
                </div>
                <p className="text-xs text-slate-400 pt-1 leading-relaxed">
                  Consumes under 28,000 gas units per selection. Operates with <strong>0 ETH application fees</strong>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#030612] border border-white/10 space-y-2">
                <h4 className="font-display text-white font-bold text-sm">Lightweight Verification Event:</h4>
                <pre className="font-mono text-xs text-[#0052FF] p-3 rounded-xl bg-white/[0.02] border border-white/5">
{`event SelectionConfirmed(
    address indexed user,
    uint256 indexed selectionNumber,
    uint256 timestamp
);`}
                </pre>
                <div className="text-xs text-emerald-300 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 space-y-1">
                  <p className="font-semibold">Privacy-Preserving Architecture:</p>
                  <p className="text-slate-300">
                    The chosen personality ID and personal selection history are stored strictly <strong>OFF-CHAIN</strong> in the user's browser, seeded deterministically by the confirmed transaction hash. No individual personality choices are ever published to the public blockchain.
                  </p>
                </div>
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
