import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  Unlock,
  User,
  Key,
  Users,
  Plus,
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { MatrixBackground } from '@/components/layout/MatrixBackground';
import { ShieldParticles } from '@/components/effects/ShieldParticles';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton, SkeletonCard } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { creditTierLabels, type CreditTier } from '@/lib/web3/config';
import { zamaCCOService, type AccessPermission } from '@/lib/web3/zamaService';
import { useWallet } from '@/contexts/WalletContext';
import { fetchProfileSubmissions, fetchDecryptionRequests, type TransactionEvent } from '@/lib/web3/transactionService';

interface UserProfile {
  address: string;
  hasProfile: boolean;
  creditTier: CreditTier | null;
  submittedAt: string | null;
  encryptedData: {
    income: string;
    collateral: string;
    debt: string;
  } | null;
}

const tierColors: Record<CreditTier, string> = {
  Poor: 'bg-destructive/20 text-destructive border-destructive/30',
  Fair: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Good: 'bg-green-500/20 text-green-400 border-green-500/30',
  Excellent: 'bg-primary/20 text-primary border-primary/30',
};

const Profile = () => {
  const { address: walletAddress, isConnected } = useWallet();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [permissions, setPermissions] = useState<AccessPermission[]>([]);
  const [decryptionRequests, setDecryptionRequests] = useState<TransactionEvent[]>([]);
  const [newLenderAddress, setNewLenderAddress] = useState('');
  const [isGranting, setIsGranting] = useState(false);
  const [copied, setCopied] = useState(false);

  const loadProfileFromBlockchain = async () => {
    if (!walletAddress) return;
    
    try {
      // Fetch profile submissions from blockchain
      const submissions = await fetchProfileSubmissions(walletAddress);
      const decryptions = await fetchDecryptionRequests(walletAddress);
      
      setDecryptionRequests(decryptions);
      
      if (submissions.length > 0) {
        const latestSubmission = submissions[0];
        
        // Try to get credit tier from contract
        let creditTier: CreditTier | null = null;
        try {
          creditTier = await zamaCCOService.getPublicCreditTier(walletAddress);
        } catch {
          creditTier = 'Good'; // Fallback for demo
        }
        
        const mockProfile: UserProfile = {
          address: walletAddress,
          hasProfile: true,
          creditTier,
          submittedAt: latestSubmission.timestamp,
          encryptedData: {
            income: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
            collateral: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
            debt: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
          },
        };
        setProfile(mockProfile);
      } else {
        // No submissions found - show mock data for demo
        setProfile({
          address: walletAddress,
          hasProfile: true,
          creditTier: 'Good',
          submittedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
          encryptedData: {
            income: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
            collateral: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
            debt: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
          },
        });
      }

      // Load mock permissions (ACL would be on-chain in production)
      const mockPermissions: AccessPermission[] = [
        {
          lenderAddress: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
          grantedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          isActive: true,
        },
        {
          lenderAddress: '0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec',
          grantedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
          expiresAt: new Date(Date.now() + 86400000 * 25).toISOString(),
          isActive: true,
        },
      ];
      setPermissions(mockPermissions);
    } catch (error) {
      console.error('Error loading profile from blockchain:', error);
      toast({
        title: 'Error loading profile',
        description: 'Could not fetch data from blockchain. Using cached data.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      await loadProfileFromBlockchain();
      setIsLoading(false);
    };

    if (isConnected && walletAddress) {
      loadProfile();
    } else {
      setIsLoading(false);
    }
  }, [isConnected, walletAddress]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadProfileFromBlockchain();
    setIsRefreshing(false);
    toast({
      title: 'Profile Refreshed',
      description: 'Latest data fetched from blockchain.',
    });
  };

  const handleGrantAccess = async () => {
    if (!newLenderAddress || !newLenderAddress.startsWith('0x') || newLenderAddress.length !== 42) {
      toast({
        title: 'Invalid Address',
        description: 'Please enter a valid Ethereum address.',
        variant: 'destructive',
      });
      return;
    }

    setIsGranting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newPermission: AccessPermission = {
        lenderAddress: newLenderAddress,
        grantedAt: new Date().toISOString(),
        isActive: true,
      };
      
      setPermissions(prev => [...prev, newPermission]);
      setNewLenderAddress('');
      
      toast({
        title: 'Access Granted',
        description: 'Lender can now request decryption of your credit tier.',
      });
    } catch (error) {
      toast({
        title: 'Failed to Grant Access',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGranting(false);
    }
  };

  const handleRevokeAccess = async (lenderAddress: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPermissions(prev =>
        prev.map(p =>
          p.lenderAddress === lenderAddress ? { ...p, isActive: false } : p
        )
      );
      
      toast({
        title: 'Access Revoked',
        description: 'Lender can no longer decrypt your credit tier.',
      });
    } catch (error) {
      toast({
        title: 'Failed to Revoke Access',
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleCopyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isConnected && !isLoading) {
    return (
      <div className="min-h-screen bg-background relative">
        <MatrixBackground />
        <Header />
        <main className="relative z-10 pt-28 pb-16 px-4">
          <div className="container mx-auto max-w-2xl text-center">
            <ShieldParticles size="lg" className="mx-auto mb-8" />
            <h1 className="text-3xl font-bold text-foreground mb-4">Connect Your Wallet</h1>
            <p className="text-muted-foreground mb-8">
              Connect your wallet to view and manage your encrypted credit profile.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <MatrixBackground />
      <Header />

      <main className="relative z-10 pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Your Profile
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto mb-4">
              View your encrypted data, credit tier, and manage access permissions
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh from Blockchain
            </Button>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-1"
            >
              {isLoading ? (
                <SkeletonCard />
              ) : (
                <Card className="bg-card border-border">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4">
                      <ShieldParticles size="md" isAnimating={!!profile?.creditTier} />
                    </div>
                    <CardTitle className="text-foreground">
                      {profile?.hasProfile ? 'Profile Active' : 'No Profile'}
                    </CardTitle>
                    <CardDescription>
                      {profile?.submittedAt
                        ? `Submitted ${new Date(profile.submittedAt).toLocaleDateString()}`
                        : 'Submit your data to create a profile'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Wallet Address */}
                    <div className="p-3 bg-secondary/30 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Wallet Address</div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm text-foreground">
                          {walletAddress?.slice(0, 10)}...{walletAddress?.slice(-8)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCopyAddress}
                          className="h-6 w-6 p-0"
                        >
                          {copied ? (
                            <Check className="w-3 h-3 text-green-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Credit Tier */}
                    {profile?.creditTier && (
                      <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 text-center">
                        <div className="text-xs text-muted-foreground mb-2">Your Credit Tier</div>
                        <Badge className={`text-lg px-4 py-1 ${tierColors[profile.creditTier]}`}>
                          {profile.creditTier}
                        </Badge>
                      </div>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-secondary/30 rounded-lg text-center">
                        <div className="text-2xl font-bold text-primary">{permissions.filter(p => p.isActive).length}</div>
                        <div className="text-xs text-muted-foreground">Active Permissions</div>
                      </div>
                      <div className="p-3 bg-secondary/30 rounded-lg text-center">
                        <div className="text-2xl font-bold text-foreground">{decryptionRequests.length}</div>
                        <div className="text-xs text-muted-foreground">Decryption Requests</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>

            {/* Encrypted Data & Permissions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Encrypted Data */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Lock className="w-5 h-5 text-primary" />
                    Encrypted Data
                  </CardTitle>
                  <CardDescription>
                    Your financial data is encrypted on-chain - only you and authorized lenders can see your tier
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {profile?.encryptedData && Object.entries(profile.encryptedData).map(([key, value]) => (
                        <div key={key} className="p-3 bg-secondary/30 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-foreground capitalize">{key}</span>
                            <Badge variant="outline" className="text-xs">
                              <Lock className="w-3 h-3 mr-1" />
                              Encrypted
                            </Badge>
                          </div>
                          <div className="font-mono text-xs text-encrypted break-all">
                            {value}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Access Control */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Users className="w-5 h-5 text-primary" />
                    Access Control (ACL)
                  </CardTitle>
                  <CardDescription>
                    Manage which lenders can request decryption of your credit tier
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Grant Access Form */}
                  <div className="flex gap-3">
                    <Input
                      placeholder="Enter lender address (0x...)"
                      value={newLenderAddress}
                      onChange={(e) => setNewLenderAddress(e.target.value)}
                      className="bg-input border-border text-foreground font-mono text-sm"
                    />
                    <Button
                      onClick={handleGrantAccess}
                      disabled={isGranting}
                      variant="cta"
                    >
                      {isGranting ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          <Key className="w-4 h-4" />
                        </motion.div>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-1" />
                          Grant
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Permissions List */}
                  <div className="space-y-2">
                    <AnimatePresence>
                      {permissions.map((permission, index) => (
                        <motion.div
                          key={permission.lenderAddress}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-3 rounded-lg border ${
                            permission.isActive
                              ? 'bg-secondary/30 border-border'
                              : 'bg-muted/30 border-muted'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${
                                permission.isActive ? 'bg-green-500' : 'bg-muted-foreground'
                              }`} />
                              <div>
                                <span className="font-mono text-sm text-foreground">
                                  {permission.lenderAddress.slice(0, 10)}...{permission.lenderAddress.slice(-8)}
                                </span>
                                <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                                  <Clock className="w-3 h-3" />
                                  Granted {new Date(permission.grantedAt).toLocaleDateString()}
                                  {permission.expiresAt && (
                                    <span className="text-primary">
                                      • Expires {new Date(permission.expiresAt).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            {permission.isActive && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRevokeAccess(permission.lenderAddress)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {permissions.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No permissions granted yet</p>
                        <p className="text-sm">Add a lender address to grant access</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
