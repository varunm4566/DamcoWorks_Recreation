import pool from '../db.js';

// ---------- Allowed sort columns ----------
const ALLOWED_SORT_COLUMNS = new Set([
  'name', 'client_name', 'health_score', 'headcount', 'fte',
  'spi', 'cpi', 'pdm_name', 'overdue_days', 'variance_percent',
  'revenue_at_risk', 'customer_confidence', 'margin_percent', 'created_at',
]);

/**
 * Build dynamic WHERE clause from filters object
 */
function buildWhereClause(filters, division, search, params) {
  const conditions = [];
  let paramIndex = params.length;

  // Division filter
  if (division && division !== 'All') {
    paramIndex++;
    conditions.push(`p.division = $${paramIndex}`);
    params.push(division);
  }

  // Text search
  if (search) {
    paramIndex++;
    conditions.push(`(p.name ILIKE $${paramIndex} OR p.client_name ILIKE $${paramIndex})`);
    params.push(`%${search}%`);
  }

  // Filter by DM/PDM
  if (filters.dm_pdm) {
    paramIndex++;
    conditions.push(`(p.pdm_name ILIKE $${paramIndex} OR p.dm_name ILIKE $${paramIndex})`);
    params.push(`%${filters.dm_pdm}%`);
  }

  // Status filter
  if (filters.status) {
    paramIndex++;
    conditions.push(`p.status = $${paramIndex}`);
    params.push(filters.status);
  }

  // Project type filter
  if (filters.project_type) {
    paramIndex++;
    conditions.push(`p.project_type = $${paramIndex}`);
    params.push(filters.project_type);
  }

  // Boolean filters
  const booleanFields = ['is_critical_attention', 'assessment_overdue', 'severe_overburn'];
  for (const field of booleanFields) {
    if (filters[field] !== undefined && filters[field] !== null) {
      paramIndex++;
      conditions.push(`p.${field} = $${paramIndex}`);
      params.push(filters[field]);
    }
  }

  // Revenue at risk > 0
  if (filters.revenue_at_risk_gt) {
    paramIndex++;
    conditions.push(`p.revenue_at_risk > $${paramIndex}`);
    params.push(filters.revenue_at_risk_gt);
  }

  // Health score range
  if (filters.health_min !== undefined) {
    paramIndex++;
    conditions.push(`p.health_score >= $${paramIndex}`);
    params.push(filters.health_min);
  }
  if (filters.health_max !== undefined) {
    paramIndex++;
    conditions.push(`p.health_score <= $${paramIndex}`);
    params.push(filters.health_max);
  }

  // SPI filter (below threshold)
  if (filters.spi_below) {
    paramIndex++;
    conditions.push(`p.spi < $${paramIndex}`);
    params.push(filters.spi_below);
  }

  // CPI filter (below threshold)
  if (filters.cpi_below !== undefined && filters.cpi_below !== '') {
    paramIndex++;
    conditions.push(`p.cpi < $${paramIndex}`);
    params.push(filters.cpi_below);
  }

  // Variance filter (above threshold)
  if (filters.variance_above !== undefined && filters.variance_above !== '') {
    paramIndex++;
    conditions.push(`p.variance_percent > $${paramIndex}`);
    params.push(filters.variance_above);
  }

  // Customer confidence / CSAT below threshold
  if (filters.confidence_below !== undefined) {
    paramIndex++;
    conditions.push(`p.customer_confidence < $${paramIndex}`);
    params.push(filters.confidence_below);
  }

  // Margin below threshold
  if (filters.margin_below !== undefined && filters.margin_below !== '') {
    paramIndex++;
    conditions.push(`p.margin_percent < $${paramIndex}`);
    params.push(filters.margin_below);
  }

  // Overburn above threshold
  if (filters.overburn_above !== undefined && filters.overburn_above !== '') {
    paramIndex++;
    conditions.push(`p.overburn_percent > $${paramIndex}`);
    params.push(filters.overburn_above);
  }

  // Milestone status filter — project has at least one milestone with this status
  if (filters.milestone_status) {
    paramIndex++;
    conditions.push(`EXISTS (SELECT 1 FROM project_milestones WHERE project_id = p.id AND status = $${paramIndex})`);
    params.push(filters.milestone_status);
  }

  // Timeline date range filters
  if (filters.contract_date_from) {
    paramIndex++;
    conditions.push(`p.contract_start_date >= $${paramIndex}`);
    params.push(filters.contract_date_from);
  }
  if (filters.contract_date_to) {
    paramIndex++;
    conditions.push(`p.contract_end_date <= $${paramIndex}`);
    params.push(filters.contract_date_to);
  }

  // Engagement model filter
  if (filters.engagement_model) {
    paramIndex++;
    conditions.push(`p.engagement_model = $${paramIndex}`);
    params.push(filters.engagement_model);
  }

  // Column-level: project name filter
  if (filters.name_filter) {
    paramIndex++;
    conditions.push(`p.name ILIKE $${paramIndex}`);
    params.push(`%${filters.name_filter}%`);
  }

  // Column-level: client name filter
  if (filters.client_name_filter) {
    paramIndex++;
    conditions.push(`p.client_name ILIKE $${paramIndex}`);
    params.push(`%${filters.client_name_filter}%`);
  }

  // Column-level: delivery manager filter
  if (filters.dm_name_filter) {
    paramIndex++;
    conditions.push(`p.dm_name ILIKE $${paramIndex}`);
    params.push(`%${filters.dm_name_filter}%`);
  }

  // Column-level: sales manager filter
  if (filters.sm_name_filter) {
    paramIndex++;
    conditions.push(`p.sm_name ILIKE $${paramIndex}`);
    params.push(`%${filters.sm_name_filter}%`);
  }

  // Service quality filter
  if (filters.service_quality) {
    paramIndex++;
    conditions.push(`p.service_quality = $${paramIndex}`);
    params.push(filters.service_quality);
  }

  // Financial health filter
  if (filters.financial_health) {
    paramIndex++;
    conditions.push(`p.financial_health = $${paramIndex}`);
    params.push(filters.financial_health);
  }

  // Tag filters (JSONB containment)
  const tagCategories = ['Offering', 'Geography', 'Domain', 'Currency', 'Status', 'Division'];
  for (const cat of tagCategories) {
    const key = `tag_${cat.toLowerCase()}`;
    if (filters[key]) {
      const values = Array.isArray(filters[key]) ? filters[key] : [filters[key]];
      for (const val of values) {
        paramIndex++;
        conditions.push(`p.tags @> $${paramIndex}::jsonb`);
        params.push(JSON.stringify([{ category: cat, value: val }]));
      }
    }
  }

  return conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';
}

/**
 * Fetch paginated project list with filters, sorting, and latest thought
 */
export async function findAll({ page = 1, pageSize = 25, sortBy = 'name', sortDir = 'asc', filters = {}, search = '', division = 'All' } = {}) {
  const safeSortBy = ALLOWED_SORT_COLUMNS.has(sortBy) ? sortBy : 'name';
  const safeSortDir = sortDir === 'desc' ? 'DESC' : 'ASC';
  const offset = (page - 1) * pageSize;

  const params = [];
  const whereClause = buildWhereClause(filters, division, search, params);

  // Count query
  const countSql = `SELECT COUNT(*) as total FROM projects p ${whereClause}`;
  const countResult = await pool.query(countSql, params);
  const totalCount = parseInt(countResult.rows[0].total, 10);

  // Data query with latest delivery thought via LATERAL
  const dataParams = [...params];
  const offsetIdx = dataParams.length + 1;
  const limitIdx = dataParams.length + 2;
  dataParams.push(offset, pageSize);

  const dataSql = `
    SELECT p.*,
      lt.note AS latest_thought,
      lt.author AS latest_thought_author,
      lt.created_at AS latest_thought_date,
      ms.total_milestones,
      ms.at_risk_milestones,
      ms.completed_milestones
    FROM projects p
    LEFT JOIN LATERAL (
      SELECT note, author, created_at
      FROM project_delivery_thoughts
      WHERE project_id = p.id
      ORDER BY created_at DESC
      LIMIT 1
    ) lt ON true
    LEFT JOIN LATERAL (
      SELECT
        COUNT(*) AS total_milestones,
        COUNT(*) FILTER (WHERE status = 'at-risk') AS at_risk_milestones,
        COUNT(*) FILTER (WHERE status = 'completed') AS completed_milestones
      FROM project_milestones
      WHERE project_id = p.id
    ) ms ON true
    ${whereClause}
    ORDER BY p.${safeSortBy} ${safeSortDir} NULLS LAST
    OFFSET $${offsetIdx} LIMIT $${limitIdx}
  `;

  const dataResult = await pool.query(dataSql, dataParams);
  return { rows: dataResult.rows, totalCount };
}

/**
 * Get KPI summary for a division (or all)
 */
export async function getKpiSummary(division = 'All') {
  const divCondition = division && division !== 'All' ? `AND division = $1` : '';
  const params = division && division !== 'All' ? [division] : [];

  const sql = `
    SELECT
      COUNT(*) FILTER (WHERE is_critical_attention = true) AS critical_attention,
      COALESCE(SUM(revenue_at_risk) FILTER (WHERE revenue_at_risk > 0), 0) AS revenue_at_risk_total,
      ROUND(AVG(spi) FILTER (WHERE spi IS NOT NULL), 2) AS avg_spi,
      COUNT(*) FILTER (WHERE spi IS NOT NULL AND spi < 0.9) AS low_spi_count,
      ROUND(AVG(customer_confidence) FILTER (WHERE customer_confidence IS NOT NULL), 1) AS avg_confidence,
      COUNT(*) FILTER (WHERE customer_confidence IS NOT NULL AND customer_confidence < 3.5) AS low_confidence_count,
      COUNT(*) AS total_active,
      COUNT(*) FILTER (WHERE project_type = 'BYT/T&M') AS byt_tm_count,
      COUNT(*) FILTER (WHERE project_type = 'FP') AS fp_count,
      COUNT(*) FILTER (WHERE project_type = 'Staffing') AS staffing_count
    FROM projects
    WHERE status = 'active' ${divCondition}
  `;

  const result = await pool.query(sql, params);
  const row = result.rows[0];
  return {
    criticalAttention: parseInt(row.critical_attention, 10),
    revenueAtRisk: parseFloat(row.revenue_at_risk_total),
    deliveryPerformanceIndex: parseInt(row.low_spi_count, 10),
    avgSpi: parseFloat(row.avg_spi) || 0,
    customerConfidence: parseInt(row.low_confidence_count, 10),
    avgConfidence: parseFloat(row.avg_confidence) || 0,
    activeProjects: parseInt(row.total_active, 10),
    bytTmCount: parseInt(row.byt_tm_count, 10),
    fpCount: parseInt(row.fp_count, 10),
    staffingCount: parseInt(row.staffing_count, 10),
  };
}

/**
 * Get project and DM counts per division
 */
export async function getDivisionCounts() {
  const sql = `
    SELECT
      division,
      COUNT(*) AS project_count,
      COUNT(DISTINCT dm_name) AS dm_count
    FROM projects
    WHERE status = 'active'
    GROUP BY division
    ORDER BY project_count DESC
  `;
  const result = await pool.query(sql);

  const totals = result.rows.reduce(
    (acc, r) => ({
      project_count: acc.project_count + parseInt(r.project_count, 10),
      dm_count: acc.dm_count + parseInt(r.dm_count, 10),
    }),
    { project_count: 0, dm_count: 0 }
  );

  return [
    ...result.rows.map((r) => ({
      division: r.division,
      projectCount: parseInt(r.project_count, 10),
      dmCount: parseInt(r.dm_count, 10),
    })),
    { division: 'All', projectCount: totals.project_count, dmCount: totals.dm_count },
  ];
}

/**
 * Get single project by ID with delivery thoughts and milestones
 */
export async function getById(projectId) {
  const projectResult = await pool.query(
    `SELECT p.*,
       (SELECT COUNT(*) FROM project_team_members WHERE project_id = p.id) AS team_member_count
     FROM projects p
     WHERE p.id = $1`,
    [projectId]
  );
  if (projectResult.rowCount === 0) return null;

  const [thoughtsResult, milestonesResult] = await Promise.all([
    pool.query(
      'SELECT * FROM project_delivery_thoughts WHERE project_id = $1 ORDER BY created_at DESC',
      [projectId]
    ),
    pool.query(
      'SELECT * FROM project_milestones WHERE project_id = $1 ORDER BY due_date ASC NULLS LAST',
      [projectId]
    ),
  ]);

  return {
    ...projectResult.rows[0],
    delivery_thoughts: thoughtsResult.rows,
    milestones: milestonesResult.rows,
  };
}

/**
 * Get distinct DM/PDM names for the dropdown
 */
export async function getDistinctDmPdm() {
  const sql = `
    SELECT DISTINCT name FROM (
      SELECT DISTINCT dm_name AS name FROM projects WHERE dm_name IS NOT NULL AND dm_name != ''
      UNION
      SELECT DISTINCT pdm_name AS name FROM projects WHERE pdm_name IS NOT NULL AND pdm_name != ''
    ) combined
    ORDER BY name
  `;
  const result = await pool.query(sql);
  return result.rows.map((r) => r.name);
}

/**
 * Paginated team members for a project
 */
export async function getTeamMembers(projectId, page = 1, pageSize = 5) {
  const offset = (page - 1) * pageSize;
  const [countResult, dataResult] = await Promise.all([
    pool.query('SELECT COUNT(*) AS total FROM project_team_members WHERE project_id = $1', [projectId]),
    pool.query(
      'SELECT * FROM project_team_members WHERE project_id = $1 ORDER BY name ASC OFFSET $2 LIMIT $3',
      [projectId, offset, pageSize]
    ),
  ]);
  return { rows: dataResult.rows, totalCount: parseInt(countResult.rows[0].total, 10) };
}

/**
 * Paginated invoices for a project
 */
export async function getInvoices(projectId, page = 1, pageSize = 5) {
  const offset = (page - 1) * pageSize;
  const [countResult, dataResult] = await Promise.all([
    pool.query('SELECT COUNT(*) AS total FROM project_invoices WHERE project_id = $1', [projectId]),
    pool.query(
      'SELECT * FROM project_invoices WHERE project_id = $1 ORDER BY created_on DESC NULLS LAST OFFSET $2 LIMIT $3',
      [projectId, offset, pageSize]
    ),
  ]);
  return { rows: dataResult.rows, totalCount: parseInt(countResult.rows[0].total, 10) };
}

/**
 * Paginated CSAT surveys for a project
 */
export async function getCsatSurveys(projectId, page = 1, pageSize = 5) {
  const offset = (page - 1) * pageSize;
  const [countResult, dataResult] = await Promise.all([
    pool.query('SELECT COUNT(*) AS total FROM project_csat_surveys WHERE project_id = $1', [projectId]),
    pool.query(
      'SELECT * FROM project_csat_surveys WHERE project_id = $1 ORDER BY triggered_on DESC NULLS LAST OFFSET $2 LIMIT $3',
      [projectId, offset, pageSize]
    ),
  ]);
  return { rows: dataResult.rows, totalCount: parseInt(countResult.rows[0].total, 10) };
}

/**
 * Paginated contracts for a project
 */
export async function getContracts(projectId, page = 1, pageSize = 5) {
  const offset = (page - 1) * pageSize;
  const [countResult, dataResult] = await Promise.all([
    pool.query('SELECT COUNT(*) AS total FROM project_contracts WHERE project_id = $1', [projectId]),
    pool.query(
      'SELECT * FROM project_contracts WHERE project_id = $1 ORDER BY updated_on DESC NULLS LAST OFFSET $2 LIMIT $3',
      [projectId, offset, pageSize]
    ),
  ]);
  return { rows: dataResult.rows, totalCount: parseInt(countResult.rows[0].total, 10) };
}

/**
 * Insert a new delivery thought
 */
export async function addDeliveryThought(projectId, { note, author, service_quality }) {
  const result = await pool.query(
    `INSERT INTO project_delivery_thoughts (project_id, note, author, service_quality)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [projectId, note, author, service_quality || null]
  );
  return result.rows[0];
}

/**
 * Update work_status for a project
 */
export async function updateWorkStatus(projectId, work_status) {
  const result = await pool.query(
    `UPDATE projects SET work_status = $1 WHERE id = $2 RETURNING *`,
    [work_status, projectId]
  );
  if (result.rowCount === 0) return null;
  return result.rows[0];
}
