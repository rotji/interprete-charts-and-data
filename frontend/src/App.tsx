import React from 'react';
import Dashboard from './components/Dashboard';
import PolymarketDashboard from './components/PolymarketDashboard';
import styles from './styles/app.module.css';

function App() {
  return (
    <div className={styles.appRoot}>
      <Dashboard />
      <PolymarketDashboard />
    </div>
  );
}

export default App;
