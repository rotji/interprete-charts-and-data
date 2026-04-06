import express, { type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import snapshotsRouter from './routes/snapshots.ts';
import polymarketsRouter from './routes/polymarkets.ts';
import { MarketCollector } from './collectors/marketCollector.ts';
import { SnapshotStorage } from './storage/snapshotStorage.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());


// API route for retrieving snapshots
app.use('/api/snapshots', snapshotsRouter);

// API route for Polymarket markets
app.use('/api/polymarkets', polymarketsRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Backend is running!');
});

// --- Market Data Collector Setup ---
// Example: CoinGecko BTC-USD price API
const BTC_API = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd';
const collector = new MarketCollector(BTC_API, 'coingecko-btc-usd');

// Fetch and store a snapshot every 60 seconds
setInterval(async () => {
  const snapshot = await collector.fetchSnapshot();
  if (snapshot) {
    SnapshotStorage.save(snapshot);
    console.log('Snapshot saved:', snapshot);
  }
}, 60_000);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
