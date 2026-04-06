// src/features/stateClassifier.ts
import type { MarketFeatures } from './featureCalculator';

export type MarketState =
  | 'WIDE_UNCERTAINTY'
  | 'EQUILIBRIUM'
  | 'CONVERGING'
  | 'TRANSITIONING'
  | 'VOLATILE_REPRICING'
  | 'NEAR_RESOLUTION'
  | 'UNKNOWN';

export function classifyState(features: MarketFeatures): MarketState {
  if (!features) return 'UNKNOWN';
  const { concentration, volatility, spread, trendStrength } = features;

  if (concentration !== null && concentration > 0.95 && spread !== null && spread > 0.8) {
    return 'CONVERGING';
  }
  if (volatility !== null && volatility > 0.1 && Math.abs(trendStrength ?? 0) > 0.05) {
    return 'VOLATILE_REPRICING';
  }
  if (concentration !== null && concentration < 0.7 && (spread ?? 0) < 0.3) {
    return 'WIDE_UNCERTAINTY';
  }
  if (concentration !== null && concentration > 0.9 && (spread ?? 0) < 0.2) {
    return 'EQUILIBRIUM';
  }
  if (trendStrength !== null && Math.abs(trendStrength) > 0.02) {
    return 'TRANSITIONING';
  }
  if (concentration !== null && concentration > 0.98 && spread !== null && spread > 0.95) {
    return 'NEAR_RESOLUTION';
  }
  return 'UNKNOWN';
}
