import pool from '../db.js';

// ─── Computed columns (same expression used in every SELECT) ─────────────────
// bench_days      = days on bench since bench_since (integer)
// attention_status = URGENT / CRITICAL / MODERATE / OK
const COMPUTED_COLS = `
  (CURRENT_DATE - bench_since)::INTEGER AS bench_days,
  CASE
    WHEN (CURRENT_DATE - bench_since) > 90 THEN 'URGENT'
    WHEN (CURRENT_DATE - bench_since) > 60 THEN 'CRITICAL'
    WHEN (CURRENT_DATE - bench_since) > 30 THEN 'MODERATE'
    ELSE 'OK'
  END AS attention_status
`;

// ─── Row mapper: snake_case DB columns → camelCase frontend shape ─────────────
function mapRow(r) {
  return {
    id:              r.id,
    name:            r.name,
    empCode:         r.emp_code,
    division:        r.division,
    employeeType:    r.employee_type,
    primarySkill:    r.primary_skill,
    benchDays:       r.bench_days,
    benchSince:      r.bench_since,
    attentionStatus: r.attention_status,
    lastProject:     r.last_project,
    projectType:     r.project_type,
    role:            r.project_role,
    engagementType:  r.engagement_type,
    billing:         r.billing,
    billingPct:      r.billing_pct != null ? Number(r.billing_pct) : null,
    resourceMargin:  r.resource_margin,
    allocation:      r.allocation,
    dm:              r.dm,
    programManager:  r.program_manager,
    projectStart:    r.project_start,
    projectEnd:      r.project_end,
    projectDuration: r.project_duration,
    monthlyCTC:      r.monthly_ctc,
    performance:     r.performance,
    hrDecision:      r.hr_decision,
    remarks:         r.remarks,
    timeline:        r.timeline,
    plannedProject:  r.planned_project,
    // Profile overview fields
    dateOfJoining:   r.date_of_joining,
    location:        r.location,
    department:      r.department,
    totalExperience: r.total_experience != null ? Number(r.total_experience) : null,
    damcoExperience: r.damco_experience != null ? Number(r.damco_experience) : null,
    email:           r.email,
    phone:           r.phone,
  };
}

// ─── bench_resources ──────────────────────────────────────────────────────────

/** Return all bench resources, bench_days / attention_status computed on the fly. */
export async function getAllBenchResources() {
  const { rows } = await pool.query(`
    SELECT *, ${COMPUTED_COLS}
    FROM   bench_resources
    ORDER  BY bench_days DESC
  `);
  return rows.map(mapRow);
}

/** Update the action-plan fields for a single resource. */
export async function updateActionPlan(id, { hrDecision, remarks, timeline, plannedProject }) {
  const { rows } = await pool.query(`
    UPDATE bench_resources
    SET    hr_decision      = $1,
           remarks          = $2,
           timeline         = $3,
           planned_project  = $4
    WHERE  id = $5
    RETURNING *, ${COMPUTED_COLS}
  `, [hrDecision ?? null, remarks ?? '', timeline ?? null, plannedProject ?? null, id]);
  if (!rows.length) throw new Error(`Bench resource id=${id} not found`);
  return mapRow(rows[0]);
}

// ─── bench_skills ─────────────────────────────────────────────────────────────

/** Return all skills ordered by sort_order. */
export async function getAllSkills() {
  const { rows } = await pool.query(`
    SELECT skill, count
    FROM   bench_skills
    ORDER  BY sort_order, skill
  `);
  return rows;
}

// ─── Department summary ───────────────────────────────────────────────────────

/** Return per-division headcounts (used for DepartmentTabs counts). */
export async function getDepartmentCounts() {
  const { rows } = await pool.query(`
    SELECT division, COUNT(*)::INTEGER AS count
    FROM   bench_resources
    GROUP  BY division
  `);
  const DIVISION_ORDER = [
    'Technology Services',
    'Insurance',
    'ITES',
    'Marketing Services',
    'Salesforce',
  ];
  const sorted = DIVISION_ORDER
    .map((d) => rows.find((r) => r.division === d) || { division: d, count: 0 });
  // Any divisions not in the predefined list go after, before All
  const rest = rows.filter((r) => !DIVISION_ORDER.includes(r.division));
  const total = rows.reduce((s, r) => s + r.count, 0);
  return [...sorted, ...rest, { division: 'All', count: total }];
}

// ─── future_bench ─────────────────────────────────────────────────────────────

/** Return all future-bench rows ordered by roll_off_date. */
export async function getFutureBench() {
  const { rows } = await pool.query(`
    SELECT
      id,
      name_code        AS "nameCode",
      emp_code         AS "empCode",
      skill,
      designation,
      current_project  AS "currentProject",
      delivery_manager AS "deliveryManager",
      engagement_model AS "engagementModel",
      project_role     AS "projectRole",
      billed,
      roll_off_date    AS "rollOffDate"
    FROM   future_bench
    ORDER  BY roll_off_date, name_code
  `);
  return rows;
}
