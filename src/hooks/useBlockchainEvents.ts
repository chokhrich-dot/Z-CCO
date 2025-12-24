import { useEffect, useCallback, useRef, useState } from 'react';
import { ethers } from 'ethers';
import { ZAMA_CCO_ADDRESS, ZAMA_CCO_ABI, creditTierLabels, SEPOLIA_RPC_URL } from '@/lib/web3/config';
import { toast } from '@/hooks/use-toast';

export interface BlockchainEvent {
  id: string;
  type: 'EncryptedProfileSubmitted' | 'CreditScoreComputed' | 'DecryptionRequested' | 'RewardDistributed';
  borrower: string;
  lender?: string;
  tier?: number;
  rewardAmount?: string;
  timestamp?: number;
  txHash: string;
  blockNumber: number;
}

interface UseBlockchainEventsOptions {
  onProfileSubmitted?: (borrower: string, txHash: string, timestamp?: number) => void;
  onCreditScoreComputed?: (borrower: string, tier: number, txHash: string) => void;
  onDecryptionRequested?: (borrower: string, lender: string, txHash: string, timestamp?: number) => void;
  onRewardDistributed?: (user: string, amount: string, txHash: string) => void;
  showNotifications?: boolean;
  autoReconnect?: boolean;
}

export const useBlockchainEvents = (options: UseBlockchainEventsOptions = {}) => {
  const {
    onProfileSubmitted,
    onCreditScoreComputed,
    onDecryptionRequested,
    onRewardDistributed,
    showNotifications = true,
    autoReconnect = true,
  } = options;

  const contractRef = useRef<ethers.Contract | null>(null);
  const providerRef = useRef<ethers.BrowserProvider | ethers.JsonRpcProvider | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [events, setEvents] = useState<BlockchainEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const addEvent = useCallback((event: BlockchainEvent) => {
    setEvents(prev => {
      // Prevent duplicates
      if (prev.some(e => e.id === event.id)) return prev;
      return [event, ...prev].slice(0, 100); // Keep last 100 events
    });
  }, []);

  const setupEventListeners = useCallback(async () => {
    try {
      // Try browser provider first, fall back to RPC
      let provider: ethers.BrowserProvider | ethers.JsonRpcProvider;
      
      if (typeof window !== 'undefined' && window.ethereum) {
        provider = new ethers.BrowserProvider(window.ethereum);
      } else {
        provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
      }
      
      providerRef.current = provider;
      const contract = new ethers.Contract(ZAMA_CCO_ADDRESS, ZAMA_CCO_ABI, provider);
      contractRef.current = contract;

      // Listen for EncryptedProfileSubmitted events
      contract.on('EncryptedProfileSubmitted', (borrower: string, encryptedData: string, timestamp: bigint, event: ethers.ContractEventPayload) => {
        const eventId = `${event.log?.transactionHash || ''}-profile-${Date.now()}`;
        const newEvent: BlockchainEvent = {
          id: eventId,
          type: 'EncryptedProfileSubmitted',
          borrower,
          timestamp: Number(timestamp),
          txHash: event.log?.transactionHash || '',
          blockNumber: event.log?.blockNumber || 0,
        };
        addEvent(newEvent);

        if (showNotifications) {
          toast({
            title: 'Profile Submitted',
            description: `Encrypted profile submitted by ${borrower.slice(0, 8)}...`,
          });
        }

        onProfileSubmitted?.(borrower, newEvent.txHash, Number(timestamp));
      });

      // Listen for CreditScoreComputed events
      contract.on('CreditScoreComputed', (borrower: string, tier: bigint, event: ethers.ContractEventPayload) => {
        const tierNumber = Number(tier);
        const eventId = `${event.log?.transactionHash || ''}-score-${Date.now()}`;
        const newEvent: BlockchainEvent = {
          id: eventId,
          type: 'CreditScoreComputed',
          borrower,
          tier: tierNumber,
          txHash: event.log?.transactionHash || '',
          blockNumber: event.log?.blockNumber || 0,
        };
        addEvent(newEvent);

        if (showNotifications) {
          toast({
            title: 'Credit Score Computed',
            description: `Credit tier for ${borrower.slice(0, 8)}...: ${creditTierLabels[tierNumber] || 'Unknown'}`,
          });
        }

        onCreditScoreComputed?.(borrower, tierNumber, newEvent.txHash);
      });

      // Listen for DecryptionRequested events
      contract.on('DecryptionRequested', (borrower: string, lender: string, timestamp: bigint, event: ethers.ContractEventPayload) => {
        const eventId = `${event.log?.transactionHash || ''}-decrypt-${Date.now()}`;
        const newEvent: BlockchainEvent = {
          id: eventId,
          type: 'DecryptionRequested',
          borrower,
          lender,
          timestamp: Number(timestamp),
          txHash: event.log?.transactionHash || '',
          blockNumber: event.log?.blockNumber || 0,
        };
        addEvent(newEvent);

        if (showNotifications) {
          toast({
            title: 'Decryption Requested',
            description: `Lender ${lender.slice(0, 8)}... requested access to ${borrower.slice(0, 8)}...`,
          });
        }

        onDecryptionRequested?.(borrower, lender, newEvent.txHash, Number(timestamp));
      });

      // Listen for RewardDistributed events
      contract.on('RewardDistributed', (user: string, rewardAmount: bigint, event: ethers.ContractEventPayload) => {
        const amountFormatted = ethers.formatUnits(rewardAmount, 18);
        const eventId = `${event.log?.transactionHash || ''}-reward-${Date.now()}`;
        const newEvent: BlockchainEvent = {
          id: eventId,
          type: 'RewardDistributed',
          borrower: user,
          rewardAmount: amountFormatted,
          txHash: event.log?.transactionHash || '',
          blockNumber: event.log?.blockNumber || 0,
        };
        addEvent(newEvent);

        if (showNotifications) {
          toast({
            title: 'Reward Distributed',
            description: `${amountFormatted} CCO tokens distributed to ${user.slice(0, 8)}...`,
          });
        }

        onRewardDistributed?.(user, amountFormatted, newEvent.txHash);
      });

      setIsConnected(true);
      console.log('Blockchain event listeners set up successfully');
    } catch (error) {
      console.error('Failed to set up event listeners:', error);
      setIsConnected(false);
      
      // Auto-reconnect after 5 seconds
      if (autoReconnect) {
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('Attempting to reconnect event listeners...');
          setupEventListeners();
        }, 5000);
      }
    }
  }, [onProfileSubmitted, onCreditScoreComputed, onDecryptionRequested, onRewardDistributed, showNotifications, autoReconnect, addEvent]);

  const cleanup = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (contractRef.current) {
      contractRef.current.removeAllListeners();
      contractRef.current = null;
    }
    providerRef.current = null;
    setIsConnected(false);
  }, []);

  useEffect(() => {
    setupEventListeners();
    return cleanup;
  }, [setupEventListeners, cleanup]);

  return {
    events,
    isConnected,
    setupEventListeners,
    cleanup,
  };
};
