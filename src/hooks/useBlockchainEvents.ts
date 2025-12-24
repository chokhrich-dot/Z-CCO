import { useEffect, useCallback, useRef } from 'react';
import { ethers } from 'ethers';
import { ZAMA_CCO_ADDRESS, ZAMA_CCO_ABI } from '@/lib/web3/config';
import { toast } from '@/hooks/use-toast';

interface BlockchainEvent {
  type: 'EncryptedProfileSubmitted' | 'CreditScoreComputed' | 'DecryptionRequested';
  borrower: string;
  lender?: string;
  tier?: number;
  txHash: string;
  blockNumber: number;
}

interface UseBlockchainEventsOptions {
  onProfileSubmitted?: (borrower: string, txHash: string) => void;
  onCreditScoreComputed?: (borrower: string, tier: number, txHash: string) => void;
  onDecryptionRequested?: (borrower: string, lender: string, txHash: string) => void;
  showNotifications?: boolean;
}

export const useBlockchainEvents = (options: UseBlockchainEventsOptions = {}) => {
  const {
    onProfileSubmitted,
    onCreditScoreComputed,
    onDecryptionRequested,
    showNotifications = true,
  } = options;

  const contractRef = useRef<ethers.Contract | null>(null);
  const eventsRef = useRef<BlockchainEvent[]>([]);

  const setupEventListeners = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      console.log('No ethereum provider found');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(ZAMA_CCO_ADDRESS, ZAMA_CCO_ABI, provider);
      contractRef.current = contract;

      // Listen for EncryptedProfileSubmitted events
      contract.on('EncryptedProfileSubmitted', (borrower: string, event: any) => {
        const newEvent: BlockchainEvent = {
          type: 'EncryptedProfileSubmitted',
          borrower,
          txHash: event.log?.transactionHash || '',
          blockNumber: event.log?.blockNumber || 0,
        };
        eventsRef.current = [...eventsRef.current, newEvent];

        if (showNotifications) {
          toast({
            title: 'Profile Submitted',
            description: `Encrypted profile submitted by ${borrower.slice(0, 8)}...`,
          });
        }

        onProfileSubmitted?.(borrower, newEvent.txHash);
      });

      // Listen for CreditScoreComputed events
      contract.on('CreditScoreComputed', (borrower: string, tier: bigint, event: any) => {
        const tierNumber = Number(tier);
        const newEvent: BlockchainEvent = {
          type: 'CreditScoreComputed',
          borrower,
          tier: tierNumber,
          txHash: event.log?.transactionHash || '',
          blockNumber: event.log?.blockNumber || 0,
        };
        eventsRef.current = [...eventsRef.current, newEvent];

        if (showNotifications) {
          const tierLabels = ['Poor', 'Fair', 'Good', 'Excellent'];
          toast({
            title: 'Credit Score Computed',
            description: `Credit tier for ${borrower.slice(0, 8)}...: ${tierLabels[tierNumber] || 'Unknown'}`,
          });
        }

        onCreditScoreComputed?.(borrower, tierNumber, newEvent.txHash);
      });

      // Listen for DecryptionRequested events
      contract.on('DecryptionRequested', (borrower: string, lender: string, event: any) => {
        const newEvent: BlockchainEvent = {
          type: 'DecryptionRequested',
          borrower,
          lender,
          txHash: event.log?.transactionHash || '',
          blockNumber: event.log?.blockNumber || 0,
        };
        eventsRef.current = [...eventsRef.current, newEvent];

        if (showNotifications) {
          toast({
            title: 'Decryption Requested',
            description: `Lender ${lender.slice(0, 8)}... requested access to ${borrower.slice(0, 8)}...`,
          });
        }

        onDecryptionRequested?.(borrower, lender, newEvent.txHash);
      });

      console.log('Blockchain event listeners set up successfully');
    } catch (error) {
      console.error('Failed to set up event listeners:', error);
    }
  }, [onProfileSubmitted, onCreditScoreComputed, onDecryptionRequested, showNotifications]);

  const cleanup = useCallback(() => {
    if (contractRef.current) {
      contractRef.current.removeAllListeners();
      contractRef.current = null;
    }
  }, []);

  useEffect(() => {
    setupEventListeners();
    return cleanup;
  }, [setupEventListeners, cleanup]);

  return {
    events: eventsRef.current,
    setupEventListeners,
    cleanup,
  };
};
