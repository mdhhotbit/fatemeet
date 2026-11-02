import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Eye,
  Compass,
  RotateCcw,
  Check,
  Trash2,
  Lock,
  Globe,
  Activity,
  UserX,
} from 'lucide-react';
import {
  getVisitorAnalytics,
  getOverallTrafficStats,
  clearAnonymousActivityHistory,
  VisitorAnalytics,
  OverallTrafficStats,
} from '../lib/anonymousAnalytics';

interface PrivacyStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivityCleared?: () => void;
}

export const PrivacyStatsModal: React.FC<PrivacyStatsModalProps> = ({
  isOpen,
  onClose,
  onActivityCleared,
}) => {
  const [visitorStats, setVisitorStats] = useState<VisitorAnalytics | null>(null);
  const [overallStats, setOverallStats] = useState<OverallTrafficStats | null>(null);
  const [clearedNotice, setClearedNotice] = useState(false);

  const refreshData = () => {
    setVisitorStats(getVisitorAnalytics());
    setOverallStats(getOverallTrafficStats());
  };

  useEffect(() => {
    if (isOpen) {
      refreshData();
      setClearedNotice(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClear = () => {
    if (window.confirm('Clear all your anonymous activity history and rotate your anonymous ID?')) {
      clearAnonymousActivityHistory();
      refreshData();
      setClearedNotice(true);
      if (onActivityCleared) onActivityCleared();
      setTimeout(() => setClearedNotice(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#090d1c] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-cinzel text-base sm:text-lg font-bold text-white">
                PRIVACY & ANONYMOUS METRICS
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Privacy Charter Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-blue-500/10 border border-amber-500/25 space-y-2">
            <div className="flex items-center gap-2 text-xs font-cinzel font-bold text-amber-200 uppercase tracking-wider">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Core Privacy Guarantee</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              LuckyFace is built on total user sovereignty. We never ask for names, phone numbers, email addresses, or contacts. We do not use Google Analytics, advertising pixels, or third-party behavioral trackers. Your IP address is never permanently stored or used for identification.
            </p>
          </div>

          {/* Your Anonymous Identity */}
          <div className="p-4 rounded-xl bg-slate-950 border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="uppercase tracking-wider font-semibold">Your Anonymous Browser ID</span>
              <span className="text-[11px] text-emerald-400 font-mono">100% Pseudonymous</span>
            </div>
            <div className="font-mono text-sm sm:text-base text-amber-200 bg-slate-900 p-2.5 rounded-lg border border-white/10 flex items-center justify-between">
              <span>{visitorStats?.anonymousId || 'anon_session'}</span>
              <span className="text-[11px] text-slate-500 font-sans">Stored locally only</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Your activity history is completely isolated in your browser and is never visible to any other visitor.
            </p>
          </div>

          {/* Your Personal Activity Stats */}
          <div className="space-y-3">
            <h4 className="font-cinzel text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              <span>Your Anonymous Activity (This Device)</span>
            </h4>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-white/5 text-center">
                <span className="font-cinzel text-xl sm:text-2xl font-bold text-white tabular-nums block">
                  {visitorStats?.visitCount ?? 1}
                </span>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider">
                  Visits
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-white/5 text-center">
                <span className="font-cinzel text-xl sm:text-2xl font-bold text-amber-200 tabular-nums block">
                  {visitorStats?.totalProfileViews ?? 0}
                </span>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider">
                  Profile Views
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-white/5 text-center">
                <span className="font-cinzel text-xl sm:text-2xl font-bold text-amber-400 tabular-nums block">
                  {visitorStats?.totalEncounters ?? 0}
                </span>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider">
                  Destiny Matches
                </span>
              </div>
            </div>
          </div>

          {/* Overall Website Traffic Statistics */}
          <div className="space-y-3 pt-2 border-t border-white/5">
            <h4 className="font-cinzel text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-400" />
              <span>Overall Traffic Statistics</span>
            </h4>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-white/5 text-center">
                <span className="font-cinzel text-lg sm:text-xl font-bold text-slate-200 tabular-nums block">
                  {(overallStats?.totalGlobalVisits ?? 1420).toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                  Total Site Visits
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-white/5 text-center">
                <span className="font-cinzel text-lg sm:text-xl font-bold text-blue-300 tabular-nums block">
                  {(overallStats?.totalGlobalEncounters ?? 856).toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                  Total Encounters
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-white/5 text-center">
                <span className="font-cinzel text-lg sm:text-xl font-bold text-amber-200 tabular-nums block">
                  {(overallStats?.totalGlobalProfileViews ?? 3280).toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                  Dossier Explores
                </span>
              </div>
            </div>
          </div>

          {/* Clear Activity Control */}
          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-rose-200 block">
                Clear Anonymous Activity
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Purges all local view counts, encounter records, and resets your anonymous ID.
              </p>
            </div>

            <button
              onClick={handleClear}
              className="px-4 py-2 bg-rose-900/60 hover:bg-rose-800 text-rose-100 border border-rose-500/30 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear My Activity</span>
            </button>
          </div>

          {clearedNotice && (
            <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>All anonymous history has been cleared and your ID has been rotated.</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-white/10 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg cursor-pointer transition-colors"
          >
            Close Privacy View
          </button>
        </div>
      </div>
    </div>
  );
};
