import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, TrendingUp, Eye, Zap, ArrowRight, Database, Key, Users, Wallet, FileText, Calculator, Unlock, Github, Twitter, Play, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MatrixBackground } from '@/components/layout/MatrixBackground';
import { Header } from '@/components/layout/Header';
import { PrivacyOverlay } from '@/components/effects/PrivacyOverlay';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const features = [
  {
    icon: Lock,
    title: 'Fully Homomorphic Encryption',
    description: 'Your financial data remains encrypted during all computations. Not even the blockchain can see your numbers.',
  },
  {
    icon: TrendingUp,
    title: 'On-Chain Credit Scoring',
    description: 'Get a verifiable credit score computed entirely on-chain without exposing sensitive financial information.',
  },
  {
    icon: Eye,
    title: 'Selective Disclosure',
    description: 'Grant lenders permission to decrypt your score. You control who sees what, when.',
  },
  {
    icon: Database,
    title: 'Immutable Records',
    description: 'All transactions are logged on Sepolia testnet with cryptographic proof of integrity.',
  },
];

const stats = [
  { value: '100%', label: 'Privacy Preserved' },
  { value: 'FHE', label: 'Zama Encryption' },
  { value: '0', label: 'Data Leaks' },
  { value: '∞', label: 'Possibilities' },
];

const walkthroughSteps = [
  {
    step: 1,
    icon: Wallet,
    title: 'Connect MetaMask',
    description: 'Link your MetaMask wallet to securely interact with the DApp on Sepolia testnet.',
    details: 'Click the "Connect Wallet" button in the header. Approve the connection request in MetaMask. Ensure you have some Sepolia ETH for gas fees.',
  },
  {
    step: 2,
    icon: Eye,
    title: 'Navigate the Interface',
    description: 'Explore the Dashboard, Lender Portal, and Profile sections to understand your options.',
    details: 'The Dashboard shows your credit profile status. The Lender Portal is for those who want to view borrower scores. Profile shows your encrypted data history.',
  },
  {
    step: 3,
    icon: FileText,
    title: 'Submit Encrypted Data',
    description: 'Enter your financial data (income, collateral, debt) which gets encrypted using FHE before submission.',
    details: 'Your data is encrypted client-side using Zama\'s FHE library. Only encrypted values are sent to the blockchain. Nobody can see your actual numbers.',
  },
  {
    step: 4,
    icon: Calculator,
    title: 'Request Score Computation',
    description: 'Trigger the on-chain credit score calculation that operates entirely on encrypted data.',
    details: 'The smart contract performs mathematical operations on your encrypted data. The result is an encrypted credit tier (Poor, Fair, Good, Excellent).',
  },
  {
    step: 5,
    icon: Unlock,
    title: 'Decrypt & View Results',
    description: 'Grant decryption access to authorized lenders or view your own score with proper permissions.',
    details: 'You control who can decrypt your score. Lenders must request access. You can revoke permissions at any time.',
  },
];

const Index = () => {
  const [showPrivacyOverlay, setShowPrivacyOverlay] = useState(true);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Privacy Overlay */}
      {showPrivacyOverlay && (
        <PrivacyOverlay 
          duration={3000} 
          onComplete={() => setShowPrivacyOverlay(false)} 
        />
      )}
      
      <MatrixBackground />
      <Header />
      
      {/* Hero Section with Video */}
      <section className="relative z-10 pt-32 pb-12 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-primary/30 mb-8">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Powered by Zama fhEVM</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="text-foreground">Privacy-Preserving</span>
                <br />
                <span className="text-gradient">Credit Scoring</span>
                <br />
                <span className="text-foreground">for Regulated DeFi</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                The Confidential Credit Oracle enables encrypted on-chain credit scoring 
                using Fully Homomorphic Encryption. Your data stays private, always.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            >
              <Link to="/dashboard">
                <Button variant="cta" size="xl" className="group">
                  <span>Launch App</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/why-zama">
                <Button variant="outline" size="xl">
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* YouTube Video Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="max-w-4xl mx-auto mb-8"
          >
            <div className="relative rounded-2xl overflow-hidden border border-primary/20 bg-card shadow-2xl shadow-primary/10">
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none z-10" />
              <div className="aspect-video">
                <iframe
                  src="https://www.youtube.com/embed/Ydnn-3bfvBs?rel=0&modestbranding=1"
                  title="ZamaCCO Demo Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4 flex items-center justify-center gap-2">
              <Play className="w-4 h-4" />
              Watch the demo to see ZamaCCO in action
            </p>
          </motion.div>

          {/* Animated Shield */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 pointer-events-none"
          >
            <div className="relative w-96 h-96 opacity-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 border-2 border-primary/30 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-8 border border-primary/20 rounded-full"
              />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-16 border border-primary/10 rounded-full"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive DApp Walkthrough */}
      <section className="relative z-10 py-20 px-4 bg-gradient-to-b from-transparent via-secondary/20 to-transparent">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How to Use ZamaCCO
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Follow these simple steps to start your private credit scoring journey
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {walkthroughSteps.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      onClick={() => setExpandedStep(expandedStep === item.step ? null : item.step)}
                      className={`
                        bg-card rounded-xl p-6 border cursor-pointer transition-all duration-300
                        ${expandedStep === item.step 
                          ? 'border-primary shadow-lg shadow-primary/20' 
                          : 'border-border hover:border-primary/50'
                        }
                      `}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-primary font-bold">{item.step}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <item.icon className="w-5 h-5 text-primary" />
                            <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                          
                          {/* Expandable details */}
                          <motion.div
                            initial={false}
                            animate={{ 
                              height: expandedStep === item.step ? 'auto' : 0,
                              opacity: expandedStep === item.step ? 1 : 0
                            }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 pt-4 border-t border-border">
                              <p className="text-sm text-foreground/80">{item.details}</p>
                            </div>
                          </motion.div>
                        </div>
                        <ChevronDown 
                          className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${
                            expandedStep === item.step ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>Click to {expandedStep === item.step ? 'collapse' : 'expand'} details</p>
                  </TooltipContent>
                </Tooltip>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose ZamaCCO
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Leveraging Zama's FHE technology to compute on encrypted data
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card-gradient rounded-xl p-6 border border-border card-hover"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Your Journey to Private Credit
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: 1, icon: Key, title: 'Encrypt Your Data', desc: 'Submit encrypted income, collateral, and debt values using FHE.' },
              { step: 2, icon: Database, title: 'Compute On-Chain', desc: 'Your credit score is calculated without decrypting any data.' },
              { step: 3, icon: Users, title: 'Control Access', desc: 'Grant or revoke access to lenders through selective disclosure.' },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-card rounded-xl p-6 border border-border">
                  <div className="absolute -top-4 left-6 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    {item.step}
                  </div>
                  <div className="pt-4">
                    <item.icon className="w-8 h-8 text-primary mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-card-gradient rounded-2xl p-12 border border-primary/20 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
            <div className="relative z-10">
              <Shield className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Ready to Take Control?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                Connect your wallet and start building your private, verifiable credit history today.
              </p>
              <Link to="/dashboard">
                <Button variant="cta" size="xl">
                  Get Started Now
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer with Social Links */}
      <footer className="relative z-10 py-12 px-4 border-t border-border">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              <span className="font-bold text-foreground">CCO</span>
              <span className="text-muted-foreground text-sm">• Confidential Credit Oracle</span>
            </div>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/chokhrich-dot/Z-CCO"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 border border-border hover:border-primary/50 transition-all duration-300 group"
              >
                <Github className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">GitHub</span>
              </a>
              <a
                href="https://x.com/chokhrich1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 border border-border hover:border-primary/50 transition-all duration-300 group"
              >
                <Twitter className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Twitter</span>
              </a>
            </div>
            
            <div className="text-sm text-muted-foreground">
              Built on Sepolia Testnet with Zama fhEVM
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
