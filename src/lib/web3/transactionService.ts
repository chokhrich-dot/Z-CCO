import { ethers } from 'ethers';
import { ZAMA_CCO_ADDRESS, ZAMA_CCO_ABI, creditTierLabels, type CreditTier, SEPOLIA_RPC_URL } from './config';

export interface TransactionEvent {
  id: string;
  txHash: string;
  type: 'profile_submit' | 'score_compute' | 'decryption_request' | 'reward_distributed';
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  blockNumber: number;
  from: string;
  to?: string;
  dataType?: string;
  tier?: CreditTier;
  rewardAmount?: string;
}

interface EventCache {
  events: TransactionEvent[];
  lastBlock: number;
  timestamp: number;
}

const CACHE_DURATION = 60000; // 1 minute
let eventCache: EventCache | null = null;

const getProvider = () => {
  return new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
};

const getContract = (provider: ethers.Provider) => {
  return new ethers.Contract(ZAMA_CCO_ADDRESS, ZAMA_CCO_ABI, provider);
};

export const fetchProfileSubmissions = async (
  userAddress?: string,
  fromBlock: number = 0,
  toBlock: number | 'latest' = 'latest'
): Promise<TransactionEvent[]> => {
  try {
    const provider = getProvider();
    const contract = getContract(provider);
    
    const filter = contract.filters.EncryptedProfileSubmitted(
      userAddress ? userAddress : null
    );
    
    const events = await contract.queryFilter(filter, fromBlock, toBlock);
    
    return Promise.all(events.map(async (event) => {
      const block = await event.getBlock();
      const log = event as ethers.EventLog;
      
      return {
        id: `${event.transactionHash}-${event.index}`,
        txHash: event.transactionHash,
        type: 'profile_submit' as const,
        status: 'completed' as const,
        timestamp: block ? new Date(block.timestamp * 1000).toISOString() : new Date().toISOString(),
        blockNumber: event.blockNumber,
        from: log.args[0] as string,
        dataType: 'Income, Collateral, Debt',
      };
    }));
  } catch (error) {
    console.error('Error fetching profile submissions:', error);
    return [];
  }
};

export const fetchDecryptionRequests = async (
  borrowerAddress?: string,
  lenderAddress?: string,
  fromBlock: number = 0,
  toBlock: number | 'latest' = 'latest'
): Promise<TransactionEvent[]> => {
  try {
    const provider = getProvider();
    const contract = getContract(provider);
    
    const filter = contract.filters.DecryptionRequested(
      borrowerAddress || null,
      lenderAddress || null
    );
    
    const events = await contract.queryFilter(filter, fromBlock, toBlock);
    
    return Promise.all(events.map(async (event) => {
      const block = await event.getBlock();
      const log = event as ethers.EventLog;
      
      return {
        id: `${event.transactionHash}-${event.index}`,
        txHash: event.transactionHash,
        type: 'decryption_request' as const,
        status: 'completed' as const,
        timestamp: block ? new Date(block.timestamp * 1000).toISOString() : new Date().toISOString(),
        blockNumber: event.blockNumber,
        from: log.args[1] as string, // lender
        to: log.args[0] as string, // borrower
      };
    }));
  } catch (error) {
    console.error('Error fetching decryption requests:', error);
    return [];
  }
};

export const fetchCreditScoreComputations = async (
  borrowerAddress?: string,
  fromBlock: number = 0,
  toBlock: number | 'latest' = 'latest'
): Promise<TransactionEvent[]> => {
  try {
    const provider = getProvider();
    const contract = getContract(provider);
    
    const filter = contract.filters.CreditScoreComputed(
      borrowerAddress || null
    );
    
    const events = await contract.queryFilter(filter, fromBlock, toBlock);
    
    return Promise.all(events.map(async (event) => {
      const block = await event.getBlock();
      const log = event as ethers.EventLog;
      const tierIndex = Number(log.args[1]);
      
      return {
        id: `${event.transactionHash}-${event.index}`,
        txHash: event.transactionHash,
        type: 'score_compute' as const,
        status: 'completed' as const,
        timestamp: block ? new Date(block.timestamp * 1000).toISOString() : new Date().toISOString(),
        blockNumber: event.blockNumber,
        from: log.args[0] as string,
        tier: creditTierLabels[tierIndex],
      };
    }));
  } catch (error) {
    console.error('Error fetching credit score computations:', error);
    return [];
  }
};

export const fetchRewardDistributions = async (
  userAddress?: string,
  fromBlock: number = 0,
  toBlock: number | 'latest' = 'latest'
): Promise<TransactionEvent[]> => {
  try {
    const provider = getProvider();
    const contract = getContract(provider);
    
    const filter = contract.filters.RewardDistributed(
      userAddress || null
    );
    
    const events = await contract.queryFilter(filter, fromBlock, toBlock);
    
    return Promise.all(events.map(async (event) => {
      const block = await event.getBlock();
      const log = event as ethers.EventLog;
      
      return {
        id: `${event.transactionHash}-${event.index}`,
        txHash: event.transactionHash,
        type: 'reward_distributed' as const,
        status: 'completed' as const,
        timestamp: block ? new Date(block.timestamp * 1000).toISOString() : new Date().toISOString(),
        blockNumber: event.blockNumber,
        from: log.args[0] as string,
        rewardAmount: ethers.formatUnits(log.args[1] as bigint, 18),
      };
    }));
  } catch (error) {
    console.error('Error fetching reward distributions:', error);
    return [];
  }
};

export const fetchAllTransactions = async (
  userAddress?: string,
  fromBlock: number = 0,
  toBlock: number | 'latest' = 'latest',
  useCache: boolean = true
): Promise<TransactionEvent[]> => {
  // Check cache
  if (useCache && eventCache && Date.now() - eventCache.timestamp < CACHE_DURATION) {
    let cachedEvents = eventCache.events;
    if (userAddress) {
      cachedEvents = cachedEvents.filter(
        e => e.from.toLowerCase() === userAddress.toLowerCase() ||
             e.to?.toLowerCase() === userAddress.toLowerCase()
      );
    }
    return cachedEvents;
  }

  try {
    const [submissions, decryptions, computations, rewards] = await Promise.all([
      fetchProfileSubmissions(userAddress, fromBlock, toBlock),
      fetchDecryptionRequests(userAddress, undefined, fromBlock, toBlock),
      fetchCreditScoreComputations(userAddress, fromBlock, toBlock),
      fetchRewardDistributions(userAddress, fromBlock, toBlock),
    ]);

    const allEvents = [...submissions, ...decryptions, ...computations, ...rewards];
    
    // Sort by timestamp descending
    allEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Update cache
    if (!userAddress) {
      const provider = getProvider();
      const latestBlock = await provider.getBlockNumber();
      eventCache = {
        events: allEvents,
        lastBlock: latestBlock,
        timestamp: Date.now(),
      };
    }

    return allEvents;
  } catch (error) {
    console.error('Error fetching all transactions:', error);
    return [];
  }
};

export const getTransactionStats = async (userAddress?: string): Promise<{
  total: number;
  submissions: number;
  computations: number;
  decryptions: number;
  rewards: number;
}> => {
  const transactions = await fetchAllTransactions(userAddress);
  
  return {
    total: transactions.length,
    submissions: transactions.filter(t => t.type === 'profile_submit').length,
    computations: transactions.filter(t => t.type === 'score_compute').length,
    decryptions: transactions.filter(t => t.type === 'decryption_request').length,
    rewards: transactions.filter(t => t.type === 'reward_distributed').length,
  };
};

export const clearTransactionCache = () => {
  eventCache = null;
};
