import pool from '../db.js';

const ALLOWED_PROJECT_SORT = new Set([
  'name', 'overall_health', 'service_quality', 'financial_health',
  'status', 'total_revenue_usd', 'total_cost_usd', 'margin_percent',
]);

/**
 * Return customer header data: name, industry, sales_owner, client_partner,
 * booked_sales_usd, revenue_usd.
 * @param {number} customerId
 */
export async function getCustomerById(customerId) {
  const result = await pool.query(
    `SELECT id, name, industry, sales_owner, client_partner, client_co_partner,
            booked_sales_usd, booked_sales_inr, revenue_usd, revenue_inr,
            status, tier, avatar_color, created_at
     FROM customers
     WHERE id = $1`,
    [customerId]
  );
  return result.rows[0] || null;
}

/**
 * Paginated, sorted, filtered project list for a customer.
 * Returns { rows, totalCount }.
 *
 * @param {number} customerId
 * @param {{ page, pageSize, sortCol, sortDir, statusFilter, search }} opts
 */
export async function getCustomerProjects(customerId, {
  page = 1,
  pageSize = 5,
  sortCol = 'name',
  sortDir = 'asc',
  statusFilter = '',
  search = '',
} = {}) {
  const safeSort = ALLOWED_PROJECT_SORT.has(sortCol) ? sortCol : 'name';
  const safeDir  = sortDir === 'desc' ? 'DESC' : 'ASC';

  const params = [customerId];
  const conditions = ['client_id = $1'];

  if (statusFilter && statusFilter !== 'all') {
    params.push(statusFilter);
    conditions.push(`status = $${params.length}`);
  }

  if (search) {
    params.push(`%${search}%`);
    conditions.push(`name ILIKE $${params.length}`);
  }

  const where = `WHERE ${conditions.join(' AND ')}`;

  // Count
  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total FROM projects ${where}`,
    params
  );
  const totalCount = countResult.rows[0].total;

  // Latest delivery thought per project via lateral join
  const offset = (page - 1) * pageSize;
  params.push(pageSize, offset);

  const sql = `
    SELECT
      p.id,
      p.name,
      p.engagement_model,
      p.status,
      p.overall_health,
      p.service_quality,
      p.financial_health,
      p.total_revenue_usd,
      p.total_cost_usd,
      p.margin_percent,
      p.ai_pulse_sentiment,
      p.ai_pulse_summary,
      p.ai_pulse_actions,
      p.ai_highlights,
      p.ai_concerns,
      p.ai_next_steps,
      p.headcount,
      p.unique_headcount,
      p.dm_name,
      p.program_manager,
      p.project_lead,
      p.tech_lead,
      p.onsite_dm_name,
      p.delivery_head,
      p.division,
      p.department,
      p.contract_start_date,
      p.contract_end_date,
      p.payterm_days,
      p.payment_timeliness_days,
      p.work_status,
      t.note        AS latest_thought,
      t.author      AS thought_author,
      t.created_at  AS thought_at
    FROM projects p
    LEFT JOIN LATERAL (
      SELECT note, author, created_at
      FROM project_delivery_thoughts
      WHERE project_id = p.id
      ORDER BY created_at DESC
      LIMIT 1
    ) t ON true
    ${where}
    ORDER BY ${safeSort} ${safeDir}
    LIMIT $${params.length - 1} OFFSET $${params.length}
  `;

  const result = await pool.query(sql, params);
  return { rows: result.rows, totalCount };
}

/**
 * Get a single project with full detail for popup modals.
 * @param {number} projectId
 */
export async function getProjectById(projectId) {
  const result = await pool.query(
    `SELECT p.*,
            t.note AS latest_thought, t.author AS thought_author, t.created_at AS thought_at
     FROM projects p
     LEFT JOIN LATERAL (
       SELECT note, author, created_at FROM project_delivery_thoughts
       WHERE project_id = p.id ORDER BY created_at DESC LIMIT 1
     ) t ON true
     WHERE p.id = $1`,
    [projectId]
  );
  return result.rows[0] || null;
}

/**
 * All delivery thoughts for a project, newest first.
 * @param {number} projectId
 */
export async function getProjectDeliveryThoughts(projectId) {
  const result = await pool.query(
    `SELECT id, note, author, created_at
     FROM project_delivery_thoughts
     WHERE project_id = $1
     ORDER BY created_at DESC`,
    [projectId]
  );
  return result.rows;
}

/**
 * Paginated monthly revenue for a customer.
 * @param {number} customerId
 * @param {{ page, pageSize, projectFilter }} opts
 */
export async function getCurrentFYRevenue(customerId, {
  page = 1,
  pageSize = 5,
} = {}) {
  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total FROM customer_monthly_revenue WHERE customer_id = $1`,
    [customerId]
  );
  const totalCount = countResult.rows[0].total;

  const offset = (page - 1) * pageSize;
  const result = await pool.query(
    `SELECT month_year, revenue_usd, revenue_inr, project_count
     FROM customer_monthly_revenue
     WHERE customer_id = $1
     ORDER BY month_year DESC
     LIMIT $2 OFFSET $3`,
    [customerId, pageSize, offset]
  );
  return { rows: result.rows, totalCount };
}

/**
 * Project-wise revenue breakdown for a given month (for View Breakdown modal).
 * We approximate by distributing the month revenue across active projects.
 * @param {number} customerId
 * @param {string} monthYear  'YYYY-MM'
 */
export async function getMonthlyBreakdown(customerId, monthYear) {
  const revResult = await pool.query(
    `SELECT revenue_usd, project_count
     FROM customer_monthly_revenue
     WHERE customer_id = $1 AND month_year = $2`,
    [customerId, monthYear]
  );
  if (!revResult.rows.length) return [];

  const { revenue_usd: total, project_count } = revResult.rows[0];

  // Get active projects for this customer to distribute revenue across
  const projResult = await pool.query(
    `SELECT id, name, total_revenue_usd
     FROM projects
     WHERE client_id = $1 AND status = 'active'
     ORDER BY total_revenue_usd DESC
     LIMIT $2`,
    [customerId, project_count || 4]
  );

  const projects = projResult.rows;
  const sumRevenue = projects.reduce((s, p) => s + parseFloat(p.total_revenue_usd || 0), 0);

  return projects.map((p) => {
    const share = sumRevenue > 0 ? parseFloat(p.total_revenue_usd) / sumRevenue : 1 / projects.length;
    const rev = parseFloat(total) * share;
    return {
      project_name: p.name,
      revenue_usd: rev,
      percentage: (share * 100).toFixed(1),
    };
  });
}

/**
 * Paginated yearly (lifetime) revenue for a customer.
 * @param {number} customerId
 * @param {{ page, pageSize }} opts
 */
export async function getLifetimeRevenue(customerId, { page = 1, pageSize = 5 } = {}) {
  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total FROM customer_yearly_revenue WHERE customer_id = $1`,
    [customerId]
  );
  const totalCount = countResult.rows[0].total;

  const offset = (page - 1) * pageSize;
  const result = await pool.query(
    `SELECT fy_year, revenue_usd, revenue_inr, project_count, onboarded_on
     FROM customer_yearly_revenue
     WHERE customer_id = $1
     ORDER BY fy_year DESC
     LIMIT $2 OFFSET $3`,
    [customerId, pageSize, offset]
  );
  return { rows: result.rows, totalCount };
}

/**
 * Yearly revenue breakdown across projects (approximated).
 * @param {number} customerId
 * @param {string} fyYear
 */
export async function getYearlyBreakdown(customerId, fyYear) {
  const revResult = await pool.query(
    `SELECT revenue_usd, project_count
     FROM customer_yearly_revenue
     WHERE customer_id = $1 AND fy_year = $2`,
    [customerId, fyYear]
  );
  if (!revResult.rows.length) return [];

  const { revenue_usd: total, project_count } = revResult.rows[0];

  const projResult = await pool.query(
    `SELECT name, total_revenue_usd
     FROM projects
     WHERE client_id = $1
     ORDER BY total_revenue_usd DESC
     LIMIT $2`,
    [customerId, project_count || 4]
  );

  const projects = projResult.rows;
  const sumRevenue = projects.reduce((s, p) => s + parseFloat(p.total_revenue_usd || 0), 0);

  return projects.map((p) => {
    const share = sumRevenue > 0 ? parseFloat(p.total_revenue_usd) / sumRevenue : 1 / projects.length;
    const rev = parseFloat(total) * share;
    return {
      project_name: p.name,
      revenue_usd: rev,
      percentage: (share * 100).toFixed(1),
    };
  });
}

/**
 * All stakeholders for a customer.
 * @param {number} customerId
 */
export async function getStakeholders(customerId) {
  const result = await pool.query(
    `SELECT id, salutation, first_name, last_name, designation, email,
            contact_number, relationship_type, stakeholder_role, status,
            linkedin_url, reports_to, reports_to_designation, last_contact_date,
            created_at, updated_at
     FROM customer_stakeholders
     WHERE customer_id = $1
     ORDER BY id ASC`,
    [customerId]
  );
  return result.rows;
}

/**
 * Create a stakeholder.
 * @param {number} customerId
 * @param {Object} data
 */
export async function createStakeholder(customerId, data) {
  const {
    salutation, first_name, last_name, designation, email,
    contact_number, relationship_type, stakeholder_role, status,
    linkedin_url, reports_to, reports_to_designation,
  } = data;

  const result = await pool.query(
    `INSERT INTO customer_stakeholders
       (customer_id, salutation, first_name, last_name, designation, email,
        contact_number, relationship_type, stakeholder_role, status,
        linkedin_url, reports_to, reports_to_designation)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
     RETURNING *`,
    [
      customerId, salutation, first_name, last_name, designation, email,
      contact_number, relationship_type, stakeholder_role, status || 'active',
      linkedin_url, reports_to, reports_to_designation,
    ]
  );
  return result.rows[0];
}

/**
 * Update an existing stakeholder.
 * @param {number} stakeholderId
 * @param {Object} data
 */
export async function updateStakeholder(stakeholderId, data) {
  const {
    salutation, first_name, last_name, designation, email,
    contact_number, relationship_type, stakeholder_role, status,
    linkedin_url, reports_to, reports_to_designation,
  } = data;

  const result = await pool.query(
    `UPDATE customer_stakeholders
     SET salutation=$1, first_name=$2, last_name=$3, designation=$4, email=$5,
         contact_number=$6, relationship_type=$7, stakeholder_role=$8, status=$9,
         linkedin_url=$10, reports_to=$11, reports_to_designation=$12,
         updated_at=NOW()
     WHERE id=$13
     RETURNING *`,
    [
      salutation, first_name, last_name, designation, email,
      contact_number, relationship_type, stakeholder_role, status,
      linkedin_url, reports_to, reports_to_designation,
      stakeholderId,
    ]
  );
  return result.rows[0];
}

/**
 * Partner logs (client partner or co-partner) for a customer.
 * @param {number} customerId
 * @param {'client_partner'|'client_co_partner'} partnerType
 */
export async function getPartnerLogs(customerId, partnerType) {
  const result = await pool.query(
    `SELECT id, partner_name, added_on, added_by, updated_on, updated_by
     FROM customer_partner_logs
     WHERE customer_id = $1 AND partner_type = $2
     ORDER BY added_on DESC`,
    [customerId, partnerType]
  );
  return result.rows;
}

/**
 * Update the client partner on a customer and create an audit log.
 * @param {number} customerId
 * @param {string} partnerName
 * @param {string} updatedBy
 */
export async function updateClientPartner(customerId, partnerName, updatedBy) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Update customer record
    await client.query(
      `UPDATE customers SET client_partner = $1 WHERE id = $2`,
      [partnerName, customerId]
    );

    // Check if a log already exists for this partner
    const existing = await client.query(
      `SELECT id FROM customer_partner_logs
       WHERE customer_id = $1 AND partner_type = 'client_partner' AND partner_name = $2`,
      [customerId, partnerName]
    );

    if (existing.rows.length > 0) {
      await client.query(
        `UPDATE customer_partner_logs
         SET updated_on = CURRENT_DATE, updated_by = $1
         WHERE id = $2`,
        [updatedBy, existing.rows[0].id]
      );
    } else {
      await client.query(
        `INSERT INTO customer_partner_logs (customer_id, partner_type, partner_name, added_on, added_by)
         VALUES ($1, 'client_partner', $2, CURRENT_DATE, $3)`,
        [customerId, partnerName, updatedBy]
      );
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Update the client co-partner on a customer and create an audit log.
 * @param {number} customerId
 * @param {string} partnerName
 * @param {string} updatedBy
 */
export async function updateClientCoPartner(customerId, partnerName, updatedBy) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(
      `UPDATE customers SET client_co_partner = $1 WHERE id = $2`,
      [partnerName, customerId]
    );

    const existing = await client.query(
      `SELECT id FROM customer_partner_logs
       WHERE customer_id = $1 AND partner_type = 'client_co_partner' AND partner_name = $2`,
      [customerId, partnerName]
    );

    if (existing.rows.length > 0) {
      await client.query(
        `UPDATE customer_partner_logs
         SET updated_on = CURRENT_DATE, updated_by = $1
         WHERE id = $2`,
        [updatedBy, existing.rows[0].id]
      );
    } else {
      await client.query(
        `INSERT INTO customer_partner_logs (customer_id, partner_type, partner_name, added_on, added_by)
         VALUES ($1, 'client_co_partner', $2, CURRENT_DATE, $3)`,
        [customerId, partnerName, updatedBy]
      );
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Return list of people eligible to be assigned as client partner.
 * Uses delivery_persons as the source of eligible names.
 */
export async function getEligiblePartners() {
  const result = await pool.query(
    `SELECT DISTINCT name FROM delivery_persons
     WHERE is_active = true
     ORDER BY name ASC`
  );
  return result.rows.map((r) => r.name);
}

/**
 * Paginated bookings for a customer.
 * @param {number} customerId
 * @param {{ page, pageSize }} opts
 */
export async function getCustomerBookings(customerId, { page = 1, pageSize = 5 } = {}) {
  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total FROM customer_bookings WHERE customer_id = $1`,
    [customerId]
  );
  const totalCount = countResult.rows[0].total;

  const offset = (page - 1) * pageSize;
  const result = await pool.query(
    `SELECT id, project_name, engagement_model, sales_owner, program_manager,
            total_booked_usd, total_booked_inr, contract_ending_on,
            total_invoiced_usd, total_invoiced_inr
     FROM customer_bookings
     WHERE customer_id = $1
     ORDER BY total_booked_usd DESC
     LIMIT $2 OFFSET $3`,
    [customerId, pageSize, offset]
  );
  return { rows: result.rows, totalCount };
}

/**
 * Monthly booking breakdown for a single booking row.
 * @param {number} bookingId
 */
export async function getBookingMonths(bookingId) {
  const result = await pool.query(
    `SELECT month_year, booked_nn, booked_en, booked_ee
     FROM customer_booking_months
     WHERE booking_id = $1
     ORDER BY month_year ASC`,
    [bookingId]
  );
  return result.rows;
}
