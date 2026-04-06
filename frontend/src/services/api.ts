// src/services/api.ts

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

export interface MarketSnapshot {
  timestamp: string;
  price: number;
  source: string;
}

export async function fetchSnapshots(): Promise<MarketSnapshot[]> {
  const res = await fetch(`${API_BASE}/snapshots`);
  if (!res.ok) throw new Error('Failed to fetch snapshots');
  return res.json();
}
