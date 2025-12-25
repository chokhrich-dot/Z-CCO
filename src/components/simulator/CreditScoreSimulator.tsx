import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, TrendingDown, DollarSign, Shield, CreditCard, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type CreditTier = 'Poor' | 'Fair' | 'Good' | 'Excellent';

interface TierInfo {
  tier: CreditTier;
  color: string;
  bgColor: string;
  description: string;
  minScore: number;
  maxScore: number;
}

const TIER_CONFIG: Record<CreditTier, TierInfo> = {
  Poor: {
    tier: 'Poor',
    color: 'text-red-400',
    bgColor: 'bg-red-500/20 border-red-500/30',
    description: 'High risk - Limited lending options',
    minScore: 0,
    maxScore: 299,
  },
  Fair: {
    tier: 'Fair',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20 border-yellow-500/30',
    description: 'Moderate risk - Standard rates apply',
    minScore: 300,
    maxScore: 549,
  },
  Good: {
    tier: 'Good',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20 border-blue-500/30',
    description: 'Low risk - Competitive rates available',
    minScore: 550,
    maxScore: 749,
  },
  Excellent: {
    tier: 'Excellent',
    color: 'text-green-400',
    bgColor: 'bg-green-500/20 border-green-500/30',
    description: 'Minimal risk - Best rates & terms',
    minScore: 750,
    maxScore: 1000,
  },
};

const calculateTier = (income: number, collateral: number, debt: number): { tier: CreditTier; score: number } => {
  // Normalize values (0-100k range for each)
  const normalizedIncome = Math.min(income / 100000, 1);
  const normalizedCollateral = Math.min(collateral / 100000, 1);
  const normalizedDebt = Math.min(debt / 100000, 1);
  
  // Score calculation: income and collateral increase score, debt decreases it
  // Weights: income 40%, collateral 35%, debt -25%
  const rawScore = (normalizedIncome * 0.4 + normalizedCollateral * 0.35 - normalizedDebt * 0.25) * 1000;
  const score = Math.max(0, Math.min(1000, Math.round(rawScore)));
  
  let tier: CreditTier;
  if (score < 300) tier = 'Poor';
  else if (score < 550) tier = 'Fair';
  else if (score < 750) tier = 'Good';
  else tier = 'Excellent';
  
  return { tier, score };
};

export const CreditScoreSimulator: React.FC = () => {
  const [income, setIncome] = useState(50000);
  const [collateral, setCollateral] = useState(25000);
  const [debt, setDebt] = useState(10000);
  
  const { tier, score } = useMemo(() => calculateTier(income, collateral, debt), [income, collateral, debt]);
  const tierInfo = TIER_CONFIG[tier];
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <Calculator className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Credit Score Simulator</CardTitle>
            <CardDescription>
              Preview how changes affect your credit tier
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Score Display */}
        <motion.div
          key={tier}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`p-6 rounded-xl border ${tierInfo.bgColor} text-center`}
        >
          <div className="text-sm text-muted-foreground mb-1">Simulated Score</div>
          <div className="text-5xl font-bold mb-2">
            <span className={tierInfo.color}>{score}</span>
            <span className="text-muted-foreground text-lg">/1000</span>
          </div>
          <Badge variant="outline" className={`${tierInfo.color} border-current`}>
            {tier}
          </Badge>
          <p className="text-sm text-muted-foreground mt-2">{tierInfo.description}</p>
        </motion.div>

        {/* Sliders */}
        <div className="space-y-6">
          {/* Income Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-400" />
                <span className="font-medium">Annual Income</span>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3.5 w-3.5 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Higher income improves your credit tier
                  </TooltipContent>
                </Tooltip>
              </div>
              <span className="text-green-400 font-mono">{formatCurrency(income)}</span>
            </div>
            <Slider
              value={[income]}
              onValueChange={([v]) => setIncome(v)}
              min={0}
              max={200000}
              step={1000}
              className="[&_[role=slider]]:bg-green-400"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>$0</span>
              <span>$200,000</span>
            </div>
          </div>

          {/* Collateral Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-400" />
                <span className="font-medium">Collateral Value</span>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3.5 w-3.5 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Assets that secure your creditworthiness
                  </TooltipContent>
                </Tooltip>
              </div>
              <span className="text-blue-400 font-mono">{formatCurrency(collateral)}</span>
            </div>
            <Slider
              value={[collateral]}
              onValueChange={([v]) => setCollateral(v)}
              min={0}
              max={200000}
              step={1000}
              className="[&_[role=slider]]:bg-blue-400"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>$0</span>
              <span>$200,000</span>
            </div>
          </div>

          {/* Debt Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-red-400" />
                <span className="font-medium">Outstanding Debt</span>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3.5 w-3.5 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Higher debt lowers your credit tier
                  </TooltipContent>
                </Tooltip>
              </div>
              <span className="text-red-400 font-mono">{formatCurrency(debt)}</span>
            </div>
            <Slider
              value={[debt]}
              onValueChange={([v]) => setDebt(v)}
              min={0}
              max={200000}
              step={1000}
              className="[&_[role=slider]]:bg-red-400"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>$0</span>
              <span>$200,000</span>
            </div>
          </div>
        </div>

        {/* Tier Scale */}
        <div className="pt-4 border-t border-border/50">
          <div className="text-sm text-muted-foreground mb-3">Credit Tier Scale</div>
          <div className="flex gap-1">
            {(['Poor', 'Fair', 'Good', 'Excellent'] as CreditTier[]).map((t) => {
              const info = TIER_CONFIG[t];
              const isActive = t === tier;
              return (
                <div
                  key={t}
                  className={`flex-1 p-2 rounded text-center text-xs transition-all ${
                    isActive
                      ? `${info.bgColor} ${info.color} font-medium`
                      : 'bg-muted/30 text-muted-foreground'
                  }`}
                >
                  <div>{t}</div>
                  <div className="text-[10px] opacity-70">
                    {info.minScore}-{info.maxScore}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tips */}
        <div className="p-3 rounded-lg bg-muted/30 text-sm">
          <div className="flex items-start gap-2">
            {score < 550 ? (
              <>
                <TrendingUp className="h-4 w-4 text-yellow-400 mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <span className="text-foreground font-medium">Tip:</span> Increase income or collateral, or reduce debt to improve your tier.
                </span>
              </>
            ) : (
              <>
                <TrendingDown className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <span className="text-foreground font-medium">Great!</span> Your current profile qualifies for competitive lending rates.
                </span>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
