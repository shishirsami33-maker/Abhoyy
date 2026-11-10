// Server-Side Internal Financial Configuration & Budgeting Estimates
// IMPORTANT: Keep server-side only. Do not expose in client-facing components.

export const ESTIMATED_VARIABLE_COSTS_BDT: Record<5 | 10 | 15 | 20, number> = {
  5: 17,
  10: 33,
  15: 50,
  20: 67,
};

export const PAYMENT_PROCESSING_FEE_RATE = 0.02; // 2% bKash processing fee

export interface CostBreakdown {
  durationMinutes: 5 | 10 | 15 | 20;
  estimatedAiCost: number;
  reportGenerationCost: number;
  recordingStorageCost: number;
  totalVariableCost: number;
}

export interface TransactionFinancials {
  transactionId: string;
  grossRevenue: number;
  processingFee: number;
  netRevenue: number;
  variableSessionCost: number;
  contributionMargin: number;
  contributionMarginPercent: number;
}

/**
 * Calculate internal contribution margin for a session or package purchase.
 */
export function calculateContribution(
  grossRevenue: number,
  durationMinutes: 5 | 10 | 15 | 20
): TransactionFinancials {
  const processingFee = Math.round(grossRevenue * PAYMENT_PROCESSING_FEE_RATE * 100) / 100;
  const netRevenue = grossRevenue - processingFee;
  const variableSessionCost = ESTIMATED_VARIABLE_COSTS_BDT[durationMinutes] || 0;
  const contributionMargin = netRevenue - variableSessionCost;
  const contributionMarginPercent =
    grossRevenue > 0 ? Math.round((contributionMargin / grossRevenue) * 1000) / 10 : 0;

  return {
    transactionId: `fin_${Date.now()}`,
    grossRevenue,
    processingFee,
    netRevenue,
    variableSessionCost,
    contributionMargin,
    contributionMarginPercent,
  };
}
