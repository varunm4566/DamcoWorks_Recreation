import { Router } from 'express';
import { findAll, getKpiSummary, getCsatSurveys, updateBooleanField } from '../models/Customer.model.js';

const router = Router();

/**
 * GET /api/customers
 * Query params: page, pageSize, sortBy, sortDir, filters (JSON string), search, myCustomers
 */
router.get('/', async (req, res) => {
  try {
    const {
      page = '1',
      pageSize = '25',
      sortBy = 'revenue_usd',
      sortDir = 'desc',
      filters: filtersStr = '{}',
      search = '',
      myCustomers = 'false',
    } = req.query;

    let filters = {};
    try {
      filters = JSON.parse(filtersStr);
    } catch {
      return res.status(400).json({ success: false, error: 'Invalid filters JSON' });
    }

    const result = await findAll({
      page: parseInt(page, 10),
      pageSize: parseInt(pageSize, 10),
      sortBy,
      sortDir,
      filters,
      search,
      myCustomers: myCustomers === 'true',
    });

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('GET /api/customers error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch customers' });
  }
});

/**
 * GET /api/customers/kpi-summary
 */
router.get('/kpi-summary', async (req, res) => {
  try {
    const data = await getKpiSummary();
    res.json({ success: true, data });
  } catch (error) {
    console.error('GET /api/customers/kpi-summary error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch KPI summary' });
  }
});

/**
 * PATCH /api/customers/:id
 * Body: { field: 'cp_ownership'|'incentive_eligibility'|'referenceable', value: boolean }
 */
router.patch('/:id', async (req, res) => {
  try {
    const customerId = parseInt(req.params.id, 10);
    if (isNaN(customerId)) {
      return res.status(400).json({ success: false, error: 'Invalid customer ID' });
    }
    const { field, value } = req.body;
    if (typeof value !== 'boolean') {
      return res.status(400).json({ success: false, error: 'Value must be a boolean' });
    }
    const data = await updateBooleanField(customerId, field, value);
    res.json({ success: true, data });
  } catch (error) {
    console.error('PATCH /api/customers/:id error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/customers/:id/csat
 */
router.get('/:id/csat', async (req, res) => {
  try {
    const customerId = parseInt(req.params.id, 10);
    if (isNaN(customerId)) {
      return res.status(400).json({ success: false, error: 'Invalid customer ID' });
    }

    const data = await getCsatSurveys(customerId);
    res.json({ success: true, data });
  } catch (error) {
    console.error('GET /api/customers/:id/csat error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch CSAT surveys' });
  }
});

export default router;
