import React, { useState, useEffect } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from './lib/wagmi';
import { IS_CONTRACT_CONFIGURED } from './config/contract';
import { recordVisitSession } from './lib/anonymousAnalytics';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { GallerySection } from './components/GallerySection';
import { EncountersHistory } from './components/EncountersHistory';
import { HowItWorksSection } from './components/HowItWorksSection';
import { RevealModal } from './components/RevealModal';
import { WalletModal } from './components/WalletModal';
import { ContractInfoModal } from './components/ContractInfoModal';
import { PrivacyStatsModal } from './components/PrivacyStatsModal';
import { Footer } from './components/Footer';
import { PERSONALITIES } from './data/personalities';
import { PortraitImage } from './components/PortraitImage';
import { getInitials } from './lib/utils';
import { ArrowRight, Compass, Shield, Sparkles } from 'lucide-react';

const queryClient = new QueryClient();

export function MainApp() {
  const [activeTab, setActiveTab] = useState<'home' | 'gallery' | 'history' | 'how-it-works'>('home');
  const [isRevealOpen, setIsRevealOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isContractOpen, setIsContractOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Initialize anonymous visitor session
  useEffect(() => {
    recordVisitSession();
  }, []);

  // Spotlight personalities: 4 iconic figures from diverse categories
  const spotlightPersonalities = [
    PERSONALITIES[0], // Albert Einstein
    PERSONALITIES[14], // Nelson Mandela
    PERSONALITIES[21], // Vincent van Gogh
    PERSONALITIES[40], // Muhammad Ali
  ];

  const handleEncounterSaved = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleActivityCleared = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#05070f] text-slate-100 flex flex-col font-sans-clean">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenWalletModal={() => setIsWalletOpen(true)}
        onOpenContractModal={() => setIsContractOpen(true)}
        onOpenPrivacyModal={() => setIsPrivacyOpen(true)}
        isContractConfigured={IS_CONTRACT_CONFIGURED}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div>
            <HeroSection
              onTriggerReveal={() => setIsRevealOpen(true)}
              onOpenContractModal={() => setIsContractOpen(true)}
              onOpenPrivacyModal={() => setIsPrivacyOpen(true)}
              isContractConfigured={IS_CONTRACT_CONFIGURED}
              totalEncountersCount={50}
            />

            {/* Spotlight Showcase of the 50 Lives */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-white/5">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                <div>
                  <p className="font-editorial text-amber-300 text-xs tracking-widest uppercase mb-1">
                    Echoes of Greatness
                  </p>
                  <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-white">
                    WHO WILL DESTINY CHOOSE?
                  </h2>
                </div>

                <button
                  onClick={() => {
                    setActiveTab('gallery');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-amber-300 hover:text-amber-200 transition-colors group cursor-pointer"
                >
                  <span>Explore all 50 lives in the Gallery</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* 4 Sample Portrait Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {spotlightPersonalities.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setActiveTab('gallery');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="group relative bg-[#090e1c] border border-white/10 hover:border-amber-400/40 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="relative overflow-hidden aspect-[3/4]">
                      <PortraitImage
                        src={item.portraitUrl}
                        alt={item.name}
                        initials={getInitials(item.name)}
                        aspectRatio="portrait"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#090e1c] via-transparent to-transparent opacity-90" />
                    </div>

                    <div className="p-3.5 space-y-1">
                      <span className="text-[10px] text-amber-400 font-medium block">
                        {item.category}
                      </span>
                      <h3 className="font-cinzel text-sm sm:text-base font-bold text-white group-hover:text-amber-200 line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-editorial italic line-clamp-1">
                        {item.profession}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Central Reveal Callout */}
              <div className="mt-14 p-6 sm:p-10 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-blue-900/10 border border-amber-500/20 text-center relative overflow-hidden">
                <div className="max-w-xl mx-auto space-y-4">
                  <span className="font-editorial italic text-amber-200 text-base sm:text-lg">
                    "Every click reveals a life."
                  </span>
                  <h3 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-white">
                    READY FOR YOUR ENCOUNTER?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Will you meet an ancient conqueror, a renaissance genius, a champion athlete, or a technological pioneer?
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => setIsRevealOpen(true)}
                      className="px-8 py-3.5 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 text-slate-950 font-cinzel text-xs font-bold uppercase tracking-widest rounded-lg hover:from-amber-200 hover:to-amber-400 shadow-xl cursor-pointer"
                    >
                      REVEAL MY DESTINY
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'gallery' && <GallerySection />}

        {activeTab === 'history' && (
          <EncountersHistory
            onTriggerReveal={() => setIsRevealOpen(true)}
            refreshTrigger={refreshTrigger}
            onOpenPrivacyModal={() => setIsPrivacyOpen(true)}
          />
        )}

        {activeTab === 'how-it-works' && (
          <HowItWorksSection
            onOpenContractModal={() => setIsContractOpen(true)}
            onTriggerReveal={() => setIsRevealOpen(true)}
            onOpenPrivacyModal={() => setIsPrivacyOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onSelectTab={setActiveTab}
        onOpenContractModal={() => setIsContractOpen(true)}
        onOpenPrivacyModal={() => setIsPrivacyOpen(true)}
      />

      {/* Reveal Modal */}
      <RevealModal
        isOpen={isRevealOpen}
        onClose={() => setIsRevealOpen(false)}
        onEncounterSaved={handleEncounterSaved}
        onOpenWalletModal={() => setIsWalletOpen(true)}
        onOpenContractModal={() => setIsContractOpen(true)}
      />

      {/* Wallet Connect / Manage Modal */}
      <WalletModal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
      />

      {/* Contract Specification & Architecture Modal */}
      <ContractInfoModal
        isOpen={isContractOpen}
        onClose={() => setIsContractOpen(false)}
      />

      {/* Privacy Charter & Anonymous Metrics Modal */}
      <PrivacyStatsModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        onActivityCleared={handleActivityCleared}
      />
    </div>
  );
}

export default function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <MainApp />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
