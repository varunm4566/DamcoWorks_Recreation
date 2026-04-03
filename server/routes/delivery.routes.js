import { Router } from 'express';
import {
  getDivisions, getKpiSummary, getTableData,
  getPersonById, getPersonCustomers, getPersonProjects, getPersonEngTeam,
} from '../models/Delivery.model.js';

const router = Router();

/**
 * GET /api/delivery/divisions
 * Returns active division list for tab bar
 */
router.get('/divisions', async (req, res) => {
  try {
    const data = await getDivisions();
    res.json({ success: true, data });
  } catch (error) {
    console.error('GET /api/delivery/divisions error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch divisions' });
  }
});

/**
 * GET /api/delivery/kpi?division={name}
 * KPI summary cards for the selected division
 */
router.get('/kpi', async (req, res) => {
  try {
    const division = req.query.division || 'both';
    const data = await getKpiSummary(division);
    res.json({ success: true, data });
  } catch (error) {
    console.error('GET /api/delivery/kpi error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch KPI summary' });
  }
});

/**
 * GET /api/delivery/table
 * Table data with optional filters and sorting
 *
 * Query params:
 *   division  - 'Technology Services' | 'Insurance' | 'both'
 *   sort      - column key
 *   order     - 'asc' | 'desc'
 *   role      - role type filter
 */
router.get('/table', async (req, res) => {
  try {
    const division   = req.query.division || 'both';
    const sortCol    = req.query.sort     || 'name';
    const sortDir    = req.query.order    || 'asc';
    const roleType   = req.query.role     || '';
    const nameSearch = req.query.name     || '';

    const data = await getTableData({ division, sortCol, sortDir, roleType, nameSearch });
    res.json({ success: true, data });
  } catch (error) {
    console.error('GET /api/delivery/table error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch delivery table' });
  }
});

/**
 * GET /api/delivery/export?division={name}&format=csv
 * Export filtered delivery data as CSV (xlsx support can be added with exceljs)
 */
router.get('/export', async (req, res) => {
  try {
    const division = req.query.division || 'both';
    const roleType = req.query.role    || '';
    const rows     = await getTableData({ division, sortCol: 'name', sortDir: 'asc', roleType });

    const headers = [
      'Name', 'Role', 'Division', 'Customers', 'Active Projects',
      'TL', 'FL', 'PL', 'DM', 'Onsite DM', 'PDM', 'PFM', 'PgM', 'PO',
      'Head Count', 'Allocation',
    ];

    const csvRows = rows.map((r) => [
      r.name, r.role, r.divisionName, r.customerCount, r.activeProjectCount,
      r.collaboratingWith.tl, r.collaboratingWith.fl, r.collaboratingWith.pl,
      r.collaboratingWith.dm, r.collaboratingWith.onsiteDm, r.collaboratingWith.pdm,
      r.collaboratingWith.pfm, r.collaboratingWith.pgm, r.collaboratingWith.po,
      r.engineeringTeam.headCount, r.engineeringTeam.allocation,
    ].join(','));

    const csv = [headers.join(','), ...csvRows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="delivery.csv"');
    res.send(csv);
  } catch (error) {
    console.error('GET /api/delivery/export error:', error);
    res.status(500).json({ success: false, error: 'Failed to export delivery data' });
  }
});

// ─── Person Detail Modal ──────────────────────────────────────────────────────

/**
 * GET /api/delivery/person/:id
 * Person identity + tab badge counts
 */
router.get('/person/:id', async (req, res) => {
  try {
    const person = await getPersonById(parseInt(req.params.id, 10));
    if (!person) return res.status(404).json({ success: false, error: 'Person not found' });
    res.json({ success: true, data: person });
  } catch (error) {
    console.error('GET /api/delivery/person/:id error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch person' });
  }
});

/**
 * GET /api/delivery/person/:id/customers
 * Customers tab data
 */
router.get('/person/:id/customers', async (req, res) => {
  try {
    const data = await getPersonCustomers(parseInt(req.params.id, 10));
    res.json({ success: true, data });
  } catch (error) {
    console.error('GET /api/delivery/person/:id/customers error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch customer data' });
  }
});

/**
 * GET /api/delivery/person/:id/projects?toBeStarted=true
 * Projects tab data with optional "to be started" toggle
 */
router.get('/person/:id/projects', async (req, res) => {
  try {
    const toBeStarted = req.query.toBeStarted === 'true';
    const data = await getPersonProjects(parseInt(req.params.id, 10), toBeStarted);
    res.json({ success: true, data });
  } catch (error) {
    console.error('GET /api/delivery/person/:id/projects error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch project data' });
  }
});

/**
 * GET /api/delivery/person/:id/engineering-team
 * Engineering Team tab data grouped by project
 */
router.get('/person/:id/engineering-team', async (req, res) => {
  try {
    const data = await getPersonEngTeam(parseInt(req.params.id, 10));
    res.json({ success: true, data });
  } catch (error) {
    console.error('GET /api/delivery/person/:id/engineering-team error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch engineering team data' });
  }
});

export default router;
