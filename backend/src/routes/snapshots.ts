// src/routes/snapshots.ts
import express from 'express';
import { SnapshotStorage } from '../storage/snapshotStorage.ts';

const router = express.Router();

router.get('/', (req, res) => {
  const snapshots = SnapshotStorage.getAll();
  res.json(snapshots);
});

export default router;
