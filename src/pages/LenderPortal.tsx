import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Users, Eye, Lock, Unlock, Search, Shield, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { MatrixBackground } from '@/components/layout/MatrixBackground';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { creditTierLabels, type CreditTier } from '@/lib/web3/config';
import { Badge } from '@/components/ui/badge';
import { RelayerService, ACLManager } from '@/lib/web3/zamaService';
import { TransactionModal, type TransactionPhase } from '@/components/modals/TransactionModal';
import { useBlockchainEvents } from '@/hooks/useBlockchainEvents';
import { SkeletonTransaction } from '@/components/ui/skeleton';

interface BorrowerProfile {
  address: string;
  hasProfile: boolean;
  tier: CreditTier | null;
  isDecrypted: boolean;
  lastUpdated: string;
}

const mockBorrowers: BorrowerProfile[] = [
  {
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f1a1f8',
    hasProfile: true,
    tier: null,
    isDecrypted: false,
    lastUpdated: '2024-01-15',
  },
  {
    address: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    hasProfile: true,
    tier: 'Good',
    isDecrypted: true,
    lastUpdated: '2024-01-14',
  },
  {
    address: '0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec',
    hasProfile: true,
    tier: 'Excellent',
    isDecrypted: true,
    lastUpdated: '2024-01-13',
  },
  {
    address: '0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097',
    hasProfile: true,
    tier: null,
    isDecrypted: false,
    lastUpdated: '2024-01-12',
  },
];

const tierColors: Record<CreditTier, string> = {
  Poor: 'bg-destructive/20 text-destructive border-destructive/30',
  Fair: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Good: 'bg-green-500/20 text-green-400 border-green-500/30',
  Excellent: 'bg-primary/20 text-primary border-primary/30',
};

const LenderPortal = () => {
  const [searchAddress, setSearchAddress] = useState('');
  const [borrowers, setBorrowers] = useState<BorrowerProfile[]>(mockBorrowers);
  const [isRequesting, setIsRequesting] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Transaction modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPhase, setModalPhase] = useState<TransactionPhase>('encrypting');
  const [modalTxHash, setModalTxHash] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | undefined>();
  const [currentBorrower, setCurrentBorrower] = useState<string>('');

  // Services
  const relayerService = new RelayerService();
  const aclManager = new ACLManager();

  // Real-time blockchain events
  useBlockchainEvents({
    onDecryptionRequested: (borrower, lender, txHash) => {
      console.log('Decryption requested event:', borrower, lender, txHash);
      // Update UI when decryption is completed
      setBorrowers((prev) =>
        prev.map((b) =>
          b.address.toLowerCase() === borrower.toLowerCase()
            ? { ...b, isDecrypted: true }
            : b
        )
      );
    },
  });

  const handleRequestDecryption = async (borrowerAddress: string) => {
    // Get connected wallet address (mock for now)
    const lenderAddress = '0xLenderAddress...';
    
    // For demo purposes, auto-grant access if not present
    if (!aclManager.hasAccess(borrowerAddress, lenderAddress)) {
      aclManager.grantAccess(borrowerAddress, lenderAddress, 30);
    }

    setIsRequesting(borrowerAddress);
    setCurrentBorrower(borrowerAddress);
    setModalOpen(true);
    setModalPhase('submitting');
    setModalError(undefined);
    setModalTxHash(null);

    try {
      // Phase 1: Submit decryption request via Relayer
      setModalPhase('decrypting');
      
      // Mock encrypted score for demo
      const mockEncryptedScore = `0x${Array.from({ length: 64 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('')}`;
      
      const result = await relayerService.requestDecryption(
        borrowerAddress,
        lenderAddress,
        mockEncryptedScore
      );

      // Update borrower with decrypted tier from relayer
      const newTier = result.tier;

      setBorrowers((prev) =>
        prev.map((b) =>
          b.address === borrowerAddress
            ? { ...b, isDecrypted: true, tier: newTier }
            : b
        )
      );

      // Generate mock txHash for demo (in production, this comes from blockchain)
      const mockTxHash = `0x${Array.from({ length: 64 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('')}`;
      setModalTxHash(mockTxHash);
      setModalPhase('complete');

      toast({
        title: 'Decryption Complete',
        description: `Credit tier revealed: ${newTier}`,
      });
    } catch (error: any) {
      console.error('Decryption error:', error);
      setModalPhase('error');
      setModalError(error?.message || 'Failed to request decryption. Please try again.');
      
      toast({
        title: 'Request Failed',
        description: error?.message || 'Failed to request decryption.',
        variant: 'destructive',
      });
    } finally {
      setIsRequesting(null);
    }
  };

  const filteredBorrowers = searchAddress
    ? borrowers.filter((b) =>
        b.address.toLowerCase().includes(searchAddress.toLowerCase())
      )
    : borrowers;

  return (
    <div className="min-h-screen bg-background relative">
      <MatrixBackground />
      <Header />

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        phase={modalPhase}
        txHash={modalTxHash}
        errorMessage={modalError}
        title="Requesting Decryption"
      />

      <main className="relative z-10 pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Lender Portal
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              View borrower profiles and request decryption of credit scores via the Zama Relayer
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by wallet address..."
                      value={searchAddress}
                      onChange={(e) => setSearchAddress(e.target.value)}
                      className="pl-10 bg-input border-border text-foreground"
                    />
                  </div>
                  <Button variant="outline">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Borrower List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Users className="w-5 h-5 text-primary" />
                  Borrower Profiles
                </CardTitle>
                <CardDescription>
                  View encrypted profiles and request score decryption via Relayer SDK
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoading ? (
                    // Skeleton loading state
                    <>
                      <SkeletonTransaction />
                      <SkeletonTransaction />
                      <SkeletonTransaction />
                    </>
                  ) : (
                    <AnimatePresence mode="popLayout">
                      {filteredBorrowers.map((borrower, index) => (
                        <motion.div
                          key={borrower.address}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          layout
                          className="p-4 bg-secondary/30 rounded-lg border border-border hover:border-primary/30 transition-all duration-300"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Shield className="w-4 h-4 text-primary" />
                                <span className="font-mono text-sm text-foreground">
                                  {borrower.address.slice(0, 10)}...{borrower.address.slice(-8)}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>Last updated: {borrower.lastUpdated}</span>
                                <AnimatePresence mode="wait">
                                  {borrower.isDecrypted ? (
                                    <motion.span
                                      key="decrypted"
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.8 }}
                                      className="flex items-center gap-1 text-primary"
                                    >
                                      <Unlock className="w-3 h-3" />
                                      Decrypted
                                    </motion.span>
                                  ) : (
                                    <motion.span
                                      key="encrypted"
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.8 }}
                                      className="flex items-center gap-1"
                                    >
                                      <Lock className="w-3 h-3" />
                                      Encrypted
                                    </motion.span>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              <AnimatePresence mode="wait">
                                {borrower.tier ? (
                                  <motion.div
                                    key="tier"
                                    initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                    transition={{ type: 'spring', damping: 15 }}
                                  >
                                    <Badge className={tierColors[borrower.tier]}>
                                      <CheckCircle2 className="w-3 h-3 mr-1" />
                                      {borrower.tier}
                                    </Badge>
                                  </motion.div>
                                ) : (
                                  <motion.div
                                    key="hidden"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                  >
                                    <Badge variant="outline" className="border-border text-muted-foreground">
                                      <Lock className="w-3 h-3 mr-1" />
                                      Hidden
                                    </Badge>
                                  </motion.div>
                                )}
                              </AnimatePresence>

                              {!borrower.isDecrypted && (
                                <Button
                                  onClick={() => handleRequestDecryption(borrower.address)}
                                  disabled={isRequesting === borrower.address}
                                  variant="encrypted"
                                  size="sm"
                                  className="relative overflow-hidden"
                                >
                                  {isRequesting === borrower.address ? (
                                    <motion.div
                                      className="flex items-center gap-2"
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                    >
                                      <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                      >
                                        <Unlock className="w-4 h-4" />
                                      </motion.div>
                                      <span>Decrypting...</span>
                                    </motion.div>
                                  ) : (
                                    <>
                                      <Eye className="w-4 h-4 mr-1" />
                                      Request Decryption
                                    </>
                                  )}
                                </Button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}

                  {filteredBorrowers.length === 0 && !isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12"
                    >
                      <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No borrowers found matching your search.</p>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Relayer Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8"
          >
            <Card className="bg-card border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Zama Relayer Integration</h3>
                    <p className="text-sm text-muted-foreground">
                      Decryption requests are processed through the Zama Relayer SDK, which securely communicates 
                      with the Gateway Chain. ACL checks ensure only authorized lenders can view credit data. 
                      All computations happen on encrypted data using Fully Homomorphic Encryption.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default LenderPortal;
