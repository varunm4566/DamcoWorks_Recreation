import pool from '../db.js';

const ALLOWED_SORT_COLUMNS = new Set([
  'name', 'role', 'customer_count', 'active_project_count',
  'tl', 'fl', 'pl', 'dm', 'onsite_dm', 'pdm', 'pfm', 'pgm', 'po',
  'head_count', 'allocation',
]);

/**
 * Return all active divisions.
 * @returns {Promise<Array>}
 */
export async function getDivisions() {
  const result = await pool.query(
    `SELECT id, name FROM divisions WHERE is_active = true ORDER BY id`
  );
  return result.rows;
}

/**
 * KPI summary counts grouped by role for a given division.
 * Division 'both' or 'all' → aggregate across all divisions.
 *
 * Returns:
 *   deliveryLeadership: { programManagers, productOwners, deliveryManagers,
 *                         onsiteDeliveryManagers, productDevelopmentManagers }
 *   executionLeads:     { projectLeads, functionalLeads, technicalLeads }
 *   portfolio:          { activeCustomers, activeProjects }
 *
 * @param {string} division  'Technology Services' | 'Insurance' | 'both'
 * @returns {Promise<Object>}
 */
export async function getKpiSummary(division) {
  const params = [];
  let divisionClause = '';
  if (division && division !== 'both' && division !== 'Both') {
    params.push(division);
    divisionClause = `AND d.name = $1`;
  }

  const roleQuery = `
    SELECT dp.role, COUNT(dp.id)::int AS cnt
    FROM delivery_persons dp
    JOIN divisions d ON d.id = dp.division_id
    WHERE dp.is_active = true ${divisionClause}
    GROUP BY dp.role
  `;
  const roleResult = await pool.query(roleQuery, params);

  const roleCounts = {};
  for (const row of roleResult.rows) {
    roleCounts[row.role] = row.cnt;
  }

  // Portfolio: distinct customers & projects assigned to active persons
  const portfolioQuery = `
    SELECT
      COUNT(DISTINCT pca.customer_id) FILTER (WHERE pca.is_active = true) AS active_customers,
      COUNT(DISTINCT ppa.project_id)  FILTER (WHERE ppa.is_active = true) AS active_projects
    FROM delivery_persons dp
    JOIN divisions d ON d.id = dp.division_id
    LEFT JOIN person_customer_assignments pca ON pca.person_id = dp.id
    LEFT JOIN person_project_assignments  ppa ON ppa.person_id = dp.id
    WHERE dp.is_active = true ${divisionClause}
  `;
  const portfolioResult = await pool.query(portfolioQuery, params);
  const portfolio = portfolioResult.rows[0];

  // Acting counts — mocked as 60-80% of role count for now.
  // In production these would come from a separate acting_assignments table.
  function actingCount(count) {
    return Math.round(count * 0.7);
  }

  const pgm   = roleCounts['Program Manager']              || 0;
  const po    = roleCounts['Product Owner']                || 0;
  const dm    = roleCounts['Delivery Manager']             || 0;
  const odm   = roleCounts['Onsite Delivery Manager']      || 0;
  const pdm   = roleCounts['Product Development Manager']  || 0;
  const pfm   = roleCounts['Product Functional Manager']   || 0;
  const pl    = roleCounts['Project Lead']                 || 0;
  const fl    = roleCounts['Functional Lead']              || 0;
  const tl    = roleCounts['Technical Lead']               || 0;

  return {
    deliveryLeadership: {
      programManagers:              { count: pgm,  acting: actingCount(pgm)  },
      productOwners:                { count: po,   acting: actingCount(po)   },
      deliveryManagers:             { count: dm,   acting: actingCount(dm)   },
      onsiteDeliveryManagers:       { count: odm,  acting: actingCount(odm)  },
      productDevelopmentManagers:   { count: pdm,  acting: actingCount(pdm)  },
      productFunctionalManagers:    { count: pfm,  acting: actingCount(pfm)  },
    },
    executionLeads: {
      projectLeads:    { count: pl,  acting: actingCount(pl)  },
      functionalLeads: { count: fl,  acting: actingCount(fl)  },
      technicalLeads:  { count: tl,  acting: actingCount(tl)  },
    },
    portfolio: {
      activeCustomers: parseInt(portfolio.active_customers, 10) || 0,
      activeProjects:  parseInt(portfolio.active_projects,  10) || 0,
    },
  };
}

/**
 * Delivery table data with optional division filter, sort, and role filter.
 *
 * @param {Object} opts
 * @param {string} opts.division    'Technology Services' | 'Insurance' | 'both'
 * @param {string} opts.sortCol     column key (validated against whitelist)
 * @param {string} opts.sortDir     'asc' | 'desc'
 * @param {string} opts.roleType    role name to filter by
 * @param {string} opts.nameSearch  partial name search
 * @returns {Promise<Array<DeliveryPerson>>}
 */
export async function getTableData({ division, sortCol = 'name', sortDir = 'asc', roleType, nameSearch }) {
  const safeSort   = ALLOWED_SORT_COLUMNS.has(sortCol) ? sortCol : 'name';
  const safeDir    = sortDir === 'desc' ? 'DESC' : 'ASC';

  const params = [];
  const conditions = ['dp.is_active = true'];

  if (division && division !== 'both' && division !== 'Both') {
    params.push(division);
    conditions.push(`d.name = $${params.length}`);
  }

  if (roleType) {
    params.push(roleType);
    conditions.push(`dp.role = $${params.length}`);
  }

  if (nameSearch) {
    params.push(`%${nameSearch}%`);
    conditions.push(`dp.name ILIKE $${params.length}`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  // Collaboration pivot — one row per person, columns for each role_type
  const collabCTE = `
    collab AS (
      SELECT
        person_id,
        COALESCE(MAX(count) FILTER (WHERE role_type = 'tl'),       0) AS tl,
        COALESCE(MAX(count) FILTER (WHERE role_type = 'fl'),       0) AS fl,
        COALESCE(MAX(count) FILTER (WHERE role_type = 'pl'),       0) AS pl,
        COALESCE(MAX(count) FILTER (WHERE role_type = 'dm'),       0) AS dm,
        COALESCE(MAX(count) FILTER (WHERE role_type = 'onsite_dm'),0) AS onsite_dm,
        COALESCE(MAX(count) FILTER (WHERE role_type = 'pdm'),      0) AS pdm,
        COALESCE(MAX(count) FILTER (WHERE role_type = 'pfm'),      0) AS pfm,
        COALESCE(MAX(count) FILTER (WHERE role_type = 'pgm'),      0) AS pgm,
        COALESCE(MAX(count) FILTER (WHERE role_type = 'po'),       0) AS po
      FROM person_collaborations
      GROUP BY person_id
    )
  `;

  // Sort column mapping — collaboration / metric columns need aliases
  const sortMap = {
    name:                 'dp.name',
    role:                 'dp.role',
    customer_count:       'customer_count',
    active_project_count: 'active_project_count',
    tl: 'c.tl', fl: 'c.fl', pl: 'c.pl',
    dm: 'c.dm', onsite_dm: 'c.onsite_dm', pdm: 'c.pdm',
    pfm: 'c.pfm', pgm: 'c.pgm', po: 'c.po',
    head_count: 'etm.head_count',
    allocation:  'etm.allocation',
  };
  const orderExpr = `${sortMap[safeSort] || 'dp.name'} ${safeDir}`;

  const sql = `
    WITH ${collabCTE}
    SELECT
      dp.id,
      dp.name,
      dp.role,
      d.name                                                  AS division_name,
      COUNT(DISTINCT pca.customer_id) FILTER (WHERE pca.is_active = true) AS customer_count,
      COUNT(DISTINCT ppa.project_id)  FILTER (WHERE ppa.is_active = true) AS active_project_count,
      COALESCE(c.tl,       0) AS tl,
      COALESCE(c.fl,       0) AS fl,
      COALESCE(c.pl,       0) AS pl,
      COALESCE(c.dm,       0) AS dm,
      COALESCE(c.onsite_dm,0) AS onsite_dm,
      COALESCE(c.pdm,      0) AS pdm,
      COALESCE(c.pfm,      0) AS pfm,
      COALESCE(c.pgm,      0) AS pgm,
      COALESCE(c.po,       0) AS po,
      COALESCE(etm.head_count, 0)   AS head_count,
      COALESCE(etm.allocation, 0.00) AS allocation
    FROM delivery_persons dp
    JOIN divisions d ON d.id = dp.division_id
    LEFT JOIN person_customer_assignments pca ON pca.person_id = dp.id
    LEFT JOIN person_project_assignments  ppa ON ppa.person_id = dp.id
    LEFT JOIN collab c  ON c.person_id  = dp.id
    LEFT JOIN engineering_team_metrics etm ON etm.person_id = dp.id
    ${whereClause}
    GROUP BY
      dp.id, dp.name, dp.role, d.name,
      c.tl, c.fl, c.pl, c.dm, c.onsite_dm, c.pdm, c.pfm, c.pgm, c.po,
      etm.head_count, etm.allocation
    ORDER BY ${orderExpr}
  `;

  const result = await pool.query(sql, params);
  return result.rows.map((row) => ({
    id:                  row.id,
    name:                row.name,
    role:                row.role,
    divisionName:        row.division_name,
    customerCount:       parseInt(row.customer_count,       10) || 0,
    activeProjectCount:  parseInt(row.active_project_count, 10) || 0,
    collaboratingWith: {
      tl:       parseInt(row.tl,        10),
      fl:       parseInt(row.fl,        10),
      pl:       parseInt(row.pl,        10),
      dm:       parseInt(row.dm,        10),
      onsiteDm: parseInt(row.onsite_dm, 10),
      pdm:      parseInt(row.pdm,       10),
      pfm:      parseInt(row.pfm,       10),
      pgm:      parseInt(row.pgm,       10),
      po:       parseInt(row.po,        10),
    },
    engineeringTeam: {
      headCount:  parseInt(row.head_count,  10),
      allocation: parseFloat(row.allocation),
    },
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// Person Detail Modal
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get person name + role by id.
 * @param {number} id
 */
export async function getPersonById(id) {
  const result = await pool.query(
    `SELECT dp.id, dp.name, dp.role, d.name AS division_name,
            COUNT(DISTINCT pca.customer_id) FILTER (WHERE pca.is_active) AS customer_count,
            COUNT(DISTINCT ppa.project_id)  FILTER (WHERE ppa.is_active) AS project_count,
            COALESCE(etm.head_count, 0) AS head_count
     FROM delivery_persons dp
     JOIN divisions d ON d.id = dp.division_id
     LEFT JOIN person_customer_assignments pca ON pca.person_id = dp.id
     LEFT JOIN person_project_assignments  ppa ON ppa.person_id = dp.id
     LEFT JOIN engineering_team_metrics etm    ON etm.person_id = dp.id
     WHERE dp.id = $1
     GROUP BY dp.id, dp.name, dp.role, d.name, etm.head_count`,
    [id]
  );
  if (!result.rows.length) return null;
  const row = result.rows[0];
  return {
    id:            row.id,
    name:          row.name,
    role:          row.role,
    divisionName:  row.division_name,
    customerCount: parseInt(row.customer_count, 10) || 0,
    projectCount:  parseInt(row.project_count,  10) || 0,
    headCount:     parseInt(row.head_count,      10) || 0,
  };
}

/**
 * Customers tab data — all customers linked to this person with project counts.
 * @param {number} personId
 */
export async function getPersonCustomers(personId) {
  const result = await pool.query(
    `SELECT
       c.id,
       c.name                          AS customer,
       COALESCE(c.tier, 'Direct')      AS type,
       COUNT(DISTINCT p.id)::int       AS project_count,
       ARRAY_AGG(DISTINCT p.name ORDER BY p.name) AS project_names
     FROM person_customer_assignments pca
     JOIN customers c ON c.id = pca.customer_id
     LEFT JOIN projects p ON p.client_id = c.id
       AND EXISTS (
         SELECT 1 FROM person_project_assignments ppa
         WHERE ppa.person_id = $1 AND ppa.project_id = p.id
       )
     WHERE pca.person_id = $1 AND pca.is_active = true
     GROUP BY c.id, c.name, c.tier
     ORDER BY c.name`,
    [personId]
  );
  return result.rows.map((row) => ({
    id:           row.id,
    customer:     row.customer,
    type:         row.type || 'Direct',
    projectCount: row.project_count,
    projects:     (row.project_names || []).filter(Boolean),
  }));
}

/**
 * Projects tab data — all projects linked to this person.
 * @param {number} personId
 * @param {boolean} includeToBeStarted  when true, includes future-dated projects
 */
export async function getPersonProjects(personId, includeToBeStarted = false) {
  const params = [personId];
  const toBeStartedClause = includeToBeStarted
    ? ''
    : `AND (p.contract_start_date IS NULL OR p.contract_start_date <= CURRENT_DATE)`;

  const result = await pool.query(
    `SELECT
       p.id,
       p.name                                        AS project_name,
       p.client_name                                 AS customer,
       COALESCE(p.project_type, p.engagement_model, 'T&M') AS model,
       p.contract_start_date,
       p.contract_end_date,
       p.status,
       COALESCE(p.tech_lead,        '--') AS tl,
       COALESCE(p.dm_name,          '--') AS dm,
       COALESCE(p.onsite_dm_name,   '--') AS onsite_dm,
       COALESCE(p.program_manager,  '--') AS pgm
     FROM person_project_assignments ppa
     JOIN projects p ON p.id = ppa.project_id
     WHERE ppa.person_id = $1 AND ppa.is_active = true
     ${toBeStartedClause}
     ORDER BY p.name`,
    params
  );

  function fmtDate(d) {
    if (!d) return null;
    const dt = new Date(d);
    return dt.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  }

  return result.rows.map((row) => ({
    id:          row.id,
    projectName: row.project_name,
    customer:    row.customer,
    model:       row.model,
    startDate:   fmtDate(row.contract_start_date),
    endDate:     fmtDate(row.contract_end_date),
    status:      row.status,
    coreTeam: {
      tl:      row.tl,
      dm:      row.dm,
      onsiteDm: row.onsite_dm,
      pgm:     row.pgm,
    },
  }));
}

/**
 * Engineering Team tab data — all team members across all projects of this person.
 * Groups by project; each row is one team member.
 * @param {number} personId
 */
export async function getPersonEngTeam(personId) {
  const result = await pool.query(
    `SELECT
       p.id                                          AS project_id,
       p.name                                        AS project_name,
       p.client_name                                 AS customer,
       COALESCE(p.tech_lead,        '--') AS tl,
       COALESCE(p.dm_name,          '--') AS dm,
       COALESCE(p.onsite_dm_name,   '--') AS onsite_dm,
       COALESCE(p.program_manager,  '--') AS pgm,
       tm.id                                         AS member_id,
       tm.name                                       AS member_name,
       tm.role_title                                 AS title,
       COALESCE(tm.sow_role, tm.contribution, '--')  AS role,
       tm.allocation_percent,
       tm.billing_percent,
       tm.duration_start,
       tm.duration_end
     FROM person_project_assignments ppa
     JOIN projects p ON p.id = ppa.project_id
     LEFT JOIN project_team_members tm ON tm.project_id = p.id
     WHERE ppa.person_id = $1 AND ppa.is_active = true
     ORDER BY p.name, tm.name`,
    [personId]
  );

  function fmtDate(d) {
    if (!d) return null;
    const dt = new Date(d);
    return dt.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  }

  // Group by project
  const projectMap = new Map();
  for (const row of result.rows) {
    if (!projectMap.has(row.project_id)) {
      projectMap.set(row.project_id, {
        projectId:   row.project_id,
        projectName: row.project_name,
        customer:    row.customer,
        coreTeam: {
          tl:       row.tl,
          dm:       row.dm,
          onsiteDm: row.onsite_dm,
          pgm:      row.pgm,
        },
        members: [],
      });
    }
    if (row.member_id) {
      projectMap.get(row.project_id).members.push({
        id:               row.member_id,
        name:             row.member_name,
        title:            row.title,
        role:             row.role,
        allocationPercent: parseFloat(row.allocation_percent) || 0,
        billingPercent:   parseFloat(row.billing_percent)    || 0,
        durationStart:    fmtDate(row.duration_start),
        durationEnd:      fmtDate(row.duration_end),
      });
    }
  }

  return Array.from(projectMap.values());
}
