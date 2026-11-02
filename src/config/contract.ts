/**
 * FATE MEET - Smart Contract Configuration
 * 
 * Target: Base Mainnet
 * Chain ID: 8453
 * 
 * PHASE 1 STATUS:
 * CONTRACT_ADDRESS is intentionally an empty placeholder ("").
 * The app operates in transparent Demo Mode until a contract is deployed in Phase 2.
 * 
 * In Phase 2:
 * 1. Open Remix IDE (https://remix.ethereum.org)
 * 2. Paste the provided SOLIDITY_CONTRACT_CODE below
 * 3. Deploy to Base Mainnet (Chain ID 8453) using Injected Provider (MetaMask/Rabby/Coinbase)
 * 4. Paste the deployed address into VITE_FATE_MEET_CONTRACT_ADDRESS in .env or below.
 */

export const BASE_CHAIN_ID = 8453;

// Set via environment variable or directly update here once deployed in Phase 2
export const CONTRACT_ADDRESS: `0x${string}` | '' =
  (import.meta.env?.VITE_FATE_MEET_CONTRACT_ADDRESS as `0x${string}`) || '';

export const IS_CONTRACT_CONFIGURED = Boolean(
  CONTRACT_ADDRESS && CONTRACT_ADDRESS.startsWith('0x') && CONTRACT_ADDRESS.length === 42
);

export const BASESCAN_URL = 'https://basescan.org';

/**
 * Proposed Smart Contract ABI
 * Includes reveal(), getLastEncounter(), getEncounterCount(), totalEncounters(),
 * and the EncounterRevealed event.
 */
export const CONTRACT_ABI = [
  {
    type: 'function',
    name: 'reveal',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [
      {
        name: 'personalityId',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'function',
    name: 'getLastEncounter',
    stateMutability: 'view',
    inputs: [
      {
        name: 'user',
        type: 'address',
        internalType: 'address',
      },
    ],
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
    name: 'getEncounterCount',
    stateMutability: 'view',
    inputs: [
      {
        name: 'user',
        type: 'address',
        internalType: 'address',
      },
    ],
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
    name: 'totalEncounters',
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
 * Complete, gas-efficient Solidity Contract for Phase 2 Deployment on Base Mainnet.
 * Inexpensive on-chain pseudorandomness using block parameters, sender address, and nonce.
 * Note: Documented honest pseudorandomness; does not claim cryptographic VRF security.
 */
export const SOLIDITY_CONTRACT_CODE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title FateMeet
 * @notice Interactive historic discovery on Base Mainnet.
 * @dev Exactly 50 personalities (IDs 1 through 50).
 * Uses inexpensive on-chain pseudorandomness suitable for social discovery.
 * No fees, no subscriptions, no owner privileges, and minimal gas consumption.
 */
contract FateMeet {
    uint256 public constant TOTAL_PERSONALITIES = 50;

    // Total encounters across the entire network
    uint256 public totalEncounters;

    // User address => total number of encounters
    mapping(address => uint256) public userEncounterCount;

    // User address => latest personalityId revealed (1 to 50)
    mapping(address => uint256) public lastEncounterOf;

    // Event emitted when a personality is revealed
    event EncounterRevealed(
        address indexed user,
        uint256 personalityId,
        uint256 timestamp
    );

    /**
     * @notice Reveals a randomly selected personality ID between 1 and 50.
     * @return personalityId The assigned personality ID (1-50).
     */
    function reveal() external returns (uint256 personalityId) {
        // Inexpensive on-chain pseudorandomness
        // Note: Suitable for discovery games; not cryptographically manipulation-proof.
        uint256 randomHash = uint256(
            keccak256(
                abi.encodePacked(
                    block.prevrandao,
                    block.timestamp,
                    msg.sender,
                    totalEncounters,
                    userEncounterCount[msg.sender]
                )
            )
        );

        // Map to 1..50
        personalityId = (randomHash % TOTAL_PERSONALITIES) + 1;

        totalEncounters += 1;
        userEncounterCount[msg.sender] += 1;
        lastEncounterOf[msg.sender] = personalityId;

        emit EncounterRevealed(msg.sender, personalityId, block.timestamp);
    }

    /**
     * @notice Returns the last personality ID encountered by a user.
     */
    function getLastEncounter(address user) external view returns (uint256) {
        return lastEncounterOf[user];
    }

    /**
     * @notice Returns how many encounters a user has completed.
     */
    function getEncounterCount(address user) external view returns (uint256) {
        return userEncounterCount[user];
    }
}
`;
