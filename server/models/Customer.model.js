import pool from '../db.js';

/**
 * Build dynamic WHERE clause from filters object
 * @param {Object} filters - { column: value } or { column: { type, value, min, max } }
 * @param {string} search - search term for customer name
 * @param {number} startParam - starting $N parameter index
 * @returns {{ clause: string, values: Array }}
 */
function buildWhereClause(filters, search, startParam = 1, myCustomers = false) {
  const conditions = [];
  const values = [];
  let paramIndex = startParam;

  if (filters) {
    for (const [column, filterValue] of Object.entries(filters)) {
      if (filterValue === null || filterValue === undefined || filterValue === '') continue;

      // is_new_logo filter
      if (column === 'is_new_logo') {
        conditions.push(`is_new_logo = $${paramIndex}`);
        values.push(filterValue === 'true' || filterValue === true);
        paramIndex++;
        continue;
      }

      // Boolean filters
      if (['cp_ownership', 'incentive_eligibility', 'referenceable'].includes(column)) {
        conditions.push(`${column} = $${paramIndex}`);
        values.push(filterValue === 'true' || filterValue === true);
        paramIndex++;
        continue;
      }

      // Status filter
      if (column === 'customer_status') {
        conditions.push(`status = $${paramIndex}`);
        values.push(filterValue);
        paramIndex++;
        continue;
      }

      // Numeric range/gt/lt filters
      if (typeof filterValue === 'object' && filterValue.type) {
        const numColumn = column;
        if (filterValue.type === 'range' && filterValue.min != null && filterValue.max != null) {
          conditions.push(`${numColumn} BETWEEN $${paramIndex} AND $${paramIndex + 1}`);
          values.push(parseFloat(filterValue.min), parseFloat(filterValue.max));
          paramIndex += 2;
        } else if (filterValue.type === 'gt' && filterValue.value != null) {
          conditions.push(`${numColumn} > $${paramIndex}`);
          values.push(parseFloat(filterValue.value));
          paramIndex++;
        } else if (filterValue.type === 'lt' && filterValue.value != null) {
          conditions.push(`${numColumn} < $${paramIndex}`);
          values.push(parseFloat(filterValue.value));
          paramIndex++;
        }
        continue;
      }

      // Text filters (ILIKE for partial match)
      const textColumns = ['tier', 'sales_owner', 'client_partner', 'client_co_partner', 'industry', 'name'];
      if (textColumns.includes(column)) {
        conditions.push(`${column} ILIKE $${paramIndex}`);
        values.push(`%${filterValue}%`);
        paramIndex++;
        continue;
      }

      // DM/PDM text search in JSONB
      if (column === 'dm_pdm') {
        conditions.push(`dm_pdm::text ILIKE $${paramIndex}`);
        values.push(`%${filterValue}%`);
        paramIndex++;
        continue;
      }
    }
  }

  // Search by customer name
  if (search && search.trim()) {
    conditions.push(`name ILIKE $${paramIndex}`);
    values.push(`%${search.trim()}%`);
    paramIndex++;
  }

  // My Customers filter (client_partner = 'Varun Mishra')
  if (myCustomers) {
    conditions.push(`client_partner = $${paramIndex}`);
    values.push('Varun Mishra');
    paramIndex++;
  }

  const clause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  return { clause, values };
}

// Allowed sort columns to prevent SQL injection
const ALLOWED_SORT_COLUMNS = new Set([
  'name', 'booked_sales_usd', 'booked_sales_inr', 'revenue_usd', 'revenue_inr',
  'at_risk', 'tier', 'csat_score', 'sales_owner', 'client_partner',
  'cp_ownership', 'dm_pdm', 'industry', 'referenceable', 'status',
]);

/**
 * Fetch paginated, filtered, sorted customer list
 */
export async function findAll({ page = 1, pageSize = 25, sortBy = 'revenue_usd', sortDir = 'desc', filters = {}, search = '', myCustomers = false } = {}) {
  // Validate sort column
  if (!ALLOWED_SORT_COLUMNS.has(sortBy)) {
    sortBy = 'revenue_usd';
  }
  sortDir = sortDir === 'asc' ? 'ASC' : 'DESC';

  const offset = (page - 1) * pageSize;
  const { clause, values } = buildWhereClause(filters, search, 1, myCustomers);

  const countQuery = `SELECT COUNT(*) FROM customers ${clause}`;
  const countResult = await pool.query(countQuery, values);
  const totalCount = parseInt(countResult.rows[0].count, 10);

  const dataQuery = `
    SELECT * FROM customers
    ${clause}
    ORDER BY ${sortBy} ${sortDir} NULLS LAST
    LIMIT $${values.length + 1} OFFSET $${values.length + 2}
  `;
  const dataResult = await pool.query(dataQuery, [...values, pageSize, offset]);

  return { rows: dataResult.rows, totalCount };
}

/**
 * Get aggregated KPI summary data
 */
export async function getKpiSummary() {
  const result = await pool.query(`
    SELECT
      COALESCE(SUM(project_health_green + project_health_orange + project_health_red), 0) AS active_projects,
      COALESCE(SUM(project_health_green), 0) AS health_green,
      COALESCE(SUM(project_health_orange), 0) AS health_orange,
      COALESCE(SUM(project_health_red), 0) AS health_red,
      COUNT(*) FILTER (WHERE is_new_logo = true AND status = 'active') AS new_logos,
      COALESCE(SUM(booked_sales_usd), 0) AS booked_sales_usd,
      COALESCE(SUM(booked_sales_inr), 0) AS booked_sales_inr,
      COALESCE(SUM(revenue_usd), 0) AS revenue_usd,
      COALESCE(SUM(revenue_inr), 0) AS revenue_inr,
      COUNT(*) FILTER (WHERE status = 'active') AS active_customers
    FROM customers
    WHERE status = 'active'
  `);

  const row = result.rows[0];
  return {
    activeProjects: parseInt(row.active_projects, 10),
    healthBreakdown: {
      green: parseInt(row.health_green, 10),
      orange: parseInt(row.health_orange, 10),
      red: parseInt(row.health_red, 10),
    },
    newLogos: parseInt(row.new_logos, 10),
    bookedSales: {
      usd: parseFloat(row.booked_sales_usd),
      inr: parseFloat(row.booked_sales_inr),
    },
    revenue: {
      usd: parseFloat(row.revenue_usd),
      inr: parseFloat(row.revenue_inr),
    },
    activeCustomers: parseInt(row.active_customers, 10),
  };
}

/**
 * Update a boolean field on a customer
 */
const ALLOWED_BOOLEAN_FIELDS = new Set(['cp_ownership', 'incentive_eligibility', 'referenceable']);

export async function updateBooleanField(customerId, field, value) {
  if (!ALLOWED_BOOLEAN_FIELDS.has(field)) {
    throw new Error(`Field "${field}" is not updatable`);
  }
  const result = await pool.query(
    `UPDATE customers SET ${field} = $1, updated_at = NOW() WHERE id = $2 RETURNING id, ${field}`,
    [value, customerId]
  );
  if (result.rowCount === 0) throw new Error('Customer not found');
  return result.rows[0];
}

/**
 * Get CSAT survey responses for a specific customer
 */
export async function getCsatSurveys(customerId) {
  const result = await pool.query(
    `SELECT id, score, poc, response_date, testimonial
     FROM csat_surveys
     WHERE customer_id = $1
     ORDER BY response_date DESC`,
    [customerId]
  );
  return result.rows;
}
