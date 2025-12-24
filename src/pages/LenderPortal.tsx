import { motion } from 'framer-motion';
import { useState } from 'react';
import { Users, Eye, Lock, Unlock, Search, Shield, AlertTriangle } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { MatrixBackground } from '@/components/layout/MatrixBackground';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { creditTierLabels, type CreditTier } from '@/lib/web3/config';
import { Badge } from '@/components/ui/badge';

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

  const handleRequestDecryption = async (address: string) => {
    setIsRequesting(address);

    try {
      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setBorrowers((prev) =>
        prev.map((b) =>
          b.address === address
            ? {
                ...b,
                isDecrypted: true,
                tier: creditTierLabels[Math.floor(Math.random() * 4)] as CreditTier,
              }
            : b
        )
      );

      toast({
        title: 'Decryption Requested',
        description: 'Credit score has been decrypted and is now visible.',
      });
    } catch (error) {
      toast({
        title: 'Request Failed',
        description: 'Failed to request decryption. Please try again.',
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
              View borrower profiles and request decryption of credit scores
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
                  View encrypted profiles and request score decryption
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredBorrowers.map((borrower, index) => (
                    <motion.div
                      key={borrower.address}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-4 bg-secondary/30 rounded-lg border border-border hover:border-primary/30 transition-colors"
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
                            {borrower.isDecrypted ? (
                              <span className="flex items-center gap-1 text-primary">
                                <Unlock className="w-3 h-3" />
                                Decrypted
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <Lock className="w-3 h-3" />
                                Encrypted
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          {borrower.tier ? (
                            <Badge className={tierColors[borrower.tier]}>
                              {borrower.tier}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-border text-muted-foreground">
                              <Lock className="w-3 h-3 mr-1" />
                              Hidden
                            </Badge>
                          )}

                          {!borrower.isDecrypted && (
                            <Button
                              onClick={() => handleRequestDecryption(borrower.address)}
                              disabled={isRequesting === borrower.address}
                              variant="encrypted"
                              size="sm"
                            >
                              {isRequesting === borrower.address ? (
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                >
                                  <Unlock className="w-4 h-4" />
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

                  {filteredBorrowers.length === 0 && (
                    <div className="text-center py-12">
                      <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No borrowers found matching your search.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Info Card */}
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
                    <Lock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Privacy Notice</h3>
                    <p className="text-sm text-muted-foreground">
                      Decryption requests are logged on-chain and require authorization from the borrower. 
                      You will only see the credit tier, not the underlying financial data. All computations 
                      happen on encrypted data using Zama's FHE technology.
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
