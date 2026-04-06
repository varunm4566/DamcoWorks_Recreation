import express  from 'express';
import cors     from 'cors';
import dotenv   from 'dotenv';
dotenv.config({ path: '../.env' });

import {
  getAllBenchResources,
  updateActionPlan,
  getAllSkills,
  getDepartmentCounts,
  getFutureBench,
} from './models/bench.model.js';

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

// ── Health ─────────────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } });
});

// ── Bench ──────────────────────────────────────────────────────────────────────
app.get('/api/bench', async (_req, res) => {
  try {
    const data = await getAllBenchResources();
    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to fetch bench resources' });
  }
});

app.patch('/api/bench/:id/action-plan', async (req, res) => {
  try {
    const data = await updateActionPlan(Number(req.params.id), req.body);
    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/bench/skills', async (_req, res) => {
  try {
    const data = await getAllSkills();
    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to fetch skills' });
  }
});

app.get('/api/bench/departments', async (_req, res) => {
  try {
    const data = await getDepartmentCounts();
    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to fetch departments' });
  }
});

app.get('/api/bench/future', async (_req, res) => {
  try {
    const data = await getFutureBench();
    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to fetch future bench' });
  }
});

// ── 404 + global error ─────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ success: false, error: 'Route not found' }));

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

app.listen(PORT, () => console.log(`DamcoWorks server running on http://localhost:${PORT}`));
