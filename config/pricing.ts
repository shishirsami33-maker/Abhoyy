// Central Pricing & Billing Configuration for Abhoyy

export interface IndividualMockPlan {
  durationMinutes: 10 | 15 | 20;
  price: number;
  isRecommended?: boolean;
}

export interface MinutePackage {
  id: 'starter' | 'practice' | 'career_builder';
  nameKey: string;
  includedMinutes: number;
  price: number;
  isBestValue?: boolean;
}

// 1. Individual Mock Interviews (BDT)
export const INDIVIDUAL_MOCK_PLANS: IndividualMockPlan[] = [
  { durationMinutes: 10, price: 79 },
  { durationMinutes: 15, price: 109, isRecommended: true }, // Recommended default option
  { durationMinutes: 20, price: 139 },
];

export const INDIVIDUAL_MOCK_PRICES: Record<10 | 15 | 20, number> = {
  10: 79,
  15: 109,
  20: 139,
};

// 2. Minute Packages (BDT)
export const MINUTE_PACKAGES: MinutePackage[] = [
  {
    id: 'starter',
    nameKey: 'pricing.packages.starter',
    includedMinutes: 30,
    price: 219,
  },
  {
    id: 'practice',
    nameKey: 'pricing.packages.practice',
    includedMinutes: 60,
    price: 399,
  },
  {
    id: 'career_builder',
    nameKey: 'pricing.packages.careerBuilder',
    includedMinutes: 100,
    price: 599,
    isBestValue: true, // Marked as "Best Value"
  },
];

// 3. Free First Mock Interview Configuration
export const FREE_MOCK_CONFIG = {
  durationMinutes: 5 as const,
  price: 0,
  maxPerVerifiedPhone: 1,
};

// 4. Wallet & Policy Durations
export const PURCHASED_MINUTES_EXPIRY_DAYS = 90; // Purchased minutes expire after 90 days
export const RECORDING_RETENTION_DAYS = 30; // Maximum retention period of 30 days if not downloaded
