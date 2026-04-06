// src/services/polymarketApi.ts


export interface MarketFeatures {
  trendStrength: number | null;
  volatility: number | null;
  concentration: number | null;
  momentum: number | null;
  rateOfChange: number | null;
  spread: number | null;
}

export interface PolymarketMarket {
  id: string;
  question: string;
  categories: string[];
  endTime: string;
  volume: number;
  outcomes: Array<{
    name: string;
    price: number;
  }>;
  features?: MarketFeatures;
  state?: string;
}

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';


export async function fetchPolymarkets(): Promise<PolymarketMarket[]> {
  const res = await fetch(`${API_BASE}/polymarkets`);
  if (!res.ok) throw new Error('Failed to fetch Polymarket markets');
  return res.json();
}
