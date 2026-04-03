import { Router } from 'express';
import {
  findAll, getKpiSummary, getDivisionCounts, getById, getDistinctDmPdm,
  getTeamMembers, getInvoices, getCsatSurveys, getContracts,
  addDeliveryThought, updateWorkStatus,
} from '../models/Project.model.js';

const router = Router();

/**
 * GET /api/projects
 * Paginated project list with filters, sorting, division
 */
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = Math.min(parseInt(req.query.pageSize, 10) || 25, 100);
    const sortBy = req.query.sortBy || 'name';
    const sortDir = req.query.sortDir || 'asc';
    const division = req.query.division || 'All';
    const search = req.query.search || '';
    let filters = {};
    if (req.query.filters) {
      try {
        filters = JSON.parse(req.query.filters);
      } catch {
        return res.status(400).json({ success: false, error: 'Invalid filters JSON' });
      }
    }

    const data = await findAll({ page, pageSize, sortBy, sortDir, filters, search, division });
    res.json({ success: true, data });
  } catch (error) {
    console.error('GET /api/projects error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch projects' });
  }
});

/**
 * GET /api/projects/kpi-summary
 * KPI card aggregations, optionally filtered by division
 */
router.get('/kpi-summary', async (req, res) => {
  try {
    const division = req.query.division || 'All';
    const data = await getKpiSummary(division);
    res.json({ success: true, data });
  } catch (error) {
    console.error('GET /api/projects/kpi-summary error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch KPI summary' });
  }
});

/**
 * GET /api/projects/division-counts
 * Project and DM counts per division for tab bar
 */
router.get('/division-counts', async (req, res) => {
  try {
    const data = await getDivisionCounts();
    res.json({ success: true, data });
  } catch (error) {
    console.error('GET /api/projects/division-counts error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch division counts' });
  }
});

/**
 * GET /api/projects/dm-pdm-list
 * Distinct DM/PDM names for dropdown
 */
router.get('/dm-pdm-list', async (req, res) => {
  try {
    const data = await getDistinctDmPdm();
    res.json({ success: true, data });
  } catch (error) {
    console.error('GET /api/projects/dm-pdm-list error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch DM/PDM list' });
  }
});

/**
 * GET /api/projects/:id/team?page=1&pageSize=5
 */
router.get('/:id/team', async (req, res) => {
  try {
    const projectId = parseInt(req.params.id, 10);
    if (isNaN(projectId)) return res.status(400).json({ success: false, error: 'Invalid project ID' });
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = Math.min(parseInt(req.query.pageSize, 10) || 5, 100);
    const data = await getTeamMembers(projectId, page, pageSize);
    res.json({ success: true, data });
  } catch (error) {
    console.error('GET /api/projects/:id/team error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch team members' });
  }
});

/**
 * GET /api/projects/:id/invoices?page=1&pageSize=5
 */
router.get('/:id/invoices', async (req, res) => {
  try {
    const projectId = parseInt(req.params.id, 10);
    if (isNaN(projectId)) return res.status(400).json({ success: false, error: 'Invalid project ID' });
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = Math.min(parseInt(req.query.pageSize, 10) || 5, 100);
    const data = await getInvoices(projectId, page, pageSize);
    res.json({ success: true, data });
  } catch (error) {
    console.error('GET /api/projects/:id/invoices error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch invoices' });
  }
});

/**
 * GET /api/projects/:id/csat?page=1&pageSize=5
 */
router.get('/:id/csat', async (req, res) => {
  try {
    const projectId = parseInt(req.params.id, 10);
    if (isNaN(projectId)) return res.status(400).json({ success: false, error: 'Invalid project ID' });
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = Math.min(parseInt(req.query.pageSize, 10) || 5, 100);
    const data = await getCsatSurveys(projectId, page, pageSize);
    res.json({ success: true, data });
  } catch (error) {
    console.error('GET /api/projects/:id/csat error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch CSAT surveys' });
  }
});

/**
 * GET /api/projects/:id/contracts?page=1&pageSize=5
 */
router.get('/:id/contracts', async (req, res) => {
  try {
    const projectId = parseInt(req.params.id, 10);
    if (isNaN(projectId)) return res.status(400).json({ success: false, error: 'Invalid project ID' });
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = Math.min(parseInt(req.query.pageSize, 10) || 5, 100);
    const data = await getContracts(projectId, page, pageSize);
    res.json({ success: true, data });
  } catch (error) {
    console.error('GET /api/projects/:id/contracts error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch contracts' });
  }
});

/**
 * POST /api/projects/:id/thoughts
 * Body: { note, author, service_quality? }
 */
router.post('/:id/thoughts', async (req, res) => {
  try {
    const projectId = parseInt(req.params.id, 10);
    if (isNaN(projectId)) return res.status(400).json({ success: false, error: 'Invalid project ID' });
    const { note, author, service_quality } = req.body;
    if (!note || !author) return res.status(400).json({ success: false, error: 'note and author are required' });
    const data = await addDeliveryThought(projectId, { note, author, service_quality });
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('POST /api/projects/:id/thoughts error:', error);
    res.status(500).json({ success: false, error: 'Failed to add delivery thought' });
  }
});

/**
 * PATCH /api/projects/:id/work-status
 * Body: { work_status }
 */
router.patch('/:id/work-status', async (req, res) => {
  try {
    const projectId = parseInt(req.params.id, 10);
    if (isNaN(projectId)) return res.status(400).json({ success: false, error: 'Invalid project ID' });
    const { work_status } = req.body;
    if (!work_status) return res.status(400).json({ success: false, error: 'work_status is required' });
    const data = await updateWorkStatus(projectId, work_status);
    if (!data) return res.status(404).json({ success: false, error: 'Project not found' });
    res.json({ success: true, data });
  } catch (error) {
    console.error('PATCH /api/projects/:id/work-status error:', error);
    res.status(500).json({ success: false, error: 'Failed to update work status' });
  }
});

/**
 * GET /api/projects/:id
 * Single project detail with delivery thoughts
 */
router.get('/:id', async (req, res) => {
  try {
    const projectId = parseInt(req.params.id, 10);
    if (isNaN(projectId)) {
      return res.status(400).json({ success: false, error: 'Invalid project ID' });
    }
    const data = await getById(projectId);
    if (!data) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    res.json({ success: true, data });
  } catch (error) {
    console.error('GET /api/projects/:id error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch project' });
  }
});

export default router;
