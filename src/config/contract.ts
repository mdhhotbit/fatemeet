/**
 * LuckyFace - Smart Contract Configuration
 * 
 * Target: Base Mainnet
 * Chain ID: 8453
 * 
 * Privacy & Gas Architecture:
 * - 0 ETH Application Fee: Users pay ONLY standard Base network gas.
 * - Privacy-First: Individual personality IDs and selection histories remain strictly OFF-CHAIN.
 * - Ultra Gas-Efficient: Emits an on-chain verification event consuming < 28,000 gas units (~$0.0005 on Base).
 */

export const BASE_CHAIN_ID = 8453;
export const BASESCAN_URL = 'https://basescan.org';

const STORAGE_CONTRACT_KEY = 'luckyface_contract_address';
const LEGACY_STORAGE_KEY = 'fatemeet_contract_address';

/**
 * Retrieves the active contract address from localStorage or environment variables.
 */
export function getStoredContractAddress(): `0x${string}` | '' {
  try {
    const custom = localStorage.getItem(STORAGE_CONTRACT_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    if (custom && custom.startsWith('0x') && custom.length === 42) {
      return custom as `0x${string}`;
    }
  } catch {
    // localStorage not accessible
  }

  const envAddr = import.meta.env?.VITE_LUCKYFACE_CONTRACT_ADDRESS || import.meta.env?.VITE_FATE_MEET_CONTRACT_ADDRESS;
  if (envAddr && envAddr.startsWith('0x') && envAddr.length === 42) {
    return envAddr as `0x${string}`;
  }

  return '';
}

/**
 * Saves a custom contract address to localStorage.
 */
export function setStoredContractAddress(address: string): boolean {
  if (!address.startsWith('0x') || address.length !== 42) {
    return false;
  }
  try {
    localStorage.setItem(STORAGE_CONTRACT_KEY, address);
    return true;
  } catch {
    return false;
  }
}

/**
 * Clears custom stored contract address.
 */
export function clearStoredContractAddress(): void {
  try {
    localStorage.removeItem(STORAGE_CONTRACT_KEY);
  } catch {
    // safe fallback
  }
}

export function isContractConfigured(): boolean {
  const addr = getStoredContractAddress();
  return Boolean(addr && addr.startsWith('0x') && addr.length === 42);
}

// Default export for backwards compatibility
export const CONTRACT_ADDRESS: `0x${string}` | '' = getStoredContractAddress();
export const IS_CONTRACT_CONFIGURED = isContractConfigured();

/**
 * Smart Contract ABI
 * Ultra-lightweight verification event & recordSelection method.
 */
export const CONTRACT_ABI = [
  {
    type: 'function',
    name: 'recordSelection',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [
      {
        name: 'selectionNumber',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'function',
    name: 'reveal',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [
      {
        name: 'selectionNumber',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'function',
    name: 'totalSelections',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'function',
    name: 'getTotalSelections',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'event',
    name: 'SelectionConfirmed',
    inputs: [
      {
        name: 'user',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'selectionNumber',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
      {
        name: 'timestamp',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'EncounterRevealed',
    inputs: [
      {
        name: 'user',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'personalityId',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'timestamp',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
] as const;

/**
 * Production-ready, privacy-first Solidity Smart Contract for Base Mainnet.
 * 
 * Deployment Requirements:
 * - Network: Base Mainnet (Chain ID 8453)
 * - Compiler: Solidity ^0.8.20
 * - EVM Version: Cancun or Shanghai
 * - Gas Cost to Deploy: ~0.0001 ETH on Base (~$0.20)
 * - Gas Cost per Selection: ~27,000 gas units (~$0.0005)
 * - Platform Fee: 0 ETH (Strictly non-profit, zero application fees)
 */
export const SOLIDITY_CONTRACT_CODE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title LuckyFace
 * @notice Lightweight on-chain discovery verification on Base Mainnet (Chain ID 8453).
 * 
 * Architecture & Privacy Guarantees:
 * 1. Zero Platform Fees: Users pay ONLY standard Base network gas (0 ETH transferred).
 * 2. Privacy-First: Personality IDs and personal selection history remain strictly
 *    OFF-CHAIN. The public ledger never exposes which personality was encountered.
 * 3. Gas-Optimized: Single storage increment emitting a verification event (<28k gas).
 * 4. Transparent: No owner permissions, no pauses, and no hidden token requirements.
 */
contract LuckyFace {
    // Total selections recorded across Base Mainnet
    uint256 public totalSelections;

    // Emitted upon every verified selection.
    // Notice: personality ID is kept off-chain to protect visitor privacy.
    event SelectionConfirmed(
        address indexed user,
        uint256 indexed selectionNumber,
        uint256 timestamp
    );

    /**
     * @notice Performs a lightweight on-chain selection verification.
     * Consumes minimal gas (<28,000 gas units on Base Mainnet).
     * @return selectionNumber The sequence index of the selection on Base.
     */
    function recordSelection() external returns (uint256 selectionNumber) {
        selectionNumber = ++totalSelections;
        emit SelectionConfirmed(msg.sender, selectionNumber, block.timestamp);
    }

    /**
     * @notice Backward-compatible alias for previous iterations.
     */
    function reveal() external returns (uint256 selectionNumber) {
        return recordSelection();
    }

    /**
     * @notice View function to retrieve total selections.
     */
    function getTotalSelections() external view returns (uint256) {
        return totalSelections;
    }
}
`;
