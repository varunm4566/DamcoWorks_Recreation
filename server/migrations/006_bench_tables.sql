-- ─── Migration 006: Bench screen tables ──────────────────────────────────────
-- Run manually: psql -U damco -d damcoworks -f server/migrations/006_bench_tables.sql

-- ── bench_resources ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bench_resources (
  id               SERIAL        PRIMARY KEY,

  -- People
  name             VARCHAR(200)  NOT NULL,
  emp_code         VARCHAR(50)   NOT NULL UNIQUE,
  division         VARCHAR(100)  NOT NULL,
  employee_type    VARCHAR(50)   NOT NULL,
  primary_skill    VARCHAR(150),

  -- Bench
  bench_since      DATE          NOT NULL,

  -- Last project
  last_project     VARCHAR(300),
  project_type     VARCHAR(100),
  project_role     VARCHAR(150),
  engagement_type  VARCHAR(20),
  billing          VARCHAR(20),
  billing_pct      NUMERIC(6,2),
  resource_margin  NUMERIC(6,2),
  allocation       NUMERIC(6,2),
  dm               VARCHAR(200),
  program_manager  VARCHAR(200),
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
  planned_project  VARCHAR(300),

  -- Profile overview
  date_of_joining  DATE,
  location         VARCHAR(200),
  department       VARCHAR(200),
  total_experience NUMERIC(4,1),
  damco_experience NUMERIC(4,1),
  email            VARCHAR(200),
  phone            VARCHAR(50),

  created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ── bench_skills ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bench_skills (
  id         SERIAL       PRIMARY KEY,
  skill      VARCHAR(150) NOT NULL UNIQUE,
  count      INTEGER      NOT NULL DEFAULT 0,
  sort_order INTEGER      NOT NULL DEFAULT 0
);

-- ── future_bench ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS future_bench (
  id               SERIAL       PRIMARY KEY,
  name_code        VARCHAR(250) NOT NULL,
  emp_code         VARCHAR(50),
  skill            VARCHAR(150),
  designation      VARCHAR(150),
  current_project  VARCHAR(300),
  delivery_manager VARCHAR(200),
  engagement_model VARCHAR(20),
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

-- ── Indexes ───────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_bench_division      ON bench_resources (division);
CREATE INDEX IF NOT EXISTS idx_bench_employee_type ON bench_resources (employee_type);
CREATE INDEX IF NOT EXISTS idx_bench_primary_skill ON bench_resources (primary_skill);
CREATE INDEX IF NOT EXISTS idx_bench_hr_decision   ON bench_resources (hr_decision);
CREATE INDEX IF NOT EXISTS idx_bench_since         ON bench_resources (bench_since);
CREATE INDEX IF NOT EXISTS idx_future_roll_off     ON future_bench    (roll_off_date);
