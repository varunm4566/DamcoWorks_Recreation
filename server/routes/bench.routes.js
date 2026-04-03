import { Router } from 'express';
import {
  getAllBenchResources,
  updateActionPlan,
  getAllSkills,
  getDepartmentCounts,
  getFutureBench,
} from '../models/bench.model.js';

const router = Router();

/** GET /api/bench */
router.get('/', async (_req, res) => {
  try {
    const data = await getAllBenchResources();
    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to fetch bench resources' });
  }
});

/** GET /api/bench/skills */
router.get('/skills', async (_req, res) => {
  try {
    const data = await getAllSkills();
    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to fetch skills' });
  }
});

/** GET /api/bench/departments */
router.get('/departments', async (_req, res) => {
  try {
    const data = await getDepartmentCounts();
    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to fetch departments' });
  }
});

/** GET /api/bench/future */
router.get('/future', async (_req, res) => {
  try {
    const data = await getFutureBench();
    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to fetch future bench' });
  }
});

/** PATCH /api/bench/:id/action-plan */
router.patch('/:id/action-plan', async (req, res) => {
  try {
    const data = await updateActionPlan(Number(req.params.id), req.body);
    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
