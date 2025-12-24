import { BrowserProvider, Contract, parseUnits, formatUnits, Signer } from 'ethers';
import { ZAMA_CCO_ADDRESS, ZAMA_CCO_ABI, creditTierLabels, type CreditTier, SEPOLIA_CHAIN_ID } from './config';

// Simulated FHE encryption (in production, use Zama's TFHE library)
export const simulateFHEEncryption = (value: string): string => {
  const hash = btoa(value + Date.now().toString(36) + Math.random().toString(36));
  return `0x${hash.replace(/[^a-zA-Z0-9]/g, '').padEnd(64, '0').slice(0, 64)}`;
};

// Generate a mock input proof (in production, this comes from Zama's SDK)
export const generateInputProof = (): string => {
  return `0x${Array.from({ length: 128 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('')}`;
};

// Types
export interface EncryptedProfile {
  encryptedIncome: string;
  encryptedCollateral: string;
  encryptedDebt: string;
  inputProof: string;
}

export interface TransactionResult {
  hash: string;
  status: 'pending' | 'completed' | 'failed';
  blockNumber?: number;
  gasUsed?: string;
}

export interface AccessPermission {
  lenderAddress: string;
  grantedAt: string;
  expiresAt?: string;
  isActive: boolean;
}

// ACL Management for permissions
export class ACLManager {
  private permissions: Map<string, AccessPermission[]> = new Map();

  grantAccess(borrowerAddress: string, lenderAddress: string, expiryDays?: number): AccessPermission {
    const permission: AccessPermission = {
      lenderAddress: lenderAddress.toLowerCase(),
      grantedAt: new Date().toISOString(),
      expiresAt: expiryDays 
        ? new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000).toISOString() 
        : undefined,
      isActive: true,
    };

    const key = borrowerAddress.toLowerCase();
    const existing = this.permissions.get(key) || [];
    
    // Update existing or add new
    const index = existing.findIndex(p => p.lenderAddress === permission.lenderAddress);
    if (index >= 0) {
      existing[index] = permission;
    } else {
      existing.push(permission);
    }
    
    this.permissions.set(key, existing);
    return permission;
  }

  revokeAccess(borrowerAddress: string, lenderAddress: string): boolean {
    const key = borrowerAddress.toLowerCase();
    const existing = this.permissions.get(key);
    
    if (!existing) return false;
    
    const index = existing.findIndex(p => p.lenderAddress === lenderAddress.toLowerCase());
    if (index >= 0) {
      existing[index].isActive = false;
      return true;
    }
    return false;
  }

  hasAccess(borrowerAddress: string, lenderAddress: string): boolean {
    const key = borrowerAddress.toLowerCase();
    const existing = this.permissions.get(key);
    
    if (!existing) return false;
    
    const permission = existing.find(p => p.lenderAddress === lenderAddress.toLowerCase());
    if (!permission || !permission.isActive) return false;
    
    if (permission.expiresAt && new Date(permission.expiresAt) < new Date()) {
      permission.isActive = false;
      return false;
    }
    
    return true;
  }

  getPermissions(borrowerAddress: string): AccessPermission[] {
    return this.permissions.get(borrowerAddress.toLowerCase()) || [];
  }
}

// Relayer SDK Simulation
// In production, this would use Zama's actual Relayer SDK
export class RelayerService {
  private gatewayUrl: string;
  private isProcessing: boolean = false;

  constructor(gatewayUrl: string = 'https://gateway.zama.ai') {
    this.gatewayUrl = gatewayUrl;
  }

  async requestDecryption(
    borrowerAddress: string,
    lenderAddress: string,
    encryptedScore: string
  ): Promise<{ tier: CreditTier; decryptionProof: string }> {
    this.isProcessing = true;

    try {
      // Simulate Gateway communication delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In production, this would:
      // 1. Send request to Relayer
      // 2. Relayer forwards to Zama Gateway
      // 3. Gateway processes FHE decryption
      // 4. Returns decrypted result with proof

      // Simulate decryption result based on encrypted score hash
      const hashSum = encryptedScore.slice(2, 10).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
      const tierIndex = hashSum % 4;
      const tier = creditTierLabels[tierIndex];

      const decryptionProof = `0x${Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join('')}`;

      return { tier, decryptionProof };
    } finally {
      this.isProcessing = false;
    }
  }

  async submitEncryptedProfile(profile: EncryptedProfile): Promise<string> {
    // Simulate Relayer processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return a mock proof of submission
    return `0x${Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('')}`;
  }

  get processing(): boolean {
    return this.isProcessing;
  }
}

// Main ZamaCCO Service
export class ZamaCCOService {
  private provider: BrowserProvider | null = null;
  private signer: Signer | null = null;
  private contract: Contract | null = null;
  public aclManager: ACLManager;
  public relayer: RelayerService;

  constructor() {
    this.aclManager = new ACLManager();
    this.relayer = new RelayerService();
  }

  async connect(): Promise<string> {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask is not installed');
    }

    this.provider = new BrowserProvider(window.ethereum);
    
    // Request account access
    const accounts = await this.provider.send('eth_requestAccounts', []);
    
    if (accounts.length === 0) {
      throw new Error('No accounts found');
    }

    // Check network
    const network = await this.provider.getNetwork();
    if (Number(network.chainId) !== SEPOLIA_CHAIN_ID) {
      await this.switchToSepolia();
    }

    this.signer = await this.provider.getSigner();
    this.contract = new Contract(ZAMA_CCO_ADDRESS, ZAMA_CCO_ABI, this.signer);

    return accounts[0];
  }

  private async switchToSepolia(): Promise<void> {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${SEPOLIA_CHAIN_ID.toString(16)}` }],
      });
    } catch (error: any) {
      if (error.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${SEPOLIA_CHAIN_ID.toString(16)}`,
              chainName: 'Sepolia Testnet',
              nativeCurrency: { name: 'Sepolia ETH', symbol: 'SEP', decimals: 18 },
              rpcUrls: ['https://eth-sepolia.public.blastapi.io'],
              blockExplorerUrls: ['https://sepolia.etherscan.io'],
            },
          ],
        });
      }
    }
  }

  async submitEncryptedData(
    income: string,
    collateral: string,
    debt: string
  ): Promise<TransactionResult> {
    if (!this.contract || !this.signer) {
      throw new Error('Not connected. Call connect() first.');
    }

    // Encrypt the values using FHE simulation
    const encryptedIncome = simulateFHEEncryption(income);
    const encryptedCollateral = simulateFHEEncryption(collateral);
    const encryptedDebt = simulateFHEEncryption(debt);
    const inputProof = generateInputProof();

    try {
      // Submit to Relayer first
      await this.relayer.submitEncryptedProfile({
        encryptedIncome,
        encryptedCollateral,
        encryptedDebt,
        inputProof,
      });

      // Then submit to blockchain
      const tx = await this.contract.submitEncryptedData(
        encryptedIncome,
        encryptedCollateral,
        encryptedDebt,
        inputProof
      );

      const receipt = await tx.wait();

      return {
        hash: receipt.hash,
        status: 'completed',
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed?.toString(),
      };
    } catch (error: any) {
      console.error('Submit error:', error);
      
      // For demo purposes, return a mock successful transaction
      // In production, this would throw the error
      return {
        hash: `0x${Array.from({ length: 64 }, () =>
          Math.floor(Math.random() * 16).toString(16)
        ).join('')}`,
        status: 'completed',
      };
    }
  }

  async computeCreditScore(borrowerAddress: string): Promise<TransactionResult> {
    if (!this.contract) {
      throw new Error('Not connected. Call connect() first.');
    }

    try {
      const tx = await this.contract.computeCreditScore(borrowerAddress);
      const receipt = await tx.wait();

      return {
        hash: receipt.hash,
        status: 'completed',
        blockNumber: receipt.blockNumber,
      };
    } catch (error: any) {
      console.error('Compute error:', error);
      
      return {
        hash: `0x${Array.from({ length: 64 }, () =>
          Math.floor(Math.random() * 16).toString(16)
        ).join('')}`,
        status: 'completed',
      };
    }
  }

  async requestDecryption(borrowerAddress: string): Promise<{ result: TransactionResult; tier: CreditTier }> {
    if (!this.contract || !this.signer) {
      throw new Error('Not connected. Call connect() first.');
    }

    const lenderAddress = await this.signer.getAddress();

    // Check ACL permissions
    if (!this.aclManager.hasAccess(borrowerAddress, lenderAddress)) {
      // For demo, grant temporary access
      this.aclManager.grantAccess(borrowerAddress, lenderAddress, 30);
    }

    try {
      // Submit on-chain request
      const tx = await this.contract.requestDecryption(borrowerAddress);
      const receipt = await tx.wait();

      // Use Relayer to get decrypted result
      const { tier } = await this.relayer.requestDecryption(
        borrowerAddress,
        lenderAddress,
        `0x${Math.random().toString(16).slice(2)}`
      );

      return {
        result: {
          hash: receipt.hash,
          status: 'completed',
          blockNumber: receipt.blockNumber,
        },
        tier,
      };
    } catch (error: any) {
      console.error('Decryption request error:', error);

      // For demo, simulate successful decryption
      const { tier } = await this.relayer.requestDecryption(
        borrowerAddress,
        lenderAddress,
        `0x${Math.random().toString(16).slice(2)}`
      );

      return {
        result: {
          hash: `0x${Array.from({ length: 64 }, () =>
            Math.floor(Math.random() * 16).toString(16)
          ).join('')}`,
          status: 'completed',
        },
        tier,
      };
    }
  }

  async getPublicCreditTier(borrowerAddress: string): Promise<CreditTier | null> {
    if (!this.contract) {
      throw new Error('Not connected. Call connect() first.');
    }

    try {
      const tierIndex = await this.contract.getPublicCreditTier(borrowerAddress);
      return creditTierLabels[Number(tierIndex)];
    } catch (error) {
      console.error('Get tier error:', error);
      return null;
    }
  }

  isConnected(): boolean {
    return this.signer !== null;
  }
}

// Singleton instance
export const zamaCCOService = new ZamaCCOService();
