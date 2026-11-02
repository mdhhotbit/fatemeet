/**
 * LuckyFace - Base Mainnet Smart Contract Configuration
 * 
 * Target Network: Base Mainnet
 * Chain ID: 8453
 * Native Currency: ETH
 * 
 * Smart Contract Specification:
 * - Contract Name: LuckyFace
 * - Function Name: gm()
 * - Function Signature: gm()
 * - Parameters: None
 * - Payable: No
 * - Users pay ONLY standard Base network gas (0 ETH transferred).
 * - Zero platform fees, zero token transfers.
 * - Privacy: Character IDs and user details remain strictly off-chain.
 */

export const BASE_CHAIN_ID = 8453;
export const BASESCAN_URL = 'https://basescan.org';

export const CONTRACT_NAME = 'LuckyFace';
export const CONTRACT_FUNCTION_NAME = 'gm';

/**
 * ==============================================================================
 * CLEARLY IDENTIFIABLE CONTRACT ADDRESS VARIABLE
 * Base Mainnet (Chain ID 8453)
 * 
 * Replace this placeholder with your deployed Base Mainnet contract address,
 * or configure via the in-app Contract Deployment modal or VITE_LUCKYFACE_CONTRACT_ADDRESS.
 * Do not invent or hardcode a fake contract address.
 * ==============================================================================
 */
export const LUCKYFACE_CONTRACT_ADDRESS: `0x${string}` | '' =
  ((import.meta.env?.VITE_LUCKYFACE_CONTRACT_ADDRESS as string) ||
   (typeof window !== 'undefined' ? localStorage.getItem('luckyface_contract_address') || '' : '') ||
   '') as `0x${string}` | '';

const STORAGE_CONTRACT_KEY = 'luckyface_contract_address';

/**
 * Retrieves the active contract address from configuration or localStorage.
 */
export function getStoredContractAddress(): `0x${string}` | '' {
  // 1. Direct configuration variable check
  if (LUCKYFACE_CONTRACT_ADDRESS && LUCKYFACE_CONTRACT_ADDRESS.startsWith('0x') && LUCKYFACE_CONTRACT_ADDRESS.length === 42) {
    return LUCKYFACE_CONTRACT_ADDRESS;
  }

  // 2. Browser storage check (configured via deployment guide)
  try {
    const custom = localStorage.getItem(STORAGE_CONTRACT_KEY);
    if (custom && custom.startsWith('0x') && custom.length === 42) {
      return custom as `0x${string}`;
    }
  } catch {
    // localStorage not accessible
  }

  // 3. Fallback placeholder
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

/**
 * Verifies if a valid Base Mainnet contract address is configured.
 */
export function isContractConfigured(): boolean {
  const addr = getStoredContractAddress();
  return Boolean(addr && addr.startsWith('0x') && addr.length === 42);
}

// Aliases for compatibility
export const CONTRACT_ADDRESS: `0x${string}` | '' = getStoredContractAddress();
export const IS_CONTRACT_CONFIGURED = isContractConfigured();

/**
 * Smart Contract ABI for LuckyFace
 * Function: gm() - nonpayable, zero arguments, zero outputs
 */
export const LUCKYFACE_ABI = [
  {
    type: 'function',
    name: 'gm',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [],
  },
  {
    type: 'event',
    name: 'GM',
    inputs: [
      {
        name: 'sender',
        type: 'address',
        indexed: true,
        internalType: 'address',
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

// Default export alias
export const CONTRACT_ABI = LUCKYFACE_ABI;

/**
 * Production-ready Solidity Smart Contract for Base Mainnet.
 * 
 * Deployment parameters:
 * - Network: Base Mainnet (Chain ID 8453)
 * - Compiler: Solidity ^0.8.20
 * - EVM Version: Cancun / Shanghai
 * - Gas Cost per Selection: ~24,000 gas units (< $0.0005 on Base)
 * - Platform Fee: 0 ETH (Zero cut, strictly gas only)
 */
export const SOLIDITY_CONTRACT_CODE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title LuckyFace
 * @notice Lightweight on-chain interaction for character reveal on Base Mainnet (Chain ID 8453).
 *
 * Specifications:
 * - Contract Name: LuckyFace
 * - Function: gm()
 * - Parameters: None
 * - Payable: No
 *
 * Guarantees:
 * 1. Zero Platform Fees: Users pay ONLY standard Base network gas (0 ETH transferred).
 * 2. Privacy-First: Character IDs and personal selection history are NOT stored on-chain.
 * 3. Gas-Optimized: Single lightweight event emission (<25,000 gas units on Base).
 * 4. Transparent: No owner permissions, no token transfers, no contract pauses.
 */
contract LuckyFace {
    // Event emitted upon successful gm call
    event GM(address indexed sender, uint256 timestamp);

    /**
     * @notice Lightweight interaction to trigger personality reveal.
     * Consumes minimal gas (<25,000 gas units on Base Mainnet).
     */
    function gm() external {
        emit GM(msg.sender, block.timestamp);
    }
}
`;
