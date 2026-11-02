import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { History, Sparkles, Trash2, ExternalLink, Calendar, Compass, Shield } from 'lucide-react';
import { EncounterRecord } from '../types';
import {
  getDemoEncounters,
  clearDemoEncounters,
  getChainEncounters,
} from '../lib/encountersStorage';
import { getPersonalityById } from '../lib/random';
import { formatDate, getInitials } from '../lib/utils';
import { getBaseScanTxUrl, shortenAddress } from '../lib/blockchain';
import { PortraitImage } from './PortraitImage';
import { PersonalityDetailModal } from './PersonalityDetailModal';
import { Personality } from '../types';

interface EncountersHistoryProps {
  onTriggerReveal: () => void;
  refreshTrigger: number;
}

export const EncountersHistory: React.FC<EncountersHistoryProps> = ({
  onTriggerReveal,
  refreshTrigger,
}) => {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<'demo' | 'chain'>('demo');
  const [demoRecords, setDemoRecords] = useState<EncounterRecord[]>([]);
  const [chainRecords, setChainRecords] = useState<EncounterRecord[]>([]);
  const [selectedPersonality, setSelectedPersonality] = useState<Personality | null>(null);

  useEffect(() => {
    setDemoRecords(getDemoEncounters());
    if (address) {
      setChainRecords(getChainEncounters(address));
      // If user has blockchain encounters, default to chain tab
      const userChain = getChainEncounters(address);
      if (userChain.length > 0) {
        setActiveTab('chain');
      }
    }
  }, [address, refreshTrigger]);

  const handleClearDemo = () => {
    if (window.confirm('Clear all demo encounter history?')) {
      clearDemoEncounters();
      setDemoRecords([]);
    }
  };

  const recordsToShow = activeTab === 'demo' ? demoRecords : chainRecords;

  // Calculate unique personalities met
  const uniquePersonalityCount = new Set(recordsToShow.map((r) => r.personalityId)).size;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <p className="font-editorial text-amber-300 text-sm tracking-widest uppercase mb-2">
          Personal Destiny Chronicle
        </p>
        <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
          MY ENCOUNTERS
        </h2>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Review your journey through history. Each encounter preserves a fleeting collision of minds.
        </p>
      </div>

      {/* History Mode Tabs */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="flex p-1 bg-slate-950/80 border border-white/10 rounded-xl">
          <button
            onClick={() => setActiveTab('demo')}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'demo'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>DEMO HISTORY ({demoRecords.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('chain')}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'chain'
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-blue-300" />
            <span>BLOCKCHAIN ON-CHAIN ({chainRecords.length})</span>
          </button>
        </div>
      </div>

      {/* Mode Banner / Disclaimer */}
      {activeTab === 'demo' ? (
        <div className="flex flex-col sm:flex-row items-center justify-between p-3.5 mb-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 max-w-3xl mx-auto gap-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-bold uppercase text-[10px]">
              DEMO HISTORY
            </span>
            <span>Recorded locally in browser. No gas or blockchain transactions used.</span>
          </div>
          {demoRecords.length > 0 && (
            <button
              onClick={handleClearDemo}
              className="text-xs text-rose-300 hover:text-rose-200 flex items-center gap-1 shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Demo History</span>
            </button>
          )}
        </div>
      ) : (
        <div className="p-3.5 mb-8 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs text-blue-200/90 max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0052FF]" />
            <span>
              {isConnected && address
                ? `Tracking on-chain encounters for ${shortenAddress(address)} on Base Mainnet.`
                : 'Connect your EVM wallet to view your confirmed Base blockchain encounters.'}
            </span>
          </div>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-10">
        <div className="p-4 rounded-xl bg-slate-900/50 border border-white/5 text-center">
          <p className="font-cinzel text-2xl sm:text-3xl font-bold text-amber-300 tabular-nums">
            {recordsToShow.length}
          </p>
          <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Total Encounters</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/50 border border-white/5 text-center">
          <p className="font-cinzel text-2xl sm:text-3xl font-bold text-slate-200 tabular-nums">
            {uniquePersonalityCount} / 50
          </p>
          <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Unique Personalities</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/50 border border-white/5 text-center">
          <p className="font-cinzel text-base sm:text-lg font-bold text-slate-200 line-clamp-1">
            {recordsToShow.length > 0
              ? getPersonalityById(recordsToShow[0].personalityId)?.name || 'None'
              : 'None'}
          </p>
          <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Latest Encounter</p>
        </div>
      </div>

      {/* Empty State */}
      {recordsToShow.length === 0 ? (
        <div className="text-center py-16 bg-slate-950/50 border border-white/5 rounded-2xl max-w-xl mx-auto px-6">
          <Compass className="w-12 h-12 text-amber-400/50 mx-auto mb-4 animate-spin-slow" />
          <h3 className="font-cinzel text-xl font-bold text-white mb-2">No Encounters Yet</h3>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            {activeTab === 'demo'
              ? 'Press REVEAL MY DESTINY to experience your first historical encounter in Demo Mode.'
              : 'Connect your wallet and complete an on-chain reveal to record your first Base transaction encounter.'}
          </p>
          <button
            onClick={onTriggerReveal}
            className="px-6 py-3 bg-gradient-to-r from-amber-300 to-amber-500 text-slate-950 font-cinzel text-xs font-bold uppercase tracking-wider rounded-lg hover:from-amber-200 hover:to-amber-400 cursor-pointer shadow-lg shadow-amber-500/10"
          >
            REVEAL MY DESTINY
          </button>
        </div>
      ) : (
        /* List of Encounter Cards */
        <div className="space-y-3 max-w-4xl mx-auto">
          {recordsToShow.map((record) => {
            const personality = getPersonalityById(record.personalityId);
            if (!personality) return null;

            return (
              <div
                key={record.id}
                onClick={() => setSelectedPersonality(personality)}
                className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-[#090e1c] border border-white/10 hover:border-amber-400/40 rounded-xl transition-all cursor-pointer gap-4"
              >
                <div className="flex items-center gap-4">
                  {/* Thumbnail Portrait */}
                  <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-amber-500/20">
                    <PortraitImage
                      src={personality.portraitUrl}
                      alt={personality.name}
                      initials={getInitials(personality.name)}
                      aspectRatio="square"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-amber-300/80 mb-0.5">
                      <span>{personality.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{personality.nationality}</span>
                    </div>

                    <h4 className="font-cinzel text-base sm:text-lg font-bold text-white group-hover:text-amber-200 transition-colors">
                      {personality.name}
                    </h4>

                    <p className="text-xs text-slate-400 font-editorial italic">
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
                        className="text-[11px] text-blue-400 hover:text-blue-300 font-mono flex items-center gap-1 justify-end underline mt-0.5"
                      >
                        <span>BaseScan Tx</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>

                  <span className="text-xs text-amber-300/70 group-hover:text-amber-200 font-medium">
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
