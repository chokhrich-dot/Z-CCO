import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flag, Rocket, Server, Shield, Users, Globe,
  CheckCircle, Circle, Lock, Zap, Database, Eye,
  ChevronRight, Info
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { MatrixBackground } from '@/components/layout/MatrixBackground';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RoadmapPhase {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: typeof Flag;
  status: 'completed' | 'current' | 'upcoming';
  quarter: string;
  milestones: string[];
  details: string;
}

const roadmapPhases: RoadmapPhase[] = [
  {
    id: 'phase-1',
    title: 'Project Kickoff',
    subtitle: 'Foundation & Research',
    description: 'Laying the groundwork for privacy-preserving credit scoring',
    icon: Flag,
    status: 'completed',
    quarter: 'Q1 2024',
    milestones: [
      'Core team assembly',
      'FHE research & prototyping',
      'Smart contract architecture design',
      'Security audit planning'
    ],
    details: 'The initial phase focused on building a strong foundation. We assembled a team of cryptography experts and blockchain developers, conducted extensive research on Fully Homomorphic Encryption (FHE), and designed the core architecture for the ZamaCCO smart contracts.'
  },
  {
    id: 'phase-2',
    title: 'Beta Launch',
    subtitle: 'Testnet Deployment',
    description: 'Launching the CCO platform on Sepolia testnet',
    icon: Rocket,
    status: 'completed',
    quarter: 'Q2 2024',
    milestones: [
      'Sepolia testnet deployment',
      'Basic credit scoring functionality',
      'MetaMask wallet integration',
      'Initial user testing'
    ],
    details: 'We successfully deployed our smart contracts to the Sepolia testnet, enabling users to submit encrypted financial data and receive credit scores. The beta phase allowed us to gather valuable feedback and identify areas for improvement.'
  },
  {
    id: 'phase-3',
    title: 'Enhanced Privacy',
    subtitle: 'Advanced FHE Features',
    description: 'Implementing advanced encryption and access control',
    icon: Shield,
    status: 'current',
    quarter: 'Q3 2024',
    milestones: [
      'Zama Gateway integration',
      'ACL-based permissions',
      'Relayer SDK implementation',
      'Enhanced decryption workflows'
    ],
    details: 'Currently, we are enhancing the privacy features of our platform. This includes integrating with the Zama Gateway for secure decryption, implementing granular access controls, and building a seamless relayer system for handling encrypted data operations.'
  },
  {
    id: 'phase-4',
    title: 'Lender Integration',
    subtitle: 'DeFi Partnerships',
    description: 'Connecting with DeFi protocols and lenders',
    icon: Users,
    status: 'upcoming',
    quarter: 'Q4 2024',
    milestones: [
      'DeFi protocol integrations',
      'Lender dashboard enhancement',
      'API for third-party access',
      'Compliance framework'
    ],
    details: 'We will focus on building partnerships with DeFi protocols and traditional lenders. This phase includes creating robust APIs for third-party integration and establishing a compliance framework for regulated financial entities.'
  },
  {
    id: 'phase-5',
    title: 'Mainnet Deployment',
    subtitle: 'Production Launch',
    description: 'Deploying to Ethereum mainnet for production use',
    icon: Server,
    status: 'upcoming',
    quarter: 'Q1 2025',
    milestones: [
      'Comprehensive security audits',
      'Mainnet smart contract deployment',
      'Production-ready infrastructure',
      'User migration from testnet'
    ],
    details: 'The mainnet deployment phase will see our platform go live on Ethereum mainnet. This includes comprehensive security audits, production-grade infrastructure, and a seamless migration path for existing testnet users.'
  },
  {
    id: 'phase-6',
    title: 'Global Expansion',
    subtitle: 'Multi-chain & Growth',
    description: 'Expanding to multiple chains and regions',
    icon: Globe,
    status: 'upcoming',
    quarter: 'Q2 2025',
    milestones: [
      'Multi-chain deployment',
      'Cross-chain credit portability',
      'Regional compliance',
      'Enterprise solutions'
    ],
    details: 'Our final phase focuses on global expansion. We will deploy to multiple blockchain networks, enable cross-chain credit score portability, ensure regional regulatory compliance, and offer enterprise-grade solutions for institutional users.'
  },
];

const statusStyles = {
  completed: {
    bg: 'bg-green-500',
    text: 'text-green-400',
    badge: 'bg-green-500/20 text-green-400 border-green-500/30'
  },
  current: {
    bg: 'bg-primary',
    text: 'text-primary',
    badge: 'bg-primary/20 text-primary border-primary/30'
  },
  upcoming: {
    bg: 'bg-muted-foreground',
    text: 'text-muted-foreground',
    badge: 'bg-muted/20 text-muted-foreground border-muted/30'
  }
};

const Roadmap = () => {
  const [selectedPhase, setSelectedPhase] = useState<RoadmapPhase | null>(null);
  const [hoveredPhase, setHoveredPhase] = useState<string | null>(null);

  const currentPhaseIndex = roadmapPhases.findIndex(p => p.status === 'current');
  const progressPercentage = ((currentPhaseIndex + 0.5) / roadmapPhases.length) * 100;

  return (
    <div className="min-h-screen bg-background relative">
      <MatrixBackground />
      <Header />

      <main className="relative z-10 pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Development Roadmap
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Our journey to build the future of privacy-preserving credit scoring
            </p>

            {/* Progress Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Progress</span>
                <span className="text-sm text-primary font-semibold">
                  Phase {currentPhaseIndex + 1} of {roadmapPhases.length}
                </span>
              </div>
              <div className="h-3 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-primary to-green-500 rounded-full"
                />
              </div>
            </div>
          </motion.div>

          {/* Timeline - Desktop */}
          <div className="hidden lg:block mb-16">
            <div className="relative">
              {/* Horizontal Line */}
              <div className="absolute top-10 left-0 right-0 h-1 bg-border">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-primary to-green-500"
                />
              </div>

              {/* Phase Icons */}
              <div className="flex justify-between">
                {roadmapPhases.map((phase, index) => (
                  <motion.div
                    key={phase.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    className="flex flex-col items-center"
                    style={{ width: `${100 / roadmapPhases.length}%` }}
                    onMouseEnter={() => setHoveredPhase(phase.id)}
                    onMouseLeave={() => setHoveredPhase(null)}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedPhase(phase)}
                          className={`relative w-20 h-20 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 ${
                            phase.status === 'completed' ? 'bg-green-500/20 border-green-500' :
                            phase.status === 'current' ? 'bg-primary/20 border-primary glow-primary' :
                            'bg-secondary border-border'
                          } ${hoveredPhase === phase.id ? 'shadow-lg' : ''}`}
                        >
                          <phase.icon className={`w-8 h-8 ${
                            phase.status === 'completed' ? 'text-green-400' :
                            phase.status === 'current' ? 'text-primary' :
                            'text-muted-foreground'
                          }`} />
                          
                          {/* Status indicator */}
                          <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${
                            statusStyles[phase.status].bg
                          }`}>
                            {phase.status === 'completed' && <CheckCircle className="w-4 h-4 text-white" />}
                            {phase.status === 'current' && <Zap className="w-4 h-4 text-primary-foreground animate-pulse" />}
                            {phase.status === 'upcoming' && <Circle className="w-4 h-4 text-muted" />}
                          </div>
                        </motion.button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{phase.title}</p>
                      </TooltipContent>
                    </Tooltip>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.15 + 0.3 }}
                      className="mt-4 text-center"
                    >
                      <Badge className={statusStyles[phase.status].badge}>
                        {phase.quarter}
                      </Badge>
                      <p className="font-semibold text-foreground mt-2 text-sm">{phase.title}</p>
                      <p className="text-xs text-muted-foreground">{phase.subtitle}</p>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Timeline - Mobile */}
          <div className="lg:hidden space-y-4 mb-8">
            {roadmapPhases.map((phase, index) => (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card 
                  className={`bg-card border-2 cursor-pointer transition-all ${
                    phase.status === 'current' ? 'border-primary glow-primary' :
                    phase.status === 'completed' ? 'border-green-500/50' :
                    'border-border'
                  }`}
                  onClick={() => setSelectedPhase(phase)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                        phase.status === 'completed' ? 'bg-green-500/20' :
                        phase.status === 'current' ? 'bg-primary/20' :
                        'bg-secondary'
                      }`}>
                        <phase.icon className={`w-7 h-7 ${statusStyles[phase.status].text}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">{phase.title}</h3>
                          <Badge className={statusStyles[phase.status].badge}>
                            {phase.quarter}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{phase.subtitle}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Phase Details Cards - Desktop */}
          <div className="hidden lg:grid grid-cols-3 gap-6">
            {roadmapPhases.slice(0, 3).map((phase, index) => (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              >
                <Card className={`bg-card border-border h-full cursor-pointer card-hover ${
                  phase.status === 'current' ? 'border-primary/50' : ''
                }`} onClick={() => setSelectedPhase(phase)}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge className={statusStyles[phase.status].badge}>
                        {phase.status.charAt(0).toUpperCase() + phase.status.slice(1)}
                      </Badge>
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-foreground">{phase.title}</CardTitle>
                    <CardDescription>{phase.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {phase.milestones.slice(0, 3).map((milestone, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle className={`w-4 h-4 ${
                            phase.status === 'completed' ? 'text-green-400' :
                            phase.status === 'current' && i === 0 ? 'text-primary' :
                            'text-muted-foreground'
                          }`} />
                          <span className="text-muted-foreground">{milestone}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Phase Detail Modal */}
          <Dialog open={!!selectedPhase} onOpenChange={() => setSelectedPhase(null)}>
            <DialogContent className="bg-card border-border max-w-lg">
              {selectedPhase && (
                <>
                  <DialogHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                        selectedPhase.status === 'completed' ? 'bg-green-500/20' :
                        selectedPhase.status === 'current' ? 'bg-primary/20' :
                        'bg-secondary'
                      }`}>
                        <selectedPhase.icon className={`w-8 h-8 ${statusStyles[selectedPhase.status].text}`} />
                      </div>
                      <div>
                        <Badge className={statusStyles[selectedPhase.status].badge}>
                          {selectedPhase.quarter}
                        </Badge>
                        <DialogTitle className="text-foreground mt-1">{selectedPhase.title}</DialogTitle>
                        <DialogDescription>{selectedPhase.subtitle}</DialogDescription>
                      </div>
                    </div>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-muted-foreground text-sm">
                      {selectedPhase.details}
                    </p>
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Key Milestones</h4>
                      <ul className="space-y-2">
                        {selectedPhase.milestones.map((milestone, i) => (
                          <li key={i} className="flex items-center gap-3 text-sm">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              selectedPhase.status === 'completed' ? 'bg-green-500/20' :
                              selectedPhase.status === 'current' && i <= 1 ? 'bg-primary/20' :
                              'bg-secondary'
                            }`}>
                              <CheckCircle className={`w-4 h-4 ${
                                selectedPhase.status === 'completed' ? 'text-green-400' :
                                selectedPhase.status === 'current' && i <= 1 ? 'text-primary' :
                                'text-muted-foreground'
                              }`} />
                            </div>
                            <span className="text-foreground">{milestone}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
};

export default Roadmap;
