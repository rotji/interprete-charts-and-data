// src/features/featureStore.ts
import type { MarketFeatures } from './featureCalculator';

// In-memory store for demo; replace with DB for production
const featureHistory: Record<string, MarketFeatures[]> = {};

export function saveFeatures(marketId: string, features: MarketFeatures) {
  if (!featureHistory[marketId]) featureHistory[marketId] = [];
  featureHistory[marketId].push(features);
}

export function getLatestFeatures(marketId: string): MarketFeatures | null {
  const arr = featureHistory[marketId];
  return arr && arr.length ? arr[arr.length - 1] : null;
}

export function getAllFeatures(marketId: string): MarketFeatures[] {
  return featureHistory[marketId] || [];
}

export function getAllMarketsWithFeatures() {
  return Object.keys(featureHistory);
}
