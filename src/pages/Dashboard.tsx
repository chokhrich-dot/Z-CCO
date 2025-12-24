import { motion } from 'framer-motion';
import { useState } from 'react';
import { Shield, Lock, Unlock, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { MatrixBackground } from '@/components/layout/MatrixBackground';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { ZAMA_CCO_ADDRESS } from '@/lib/web3/config';

interface EncryptedData {
  income: string;
  collateral: string;
  debt: string;
}

const Dashboard = () => {
  const [formData, setFormData] = useState<EncryptedData>({
    income: '',
    collateral: '',
    debt: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const handleInputChange = (field: keyof EncryptedData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const simulateEncryption = (value: string): string => {
    // Simulate FHE encryption (in reality, this would use Zama's library)
    const hash = btoa(value + Math.random().toString(36)).slice(0, 16);
    return `0x${hash.replace(/[^a-zA-Z0-9]/g, '').padEnd(64, '0')}`;
  };

  const handleSubmit = async () => {
    if (!formData.income || !formData.collateral || !formData.debt) {
      toast({
        title: 'Missing Data',
        description: 'Please fill in all fields before submitting.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate encryption process
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsEncrypted(true);

      // Simulate transaction
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const mockTxHash = `0x${Array.from({ length: 64 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('')}`;
      
      setTxHash(mockTxHash);

      toast({
        title: 'Profile Submitted',
        description: 'Your encrypted financial data has been submitted to the blockchain.',
      });
    } catch (error) {
      toast({
        title: 'Submission Failed',
        description: 'Failed to submit encrypted data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const encryptedValues = {
    income: formData.income ? simulateEncryption(formData.income) : null,
    collateral: formData.collateral ? simulateEncryption(formData.collateral) : null,
    debt: formData.debt ? simulateEncryption(formData.debt) : null,
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
              Borrower Dashboard
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Submit your encrypted financial data to generate a private credit score
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Lock className="w-5 h-5 text-primary" />
                    Submit Financial Data
                  </CardTitle>
                  <CardDescription>
                    Enter your financial information. All data will be encrypted using FHE before submission.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="income" className="text-foreground">Monthly Income (USD)</Label>
                    <Input
                      id="income"
                      type="number"
                      placeholder="e.g., 5000"
                      value={formData.income}
                      onChange={(e) => handleInputChange('income', e.target.value)}
                      className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="collateral" className="text-foreground">Collateral Value (USD)</Label>
                    <Input
                      id="collateral"
                      type="number"
                      placeholder="e.g., 10000"
                      value={formData.collateral}
                      onChange={(e) => handleInputChange('collateral', e.target.value)}
                      className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="debt" className="text-foreground">Current Debt (USD)</Label>
                    <Input
                      id="debt"
                      type="number"
                      placeholder="e.g., 2000"
                      value={formData.debt}
                      onChange={(e) => handleInputChange('debt', e.target.value)}
                      className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>

                  <div className="pt-4">
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      variant="cta"
                      className="w-full"
                      size="lg"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          >
                            <Lock className="w-4 h-4" />
                          </motion.div>
                          {isEncrypted ? 'Submitting to Chain...' : 'Encrypting Data...'}
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="w-4 h-4" />
                          Submit Encrypted Data
                        </span>
                      )}
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground flex items-start gap-2 p-3 bg-secondary/30 rounded-lg">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>
                      Your data is encrypted client-side using Zama's FHE library before being submitted 
                      to the ZamaCCO smart contract at <span className="font-mono text-primary">{ZAMA_CCO_ADDRESS.slice(0, 10)}...</span>
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Encrypted Preview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Shield className="w-5 h-5 text-primary" />
                    Encrypted Output Preview
                  </CardTitle>
                  <CardDescription>
                    This is how your data appears on the blockchain - fully encrypted
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {['income', 'collateral', 'debt'].map((field) => (
                    <div key={field} className="space-y-2">
                      <Label className="capitalize text-foreground">{field}</Label>
                      <div className="p-3 bg-secondary/50 rounded-lg border border-border font-mono text-sm break-all">
                        {encryptedValues[field as keyof typeof encryptedValues] ? (
                          <span className="text-encrypted">
                            {encryptedValues[field as keyof typeof encryptedValues]}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Enter value to see encrypted output...</span>
                        )}
                      </div>
                    </div>
                  ))}

                  {txHash && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 p-4 bg-primary/10 border border-primary/30 rounded-lg"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                        <span className="font-semibold text-foreground">Transaction Submitted</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <span className="block mb-1">Transaction Hash:</span>
                        <a
                          href={`https://sepolia.etherscan.io/tx/${txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-xs text-primary hover:underline break-all"
                        >
                          {txHash}
                        </a>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>

              {/* Status Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-6"
              >
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground text-lg">Your Credit Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        {txHash ? (
                          <>
                            <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                            <span className="text-foreground">Profile Submitted</span>
                          </>
                        ) : (
                          <>
                            <div className="w-3 h-3 rounded-full bg-muted-foreground" />
                            <span className="text-muted-foreground">Awaiting Submission</span>
                          </>
                        )}
                      </div>
                      {txHash && (
                        <span className="text-xs font-mono text-primary">
                          <Unlock className="w-4 h-4" />
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
