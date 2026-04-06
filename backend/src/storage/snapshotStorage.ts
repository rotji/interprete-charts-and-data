// src/storage/snapshotStorage.ts
import type { MarketSnapshot } from '../collectors/marketCollector.ts';
import fs from 'fs';
import path from 'path';

const SNAPSHOT_FILE = path.join(process.cwd(), 'snapshots.json');

export class SnapshotStorage {
  static save(snapshot: MarketSnapshot) {
    let snapshots: MarketSnapshot[] = [];
    if (fs.existsSync(SNAPSHOT_FILE)) {
      const raw = fs.readFileSync(SNAPSHOT_FILE, 'utf-8');
      snapshots = JSON.parse(raw);
    }
    snapshots.push(snapshot);
    fs.writeFileSync(SNAPSHOT_FILE, JSON.stringify(snapshots, null, 2));
  }

  static getAll(): MarketSnapshot[] {
    if (!fs.existsSync(SNAPSHOT_FILE)) return [];
    const raw = fs.readFileSync(SNAPSHOT_FILE, 'utf-8');
    return JSON.parse(raw);
  }
}
