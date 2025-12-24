import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, Star, Gift, Coins, Target, Award,
  Flame, Zap, Crown, Medal, TrendingUp, Lock
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { MatrixBackground } from '@/components/layout/MatrixBackground';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useWallet } from '@/contexts/WalletContext';

interface Reward {
  id: string;
  name: string;
  description: string;
  type: 'token' | 'nft' | 'badge';
  amount?: number;
  earned: boolean;
  earnedAt?: string;
  icon: typeof Trophy;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  progress: number;
  target: number;
  reward: number;
  icon: typeof Trophy;
  unlocked: boolean;
}

const mockRewards: Reward[] = [
  {
    id: '1',
    name: 'First Submission',
    description: 'Submit your first encrypted profile',
    type: 'badge',
    earned: true,
    earnedAt: '2024-01-15',
    icon: Star,
    rarity: 'common'
  },
  {
    id: '2',
    name: 'CCO Pioneer',
    description: 'Early adopter of the CCO platform',
    type: 'nft',
    earned: true,
    earnedAt: '2024-01-10',
    icon: Crown,
    rarity: 'legendary'
  },
  {
    id: '3',
    name: 'Credit Master',
    description: 'Achieve Excellent credit tier',
    type: 'token',
    amount: 100,
    earned: false,
    icon: Trophy,
    rarity: 'epic'
  },
  {
    id: '4',
    name: 'Active Lender',
    description: 'Complete 10 decryption requests',
    type: 'token',
    amount: 50,
    earned: false,
    icon: Zap,
    rarity: 'rare'
  },
  {
    id: '5',
    name: 'Privacy Guardian',
    description: 'Maintain encrypted profile for 30 days',
    type: 'nft',
    earned: true,
    earnedAt: '2024-02-15',
    icon: Lock,
    rarity: 'epic'
  },
  {
    id: '6',
    name: 'Community Champion',
    description: 'Refer 5 users to the platform',
    type: 'token',
    amount: 200,
    earned: false,
    icon: Medal,
    rarity: 'legendary'
  },
];

const achievements: Achievement[] = [
  {
    id: '1',
    name: 'Profile Submissions',
    description: 'Submit encrypted profiles',
    progress: 3,
    target: 5,
    reward: 25,
    icon: Lock,
    unlocked: false
  },
  {
    id: '2',
    name: 'Score Improvements',
    description: 'Improve your credit score',
    progress: 2,
    target: 3,
    reward: 50,
    icon: TrendingUp,
    unlocked: false
  },
  {
    id: '3',
    name: 'Consecutive Days',
    description: 'Active days in a row',
    progress: 7,
    target: 7,
    reward: 75,
    icon: Flame,
    unlocked: true
  },
  {
    id: '4',
    name: 'Lending Activity',
    description: 'Approve decryption requests',
    progress: 8,
    target: 10,
    reward: 100,
    icon: Gift,
    unlocked: false
  },
];

const leaderboard = [
  { rank: 1, address: '0x742d...1a1f8', tokens: 1250, tier: 'Excellent' },
  { rank: 2, address: '0x8ba1...DBA72', tokens: 980, tier: 'Good' },
  { rank: 3, address: '0x1CBd...c9Ec', tokens: 875, tier: 'Excellent' },
  { rank: 4, address: '0x3f4a...9e2c', tokens: 720, tier: 'Good' },
  { rank: 5, address: '0x5c2b...8a1d', tokens: 650, tier: 'Good' },
];

const rarityStyles: Record<string, string> = {
  common: 'border-muted-foreground bg-muted/20',
  rare: 'border-blue-500 bg-blue-500/20',
  epic: 'border-purple-500 bg-purple-500/20',
  legendary: 'border-primary bg-primary/20 glow-primary',
};

const Rewards = () => {
  const { address, isConnected } = useWallet();
  const [activeTab, setActiveTab] = useState<'rewards' | 'achievements' | 'leaderboard'>('rewards');

  const totalTokens = 175;
  const earnedRewards = mockRewards.filter(r => r.earned).length;

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
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Rewards & Achievements
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Earn CCO tokens and NFTs by participating in the platform
            </p>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            <Card className="bg-card border-border card-hover">
              <CardContent className="pt-6 text-center">
                <Coins className="w-10 h-10 text-primary mx-auto mb-3" />
                <p className="text-3xl font-bold text-gradient mb-1">{totalTokens}</p>
                <p className="text-sm text-muted-foreground">CCO Tokens Earned</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border card-hover">
              <CardContent className="pt-6 text-center">
                <Trophy className="w-10 h-10 text-primary mx-auto mb-3" />
                <p className="text-3xl font-bold text-gradient mb-1">{earnedRewards}/{mockRewards.length}</p>
                <p className="text-sm text-muted-foreground">Rewards Collected</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border card-hover">
              <CardContent className="pt-6 text-center">
                <Target className="w-10 h-10 text-primary mx-auto mb-3" />
                <p className="text-3xl font-bold text-gradient mb-1">#12</p>
                <p className="text-sm text-muted-foreground">Leaderboard Rank</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center gap-2 mb-8"
          >
            {(['rewards', 'achievements', 'leaderboard'] as const).map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? 'default' : 'outline'}
                onClick={() => setActiveTab(tab)}
                className="capitalize"
              >
                {tab === 'rewards' && <Gift className="w-4 h-4 mr-2" />}
                {tab === 'achievements' && <Award className="w-4 h-4 mr-2" />}
                {tab === 'leaderboard' && <Trophy className="w-4 h-4 mr-2" />}
                {tab}
              </Button>
            ))}
          </motion.div>

          {/* Rewards Grid */}
          {activeTab === 'rewards' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {mockRewards.map((reward, index) => (
                <motion.div
                  key={reward.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`bg-card border-2 ${rarityStyles[reward.rarity]} ${
                    reward.earned ? '' : 'opacity-60'
                  } card-hover`}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          reward.earned ? 'bg-primary/20' : 'bg-secondary'
                        }`}>
                          <reward.icon className={`w-6 h-6 ${
                            reward.earned ? 'text-primary' : 'text-muted-foreground'
                          }`} />
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge variant="outline" className="capitalize text-xs">
                            {reward.rarity}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {reward.type.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">{reward.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{reward.description}</p>
                      {reward.amount && (
                        <div className="flex items-center gap-1 text-primary mb-3">
                          <Coins className="w-4 h-4" />
                          <span className="font-semibold">{reward.amount} CCO</span>
                        </div>
                      )}
                      {reward.earned ? (
                        <div className="flex items-center gap-2 text-green-400">
                          <Award className="w-4 h-4" />
                          <span className="text-sm">Earned {reward.earnedAt}</span>
                        </div>
                      ) : (
                        <Button variant="outline" size="sm" className="w-full">
                          View Requirements
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Achievements */}
          {activeTab === 'achievements' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`bg-card border-border ${
                    achievement.unlocked ? 'border-primary/50' : ''
                  }`}>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                          achievement.unlocked ? 'bg-primary/20' : 'bg-secondary'
                        }`}>
                          <achievement.icon className={`w-7 h-7 ${
                            achievement.unlocked ? 'text-primary' : 'text-muted-foreground'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-foreground">{achievement.name}</h3>
                            <div className="flex items-center gap-1 text-primary">
                              <Coins className="w-4 h-4" />
                              <span className="font-semibold">{achievement.reward} CCO</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                          <div className="flex items-center gap-3">
                            <Progress 
                              value={(achievement.progress / achievement.target) * 100} 
                              className="flex-1 h-2"
                            />
                            <span className="text-sm text-muted-foreground">
                              {achievement.progress}/{achievement.target}
                            </span>
                          </div>
                        </div>
                        {achievement.unlocked && (
                          <Button variant="cta" size="sm">
                            Claim
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Leaderboard */}
          {activeTab === 'leaderboard' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Trophy className="w-5 h-5 text-primary" />
                    Top Earners
                  </CardTitle>
                  <CardDescription>
                    Users with the most CCO tokens earned
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {leaderboard.map((entry, index) => (
                      <motion.div
                        key={entry.rank}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center justify-between p-4 rounded-lg ${
                          entry.rank <= 3 ? 'bg-primary/10 border border-primary/30' : 'bg-secondary/30'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                            entry.rank === 1 ? 'bg-yellow-500 text-yellow-950' :
                            entry.rank === 2 ? 'bg-gray-400 text-gray-900' :
                            entry.rank === 3 ? 'bg-amber-600 text-amber-950' :
                            'bg-secondary text-foreground'
                          }`}>
                            {entry.rank}
                          </div>
                          <div>
                            <p className="font-mono text-foreground">{entry.address}</p>
                            <Badge variant="outline" className="text-xs mt-1">
                              {entry.tier}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-primary">
                          <Coins className="w-5 h-5" />
                          <span className="font-bold text-lg">{entry.tokens}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Rewards;
