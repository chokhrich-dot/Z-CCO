// ZamaCCO Contract Details
export const ZAMA_CCO_ADDRESS = '0x0a0656fe438602d20a1d6783dcee838e430ade9a' as const;

export const ZAMA_CCO_ABI = [
  {
    type: 'constructor',
    inputs: [{ name: '_config', type: 'address', internalType: 'contract ZamaEthereumConfig' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'submitEncryptedData',
    inputs: [
      { name: 'encryptedIncome', type: 'bytes32', internalType: 'externalEuint32' },
      { name: 'encryptedCollateral', type: 'bytes32', internalType: 'externalEuint32' },
      { name: 'encryptedDebt', type: 'bytes32', internalType: 'externalEuint32' },
      { name: 'inputProof', type: 'bytes', internalType: 'bytes' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'computeCreditScore',
    inputs: [{ name: 'borrower', type: 'address', internalType: 'address' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'requestDecryption',
    inputs: [{ name: 'borrower', type: 'address', internalType: 'address' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getPublicCreditTier',
    inputs: [{ name: 'borrower', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint8', internalType: 'enum ZamaCCO.CreditTier' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'distributeReward',
    inputs: [
      { name: 'user', type: 'address', internalType: 'address' },
      { name: 'rewardAmount', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    name: 'EncryptedProfileSubmitted',
    inputs: [
      { name: 'borrower', type: 'address', indexed: true, internalType: 'address' },
      { name: 'encryptedData', type: 'string', indexed: false, internalType: 'string' },
      { name: 'timestamp', type: 'uint256', indexed: false, internalType: 'uint256' },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'CreditScoreComputed',
    inputs: [
      { name: 'borrower', type: 'address', indexed: true, internalType: 'address' },
      { name: 'tier', type: 'uint8', indexed: false, internalType: 'enum ZamaCCO.CreditTier' },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'DecryptionRequested',
    inputs: [
      { name: 'borrower', type: 'address', indexed: true, internalType: 'address' },
      { name: 'lender', type: 'address', indexed: true, internalType: 'address' },
      { name: 'timestamp', type: 'uint256', indexed: false, internalType: 'uint256' },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'RewardDistributed',
    inputs: [
      { name: 'user', type: 'address', indexed: true, internalType: 'address' },
      { name: 'rewardAmount', type: 'uint256', indexed: false, internalType: 'uint256' },
    ],
    anonymous: false,
  },
] as const;

export const creditTierLabels = ['Poor', 'Fair', 'Good', 'Excellent'] as const;
export type CreditTier = (typeof creditTierLabels)[number];

// Sepolia chain config
export const SEPOLIA_CHAIN_ID = 11155111;
export const SEPOLIA_RPC_URL = 'https://eth-sepolia.public.blastapi.io';
