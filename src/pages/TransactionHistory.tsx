import { motion } from 'framer-motion';
import { History, Lock, Unlock, CheckCircle, Clock, ExternalLink, Filter } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { MatrixBackground } from '@/components/layout/MatrixBackground';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Transaction {
  id: string;
  txHash: string;
  type: 'profile_submit' | 'score_compute' | 'decryption_request';
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  dataType?: string;
  from: string;
  to?: string;
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    txHash: '0x8f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3',
    type: 'profile_submit',
    status: 'completed',
    timestamp: '2024-01-15 14:32:21',
    dataType: 'Income, Collateral, Debt',
    from: '0x742d35Cc6634C0532925a3b844Bc9e7595f1a1f8',
  },
  {
    id: '2',
    txHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    type: 'score_compute',
    status: 'completed',
    timestamp: '2024-01-15 14:35:45',
    from: '0x742d35Cc6634C0532925a3b844Bc9e7595f1a1f8',
  },
  {
    id: '3',
    txHash: '0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e',
    type: 'decryption_request',
    status: 'completed',
    timestamp: '2024-01-15 14:40:12',
    from: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    to: '0x742d35Cc6634C0532925a3b844Bc9e7595f1a1f8',
  },
  {
    id: '4',
    txHash: '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c',
    type: 'profile_submit',
    status: 'pending',
    timestamp: '2024-01-15 15:00:00',
    dataType: 'Income, Collateral, Debt',
    from: '0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec',
  },
];

const typeLabels: Record<Transaction['type'], { label: string; icon: typeof Lock }> = {
  profile_submit: { label: 'Profile Submitted', icon: Lock },
  score_compute: { label: 'Score Computed', icon: CheckCircle },
  decryption_request: { label: 'Decryption Requested', icon: Unlock },
};

const statusStyles: Record<Transaction['status'], string> = {
  pending: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  completed: 'bg-green-500/20 text-green-400 border-green-500/30',
  failed: 'bg-destructive/20 text-destructive border-destructive/30',
};

const TransactionHistory = () => {
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
              View all on-chain transactions related to your encrypted data
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
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" size="sm" className="border-primary text-primary">
                    All Transactions
                  </Button>
                  <Button variant="outline" size="sm">
                    <Lock className="w-3 h-3 mr-1" />
                    Submissions
                  </Button>
                  <Button variant="outline" size="sm">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Computations
                  </Button>
                  <Button variant="outline" size="sm">
                    <Unlock className="w-3 h-3 mr-1" />
                    Decryptions
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
                  {mockTransactions.map((tx, index) => {
                    const TypeIcon = typeLabels[tx.type].icon;
                    return (
                      <motion.div
                        key={tx.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
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
                                  {typeLabels[tx.type].label}
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
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            <span className="text-xs text-muted-foreground">
                              {tx.timestamp}
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
                  })}
                </div>

                {/* Pagination hint */}
                <div className="mt-6 text-center">
                  <Button variant="outline" className="border-border">
                    Load More Transactions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { label: 'Total Transactions', value: '24' },
              { label: 'Profiles Submitted', value: '8' },
              { label: 'Scores Computed', value: '6' },
              { label: 'Decryptions', value: '10' },
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
