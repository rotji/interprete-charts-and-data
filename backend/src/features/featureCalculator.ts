// src/features/featureCalculator.ts
import type { PolymarketMarket } from '../collectors/polymarketCollector';

export interface MarketFeatures {
  trendStrength: number | null;
  volatility: number | null;
  concentration: number | null;
  momentum: number | null;
  rateOfChange: number | null;
  spread: number | null;
}

// Helper: calculate standard deviation
function stddev(arr: number[]): number {
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  return Math.sqrt(arr.reduce((a, b) => a + (b - mean) ** 2, 0) / arr.length);
}

// Calculate features for a market's outcome prices history
export function calculateFeatures(history: Array<{ prices: number[] }>): MarketFeatures {
  if (!history.length) {
    return {
      trendStrength: null,
      volatility: null,
      concentration: null,
      momentum: null,
      rateOfChange: null,
      spread: null,
    };
  }
  // Use the last N points for calculations
  const N = Math.min(10, history.length);
  const recent = history.slice(-N);
  // For simplicity, use the first outcome's price for trend/momentum
  const prices = recent.map(h => h.prices[0]);
  // Trend strength: linear regression slope
  let trendStrength = null;
  if (prices.length > 1) {
    const n = prices.length;
    const x = [...Array(n).keys()];
    const xMean = (n - 1) / 2;
    const yMean = prices.reduce((a, b) => a + b, 0) / n;
    const num = x.reduce((sum, xi, i) => sum + (xi - xMean) * (prices[i] - yMean), 0);
    const den = x.reduce((sum, xi) => sum + (xi - xMean) ** 2, 0);
    trendStrength = den ? num / den : 0;
  }
  // Volatility: stddev of first outcome
  const volatility = prices.length > 1 ? stddev(prices) : null;
  // Concentration: sum of top 2 outcome probs (last point)
  const last = history[history.length - 1].prices;
  const sorted = [...last].sort((a, b) => b - a);
  const concentration = sorted[0] + (sorted[1] || 0);
  // Momentum: difference between last and first
  const momentum = prices.length > 1 ? prices[prices.length - 1] - prices[0] : null;
  // Rate of change: last - previous
  const rateOfChange = prices.length > 1 ? prices[prices.length - 1] - prices[prices.length - 2] : null;
  // Spread: difference between top 2 outcomes
  const spread = sorted[0] - (sorted[1] || 0);
  return {
    trendStrength,
    volatility,
    concentration,
    momentum,
    rateOfChange,
    spread,
  };
}
