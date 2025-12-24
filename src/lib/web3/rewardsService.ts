import { type CreditTier } from './config';

export interface RewardAction {
  type: 'profile_submit' | 'score_compute' | 'decryption_complete' | 'tier_improvement';
  tokens: number;
  description: string;
}

export interface EarnedReward {
  id: string;
  action: RewardAction['type'];
  tokens: number;
  earnedAt: string;
  txHash?: string;
}

export interface UserRewardsState {
  totalTokens: number;
  earnedRewards: EarnedReward[];
  pendingRewards: number;
  lastUpdated: string;
}

const REWARD_ACTIONS: Record<RewardAction['type'], RewardAction> = {
  profile_submit: {
    type: 'profile_submit',
    tokens: 25,
    description: 'Submit encrypted profile',
  },
  score_compute: {
    type: 'score_compute',
    tokens: 50,
    description: 'Credit score computed',
  },
  decryption_complete: {
    type: 'decryption_complete',
    tokens: 10,
    description: 'Decryption request completed',
  },
  tier_improvement: {
    type: 'tier_improvement',
    tokens: 100,
    description: 'Credit tier improved',
  },
};

const TIER_BONUSES: Record<CreditTier, number> = {
  Poor: 0,
  Fair: 25,
  Good: 50,
  Excellent: 100,
};

const STORAGE_KEY = 'cco_user_rewards';

class RewardsService {
  private state: UserRewardsState;

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): UserRewardsState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading rewards state:', error);
    }
    
    return {
      totalTokens: 0,
      earnedRewards: [],
      pendingRewards: 0,
      lastUpdated: new Date().toISOString(),
    };
  }

  private saveState(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (error) {
      console.error('Error saving rewards state:', error);
    }
  }

  getState(): UserRewardsState {
    return { ...this.state };
  }

  getTotalTokens(): number {
    return this.state.totalTokens;
  }

  getEarnedRewards(): EarnedReward[] {
    return [...this.state.earnedRewards];
  }

  getRewardForAction(actionType: RewardAction['type']): RewardAction {
    return REWARD_ACTIONS[actionType];
  }

  getTierBonus(tier: CreditTier): number {
    return TIER_BONUSES[tier];
  }

  async earnReward(
    actionType: RewardAction['type'],
    txHash?: string
  ): Promise<EarnedReward> {
    const action = REWARD_ACTIONS[actionType];
    
    const reward: EarnedReward = {
      id: `reward_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      action: actionType,
      tokens: action.tokens,
      earnedAt: new Date().toISOString(),
      txHash,
    };

    this.state.earnedRewards.push(reward);
    this.state.totalTokens += action.tokens;
    this.state.lastUpdated = new Date().toISOString();
    
    this.saveState();
    
    // Emit custom event for real-time UI updates
    window.dispatchEvent(new CustomEvent('rewardEarned', { detail: reward }));
    
    return reward;
  }

  async earnTierBonus(tier: CreditTier, txHash?: string): Promise<EarnedReward | null> {
    const bonus = TIER_BONUSES[tier];
    if (bonus === 0) return null;

    const reward: EarnedReward = {
      id: `tier_bonus_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      action: 'tier_improvement',
      tokens: bonus,
      earnedAt: new Date().toISOString(),
      txHash,
    };

    this.state.earnedRewards.push(reward);
    this.state.totalTokens += bonus;
    this.state.lastUpdated = new Date().toISOString();
    
    this.saveState();
    
    window.dispatchEvent(new CustomEvent('rewardEarned', { detail: reward }));
    
    return reward;
  }

  checkAchievements(): {
    profileSubmissions: number;
    decryptionsCompleted: number;
    totalActions: number;
  } {
    const rewards = this.state.earnedRewards;
    
    return {
      profileSubmissions: rewards.filter(r => r.action === 'profile_submit').length,
      decryptionsCompleted: rewards.filter(r => r.action === 'decryption_complete').length,
      totalActions: rewards.length,
    };
  }

  resetState(): void {
    this.state = {
      totalTokens: 0,
      earnedRewards: [],
      pendingRewards: 0,
      lastUpdated: new Date().toISOString(),
    };
    this.saveState();
  }
}

export const rewardsService = new RewardsService();
