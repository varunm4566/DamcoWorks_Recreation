import { Router } from 'express';
import {
  getCustomerById,
  getCustomerProjects,
  getProjectById,
  getProjectDeliveryThoughts,
  getCurrentFYRevenue,
  getMonthlyBreakdown,
  getLifetimeRevenue,
  getYearlyBreakdown,
  getStakeholders,
  createStakeholder,
  updateStakeholder,
  getPartnerLogs,
  updateClientPartner,
  updateClientCoPartner,
  getEligiblePartners,
  getCustomerBookings,
  getBookingMonths,
} from '../models/CustomerDetail.model.js';

const router = Router();

// ── Customer header ───────────────────────────────────────────────

/**
 * GET /api/customer-detail/:id
 * Customer header card data
 */
router.get('/:id', async (req, res) => {
  try {
    const customerId = parseInt(req.params.id, 10);
    if (isNaN(customerId)) {
      return res.status(400).json({ success: false, error: 'Invalid customer ID' });
    }
    const data = await getCustomerById(customerId);
    if (!data) return res.status(404).json({ success: false, error: 'Customer not found' });
    res.json({ success: true, data });
  } catch (error) {
    console.error('GET /api/customer-detail/:id error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch customer' });
  }
});

// ── Projects ──────────────────────────────────────────────────────

/**
 * GET /api/customer-detail/:id/projects
 * Query params: page, pageSize, sort, order, status, search
 */
router.get('/:id/projects', async (req, res) => {
  try {
    const customerId = parseInt(req.params.id, 10);
    if (isNaN(customerId)) {
      return res.status(400).json({ success: false, error: 'Invalid customer ID' });
    }
    const {
      page = '1',
      pageSize = '5',
      sort = 'name',
      order = 'asc',
      status = '',
      search = '',
    } = req.query;

    const data = await getCustomerProjects(customerId, {
      page: parseInt(page, 10),
      pageSize: parseInt(pageSize, 10),
      sortCol: sort,
      sortDir: order,
      statusFilter: status,
      search,
    });
    res.json({ success: true, data });
  } catch (error) {
    console.error('GET /api/customer-detail/:id/projects error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch projects' });
  }
});

/**
 * GET /api/customer-detail/:id/projects/:pid
 * Single project for popup modals
 */
router.get('/:id/projects/:pid', async (req, res) => {
  try {
    const projectId = parseInt(req.params.pid, 10);
    if (isNaN(projectId)) {
      return res.status(400).json({ success: false, error: 'Invalid project ID' });
    }
    const data = await getProjectById(projectId);
    if (!data) return res.status(404).json({ success: false, error: 'Project not found' });
    res.json({ success: true, data });
  } catch (error) {
    console.error('GET /api/customer-detail/:id/projects/:pid error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch project' });
  }
});

/**
 * GET /api/customer-detail/:id/projects/:pid/thoughts
 * All delivery thoughts for a project, newest first
 */
router.get('/:id/projects/:pid/thoughts', async (req, res) => {
  try {
    const projectId = parseInt(req.params.pid, 10);
    if (isNaN(projectId)) {
      return res.status(400).json({ success: false, error: 'Invalid project ID' });
    }
    const data = await getProjectDeliveryThoughts(projectId);
    res.json({ success: true, data });
  } catch (error) {
    console.error('GET /api/customer-detail/:id/projects/:pid/thoughts error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch delivery thoughts' });
  }
});

// ── Revenue ───────────────────────────────────────────────────────

/**
 * GET /api/customer-detail/:id/revenue/monthly
 * Query params: page, pageSize
 */
router.get('/:id/revenue/monthly', async (req, res) => {
  try {
    const customerId = parseInt(req.params.id, 10);
    if (isNaN(customerId)) {
      return res.status(400).json({ success: false, error: 'Invalid customer ID' });
    }
    const { page = '1', pageSize = '5' } = req.query;
    const data = await getCurrentFYRevenue(customerId, {
      page: parseInt(page, 10),
      pageSize: parseInt(pageSize, 10),
    });
    res.json({ success: true, data });
  } catch (error) {
    console.error('GET /api/customer-detail/:id/revenue/monthly error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch monthly revenue' });
  }
});

/**
 * GET /api/customer-detail/:id/revenue/monthly/:monthYear/breakdown
 */
router.get('/:id/revenue/monthly/:monthYear/breakdown', async (req, res) => {
  try {
    const customerId = parseInt(req.params.id, 10);
    if (isNaN(customerId)) {
      return res.status(400).json({ success: false, error: 'Invalid customer ID' });
    }
    const data = await getMonthlyBreakdown(customerId, req.params.monthYear);
    res.json({ success: true, data });
  } catch (error) {
    console.error('GET breakdown error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch breakdown' });
  }
});

/**
 * GET /api/customer-detail/:id/revenue/yearly
 * Query params: page, pageSize
 */
router.get('/:id/revenue/yearly', async (req, res) => {
  try {
    const customerId = parseInt(req.params.id, 10);
    if (isNaN(customerId)) {
      return res.status(400).json({ success: false, error: 'Invalid customer ID' });
    }
    const { page = '1', pageSize = '5' } = req.query;
    const data = await getLifetimeRevenue(customerId, {
      page: parseInt(page, 10),
      pageSize: parseInt(pageSize, 10),
    });
    res.json({ success: true, data });
  } catch (error) {
    console.error('GET /api/customer-detail/:id/revenue/yearly error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch yearly revenue' });
  }
});

/**
 * GET /api/customer-detail/:id/revenue/yearly/:fyYear/breakdown
 */
router.get('/:id/revenue/yearly/:fyYear/breakdown', async (req, res) => {
  try {
    const customerId = parseInt(req.params.id, 10);
    if (isNaN(customerId)) {
      return res.status(400).json({ success: false, error: 'Invalid customer ID' });
    }
    const data = await getYearlyBreakdown(customerId, req.params.fyYear);
    res.json({ success: true, data });
  } catch (error) {
    console.error('GET yearly breakdown error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch yearly breakdown' });
  }
});

// ── Stakeholders ──────────────────────────────────────────────────

/**
 * GET /api/customer-detail/:id/stakeholders
 */
router.get('/:id/stakeholders', async (req, res) => {
  try {
    const customerId = parseInt(req.params.id, 10);
    if (isNaN(customerId)) {
      return res.status(400).json({ success: false, error: 'Invalid customer ID' });
    }
    const data = await getStakeholders(customerId);
    res.json({ success: true, data });
  } catch (error) {
    console.error('GET /api/customer-detail/:id/stakeholders error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch stakeholders' });
  }
});

/**
 * POST /api/customer-detail/:id/stakeholders
 */
router.post('/:id/stakeholders', async (req, res) => {
  try {
    const customerId = parseInt(req.params.id, 10);
    if (isNaN(customerId)) {
      return res.status(400).json({ success: false, error: 'Invalid customer ID' });
    }
    const { first_name } = req.body;
    if (!first_name) {
      return res.status(400).json({ success: false, error: 'first_name is required' });
    }
    const data = await createStakeholder(customerId, req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('POST /api/customer-detail/:id/stakeholders error:', error);
    res.status(500).json({ success: false, error: 'Failed to create stakeholder' });
  }
});

/**
 * PUT /api/customer-detail/:id/stakeholders/:sid
 */
router.put('/:id/stakeholders/:sid', async (req, res) => {
  try {
    const stakeholderId = parseInt(req.params.sid, 10);
    if (isNaN(stakeholderId)) {
      return res.status(400).json({ success: false, error: 'Invalid stakeholder ID' });
    }
    const data = await updateStakeholder(stakeholderId, req.body);
    if (!data) return res.status(404).json({ success: false, error: 'Stakeholder not found' });
    res.json({ success: true, data });
  } catch (error) {
    console.error('PUT /api/customer-detail/:id/stakeholders/:sid error:', error);
    res.status(500).json({ success: false, error: 'Failed to update stakeholder' });
  }
});

// ── Partner Logs ──────────────────────────────────────────────────

/**
 * GET /api/customer-detail/:id/partner-logs?type=client_partner|client_co_partner
 */
router.get('/:id/partner-logs', async (req, res) => {
  try {
    const customerId = parseInt(req.params.id, 10);
    if (isNaN(customerId)) {
      return res.status(400).json({ success: false, error: 'Invalid customer ID' });
    }
    const partnerType = req.query.type || 'client_partner';
    const data = await getPartnerLogs(customerId, partnerType);
    res.json({ success: true, data });
  } catch (error) {
    console.error('GET /api/customer-detail/:id/partner-logs error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch partner logs' });
  }
});

/**
 * PUT /api/customer-detail/:id/client-partner
 * Body: { partnerName, updatedBy }
 */
router.put('/:id/client-partner', async (req, res) => {
  try {
    const customerId = parseInt(req.params.id, 10);
    if (isNaN(customerId)) {
      return res.status(400).json({ success: false, error: 'Invalid customer ID' });
    }
    const { partnerName, updatedBy = 'System' } = req.body;
    if (!partnerName) {
      return res.status(400).json({ success: false, error: 'partnerName is required' });
    }
    await updateClientPartner(customerId, partnerName, updatedBy);
    res.json({ success: true, data: { partnerName } });
  } catch (error) {
    console.error('PUT /api/customer-detail/:id/client-partner error:', error);
    res.status(500).json({ success: false, error: 'Failed to update client partner' });
  }
});

/**
 * PUT /api/customer-detail/:id/client-co-partner
 * Body: { partnerName, updatedBy }
 */
router.put('/:id/client-co-partner', async (req, res) => {
  try {
    const customerId = parseInt(req.params.id, 10);
    if (isNaN(customerId)) {
      return res.status(400).json({ success: false, error: 'Invalid customer ID' });
    }
    const { partnerName, updatedBy = 'Admin' } = req.body;
    if (!partnerName) {
      return res.status(400).json({ success: false, error: 'partnerName is required' });
    }
    await updateClientCoPartner(customerId, partnerName, updatedBy);
    res.json({ success: true, data: { partnerName } });
  } catch (error) {
    console.error('PUT /api/customer-detail/:id/client-co-partner error:', error);
    res.status(500).json({ success: false, error: 'Failed to update client co-partner' });
  }
});

/**
 * GET /api/customer-detail/eligible-partners
 * List of names eligible to be assigned as client partner
 */
router.get('/meta/eligible-partners', async (req, res) => {
  try {
    const data = await getEligiblePartners();
    res.json({ success: true, data });
  } catch (error) {
    console.error('GET /api/customer-detail/meta/eligible-partners error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch eligible partners' });
  }
});

// ── Bookings ──────────────────────────────────────────────────────

/**
 * GET /api/customer-detail/:id/bookings
 * Query params: page, pageSize
 */
router.get('/:id/bookings', async (req, res) => {
  try {
    const customerId = parseInt(req.params.id, 10);
    if (isNaN(customerId)) {
      return res.status(400).json({ success: false, error: 'Invalid customer ID' });
    }
    const { page = '1', pageSize = '5' } = req.query;
    const data = await getCustomerBookings(customerId, {
      page: parseInt(page, 10),
      pageSize: parseInt(pageSize, 10),
    });
    res.json({ success: true, data });
  } catch (error) {
    console.error('GET /api/customer-detail/:id/bookings error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch bookings' });
  }
});

/**
 * GET /api/customer-detail/:id/bookings/:bid/months
 * Monthly breakdown for a single booking
 */
router.get('/:id/bookings/:bid/months', async (req, res) => {
  try {
    const bookingId = parseInt(req.params.bid, 10);
    if (isNaN(bookingId)) {
      return res.status(400).json({ success: false, error: 'Invalid booking ID' });
    }
    const data = await getBookingMonths(bookingId);
    res.json({ success: true, data });
  } catch (error) {
    console.error('GET booking months error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch booking months' });
  }
});

export default router;
