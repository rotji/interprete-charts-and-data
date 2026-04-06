// src/collectors/marketCollector.ts
import fetch from 'node-fetch';

export interface MarketSnapshot {
  timestamp: string;
  price: number;
  source: string;
}

export class MarketCollector {
  private apiUrl: string;
  private source: string;

  constructor(apiUrl: string, source: string) {
    this.apiUrl = apiUrl;
    this.source = source;
  }

  async fetchSnapshot(): Promise<MarketSnapshot | null> {
    try {
      const response = await fetch(this.apiUrl);
      const data = await response.json();
      // Example for a crypto price API (CoinGecko BTC-USD)
      const price = data.bitcoin?.usd ?? data.price ?? null;
      if (price === null) return null;
      return {
        timestamp: new Date().toISOString(),
        price,
        source: this.source,
      };
    } catch (error) {
      console.error('Error fetching market data:', error);
      return null;
    }
  }
}
