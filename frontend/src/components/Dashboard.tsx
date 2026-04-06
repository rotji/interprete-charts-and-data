import React, { useEffect, useState } from 'react';
import { fetchSnapshots } from '../services/api';
import type { MarketSnapshot } from '../services/api';
import styles from '../styles/app.module.css';

const Dashboard: React.FC = () => {
  const [snapshots, setSnapshots] = useState<MarketSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSnapshots()
      .then(setSnapshots)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.dashboard}>
      <h1>Market Snapshots</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Price</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {snapshots.map((snap, idx) => (
              <tr key={idx}>
                <td>{new Date(snap.timestamp).toLocaleString()}</td>
                <td>{snap.price}</td>
                <td>{snap.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Dashboard;
