import React, { useEffect, useState } from 'react';
import { fetchPolymarkets } from '../services/polymarketApi';
import type { PolymarketMarket } from '../services/polymarketApi';
import styles from '../styles/app.module.css';

const PolymarketDashboard: React.FC = () => {
  const [markets, setMarkets] = useState<PolymarketMarket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPolymarkets()
      .then(setMarkets)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.dashboard}>
      <h1>Polymarket Markets</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Question</th>
              <th>Categories</th>
              <th>End Time</th>
              <th>Volume</th>
              <th>Outcomes</th>
              <th>Signals</th>
              <th>State</th>
            </tr>
          </thead>
          <tbody>
            {markets.map((market) => (
              <tr key={market.id}>
                <td>{market.question}</td>
                <td>{market.categories.join(', ')}</td>
                <td>{new Date(market.endTime).toLocaleString()}</td>
                <td>{market.volume}</td>
                <td>
                  {market.outcomes.map((o) => `${o.name}: ${o.price}`).join(' | ')}
                </td>
                <td>
                  {market.features ? (
                    <div className={styles.signalsPanel}>
                      <ul>
                        <li><b>Trend:</b> <span>{market.features.trendStrength?.toFixed(4) ?? '—'}</span></li>
                        <li><b>Volatility:</b> <span>{market.features.volatility?.toFixed(4) ?? '—'}</span></li>
                        <li><b>Concentration:</b> <span>{market.features.concentration?.toFixed(4) ?? '—'}</span></li>
                        <li><b>Momentum:</b> <span>{market.features.momentum?.toFixed(4) ?? '—'}</span></li>
                        <li><b>Rate of Change:</b> <span>{market.features.rateOfChange?.toFixed(4) ?? '—'}</span></li>
                        <li><b>Spread:</b> <span>{market.features.spread?.toFixed(4) ?? '—'}</span></li>
                      </ul>
                    </div>
                  ) : '—'}
                </td>
                <td>
                  {market.state ? (
                    <span style={{
                      display: 'inline-block',
                      padding: '0.25em 0.7em',
                      borderRadius: '1em',
                      background: '#e3e8f7',
                      color: '#1a237e',
                      fontWeight: 600,
                      fontSize: '0.97em',
                      letterSpacing: '0.01em',
                      border: '1.5px solid #b3b8c7',
                    }}>{market.state.replace(/_/g, ' ')}</span>
                  ) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PolymarketDashboard;
