export const SignalDirectionEnum = ['LONG', 'SHORT', 'NEUTRAL'];

export const StrategyTypeEnum = [
  'macro',
  'onchain',
  'anti_trade',
  'structure',
  'liquidity',
  'trend',
  'mean_reversion',
  'volatility',
];

export const StrategyStatusEnum = ['active', 'weak', 'inactive'];

export function getSignalDirectionFromScore(score) {
  if (score > 0) return 'LONG';
  if (score <= 0) return 'SHORT';
  return 'NEUTRAL';
}

export function clampConfidence(score) {
  const raw = 50 + Math.abs(score) * 7.5;
  return Math.min(94, Math.max(51, raw));
}
