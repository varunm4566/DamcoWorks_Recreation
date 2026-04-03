-- 009_project_detail_tables.sql
-- New tables and columns for the full Project Detail Panel

-- ── 1. New columns on the projects table ─────────────────────────

-- People / Ownership roles
ALTER TABLE projects ADD COLUMN IF NOT EXISTS onsite_dm_name             VARCHAR(100);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS program_manager            VARCHAR(100);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS client_partner             VARCHAR(100);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS project_lead               VARCHAR(100);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS tech_lead                  VARCHAR(100);

-- Delivery Health metrics
ALTER TABLE projects ADD COLUMN IF NOT EXISTS budgeted_hours             INTEGER;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS logged_hours               INTEGER;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS planned_end_date           DATE;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS completion_percent         INTEGER;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS burnt_hours_ratio          DECIMAL(5,2);

-- Financials summary
ALTER TABLE projects ADD COLUMN IF NOT EXISTS avg_ageing_days            INTEGER;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS total_booked               DECIMAL(15,2);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS total_invoiced             DECIMAL(15,2);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS amount_received            DECIMAL(15,2);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS amount_outstanding         DECIMAL(15,2);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS amount_overdue             DECIMAL(15,2);

-- Overview / AI insights
ALTER TABLE projects ADD COLUMN IF NOT EXISTS project_overview           TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS ai_highlights              TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS ai_concerns                TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS ai_next_steps              TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS ai_summary                 TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS ai_attention_level         VARCHAR(50);

-- Work status toggle (separate from project lifecycle status)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS work_status                VARCHAR(20) DEFAULT 'active';

-- Quality integration
ALTER TABLE projects ADD COLUMN IF NOT EXISTS quality_integration_source VARCHAR(100) DEFAULT 'Not Integrated';

-- CSAT summary
ALTER TABLE projects ADD COLUMN IF NOT EXISTS last_csat_date             DATE;

-- Milestone summary
ALTER TABLE projects ADD COLUMN IF NOT EXISTS milestone_health_percent   DECIMAL(5,2);

-- ── 2. service_quality on delivery thoughts ──────────────────────
ALTER TABLE project_delivery_thoughts ADD COLUMN IF NOT EXISTS service_quality VARCHAR(50);

-- ── 3. project_team_members ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS project_team_members (
  id                  SERIAL PRIMARY KEY,
  project_id          INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name                VARCHAR(255) NOT NULL,
  employee_id         VARCHAR(100),
  role_title          VARCHAR(255),
  contribution        VARCHAR(255),
  sow_role            VARCHAR(255),
  allocation_percent  DECIMAL(5,2),
  billing_percent     DECIMAL(5,2),
  duration_start      DATE,
  duration_end        DATE,
  skills              JSONB DEFAULT '[]',
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_team_members_project ON project_team_members(project_id);

-- ── 4. project_invoices ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS project_invoices (
  id                SERIAL PRIMARY KEY,
  project_id        INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  created_on        DATE,
  milestone_period  VARCHAR(255),
  invoice_no        VARCHAR(100),
  value             DECIMAL(15,2),
  invoiced_due_date DATE,
  status            VARCHAR(50),
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invoices_project ON project_invoices(project_id);

-- ── 5. project_csat_surveys ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS project_csat_surveys (
  id                SERIAL PRIMARY KEY,
  project_id        INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  triggered_on      DATE,
  triggered_by      VARCHAR(255),
  client_poc        VARCHAR(255),
  response_received DATE,
  score             INTEGER,
  testimonial       TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_csat_surveys_project ON project_csat_surveys(project_id);

-- ── 6. project_contracts ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS project_contracts (
  id            SERIAL PRIMARY KEY,
  project_id    INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  booking_ref   VARCHAR(255),
  booking_type  VARCHAR(100),
  contract_type VARCHAR(100),
  updated_on    DATE,
  updated_by    VARCHAR(255),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contracts_project ON project_contracts(project_id);
