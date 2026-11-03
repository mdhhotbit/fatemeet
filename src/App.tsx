import React, { useState, useRef } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from './lib/wagmi';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { SignGuestbookSection } from './components/SignGuestbookSection';
import { MessagesSection } from './components/MessagesSection';
import { WalletModal } from './components/WalletModal';
import { Footer } from './components/Footer';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function GuestbookApp() {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [recentTxHash, setRecentTxHash] = useState<`0x${string}` | null>(null);
  const [totalMessages, setTotalMessages] = useState<number | null>(null);

  const formRef = useRef<HTMLDivElement | null>(null);

  const handleScrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleMessageSigned = (txHash?: `0x${string}`) => {
    if (txHash) {
      setRecentTxHash(txHash);
    }
    // Increment trigger to refresh message list from Base blockchain
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 font-sans-clean antialiased selection:bg-[#0052FF] selection:text-white">
      {/* Navigation */}
      <Navbar onOpenWalletModal={() => setIsWalletModalOpen(true)} />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          totalMessages={totalMessages}
          onScrollToForm={handleScrollToForm}
        />

        {/* Message Input & Signing Section */}
        <SignGuestbookSection
          onMessageSigned={handleMessageSigned}
          onOpenWalletModal={() => setIsWalletModalOpen(true)}
          formRef={formRef}
        />

        {/* Public Messages Section */}
        <MessagesSection
          refreshTrigger={refreshTrigger}
          recentTxHash={recentTxHash}
          onTotalMessagesUpdated={setTotalMessages}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Wallet Connection Modal */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <GuestbookApp />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
