/**
 * BASE GUESTBOOK — Smart Contract Configuration
 * 
 * Target: Base Mainnet
 * Chain ID: 8453
 * RPC URL: https://mainnet.base.org
 * Block Explorer: https://basescan.org
 * Contract Address: 0x829AF74F043bf274BAd0472FFE2113a4C33c7c1A
 */

export const BASE_CHAIN_ID = 8453;
export const CONTRACT_ADDRESS = '0x829AF74F043bf274BAd0472FFE2113a4C33c7c1A' as const;
export const RPC_URL = 'https://mainnet.base.org';
export const BASESCAN_URL = 'https://basescan.org';
export const CONTRACT_EXPLORER_URL = `https://basescan.org/address/${CONTRACT_ADDRESS}`;

export const MAX_MESSAGE_BYTES = 280;
export const PAGE_SIZE = 20;

export const guestbookAbi = [
  {
    type: 'function',
    name: 'MAX_MESSAGE_LENGTH',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'signGuestbook',
    stateMutability: 'nonpayable',
    inputs: [{ name: '_content', type: 'string' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'getMessage',
    stateMutability: 'view',
    inputs: [{ name: '_id', type: 'uint256' }],
    outputs: [
      { name: 'sender', type: 'address' },
      { name: 'content', type: 'string' },
      { name: 'timestamp', type: 'uint256' },
    ],
  },
  {
    type: 'function',
    name: 'getTotalMessages',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'getMessages',
    stateMutability: 'view',
    inputs: [
      { name: '_start', type: 'uint256' },
      { name: '_count', type: 'uint256' },
    ],
    outputs: [
      {
        name: 'result',
        type: 'tuple[]',
        components: [
          { name: 'sender', type: 'address' },
          { name: 'content', type: 'string' },
          { name: 'timestamp', type: 'uint256' },
        ],
      },
    ],
  },
  {
    type: 'event',
    name: 'NewMessage',
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'sender',
        type: 'address',
      },
      {
        indexed: true,
        name: 'messageId',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'content',
        type: 'string',
      },
      {
        indexed: false,
        name: 'timestamp',
        type: 'uint256',
      },
    ],
  },
] as const;

export const GUESTBOOK_ABI = guestbookAbi;
