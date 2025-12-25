import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, Key, Users, CheckCircle2, ArrowRight, Zap, TrendingUp, FileText, UserCheck, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { MatrixBackground } from '@/components/layout/MatrixBackground';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CreditScoreSimulator } from '@/components/simulator/CreditScoreSimulator';
const benefits = [{
  icon: Shield,
  title: 'Military-Grade Security',
  description: 'Your data is encrypted using Fully Homomorphic Encryption (FHE), ensuring it remains private even during computation.'
}, {
  icon: Eye,
  title: 'Zero Data Exposure',
  description: 'Sensitive financial information stays encrypted on-chain. Only you decide who can see your credit tier.'
}, {
  icon: TrendingUp,
  title: 'Reliable Credit Scoring',
  description: 'Get a trusted, verifiable credit score computed entirely on-chain without compromising your privacy.'
}, {
  icon: Users,
  title: 'Easy Lender Access',
  description: 'Lenders can securely request decryption to view your credit tier with your explicit permission.'
}];
const steps = [{
  number: 1,
  icon: FileText,
  title: 'Submit Encrypted Data',
  description: 'As a borrower, submit your encrypted financial data including income, collateral, and debt. All data is encrypted using Zama\'s fhEVM before leaving your device.',
  color: 'text-blue-400',
  bgColor: 'bg-blue-500/10',
  borderColor: 'border-blue-500/30'
}, {
  number: 2,
  icon: BarChart3,
  title: 'On-Chain Computation',
  description: 'Your credit score is computed directly on the blockchain using homomorphic operations. The computation happens on encrypted data - no one can see your actual numbers.',
  color: 'text-green-400',
  bgColor: 'bg-green-500/10',
  borderColor: 'border-green-500/30'
}, {
  number: 3,
  icon: UserCheck,
  title: 'Grant Access to Lenders',
  description: 'Control who can see your credit tier. Grant or revoke access at any time. Lenders can request decryption, but only with your approval.',
  color: 'text-purple-400',
  bgColor: 'bg-purple-500/10',
  borderColor: 'border-purple-500/30'
}];
const features = ['No credit bureaus required', 'Immutable on-chain records', 'Real-time credit updates', 'Cross-platform compatibility', 'Decentralized infrastructure', 'Transparent algorithms'];
const WhyZamaCCO = () => {
  return <div className="min-h-screen bg-background relative">
      <MatrixBackground />
      <Header />

      <main className="relative z-10 pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Hero Section */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-primary/30 mb-6">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Privacy-First Credit Scoring</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Why <span className="text-gradient">Z-CCO</span>?
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              ZamaCCO is a revolutionary platform that enables secure, privacy-preserving credit scoring 
              using <span className="text-primary font-semibold">Fully Homomorphic Encryption (FHE)</span>. 
              Your financial data stays encrypted at all times.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/dashboard">
                <Button variant="cta" size="xl" className="group">
                  Get Started
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/faq">
                <Button variant="outline" size="xl">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Benefits Section */}
          <motion.section initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} viewport={{
          once: true
        }} className="mb-20">
            <h2 className="text-3xl font-bold text-foreground text-center mb-4">
              Why Use ZamaCCO?
            </h2>
            <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Experience the future of credit scoring with unparalleled privacy and security
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => <motion.div key={benefit.title} initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.5,
              delay: index * 0.1
            }} viewport={{
              once: true
            }}>
                  <Card className="bg-card border-border h-full card-hover">
                    <CardContent className="pt-6">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <benefit.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {benefit.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>)}
            </div>
          </motion.section>

          {/* How It Works Section */}
          <motion.section initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} viewport={{
          once: true
        }} className="mb-20">
            <h2 className="text-3xl font-bold text-foreground text-center mb-4">
              How to Use ZamaCCO
            </h2>
            <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Three simple steps to secure, privacy-preserving credit scoring
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((step, index) => <motion.div key={step.number} initial={{
              opacity: 0,
              x: -20
            }} whileInView={{
              opacity: 1,
              x: 0
            }} transition={{
              duration: 0.5,
              delay: index * 0.2
            }} viewport={{
              once: true
            }} className="relative">
                  {/* Connector line */}
                  {index < steps.length - 1 && <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-border to-transparent z-0" />}
                  
                  <Card className={`bg-card border ${step.borderColor} h-full relative z-10`}>
                    <CardContent className="pt-6">
                      {/* Step number */}
                      <div className={`absolute -top-4 left-6 w-8 h-8 rounded-full ${step.bgColor} border ${step.borderColor} flex items-center justify-center font-bold text-sm ${step.color}`}>
                        {step.number}
                      </div>
                      
                      <div className="pt-4">
                        <div className={`w-14 h-14 rounded-xl ${step.bgColor} flex items-center justify-center mb-4`}>
                          <step.icon className={`w-7 h-7 ${step.color}`} />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-3">
                          {step.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>)}
            </div>
          </motion.section>

          {/* Credit Score Simulator Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h2 className="text-3xl font-bold text-foreground text-center mb-4">
              Try the Credit Score Simulator
            </h2>
            <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Preview how changes to your financial profile would affect your credit tier
            </p>
            
            <div className="max-w-xl mx-auto">
              <CreditScoreSimulator />
            </div>
          </motion.section>

          {/* Features List */}
          <motion.section initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} viewport={{
          once: true
        }} className="mb-20">
            <Card className="bg-card-gradient border-primary/20">
              <CardContent className="py-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Key Features
                  </h2>
                  <p className="text-muted-foreground">
                    Everything you need for secure credit scoring
                  </p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                  {features.map((feature, index) => <motion.div key={feature} initial={{
                  opacity: 0,
                  scale: 0.9
                }} whileInView={{
                  opacity: 1,
                  scale: 1
                }} transition={{
                  delay: index * 0.1
                }} viewport={{
                  once: true
                }} className="flex items-center gap-2 p-3 rounded-lg bg-secondary/30">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </motion.div>)}
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* CTA Section */}
          <motion.section initial={{
          opacity: 0,
          scale: 0.95
        }} whileInView={{
          opacity: 1,
          scale: 1
        }} transition={{
          duration: 0.6
        }} viewport={{
          once: true
        }}>
            <Card className="bg-card-gradient border-primary/20 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
              <CardContent className="py-12 relative z-10">
                <Shield className="w-16 h-16 text-primary mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Ready to Get Started?
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                  Join the future of privacy-preserving credit scoring. 
                  Your data, your control, always encrypted.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/dashboard">
                    <Button variant="cta" size="xl" className="group">
                      Launch Dashboard
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Link to="/profile">
                    <Button variant="outline" size="xl">
                      <Lock className="w-5 h-5 mr-2" />
                      View Profile
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.section>
        </div>
      </main>
    </div>;
};
export default WhyZamaCCO;