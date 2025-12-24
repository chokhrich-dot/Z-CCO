import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { History, Lock, Unlock, CheckCircle, Clock, ExternalLink, Award, RefreshCw } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { MatrixBackground } from '@/components/layout/MatrixBackground';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useWallet } from '@/contexts/WalletContext';
import { useBlockchainEvents } from '@/hooks/useBlockchainEvents';
import { 
  fetchAllTransactions, 
  getTransactionStats, 
  clearTransactionCache,
  type TransactionEvent 
} from '@/lib/web3/transactionService';

type FilterType = 'all' | 'profile_submit' | 'score_compute' | 'decryption_request' | 'reward_distributed';

const typeLabels: Record<TransactionEvent['type'], { label: string; icon: typeof Lock }> = {
  profile_submit: { label: 'Profile Submitted', icon: Lock },
  score_compute: { label: 'Score Computed', icon: CheckCircle },
  decryption_request: { label: 'Decryption Requested', icon: Unlock },
  reward_distributed: { label: 'Reward Distributed', icon: Award },
};

const statusStyles: Record<TransactionEvent['status'], string> = {
  pending: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  completed: 'bg-green-500/20 text-green-400 border-green-500/30',
  failed: 'bg-destructive/20 text-destructive border-destructive/30',
};

const TransactionHistory = () => {
  const { address, isConnected } = useWallet();
  const [transactions, setTransactions] = useState<TransactionEvent[]>([]);
  const [stats, setStats] = useState({ total: 0, submissions: 0, computations: 0, decryptions: 0, rewards: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Real-time event updates
  useBlockchainEvents({
    onProfileSubmitted: () => {
      refreshTransactions();
    },
    onDecryptionRequested: () => {
      refreshTransactions();
    },
    onCreditScoreComputed: () => {
      refreshTransactions();
    },
    onRewardDistributed: () => {
      refreshTransactions();
    },
    showNotifications: false,
  });

  const loadTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const [txs, txStats] = await Promise.all([
        fetchAllTransactions(address || undefined),
        getTransactionStats(address || undefined),
      ]);
      setTransactions(txs);
      setStats(txStats);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  const refreshTransactions = useCallback(async () => {
    setIsRefreshing(true);
    clearTransactionCache();
    try {
      const [txs, txStats] = await Promise.all([
        fetchAllTransactions(address || undefined, 0, 'latest', false),
        getTransactionStats(address || undefined),
      ]);
      setTransactions(txs);
      setStats(txStats);
    } catch (error) {
      console.error('Error refreshing transactions:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [address]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const filteredTransactions = filter === 'all' 
    ? transactions 
    : transactions.filter(tx => tx.type === filter);

  const paginatedTransactions = filteredTransactions.slice(0, page * ITEMS_PER_PAGE);
  const hasMore = paginatedTransactions.length < filteredTransactions.length;

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-background relative">
      <MatrixBackground />
      <Header />

      <main className="relative z-10 pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Transaction History
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {isConnected 
                ? 'View all on-chain transactions related to your encrypted data'
                : 'Connect your wallet to view your transaction history'}
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-3 items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant={filter === 'all' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => { setFilter('all'); setPage(1); }}
                    >
                      All ({stats.total})
                    </Button>
                    <Button 
                      variant={filter === 'profile_submit' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => { setFilter('profile_submit'); setPage(1); }}
                    >
                      <Lock className="w-3 h-3 mr-1" />
                      Submissions ({stats.submissions})
                    </Button>
                    <Button 
                      variant={filter === 'score_compute' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => { setFilter('score_compute'); setPage(1); }}
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Computations ({stats.computations})
                    </Button>
                    <Button 
                      variant={filter === 'decryption_request' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => { setFilter('decryption_request'); setPage(1); }}
                    >
                      <Unlock className="w-3 h-3 mr-1" />
                      Decryptions ({stats.decryptions})
                    </Button>
                    <Button 
                      variant={filter === 'reward_distributed' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => { setFilter('reward_distributed'); setPage(1); }}
                    >
                      <Award className="w-3 h-3 mr-1" />
                      Rewards ({stats.rewards})
                    </Button>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={refreshTransactions}
                    disabled={isRefreshing}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Transaction List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <History className="w-5 h-5 text-primary" />
                  Recent Transactions
                </CardTitle>
                <CardDescription>
                  All encrypted data operations logged on Sepolia testnet
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoading ? (
                    // Skeleton loading state
                    Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="p-4 bg-secondary/30 rounded-lg border border-border">
                        <div className="flex items-start gap-4">
                          <Skeleton className="w-10 h-10 rounded-lg" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-48" />
                            <Skeleton className="h-3 w-40" />
                          </div>
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                    ))
                  ) : paginatedTransactions.length > 0 ? (
                    paginatedTransactions.map((tx, index) => {
                      const TypeIcon = typeLabels[tx.type]?.icon || Lock;
                      return (
                        <motion.div
                          key={tx.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="p-4 bg-secondary/30 rounded-lg border border-border hover:border-primary/30 transition-all"
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <TypeIcon className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-foreground">
                                    {typeLabels[tx.type]?.label || tx.type}
                                  </span>
                                  <Badge className={statusStyles[tx.status]}>
                                    {tx.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                                    {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                                  </Badge>
                                </div>
                                <div className="text-sm text-muted-foreground space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span>From:</span>
                                    <span className="font-mono text-xs">
                                      {tx.from.slice(0, 10)}...{tx.from.slice(-6)}
                                    </span>
                                  </div>
                                  {tx.to && (
                                    <div className="flex items-center gap-2">
                                      <span>To:</span>
                                      <span className="font-mono text-xs">
                                        {tx.to.slice(0, 10)}...{tx.to.slice(-6)}
                                      </span>
                                    </div>
                                  )}
                                  {tx.dataType && (
                                    <div className="text-xs text-primary">
                                      Data: {tx.dataType}
                                    </div>
                                  )}
                                  {tx.tier && (
                                    <div className="text-xs text-primary">
                                      Tier: {tx.tier}
                                    </div>
                                  )}
                                  {tx.rewardAmount && (
                                    <div className="text-xs text-primary">
                                      Reward: {tx.rewardAmount} CCO
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                              <span className="text-xs text-muted-foreground">
                                {formatTimestamp(tx.timestamp)}
                              </span>
                              <a
                                href={`https://sepolia.etherscan.io/tx/${tx.txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs text-primary hover:underline font-mono"
                              >
                                {tx.txHash.slice(0, 10)}...
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No transactions found</p>
                      <p className="text-sm mt-1">
                        {isConnected 
                          ? 'Your transaction history will appear here' 
                          : 'Connect your wallet to view your history'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Load More */}
                {hasMore && !isLoading && (
                  <div className="mt-6 text-center">
                    <Button 
                      variant="outline" 
                      onClick={() => setPage(p => p + 1)}
                    >
                      Load More Transactions
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-4"
          >
            {[
              { label: 'Total', value: stats.total },
              { label: 'Submissions', value: stats.submissions },
              { label: 'Computations', value: stats.computations },
              { label: 'Decryptions', value: stats.decryptions },
              { label: 'Rewards', value: stats.rewards },
            ].map((stat) => (
              <Card key={stat.label} className="bg-card border-border">
                <CardContent className="pt-6 text-center">
                  <div className="text-2xl font-bold text-gradient mb-1">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default TransactionHistory;
