// src/collectors/polymarketCollector.ts
import fetch from 'node-fetch';

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
}

export class PolymarketCollector {
  private apiUrl: string = 'https://gamma-api.polymarket.com/markets';

  async fetchMarkets(): Promise<PolymarketMarket[]> {
    try {
      const response = await fetch(this.apiUrl);
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Expected JSON, got: ${text.slice(0, 100)}`);
      }
      const data = await response.json();
      // Map to a simplified structure for gamma-api.polymarket.com
      return data.map((m: any) => ({
        id: m.id,
        question: m.question,
        categories: [m.category],
        endTime: m.endDate,
        volume: parseFloat(m.volume),
        outcomes: (Array.isArray(m.outcomes) ? m.outcomes : JSON.parse(m.outcomes)).map((o: any, idx: number) => ({
          name: o,
          price: Number(Array.isArray(m.outcomePrices) ? m.outcomePrices[idx] : (JSON.parse(m.outcomePrices)[idx] || null)),
        })),
      }));
    } catch (error) {
      console.error('Error fetching Polymarket data:', error);
      return [];
    }
  }
}
