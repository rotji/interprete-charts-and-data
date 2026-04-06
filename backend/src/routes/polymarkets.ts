// src/routes/polymarkets.ts

import express from 'express';
import { PolymarketCollector } from '../collectors/polymarketCollector.ts';
import { calculateFeatures } from '../features/featureCalculator.ts';
import { classifyState } from '../features/stateClassifier.ts';

const router = express.Router();
const collector = new PolymarketCollector();


// In-memory price history for demo (reset on server restart)
const priceHistory: Record<string, Array<{ prices: number[] }>> = {};

router.get('/', async (req, res) => {
  const markets = await collector.fetchMarkets();
  const marketsWithFeatures = markets.map(market => {
    // Parse outcome prices as numbers
    const prices = market.outcomes.map(o => parseFloat(o.price));
    if (!priceHistory[market.id]) priceHistory[market.id] = [];
    priceHistory[market.id].push({ prices });
    // Only keep last 20 for memory
    if (priceHistory[market.id].length > 20) priceHistory[market.id].shift();
    const features = calculateFeatures(priceHistory[market.id]);
    const state = classifyState(features);
    return { ...market, features, state };
  });
  res.json(marketsWithFeatures);
});

export default router;
