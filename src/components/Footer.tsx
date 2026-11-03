import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        {/* Left Side: Brand & Required Copy */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <div className="w-5 h-5 rounded-full bg-[#0052FF] flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
            <span className="font-display font-black text-slate-900 text-sm tracking-tight">
              BASE GUESTBOOK
            </span>
          </div>

          <p className="text-xs text-slate-500 font-medium">
            Built on Base. Every message is written onchain.
          </p>
        </div>

        {/* Right Side: Network Info */}
        <div className="text-xs font-mono text-slate-400">
          Base Mainnet (Chain ID 8453)
        </div>
      </div>
    </footer>
  );
};
