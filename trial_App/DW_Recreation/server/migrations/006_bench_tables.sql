-- ─── Migration 006: Bench screen tables ──────────────────────────────────────
-- Run manually: psql -U damco -d damcoworks -f server/migrations/006_bench_tables.sql

-- ── bench_resources ───────────────────────────────────────────────────────────
-- bench_days and attention_status are NOT stored — computed dynamically from
-- bench_since so they stay accurate without cron jobs.
CREATE TABLE IF NOT EXISTS bench_resources (
  id               SERIAL        PRIMARY KEY,

  -- People
  name             VARCHAR(200)  NOT NULL,
  emp_code         VARCHAR(50)   NOT NULL UNIQUE,
  division         VARCHAR(100)  NOT NULL,           -- Technology Services | Insurance | ITES | Marketing Services | Salesforce
  employee_type    VARCHAR(50)   NOT NULL,           -- Employee | Cons(T&M) | Cons(Retainer)
  primary_skill    VARCHAR(150),

  -- Bench
  bench_since      DATE          NOT NULL,           -- bench_days derived at query time

  -- Last project
  last_project     VARCHAR(300),
  project_role     VARCHAR(150),
  engagement_type  VARCHAR(20),                      -- T&M | FP | BYT
  billing          VARCHAR(20),                      -- Billed | Not Billed
  resource_margin  NUMERIC(6,2),                     -- NULL = 'NA'
  allocation       NUMERIC(6,2),                     -- NULL = 'NA'
  dm               VARCHAR(200),
  project_start    DATE,
  project_end      DATE,
  project_duration VARCHAR(50),

  -- Performance
  monthly_ctc      NUMERIC(12,2) NOT NULL DEFAULT 0,
  performance      VARCHAR(50)   NOT NULL DEFAULT 'NA',

  -- Action plan (editable by users)
  hr_decision      VARCHAR(100),
  remarks          TEXT,
  timeline         VARCHAR(50),

  created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ── bench_skills ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bench_skills (
  id     SERIAL       PRIMARY KEY,
  skill  VARCHAR(150) NOT NULL UNIQUE,
  count  INTEGER      NOT NULL DEFAULT 0,
  sort_order INTEGER  NOT NULL DEFAULT 0
);

-- ── future_bench ──────────────────────────────────────────────────────────────
-- Resources currently on active projects rolling off in the next 30 days
CREATE TABLE IF NOT EXISTS future_bench (
  id               SERIAL       PRIMARY KEY,
  name_code        VARCHAR(250) NOT NULL,   -- "Full Name EmpCode" combined display
  skill            VARCHAR(150),
  designation      VARCHAR(150),
  current_project  VARCHAR(300),
  engagement_model VARCHAR(20),             -- T&M | FP | BYT
  project_role     VARCHAR(150),
  billed           BOOLEAN      NOT NULL DEFAULT TRUE,
  roll_off_date    DATE         NOT NULL,
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── Auto-update updated_at on bench_resources ────────────────────────────────
CREATE OR REPLACE FUNCTION trg_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS bench_resources_updated_at ON bench_resources;
CREATE TRIGGER bench_resources_updated_at
  BEFORE UPDATE ON bench_resources
  FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();

-- ── Indexes for common filter columns ────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_bench_division      ON bench_resources (division);
CREATE INDEX IF NOT EXISTS idx_bench_employee_type ON bench_resources (employee_type);
CREATE INDEX IF NOT EXISTS idx_bench_primary_skill ON bench_resources (primary_skill);
CREATE INDEX IF NOT EXISTS idx_bench_hr_decision   ON bench_resources (hr_decision);
CREATE INDEX IF NOT EXISTS idx_bench_since         ON bench_resources (bench_since);
CREATE INDEX IF NOT EXISTS idx_future_roll_off     ON future_bench    (roll_off_date);
