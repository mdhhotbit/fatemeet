import { http, createConfig } from 'wagmi';
import { base } from 'wagmi/chains';
import { injected, coinbaseWallet, metaMask } from 'wagmi/connectors';
import { RPC_URL } from '../config/guestbook';

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    injected(), // Compatible with Rabby, MetaMask, and all EIP-1193 browser wallets
    metaMask(),
    coinbaseWallet({
      appName: 'BASE GUESTBOOK',
      preference: 'all',
    }),
  ],
  transports: {
    [base.id]: http(RPC_URL),
  },
});
