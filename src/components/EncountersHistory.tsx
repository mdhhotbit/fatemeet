import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { History, Sparkles, Trash2, ExternalLink, Calendar, Compass, Shield, Lock, CheckCircle2 } from 'lucide-react';
import { EncounterRecord } from '../types';
import {
  getLocalEncounters,
  clearLocalEncounters,
  getChainEncounters,
} from '../lib/encountersStorage';
import { clearAnonymousActivityHistory } from '../lib/anonymousAnalytics';
import { getPersonalityById } from '../lib/random';
import { formatDate, getInitials } from '../lib/utils';
import { getBaseScanTxUrl, shortenAddress } from '../lib/blockchain';
import { PortraitImage } from './PortraitImage';
import { PersonalityDetailModal } from './PersonalityDetailModal';
import { Personality } from '../types';

interface EncountersHistoryProps {
  onTriggerReveal: () => void;
  refreshTrigger: number;
  onOpenPrivacyModal?: () => void;
}

export const EncountersHistory: React.FC<EncountersHistoryProps> = ({
  onTriggerReveal,
  refreshTrigger,
  onOpenPrivacyModal,
}) => {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<'chain' | 'local'>('chain');
  const [localRecords, setLocalRecords] = useState<EncounterRecord[]>([]);
  const [chainRecords, setChainRecords] = useState<EncounterRecord[]>([]);
  const [selectedPersonality, setSelectedPersonality] = useState<Personality | null>(null);

  useEffect(() => {
    setLocalRecords(getLocalEncounters());
    if (address) {
      const userChain = getChainEncounters(address);
      setChainRecords(userChain);
      if (userChain.length > 0) {
        setActiveTab('chain');
      }
    } else {
      setActiveTab('local');
    }
  }, [address, refreshTrigger]);

  const handleClearHistory = () => {
    if (window.confirm('Clear your private local discovery history? This wipes locally recorded encounters and rotates your anonymous ID.')) {
      clearAnonymousActivityHistory();
      clearLocalEncounters();
      setLocalRecords([]);
    }
  };

  const recordsToShow = activeTab === 'chain' ? chainRecords : localRecords;
  const uniquePersonalityCount = new Set(recordsToShow.map((r) => r.personalityId)).size;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <p className="font-editorial text-blue-300 text-sm tracking-widest uppercase mb-2">
          Personal Discovery Chronicle
        </p>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
          MY ENCOUNTERS
        </h2>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Your personal journey through history. Verified on Base Mainnet, with personality choices preserved strictly off-chain on your device.
        </p>
      </div>

      {/* History Mode Tabs */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="flex p-1 bg-[#060C1E] border border-white/10 rounded-2xl">
          <button
            onClick={() => setActiveTab('chain')}
            className={`px-5 py-2.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 cursor-pointer font-display ${
              activeTab === 'chain'
                ? 'bg-[#0052FF] text-white font-bold shadow-lg shadow-[#0052FF]/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-blue-200" />
            <span>BASE ON-CHAIN ARCHIVE ({chainRecords.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('local')}
            className={`px-5 py-2.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 cursor-pointer font-display ${
              activeTab === 'local'
                ? 'bg-white/10 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>LOCAL DEVICE CACHE ({localRecords.length})</span>
          </button>
        </div>
      </div>

      {/* Mode Banner / Privacy Information */}
      <div className="p-4 mb-8 rounded-2xl bg-[#060C1E] border border-[#0052FF]/25 text-xs text-blue-200/90 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0052FF] shadow-[0_0_8px_#0052FF]" />
          <span>
            {activeTab === 'chain'
              ? isConnected && address
                ? `Tracking Base Mainnet encounters for ${shortenAddress(address)}.`
                : 'Connect your EVM wallet to view your verified Base transactions.'
              : 'Preserved locally on this browser. Never shared with any third party.'}
          </span>
        </div>

        {recordsToShow.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="text-xs text-rose-300 hover:text-rose-200 flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors font-medium"
            title="Clear encounters and rotate anonymous ID"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-10">
        <div className="p-5 rounded-2xl bg-[#060C1E] border border-white/10 text-center">
          <p className="font-display text-3xl sm:text-4xl font-black text-white tabular-nums">
            {recordsToShow.length}
          </p>
          <p className="text-xs text-blue-300 uppercase tracking-wider mt-1 font-semibold">Total Encounters</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#060C1E] border border-white/10 text-center">
          <p className="font-display text-3xl sm:text-4xl font-black text-white tabular-nums">
            {uniquePersonalityCount} / 50
          </p>
          <p className="text-xs text-blue-300 uppercase tracking-wider mt-1 font-semibold">Unique Figures</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#060C1E] border border-white/10 text-center">
          <p className="font-display text-base sm:text-lg font-bold text-white line-clamp-1">
            {recordsToShow.length > 0
              ? getPersonalityById(recordsToShow[0].personalityId)?.name || 'None'
              : 'None'}
          </p>
          <p className="text-xs text-blue-300 uppercase tracking-wider mt-1 font-semibold">Latest Encounter</p>
        </div>
      </div>

      {/* Empty State */}
      {recordsToShow.length === 0 ? (
        <div className="text-center py-16 bg-[#060C1E] border border-white/10 rounded-3xl max-w-xl mx-auto px-6 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-[#0052FF]/15 border border-[#0052FF]/30 flex items-center justify-center mx-auto mb-4">
            <Compass className="w-8 h-8 text-[#0052FF] animate-spin-slow" />
          </div>
          <h3 className="font-display text-xl font-bold text-white mb-2">No Encounters Recorded Yet</h3>
          <p className="text-slate-300 text-xs sm:text-sm mb-6 leading-relaxed max-w-md mx-auto">
            {activeTab === 'chain'
              ? 'Connect your EVM wallet and execute an on-chain transaction on Base Mainnet to record your first encounter.'
              : 'Click below to initiate your first discovery encounter.'}
          </p>
          <button
            onClick={onTriggerReveal}
            className="px-8 py-3.5 bg-[#0052FF] hover:bg-blue-600 text-white font-display text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer shadow-lg shadow-[#0052FF]/20 transition-all hover:scale-[1.02]"
          >
            DISCOVER ON BASE
          </button>
        </div>
      ) : (
        /* List of Encounter Cards */
        <div className="space-y-3.5 max-w-4xl mx-auto">
          {recordsToShow.map((record) => {
            const personality = getPersonalityById(record.personalityId);
            if (!personality) return null;

            return (
              <div
                key={record.id}
                onClick={() => setSelectedPersonality(personality)}
                className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-[#060C1E] border border-white/10 hover:border-[#0052FF]/50 rounded-2xl transition-all cursor-pointer gap-4 shadow-md hover:shadow-xl"
              >
                <div className="flex items-center gap-4">
                  {/* Thumbnail Portrait */}
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-[#0052FF]/30 shadow-md">
                    <PortraitImage
                      src={personality.portraitUrl}
                      alt={personality.name}
                      initials={getInitials(personality.name)}
                      aspectRatio="square"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-blue-300 mb-0.5 font-mono">
                      <span>{personality.category}</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="text-slate-400">{personality.nationality}</span>
                    </div>

                    <h4 className="font-display text-base sm:text-lg font-bold text-white group-hover:text-blue-200 transition-colors">
                      {personality.name}
                    </h4>

                    <p className="text-xs text-slate-400 italic">
                      {personality.profession}
                    </p>
                  </div>
                </div>

                {/* Right side metadata & actions */}
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-white/5">
                  <div className="text-right">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{formatDate(record.timestamp)}</span>
                    </div>

                    {record.txHash && (
                      <a
                        href={getBaseScanTxUrl(record.txHash)}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[11px] text-[#0052FF] hover:underline font-mono flex items-center gap-1 justify-end font-semibold mt-0.5"
                      >
                        <span>BaseScan Tx</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>

                  <span className="text-xs text-blue-300 group-hover:text-white font-semibold font-display">
                    View Dossier →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Personality Detail Modal */}
      <PersonalityDetailModal
        personality={selectedPersonality}
        onClose={() => setSelectedPersonality(null)}
      />
    </section>
  );
};
